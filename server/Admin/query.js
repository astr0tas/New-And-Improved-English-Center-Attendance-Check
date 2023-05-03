import mysql from 'mysql2';

const pool = mysql.createPool({
    host: `127.0.0.1`,
    user: 'englishcenter',
    password: 'englishcenter123',
    database: 'english_center',
    multipleStatements: true
}).promise();

export async function getEmployees()
{
    const employees = await pool.query(`SELECT * FROM employee`);
    return employees[0];
}

export async function getUser(username)
{
    const [[user]] = await pool.query(`SELECT * FROM employee WHERE username = '${ username }'`);
    return user;
}

export async function getStudents()
{
    const [students] = await pool.query(`SELECT * FROM student`);
    students.map(
        student =>
        {
            student.birthday = new Date(student.birthday).toLocaleDateString('en-GB');
        }
    )
    return students;
}

export async function getStudent(id)
{
    const [student] = await pool.query(`SELECT * FROM student WHERE id = '${ id }'`);
    student.birthday = new Date(student.birthday).toLocaleDateString('en-GB');
    return student;
}

export async function getNewID()
{
    // const [id] = await pool.query(`SELECT newID()`);
    // return id;
}

export async function newStudent(name, phone, birthday, birthplace, email, address, classes)
{
    var id = getNewID(), query = `CALL newStudent('${ name }','${ phone }','${ birthday }','${ birthplace }','${ email }','${ address }')`;
    await pool.query(query);

    const classQueries = classes.map((className) =>
    {
        return pool.query('CALL addStudent(?, ?)', [id, className]);
    });

    await Promise.all(classQueries);
    return;
}

export async function changeClass(id, oldClass, newClass)
{
    await pool.query(`CALL changeClass('${ id }','${ oldClass }', '${ newClass }')`);
    return;
}

export async function getClassesOfStudent(id)
{
    var [classOfStudent] = await pool.query(`SELECT * FROM in_class JOIN class WHERE Student_ID = '${ id }' AND Class_name = Name`);
    classOfStudent.map(
        sClass =>
        {
            sClass.Start_date = new Date(sClass.Start_date).toLocaleDateString('en-GB')
            sClass.End_date = new Date(sClass.End_date).toLocaleDateString('en-GB')
        }
    )
    return classOfStudent;
}

export async function getNotClassesOfStudent(id)
{
    // var [classOfStudent] = await pool.query(`SELECT Name, Start_date, End_date, Status FROM class WHERE Status = 1 AND Current_number_of_student < Max_number_of_students AND Name NOT IN (SELECT DISTINCT Class_name FROM in_class WHERE Student_ID = '${ id }')`);
    // classOfStudent.map(
    //     sClass =>
    //     {
    //         sClass.Start_date = new Date(sClass.Start_date).toLocaleDateString('en-GB')
    //         sClass.End_date = new Date(sClass.End_date).toLocaleDateString('en-GB')
    //     }
    // )
    // return classOfStudent;
}

export async function getClasses()
{
    // const classes = await pool.query(`SELECT * FROM class WHERE Current_number_of_student < Max_number_of_students`);
    // return classes[0];
}

export async function getClassInfo(className)
{
    var [sClass] = await pool.query(`SELECT * FROM class WHERE Name = '${ className }'`);
    return sClass;
}

export async function updateInfo(ssn, address, birthday, birthplace, email, phone)
{
    //console.log(ssn);
    if (address !== "") pool.query(`UPDATE employee SET address = ? WHERE SSN = ?`, [address, ssn]);
    if (birthday !== null) pool.query(`UPDATE employee SET birthday = ? WHERE SSN = ?`, [birthday, ssn]);
    if (birthplace !== "") pool.query(`UPDATE employee SET birthplace = ? WHERE SSN = ?`, [birthplace, ssn]);
    if (email !== "") pool.query(`UPDATE employee SET email = ? WHERE SSN = ?`, [email, ssn]);
    if (phone !== "") pool.query(`UPDATE employee SET phone = ? WHERE SSN = ?`, [phone, ssn]);
    return;
}

export async function getRooms(callback)
{
    const rooms = await pool.query(`select * from CLASSROOM`);
    return rooms[0];
}

export async function getTeachers()
{
    // pool.query(`select EMPLOYEE.ID,EMPLOYEE.name from TEACHER join EMPLOYEE on TEACHER.ID=EMPLOYEE.ID`, (err, res) =>
    // {
    //     if (err)
    //         callback(err, null);
    //     else
    //         callback(null, res);
    // });
    const teachers = await pool.query(`select EMPLOYEE.ID,EMPLOYEE.name from TEACHER join EMPLOYEE on TEACHER.ID=EMPLOYEE.ID`);
    return teachers[0];
}

export async function getPeriod(dow, room, startDate, endDate)
{
    const periods = await pool.query(`
        SELECT ID,Start_hour,End_hour from TIMETABLE where ID not in (SELECT Timetable_ID from SESSION where Session_number_make_up_for is null and
            ((Session_date>='${ startDate }' and Session_date<='${ endDate }') or (Session_date<='${ startDate }' and Session_date>='${ endDate }') or (Session_date>='${ startDate }' and Session_date>='${ endDate }') or (Session_date<='${ startDate }' and Session_date<='${ endDate }'))
            and DAYOFWEEK(Session_date)=${ dow } and Classroom_ID='${ room }')
    `);
    return periods[0];
}

function getWeeksBetween(start, end)
{
    start = new Date(start);
    end = new Date(end);
    // Calculate the difference in milliseconds between the two dates
    const diffInMs = Math.abs(end - start);

    // Calculate the number of milliseconds in a week
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;

    // Divide the difference by the number of milliseconds in a week and round down to the nearest integer
    const weeks = Math.ceil(diffInMs / msPerWeek);

    // Return the number of weeks
    return weeks;
}

export async function addClass(name, start, end, timetable, room, teachers)
{
    let sql = `call createClass('${ name }','${ start }','${ end }','${ room }'); `;
    for (let i = 0; i < timetable.length; i++)
    {
        let dow;
        switch (timetable[i].dow)
        {
            case 2:
                dow = "Monday";
                break;
            case 3:
                dow = "Tuesday";
                break;
            case 4:
                dow = "Wednesday";
                break;
            case 5:
                dow = "Thursday";
                break;
            case 6:
                dow = "Friday";
                break;
            case 7:
                dow = "Saturday";
                break;
        }
        sql += `call GenSession('${ name }','${ start }','${ end }','${ dow }','${ timetable[i].periodID }','${ room }',${ i },${ timetable.length }); `;
    }
    for (let i = 0; i < teachers.length; i++)
        sql += `insert into TEACH values('${ teachers[i] }','${ name }'); `;
    for (let i = 1; i <= getWeeksBetween(start, end) * 2; i++)
        sql += `call AssignSessionForTeacher(${ i },'${ name }','${ teachers[i % teachers.length] }'); `;
    console.log(sql);
    const periods = await pool.query(sql);
    return periods;
}