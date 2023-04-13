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
            con.query(`select DISTINCT CLASS.*,COUNT(IN_CLASS.*) as Current_stu from CLASS join SESSION on join IN_CLASS on IN_CLASS.ClassName=CLASS.Name SESSION.ClassName=CLASS.Name where SESSION.TeacherID='${ id }' order by CLASS.Name,Class.Status desc limit 3 offset ${ offset } `, (err, res) =>
            {
                  if (err)
                        callback(err, null);
                  else
                        callback(null, res);
            });
      }
      else
      {
            con.query(`select DISTINCT CLASS.*,COUNT(IN_CLASS.*) as Current_stu from CLASS join SESSION on join IN_CLASS on IN_CLASS.ClassName=CLASS.Name SESSION.ClassName=CLASS.Name where SESSION.SupervisorID='${ id }' order by CLASS.Name,Class.Status desc limit 3 offset ${ offset }`, (err, res) =>
            {
                  if (err)
                        callback(err, null);
                  else
                        callback(null, res);
            });
      }
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