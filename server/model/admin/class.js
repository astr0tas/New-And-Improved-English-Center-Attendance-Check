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

      getList(name, status, callback)
      {
            this.conn.query(`select * from class where name like ? and status=? order by status desc, start_date desc, name`, [name + '%', status], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }

      getCurrentStudent(name, callback)
      {
            this.conn.query(`select count(in_class.class_name) as currentStudents from class join in_class on in_class.class_name=class.name where name=?`, [name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }

      getCurrentSession(name, callback)
      {
            this.conn.query(`select count(session.class_name) as currentSessions from class join session on session.class_name=class.name where name=?`, [name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }

      getInfo(name, callback)
      {
            this.conn.query(`select start_date,end_date,max_students,initial_sessions,status from class where name=?`, [name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      classSession(name, callback)
      {
            this.conn.query(`select session.number,session.session_date,timetable.start_hour,timetable.end_hour from session 
            join timetable on timetable.id=session.timetable_id where session.class_name=?`, [name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      classStudent(name, callback)
      {
            this.conn.query(`select student.name,student.phone,student.id,student.email,student.ssn from student join in_class on in_class.student_id=student.id where in_class.class_name=?`, [name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      toggleStatus(name, status, callback)
      {
            this.conn.query(`update class set status=? where name=?`, [status, name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      removeStudentFromClass(name, id, callback)
      {
            this.conn.query(`delete from in_class where student_id=? and class_name=?`, [id, name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getStudentNotFromClass(className, studentName, callback)
      {
            this.conn.query(`select name,phone,id,email,ssn from student S1 where S1.name like ? and S1.id not in (
                  select id from student S2 join in_class on in_class.student_id=S2.id where in_class.class_name=?
            )`, ['%' + studentName + '%', className], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      addStudentToClass(name, students, callback)
      {
            let sql = "";
            const params = [];
            for (let i = 0; i < students.length; i++)
            {
                  sql += "insert into in_class values(?,?);";
                  params.push(students[i], name);
            }
            this.conn.query(sql, params, (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }
}