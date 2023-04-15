import mysql from 'mysql2';

const con = mysql.createPool({
      host: "localhost",
      user: "englishcenter",
      password: "englishcenter123",
      database: "english_center"
});

export function getClassList(id, offset, callback)
{
      if (id.includes("TEACHER"))
      {
            con.query(`select DISTINCT CLASS.* from CLASS join TEACH on TEACH.Class_name=CLASS.Name where TEACH.Teacher_ID='${ id }' order by CLASS.Name,Class.Status desc limit 3 offset ${ offset } `, (err, res) =>
            {
                  if (err)
                        callback(err, null);
                  else
                        callback(null, res);
            });
      }
      else
      {
            con.query(`select DISTINCT CLASS.* from CLASS join SUPERVISOR_RESPONSIBLE on SUPERVISOR_RESPONSIBLE.Class_name=CLASS.Name where SUPERVISOR_RESPONSIBLE.Supervisor_ID='${ id }' order by CLASS.Name,Class.Status desc limit 3 offset ${ offset }`, (err, res) =>
            {
                  if (err)
                        callback(err, null);
                  else
                        callback(null, res);
            });
      }
}

export function getCurrentStudent(className, callback)
{
      con.query(`select count(*) as Current_stu from IN_CLASS where Class_name='${ className }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getClassDetail(className, callback)
{
      con.query(`select * from CLASS where Name='${ className }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getSessions(className, callback)
{
      con.query(`select count(*) as session from SESSION where Class_name='${ className }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getStudentList(className, callback)
{
      con.query(`select STUDENT.name,STUDENT.phone,STUDENT.email,STUDENT.ID from STUDENT join IN_CLASS on IN_CLASS.Student_ID=STUDENT.ID WHERE IN_CLASS.Class_name='${ className }' ORDER BY STUDENT.ID`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getSessionList(className, callback)
{
      con.query(`select Session_number,Session_date,Start_hour,End_hour,Classroom_ID from SESSION join TIMETABLE on TIMETABLE.ID=SESSION.Timetable_ID where Class_name='${ className }' order by Session_date`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}