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

export async function getNewID(role)
{
    const [id] = await pool.query(`SELECT newID('${ role }')`);
    return id;
}

export async function updateInfo(id, address, birthday, birthplace, email, phone)
{
    //console.log(ssn);
    if (address !== "") pool.query(`UPDATE employee SET address = ? WHERE ID = ?`, [address, id]);
    if (birthday !== null) pool.query(`UPDATE employee SET birthday = ? WHERE ID = ?`, [birthday, id]);
    if (birthplace !== "") pool.query(`UPDATE employee SET birthplace = ? WHERE ID = ?`, [birthplace, id]);
    if (email !== "") pool.query(`UPDATE employee SET email = ? WHERE ID = ?`, [email, id]);
    if (phone !== "") pool.query(`UPDATE employee SET phone = ? WHERE ID = ?`, [phone, id]);
    return;
}

export async function pieChartDaily()
{
    var daily, [tmp] = await pool.query(`select count(*) as count, st.Status
                                        from student_attendance st join session se
                                        where st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date = curdate()
                                        group by st.Status;`);

    daily = [
        { count: 0, status: 0 },
        { count: 0, status: 1 },
        { count: 0, status: 2 }
    ]

    for (var i = 0; i < daily.length; i++)
    {
        for (var j = 0; j < tmp.length; j++)
        {
            if (daily[i].status == tmp[j].Status)
            {
                daily[i].count = tmp[j].count;
                break;
            }
        }
    }

    return daily.map(obj => obj.count);
}

export async function pieChartWeekly()
{
    var weekly, [tmp] = await pool.query(`select count(*) as count, st.Status
                                        from student_attendance st join session se
                                        where st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date >= DATE_SUB(curdate(), INTERVAL (DAYOFWEEK(curdate())+6)%8 DAY)  and se.Session_date <= curdate()
                                        group by st.Status;`);
    weekly = [
        { count: 0, status: 0 },
        { count: 0, status: 1 },
        { count: 0, status: 2 }
    ]

    for (var i = 0; i < weekly.length; i++)
    {
        for (var j = 0; j < tmp.length; j++)
        {
            if (weekly[i].status == tmp[j].Status)
            {
                weekly[i].count = tmp[j].count;
                break;
            }
        }
    }

    return weekly.map(obj => obj.count);
}

export async function pieChartMonthly()
{
    var monthly, [tmp] = await pool.query(`select count(*) as count, st.Status
                                        from student_attendance st join session se
                                        where st.Session_number = se.Session_number and st.Class_name = se.Class_name and year(se.Session_date) = year(CURDATE()) and month(se.Session_date) = month(CURDATE()) and se.Session_date <= curdate()
                                        group by st.Status;`);
    monthly = [
        { count: 0, status: 0 },
        { count: 0, status: 1 },
        { count: 0, status: 2 }
    ]

    for (var i = 0; i < monthly.length; i++)
    {
        for (var j = 0; j < tmp.length; j++)
        {
            if (monthly[i].status == tmp[j].Status)
            {
                monthly[i].count = tmp[j].count;
                break;
            }
        }
    }

    return monthly.map(obj => obj.count);
}


export async function lineChartDaily()
{
    const [absent] = await pool.query(`select c.Name, COALESCE(tmp.count, 0) AS count, COALESCE(tmp.Status, 0) as Status
                                        from class c left join (
                                            select st.Class_name, count(*) as count, st.Status
                                            from student_attendance st join session se
                                            where st.Status = 0 and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date = curdate()
                                            group by st.Class_name
                                        ) tmp
                                        on c.Name = tmp.Class_name;`);
    const [late] = await pool.query(`select c.Name, COALESCE(tmp.count, 0) AS count, COALESCE(tmp.Status, 0) as Status
                                        from class c left join (
                                            select st.Class_name, count(*) as count, st.Status
                                            from student_attendance st join session se
                                            where st.Status = 1 and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date = curdate()
                                            group by st.Class_name
                                        ) tmp
                                        on c.Name = tmp.Class_name;`);
    const [onClass] = await pool.query(`select c.Name, COALESCE(tmp.count, 0) AS count, COALESCE(tmp.Status, 0) as Status
                                        from class c left join (
                                            select st.Class_name, count(*) as count, st.Status
                                            from student_attendance st join session se
                                            where st.Status = 2 and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date = curdate()
                                            group by st.Class_name
                                        ) tmp
                                        on c.Name = tmp.Class_name;`);

    var daily = [];
    for (var i = 0; i < absent.length; i++)
        for (var j = 0; j < late.length; j++)
            for (var k = 0; k < onClass.length; k++)
                if (absent[i].Name === late[j].Name && late[j].Name === onClass[k].Name)
                {
                    const sum = absent[i].count + late[j].count + onClass[k].count;
                    const a = sum === 0 ? 0 : parseFloat((absent[i].count * 100 / sum).toFixed(2)),
                        l = sum === 0 ? 0 : parseFloat((late[j].count * 100 / sum).toFixed(2))
                    daily.push({
                        Name: absent[i].Name,
                        Absent: a,
                        Late: l,
                        "On class": sum === 0 ? 0 : 100 - a - l
                    })
                }

    return daily;
}

