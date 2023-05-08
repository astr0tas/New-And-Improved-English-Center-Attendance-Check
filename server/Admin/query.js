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

export async function  pieChartDaily(){
    var daily, [tmp] = await pool.query(`select count(*) as count, st.Status
                                        from student_attendance st join session se
                                        where st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date = curdate()
                                        group by st.Status;`);
    
    daily = [
        {count: 0, status: 0},
        {count: 0, status: 1},
        {count: 0, status: 2}
    ]

    for (var i = 0; i < daily.length; i++) {
        for (var j = 0; j < tmp.length; j++) {
            if (daily[i].status == tmp[j].Status) {
                daily[i].count = tmp[j].count;
                break;
            }
        }
    }

    return daily.map(obj => obj.count);
}

export async function  pieChartWeekly(){
    var weekly, [tmp] = await pool.query(`select count(*) as count, st.Status
                                        from student_attendance st join session se
                                        where st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date >= DATE_SUB(curdate(), INTERVAL (DAYOFWEEK(curdate())+6)%8 DAY)  and se.Session_date <= curdate()
                                        group by st.Status;`);
    weekly = [
        {count: 0, status: 0},
        {count: 0, status: 1},
        {count: 0, status: 2}
    ]

    for (var i = 0; i < weekly.length; i++) {
        for (var j = 0; j < tmp.length; j++) {
            if (weekly[i].status == tmp[j].Status) {
                weekly[i].count = tmp[j].count;
                break;
            }
        }
    }

    return weekly.map(obj => obj.count);
}

export async function  pieChartMonthly(){
    var monthly, [tmp] = await pool.query(`select count(*) as count, st.Status
                                        from student_attendance st join session se
                                        where st.Session_number = se.Session_number and st.Class_name = se.Class_name and year(se.Session_date) = year(CURDATE()) and month(se.Session_date) = month(CURDATE()) and se.Session_date <= curdate()
                                        group by st.Status;`);
    monthly = [
        {count: 0, status: 0},
        {count: 0, status: 1},
        {count: 0, status: 2}
    ]

    for (var i = 0; i < monthly.length; i++) {
        for (var j = 0; j < tmp.length; j++) {
            if (monthly[i].status == tmp[j].Status) {
                monthly[i].count = tmp[j].count;
                break;
            }
        }
    }

    return monthly.map(obj => obj.count);
}


export async function  lineChartDaily(){
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
                if (absent[i].Name === late[j].Name && late[j].Name  === onClass[k].Name){
                    const sum = absent[i].count + late[j].count + onClass[k].count;
                    const a = sum === 0 ? 0 : parseFloat((absent[i].count*100/sum).toFixed(2)),
                          l = sum === 0 ? 0 : parseFloat((late[j].count*100/sum).toFixed(2))
                    daily.push({
                        Name: absent[i].Name,
                        Absent: a,
                        Late: l,
                        "On class" : sum === 0 ? 0 : 100 - a - l
                    })
                }
    
    return daily;
}

export async function  lineChartWeekly(){
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
                if (absent[i].Name === late[j].Name && late[j].Name  === onClass[k].Name){
                    const sum = absent[i].count + late[j].count + onClass[k].count;
                    const a = sum === 0 ? 0 : parseFloat((absent[i].count*100/sum).toFixed(2)),
                          l = sum === 0 ? 0 : parseFloat((late[j].count*100/sum).toFixed(2))
                    weekly.push({
                        Name: absent[i].Name,
                        Absent: a,
                        Late: l,
                        "On class" : sum === 0 ? 0 : 100 - a - l
                    })
                }
    
    return weekly;
}

export async function  lineChartMonthly(){
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
                if (absent[i].Name === late[j].Name && late[j].Name  === onClass[k].Name){
                    const sum = absent[i].count + late[j].count + onClass[k].count;
                    const a = sum === 0 ? 0 : parseFloat((absent[i].count*100/sum).toFixed(2)),
                          l = sum === 0 ? 0 : parseFloat((late[j].count*100/sum).toFixed(2))
                    monthly.push({
                        Name: absent[i].Name,
                        Absent: a,
                        Late: l,
                        "On class" : sum === 0 ? 0 : 100 - a - l
                    })
                }
    
    return monthly;
}

export async function statsClass(status){
    var [stats] = await pool.query(`select Class_name
                                from  
                                    (
                                        select st.Class_name as Class_name, count(*) as count, st.Status
                                        from student_attendance st join session se
                                        where st.Status = '${status}' and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date >= DATE_SUB(curdate(), INTERVAL (DAYOFWEEK(curdate())+6)%8 DAY)  and se.Session_date <= curdate()
                                        group by st.Class_name
                                    ) tmp
                                where tmp. count = (
                                                        select max(count)
                                                        from 
                                                            (
                                                                select st.Class_name as Class_name, count(*) as count, st.Status
                                                                from student_attendance st join session se
                                                                where st.Status = '${status}' and st.Session_number = se.Session_number and st.Class_name = se.Class_name and se.Session_date >= DATE_SUB(curdate(), INTERVAL (DAYOFWEEK(curdate())+6)%8 DAY)  and se.Session_date <= curdate()
                                                                group by st.Class_name
                                                            ) tmp1
                                                    )`);
    // console.log(status);
    return stats;
}

export async function late10Student(){
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

export async function absent5Student(){
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

export async function getPeriod(dow, room, startDate, endDate)
{
    const periods = await pool.query(`
        SELECT Start_hour,End_hour from TIMETABLE where ID not in (SELECT Timetable_ID from SESSION where Session_number_make_up_for=null and Session_date>=${ startDate } and Session_date<=${ endDate } and DAYOFWEEK(Session_date)=${ dow } and Classroom_ID='${ room }')
    `);
    return periods[0];
}