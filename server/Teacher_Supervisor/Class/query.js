import mysql from 'mysql2';

const con = mysql.createPool({
      host: "localhost",
      user: "englishcenter",
      password: "englishcenter123",
      database: "english_center",
      multipleStatements: true,
});

export function getClassList(id, offset, callback)
{
      if (id.includes("TEACHER"))
      {
            con.query(`select DISTINCT CLASS.* from CLASS join SESSION on SESSION.ClassName=CLASS.Name where SESSION.TeacherID='${ id }' order by CLASS.Name,Class.Status desc limit 3 offset ${ offset } `, (err, res) =>
            {
                  if (err)
                        callback(err, null);
                  else
                        callback(null, res);
            });
      }
      else
      {
            con.query(`select DISTINCT CLASS.* from CLASS join SESSION on SESSION.ClassName=CLASS.Name where SESSION.SupervisorID='${ id }' order by CLASS.Name,Class.Status desc limit 3 offset ${ offset }`, (err, res) =>
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
      con.query(`select count(*) as Current_stu from IN_CLASS where ClassName='${ className }'`, (err, res) =>
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
      con.query(`select count(*) as session from SESSION where ClassName='${ className }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getDefaultSessions(className, callback)
{
      con.query(`select count(*) as session from SESSION where ClassName='${ className }' and MakeUpSession_number is null`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getStudentList(className, callback)
{
      con.query(`select STUDENT.name,STUDENT.phone,STUDENT.email,STUDENT.ssn from STUDENT join IN_CLASS on IN_CLASS.StudentSSN=STUDENT.ssn WHERE IN_CLASS.ClassName='${ className }' ORDER BY STUDENT.name`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getSessionList(className, callback)
{
      con.query(`select Session_number,Session_date,Start_hour,End_hour,RoomNumber from SESSION where ClassName='${ className }' order by Session_date`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}