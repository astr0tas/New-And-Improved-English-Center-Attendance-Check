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

export async function getPeriod(dow, room, startDate, endDate)
{
    const periods = await pool.query(`
        SELECT Start_hour,End_hour from TIMETABLE where ID not in (SELECT Timetable_ID from SESSION where Session_number_make_up_for=null and Session_date>=${ startDate } and Session_date<=${ endDate } and DAYOFWEEK(Session_date)=${ dow } and Classroom_ID='${ room }')
    `);
    return periods[0];
}