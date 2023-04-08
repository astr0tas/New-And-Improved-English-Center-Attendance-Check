import mysql from 'mysql2';

const pool = mysql.createPool({
    host: `127.0.0.1`,
    user: 'englishcenter',
    password: 'englishcenter123',
    database: 'english_center'
}).promise();

export async function getEmployees(){
    const employees = await pool.query(`SELECT * FROM employee`);
    return employees[0];
}

export async function getUser(username){
    const [user] = await pool.query(`SELECT * FROM employee WHERE username = '${username}'`);
    return user[0];
}

export async function getStudents(){
    const students = await pool.query(`SELECT * FROM student`);
    return students[0];
}

export async function getStudent(ssn){
    const [student] = await pool.query(`SELECT * FROM student WHERE ssn = '${ssn}'`);
    return student;
}

export async function insertStudent(ssn, name, phone, birthday, email, quantity){
    var query = `INSERT INTO student VALUES('${ssn}','${name}','${phone}','${birthday}','${birthplace}','${email}','${address}')`;
    await pool.query(query);
    return;
}


export async function getClasses(){
    const classes = await pool.query(`SELECT * FROM class`);
    return classes[0];
}