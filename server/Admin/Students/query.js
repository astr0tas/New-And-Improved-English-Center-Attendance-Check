import mysql from 'mysql2';

const pool = mysql.createPool({
    host: `127.0.0.1`,
    user: 'englishcenter',
    password: 'englishcenter123',
    database: 'english_center'
}).promise();

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

export async function newStudent(name, phone, birthday, birthplace, email, address, classes)
{
    var id = (await pool.query(`SELECT newID('student')`))[0][0]["newID('student')"];
    const query = `CALL newStudent('${ name }','${ phone }','${ birthday }','${ birthplace }','${ email }','${ address }')`;
    await pool.query(query);

    const classQueries = classes.split(",").map((className) =>
    {
        return pool.query('CALL addStudent(?, ?)', [id, className]);
    });

    await Promise.all(classQueries);
    return;
}