import mysql from 'mysql2';

export class Class
{
      constructor()
      {
            this.conn = mysql.createPool({
                  host: "localhost",
                  user: "englishcenter",
                  password: "englishcenter123",
                  database: "english_center",
                  multipleStatements: true
            });
      }

      destroy()
      {
            if (this.conn)
            {
                  this.conn.end((err) =>
                  {
                        if (err)
                        {
                              console.error('Error closing MySQL connection:', err);
                        } else
                        {
                              console.log('MySQL connection closed');
                        }
                  });
            }
      }

      getInfo(name, callback)
      {
            this.conn.query(`select start_date,end_date,max_students,initial_sessions,status from class where name=?;
            select count(in_class.class_name) as currentStudents from class join in_class on in_class.class_name=class.name where name=?;
            select count(session.class_name) as currentSessions from class join session on session.class_name=class.name where name=?;`, [name, name, name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      classSession(name, id, type, callback)
      {
            if (!id || !type)
                  this.conn.query(`call getSessionList(?);`, [name], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res.length ? res.filter((elem, i) => i !== res.length - 1) : [], null);
                  });
            else
            {
                  if (type === 2)
                        this.conn.query(`call getTeacherSession(?,?);`, [name, id], (err, res) =>
                        {
                              if (err)
                                    callback(null, err);
                              else
                                    callback(res.length ? res.filter((elem, i) => i !== res.length - 1) : [], null);
                        });
                  else if (type === 3)
                        this.conn.query(`call getSupervisorSession(?,?);`, [name, id], (err, res) =>
                        {
                              if (err)
                                    callback(null, err);
                              else
                                    callback(res.length ? res.filter((elem, i) => i !== res.length - 1) : [], null);
                        });
            }
      }

      classStudent(name, callback)
      {
            this.conn.query(`select student.name,student.phone,student.id,student.email,student.ssn from student join in_class on in_class.student_id=student.id 
            where in_class.class_name=? order by TRIM(SUBSTRING_INDEX(student.name, ' ', -1))`, [name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }
}