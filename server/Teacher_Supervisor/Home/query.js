import mysql from 'mysql2';

const con = mysql.createPool({
      host: "localhost",
      user: "englishcenter",
      password: "englishcenter123",
      database: "english_center",
      multipleStatements: true
});

export function getTodaySession(id, callback)
{
      if (id.includes("TEACHER"))
      {
            con.query(`select SESSION.Session_number,SESSION.Class_name,TIMETABLE.Start_hour,TIMETABLE.End_hour from SESSION join TIMETABLE on TIMETABLE.ID=SESSION.Timetable_ID join TEACHER_RESPONSIBLE on TEACHER_RESPONSIBLE.Session_number=SESSION.Session_number and TEACHER_RESPONSIBLE.Class_name=SESSION.Class_name where Session_date=CURDATE() and Teacher_ID='${ id }' order by TIMETABLE.Start_hour`, (err, res) =>
            {
                  if (err)
                        callback(err, null);
                  else
                        callback(null, res);
            });
      }
      else
      {
            con.query(`select SESSION.Session_number,SESSION.Class_name,TIMETABLE.Start_hour,TIMETABLE.End_hour from SESSION join TIMETABLE on TIMETABLE.ID=SESSION.Timetable_ID join SUPERVISOR_RESPONSIBLE on SUPERVISOR_RESPONSIBLE.Session_number=SESSION.Session_number and SUPERVISOR_RESPONSIBLE.Class_name=SESSION.Class_name where Session_date=CURDATE() and Supervisor_ID='${ id }' order by TIMETABLE.Start_hour`, (err, res) =>
            {
                  if (err)
                        callback(err, null);
                  else
                        callback(null, res);
            });
      }
}

export function getMissed(callback)
{
      con.query(`select SESSION.Session_number,SESSION.Class_name,SESSION.Session_date from SESSION where SESSION.Session_date<=curdate() and (SESSION.Session_number,SESSION.Class_name) not in 
(select SESSION.Session_number,SESSION.Class_name from SESSION 
join STUDENT_ATTENDANCE on STUDENT_ATTENDANCE.Session_number=SESSION.Session_number and STUDENT_ATTENDANCE.Class_name=SESSION.Class_name) order by SESSION.Session_date desc`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}