export async function lineChartWeekly()
{
    const [absent] = await pool.query(`select c.Name, COALESCE(tmp.count, 0) AS count, COALESCE(tmp.Status, 0) as Status
                                        from class c left join (
                                            select st.Class_name, count(*) as count, st.Status
                                            from student_attendance st join session se
                                            where st.Status = 0 and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date >= DATE_SUB(curdate(), INTERVAL (DAYOFWEEK(curdate())+6)%8 DAY)  and se.Session_date <= curdate()
                                            group by st.Class_name
                                        ) tmp
                                        on c.Name = tmp.Class_name;`);
    const [late] = await pool.query(`select c.Name, COALESCE(tmp.count, 0) AS count, COALESCE(tmp.Status, 0) as Status
                                        from class c left join (
                                            select st.Class_name, count(*) as count, st.Status
                                            from student_attendance st join session se
                                            where st.Status = 1 and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date >= DATE_SUB(curdate(), INTERVAL (DAYOFWEEK(curdate())+6)%8 DAY)  and se.Session_date <= curdate()
                                            group by st.Class_name
                                        ) tmp
                                        on c.Name = tmp.Class_name;`);
    const [onClass] = await pool.query(`select c.Name, COALESCE(tmp.count, 0) AS count, COALESCE(tmp.Status, 0) as Status
                                        from class c left join (
                                            select st.Class_name, count(*) as count, st.Status
                                            from student_attendance st join session se
                                            where st.Status = 2 and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date >= DATE_SUB(curdate(), INTERVAL (DAYOFWEEK(curdate())+6)%8 DAY)  and se.Session_date <= curdate()
                                            group by st.Class_name
                                        ) tmp
                                        on c.Name = tmp.Class_name;`);

    var weekly = [];
    for (var i = 0; i < absent.length; i++)
        for (var j = 0; j < late.length; j++)
            for (var k = 0; k < onClass.length; k++)
                if (absent[i].Name === late[j].Name && late[j].Name === onClass[k].Name)
                {
                    const sum = absent[i].count + late[j].count + onClass[k].count;
                    const a = sum === 0 ? 0 : parseFloat((absent[i].count * 100 / sum).toFixed(2)),
                        l = sum === 0 ? 0 : parseFloat((late[j].count * 100 / sum).toFixed(2))
                    weekly.push({
                        Name: absent[i].Name,
                        Absent: a,
                        Late: l,
                        "On class": sum === 0 ? 0 : 100 - a - l
                    })
                }

    return weekly;
}

