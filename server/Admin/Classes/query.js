import mysql from 'mysql2';

const pool = mysql.createPool({
    host: `127.0.0.1`,
    user: 'englishcenter',
    password: 'englishcenter123',
    database: 'english_center'
}).promise();

export async function getClassesForStudent()
{
    const classes = await pool.query(`SELECT * FROM class WHERE Current_number_of_student < Max_number_of_students AND Status = 1`);
    return classes[0];
}

export async function getClasses(){
    const [classes] = await pool.query(`SELECT * FROM class`);
    classes.map(
        iClass =>{
            iClass.Start_date = new Date(iClass.Start_date).toLocaleDateString('en-GB')
            iClass.End_date = new Date(iClass.End_date).toLocaleDateString('en-GB')
        }
    )
    return classes;
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
    var [classOfStudent] = await pool.query(`SELECT Name, Start_date, End_date, Status FROM class WHERE Status = 1 AND Current_number_of_student < Max_number_of_students AND Name NOT IN (SELECT DISTINCT Class_name FROM in_class WHERE Student_ID = '${ id }')`);
    classOfStudent.map(
        sClass =>
        {
            sClass.Start_date = new Date(sClass.Start_date).toLocaleDateString('en-GB')
            sClass.End_date = new Date(sClass.End_date).toLocaleDateString('en-GB')
        }
    )
    return classOfStudent;
}

export async function getNotClassesOfStaff(id)
{
    var role = id.includes("TEACHER") ? "teacher" : "supervisor";
    var [[classOfStaff]]= await pool.query(`call availableClassForStaff(?,?)`, [role, id])
    classOfStaff.map(
        sClass =>
        {
            sClass.Start_date = new Date(sClass.Start_date).toLocaleDateString('en-GB')
            sClass.End_date = new Date(sClass.End_date).toLocaleDateString('en-GB')
        }
    )
    return classOfStaff;
}

export async function getClassInfo(className)
{
    var [sClass] = await pool.query(`SELECT * FROM class WHERE Name = '${ className }'`);
    return sClass;
}

export async function changeClass(id, oldClass, newClass)   
{
    var role;
    if (id.includes("STUDENT"))
        role = "student";
    else 
        if (id.includes("TEACHER"))
            role = "teacher";
        else
            role = "supervisor";

    await pool.query(`CALL changeClass('${ role }','${ id }','${ oldClass }', '${ newClass }')`);
    return;
}

export async function newClassForID(id, classes){
    
    if (id.includes("STUDENT")){
        const classQueries = classes.split(',').map((className) =>
        {
            return pool.query('CALL addStudent(?, ?)', [id, className]);
        });

        await Promise.all(classQueries);
    }
    else{
        if (id.includes("TEACHER")){
            const classQueries = classes.split(',').map((className) =>
            {
                return pool.query('CALL addTeacherToClass(?, ?)', [id, className]);
            });
            await Promise.all(classQueries);
        }
        else{
            console.log(classes);
        }
    }
    return;
}

export async function getClassofStaff(id, role)
{
    if (role === "teacher"){
        var [classOfTeacher] = await pool.query(`SELECT * FROM in_class JOIN class WHERE Student_ID = '${ id }' AND Class_name = Name`);
        classOfTeacher.map(
            sClass =>
            {
                sClass.Start_date = new Date(sClass.Start_date).toLocaleDateString('en-GB')
                sClass.End_date = new Date(sClass.End_date).toLocaleDateString('en-GB')
            }
        )
        return classOfTeacher;
    }
    else{

    }
}