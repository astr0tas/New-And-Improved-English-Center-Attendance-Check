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

      classStudent(name, studentName, callback)
      {
            this.conn.query(`select student.name,student.phone,student.id,student.email,student.ssn from student join in_class on in_class.student_id=student.id 
            where in_class.class_name=? and student.name like ? order by TRIM(SUBSTRING_INDEX(student.name, ' ', -1))`, [name, '%' + studentName + '%'], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      classSessionDetail(name, number, callback)
      {
            this.conn.query(`call getSessionDetail(?,?);`, [name, number], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res.length ? res.filter((elem, i) => i !== res.length - 1) : [], null);
            });
      }

      getSessionStudent(name, studentName, callback)
      {
            this.conn.query(`select student.id,student.name from student
            join IN_CLASS on IN_CLASS.student_id=student.id where IN_CLASS.class_name=? and student.name like ? order by student.name`, [name, '%' + studentName + '%'], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getStudentSessionAttendace(className, sessionNumber, id, callback)
      {
            this.conn.query(`select status,note from STUDENT_ATTENDANCE where session_number=? and class_name=? and student_id=?`, [sessionNumber, className, id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      checkAttendance(name, number, students, teacher, userType, supervisor, callback)
      {
            let sql = '';
            const params = [];
            if (userType === 1 || userType === 3)
            {
                  sql += `update TEACHER_RESPONSIBLE set teacher_status=?,teacher_note=? where teacher_id=? and class_name=? and session_number=?;
                  update SUPERVISOR_RESPONSIBLE set Note_for_class=? where Supervisor_ID=? and class_name=? and session_number=?;`;
                  params.push(teacher.status, teacher.note, teacher.id, name, number,
                        supervisor.note, supervisor.id, name, number);
            }

            for (let i = 0; i < students.length; i++)
            {
                  sql += 'update STUDENT_ATTENDANCE set status=?,note=? where student_id=? and class_name=? and session_number=?;';
                  params.push(students[i].status, students[i].note, students[i].id, name, number);
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