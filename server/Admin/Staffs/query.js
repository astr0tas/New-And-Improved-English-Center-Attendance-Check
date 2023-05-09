import mysql from 'mysql2';

const pool = mysql.createPool({
    host: `127.0.0.1`,
    user: 'englishcenter',
    password: 'englishcenter123',
    database: 'english_center'
}).promise();

export async function getNewID(role)
{
    const [id] = await pool.query(`SELECT newID('${ role }')`);
    return id;
}

export async function getSupervisors()
{
    const [supervisors] = await pool.query(`select * from SUPERVISOR join EMPLOYEE on SUPERVISOR.ID=EMPLOYEE.ID`);
    supervisors.map(
        supervisor =>
        {
            supervisor.birthday = new Date(supervisor.birthday).toLocaleDateString('en-GB');
        }
    )
    return supervisors;
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
    const [teachers] = await pool.query(`select * from TEACHER join EMPLOYEE on TEACHER.ID=EMPLOYEE.ID`);
    teachers.map(
        teacher =>
        {
            teacher.birthday = new Date(teacher.birthday).toLocaleDateString('en-GB');
        }
    )
    return teachers;
}

export async function newStaff(name, ssn, phone, birthday, birthplace, email, address, classes, role){
    const id = (await pool.query(`SELECT newID('${ role }')`))[0][0]["newID('" + role + "')"];

    await pool.query(`CALL newStaff('${ name }','${ ssn }','${ phone }','${ birthday }','${ birthplace }','${ email }','${ address }','${ role }')`);

    
    const classQueries = classes.map((obj) =>
    {
        if(role === 'teacher'){
            pool.query('CALL addTeacherToClass(?, ?)', [id, obj]);
        }
        else
            obj.session.map((session) => {
                pool.query('CALL addSessionToStaff(?,?,?)', [session, obj.className, id, role]);
            })
    });
    await Promise.all(classQueries);


    return;
}

export async function availableClassForStaff(role){console.log(role);
    const [[classes]] = await pool.query(`CALL availableClassForStaff('${ role }')`);
    return classes;
}

export async function availableSessionForStaff(role, className){
    const [[sessions]] = await pool.query(`CALL availableSessionForStaff('${ className }','${ role }')`);
    sessions.map(session => session.Session_date = new Date(session.Session_date).toLocaleDateString('en-GB'))
    return sessions;
}

export async function updateInfo(id, name, address, birthday, birthplace, email, phone)
{
    if (name !== "") pool.query(`UPDATE employee SET name = ? WHERE ID = ?`, [name, id]);
    if (address !== "") pool.query(`UPDATE employee SET address = ? WHERE ID = ?`, [address, id]);
    if (birthday !== null) pool.query(`UPDATE employee SET birthday = ? WHERE ID = ?`, [birthday, id]);
    if (birthplace !== "") pool.query(`UPDATE  employee  SET birthplace = ? WHERE ID = ?`, [birthplace, id]);
    if (email !== "") pool.query(`UPDATE employee SET email = ? WHERE ID = ?`, [email, id]);
    if (phone !== "") pool.query(`UPDATE employee SET phone = ? WHERE ID = ?`, [phone, id]);
    return;
}