export async function lineChartMonthly()
{
    const [absent] = await pool.query(`select c.Name, COALESCE(tmp.count, 0) AS count, COALESCE(tmp.Status, 0) as Status
                                        from class c left join (
                                            select st.Class_name, count(*) as count, st.Status
                                            from student_attendance st join session se
                                            where st.Status = 0 and st.Session_number = se.Session_number and st.Class_name = se.Class_name and year(se.Session_date) = year(CURDATE()) and month(se.Session_date) = month(CURDATE()) and se.Session_date <= curdate()
                                            group by st.Class_name
                                        ) tmp
                                        on c.Name = tmp.Class_name;`);
    const [late] = await pool.query(`select c.Name, COALESCE(tmp.count, 0) AS count, COALESCE(tmp.Status, 0) as Status
                                        from class c left join (
                                            select st.Class_name, count(*) as count, st.Status
                                            from student_attendance st join session se
                                            where st.Status = 1 and st.Session_number = se.Session_number and st.Class_name = se.Class_name and year(se.Session_date) = year(CURDATE()) and month(se.Session_date) = month(CURDATE()) and se.Session_date <= curdate()
                                            group by st.Class_name
                                        ) tmp
                                        on c.Name = tmp.Class_name;`);
    const [onClass] = await pool.query(`select c.Name, COALESCE(tmp.count, 0) AS count, COALESCE(tmp.Status, 0) as Status
                                        from class c left join (
                                            select st.Class_name, count(*) as count, st.Status
                                            from student_attendance st join session se
                                            where st.Status = 2 and st.Session_number = se.Session_number and st.Class_name = se.Class_name and year(se.Session_date) = year(CURDATE()) and month(se.Session_date) = month(CURDATE()) and se.Session_date <= curdate()
                                            group by st.Class_name
                                        ) tmp
                                        on c.Name = tmp.Class_name;`);

    var monthly = [];
    for (var i = 0; i < absent.length; i++)
        for (var j = 0; j < late.length; j++)
            for (var k = 0; k < onClass.length; k++)
                if (absent[i].Name === late[j].Name && late[j].Name === onClass[k].Name)
                {
                    const sum = absent[i].count + late[j].count + onClass[k].count;
                    const a = sum === 0 ? 0 : parseFloat((absent[i].count * 100 / sum).toFixed(2)),
                        l = sum === 0 ? 0 : parseFloat((late[j].count * 100 / sum).toFixed(2))
                    monthly.push({
                        Name: absent[i].Name,
                        Absent: a,
                        Late: l,
                        "On class": sum === 0 ? 0 : 100 - a - l
                    })
                }

    return monthly;
}

export async function statsClass(status)
{
    var [stats] = await pool.query(`select Class_name
                                from  
                                    (
                                        select st.Class_name as Class_name, count(*) as count, st.Status
                                        from student_attendance st join session se
                                        where st.Status = '${ status }' and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date >= DATE_SUB(curdate(), INTERVAL (DAYOFWEEK(curdate())+6)%8 DAY)  and se.Session_date <= curdate()
                                        group by st.Class_name
                                    ) tmp
                                where tmp. count = (
                                                        select max(count)
                                                        from 
                                                            (
                                                                select st.Class_name as Class_name, count(*) as count, st.Status
                                                                from student_attendance st join session se
                                                                where st.Status = '${ status }' and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date >= DATE_SUB(curdate(), INTERVAL (DAYOFWEEK(curdate())+6)%8 DAY)  and se.Session_date <= curdate()
                                                                group by st.Class_name
                                                            ) tmp1
                                                    )`);
    // console.log(status);
    return stats;
}

export async function late10Student()
{
    var [late] = await pool.query(`select Student_ID
                                    from (
                                            select Student_ID, count(*) as count
                                            from student_attendance st join session se
                                            where st.Status = 1 and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date >= DATE_SUB(curdate(), INTERVAL (DAYOFWEEK(curdate())+6)%8 DAY)  and se.Session_date <= curdate()
                                            group by Student_ID
                                        ) tmp
                                    where tmp.count > 10;
                                    `);
    return late;
}

export async function absent5Student()
{
    var [absent] = await pool.query(`select Student_ID
                                    from (
                                            select Student_ID, count(*) as count
                                            from student_attendance st join session se
                                            where st.Status = 0 and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date >= DATE_SUB(curdate(), INTERVAL (DAYOFWEEK(curdate())+6)%8 DAY)  and se.Session_date <= curdate()
                                            group by Student_ID
                                        ) tmp
                                    where tmp.count > 5;
                                    `);
    return absent;
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

// function getWeeksBetween(start, end)
// {
//     start = new Date(start);
//     end = new Date(end);
//     // Calculate the difference in milliseconds between the two dates
//     const diffInMs = Math.abs(end - start);

//     // Calculate the number of milliseconds in a week
//     const msPerWeek = 1000 * 60 * 60 * 24 * 7;

//     // Divide the difference by the number of milliseconds in a week and round down to the nearest integer
//     const weeks = Math.ceil(diffInMs / msPerWeek);

//     // Return the number of weeks
//     return weeks;
// }

export async function addClass(name, start, end, timetable, room, teachers, supervisor)
{
    let counter = 0;
    for (let i = 0; i < timetable.length; i++)
        if (timetable[i].periodID !== null) counter++;
    let sql = `call createClass('${ name }','${ start }','${ end }','${ room }',${ counter * 12 }); `;
    for (let i = 0, j = 0; i < timetable.length; i++)
    {
        if (timetable[i].periodID !== null)
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
            sql += `call GenSession('${ name }','${ start }','${ end }','${ dow }','${ timetable[i].periodID }','${ room }',${ j },${ counter }); `;
            j++;
        }
    }
    for (let i = 0; i < teachers.length; i++)
        sql += `insert into TEACH values('${ teachers[i] }','${ name }'); `;
    for (let i = 1; i <= counter * 12; i++)
    {
        sql += `call AssignSessionForTeacher(${ i },'${ name }','${ teachers[(i - 1) % teachers.length] }'); `;
        sql += `insert into SUPERVISOR_RESPONSIBLE values(${ i },'${ name }','${ supervisor }',null); `;
    }
    //console.log(sql);
    const periods = await pool.query(sql);
    return periods;
}

