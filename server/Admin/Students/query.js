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
    const [[student]] = await pool.query(`SELECT * FROM student WHERE id = '${ id }'`);
    student.birthday = new Date(student.birthday).toLocaleDateString('en-GB');
    return student;
}

export async function newStudent(name, ssn, phone, birthday, birthplace, email, address, classes)
{
    var id = (await pool.query(`SELECT newID('student')`))[0][0]["newID('student')"];
    const query = `CALL newStudent('${ name }', '${ ssn }','${ phone }','${ birthday }','${ birthplace }','${ email }','${ address }')`;
    await pool.query(query);

    const classQueries = classes.split(",").map((className) =>
    {
        return pool.query('CALL addStudent(?, ?)', [id, className]);
    });

    await Promise.all(classQueries);
    return;
}

export async function updateInfo(id, name, address, birthday, birthplace, email, phone)
{
    //console.log(ssn);
    if (name !== "") await pool.query(`UPDATE student SET name = ? WHERE ID = ?`, [name, id]);
    if (address !== "") await pool.query(`UPDATE student SET address = ? WHERE ID = ?`, [address, id]);
    if (birthday !== null) await pool.query(`UPDATE student SET birthday = ? WHERE ID = ?`, [birthday, id]);
    if (birthplace !== "") await pool.query(`UPDATE student SET birthplace = ? WHERE ID = ?`, [birthplace, id]);
    if (email !== "") await pool.query(`UPDATE student SET email = ? WHERE ID = ?`, [email, id]);
    if (phone !== "") await pool.query(`UPDATE student SET phone = ? WHERE ID = ?`, [phone, id]);
    return;
}

export async function statsStudent(id, className)
{
    const [[tmp]] = await pool.query(`call statsStudent(?,?)`, [id, className]);

    var data = [
        { count: 0, status: 0 },
        { count: 0, status: 1 },
        { count: 0, status: 2 }
    ]

    for (var i = 0; i < data.length; i++)
    {
        for (var j = 0; j < tmp.length; j++)
        {
            if (data[i].status == tmp[j].Status)
            {
                data[i].count = tmp[j].count;
                break;
            }
        }
    }

    return data;
}