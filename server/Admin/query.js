import mysql from 'mysql2';

const pool = mysql.createPool({
    host: `127.0.0.1`,
    user: 'englishcenter',
    password: 'englishcenter123',
    database: 'english_center'
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
        SELECT Start_hour,End_hour from TIMETABLE where ID not in (SELECT Timetable_ID from SESSION where Session_number_make_up_for=null and Session_date>=${ startDate } and Session_date<=${ endDate } and DAYOFWEEK(Session_date)=${ dow } and Classroom_ID='${ room }')
    `);
    return periods[0];
}