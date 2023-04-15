import mysql from 'mysql2';

const con = mysql.createPool({
      host: "localhost",
      user: "englishcenter",
      password: "englishcenter123",
      database: "english_center"
});

export function getSessionDetail(sessionNumber, className, callback)
{
      con.query(`select Classroom_ID,Session_date,Status,Session_number_make_up_for,Start_hour,End_hour from SESSION join TIMETABLE on TIMETABLE.ID=SESSION.Timetable_ID where Class_name='${ className }' and Session_number='${ sessionNumber }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getTeacher(sessionNumber, className, callback)
{
      con.query(`select EMPLOYEE.name,EMPLOYEE.ID from TEACHER_RESPONSIBLE join EMPLOYEE on TEACHER_RESPONSIBLE.Teacher_ID=EMPLOYEE.ID where TEACHER_RESPONSIBLE.Session_number=${ sessionNumber } and TEACHER_RESPONSIBLE.Class_name='${ className }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getSupervisor(sessionNumber, className, callback)
{
      con.query(`select EMPLOYEE.name,EMPLOYEE.ID from SUPERVISOR_RESPONSIBLE join EMPLOYEE on SUPERVISOR_RESPONSIBLE.Supervisor_ID=EMPLOYEE.ID where SUPERVISOR_RESPONSIBLE.Session_number=${ sessionNumber } and SUPERVISOR_RESPONSIBLE.Class_name='${ className }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}