export async function deleteStudent(id, className)
{
    const periods = await pool.query(`delete from STUDENT_ATTENDANCE where Class_name='${ className }' and Student_ID='${ id }'; delete from IN_CLASS where Student_ID='${ id }' and Class_name='${ className }'`);
    return periods;
}

export async function deactivateClass(name)
{
    const periods = await pool.query(`update CLASS set Status=false where Name='${ name }'`);
    return periods;
}

export async function activateClass(name)
{
    const periods = await pool.query(`update CLASS set Status=true where Name='${ name }'`);
    return periods;
}

export async function cancelSession(name, number)
{
    const periods = await pool.query(`update SESSION set Status=0 where Class_name='${ name }' and Session_number='${ number }'`);
    return periods;
}

export async function activateSession(name, number)
{
    const periods = await pool.query(`update SESSION set Status=2 where Class_name='${ name }' and Session_number='${ number }'`);
    return periods;
}

export async function getClassTeachers(name)
{
    const result = await pool.query(`select Teacher_ID,name from TEACH join EMPLOYEE on Teacher_ID=ID where Class_name='${ name }'`);
    return result[0];
}

export async function countSession(name)
{
    const result = await pool.query(`select count(*) as count from SESSION where Class_name='${ name }'`);
    return result[0];
}

export async function getSessions(name)
{
    const result = await pool.query(`select Session_number from SESSION where Class_name='${ name }' and Status=0 and Session_number_make_up_for is null`);
    return result[0];
}

export async function supervisor()
{
    const result = await pool.query(`select SUPERVISOR.ID,name from SUPERVISOR join EMPLOYEE on EMPLOYEE.ID=SUPERVISOR.ID`);
    return result[0];
}

export async function times(room, date)
{
    const result = await pool.query(`select * from TIMETABLE where ID not in (select Timetable_ID from SESSION where Classroom_ID='${ room }' and Session_date='${ date }')`);
    return result[0];
}

export async function getSuitableRoom(name)
{
    const result = await pool.query(`select * from CLASSROOM where Max_of_seat>=(select Max_number_of_students from CLASS where Name='${ name }')`);
    return result[0];
}

export async function createNewSession(name, newSession, room, date, time, session, teacher, supervisor)
{
    const result = await pool.query(`
    insert into SESSION values('${ newSession }','${ name }','${ time }','${ room }','${ date }',2,null,'${ session }','${ name }');
    insert into TEACHER_RESPONSIBLE values('${ newSession }','${ name }','${ teacher }',null,null);
    insert into SUPERVISOR_RESPONSIBLE values('${ newSession }','${ name }','${ supervisor }',null);
    `);
    return result;
}

export async function searchByName(name)
{
    const result = await pool.query(`select * from STUDENT where name like '%${ name }%'`);
    return result[0];
}

export async function searchBySSN(ssn)
{
    const result = await pool.query(`select * from STUDENT where SSN like '%${ ssn }%'`);
    return result[0];
}

export async function addStudentToClass(id, name)
{
    const result = await pool.query(`insert into IN_CLASS values('${ id }','${ name }')`);
    return result;
}

export async function replaceTeacher(session, name, id)
{
    const result = await pool.query(`update TEACHER_RESPONSIBLE set Teacher_ID='${ id }',Note=null,Status=null where Session_number='${ session }' and Class_name='${ name }'`);
    return result;
}

export async function replaceSupervisor(session, name, id)
{
    const result = await pool.query(`update SUPERVISOR_RESPONSIBLE set Supervisor_ID='${ id }',Note_for_class=null where Session_number='${ session }' and Class_name='${ name }'`);
    return result;
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