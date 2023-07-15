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
            this.conn.query(`select session.number,session.session_date,timetable.start_hour,timetable.end_hour,session.status from session 
            join timetable on timetable.id=session.timetable_id
            where session.class_name=? order by session.number`, [name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
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

      classTeacher(name, teacherName, callback)
      {
            this.conn.query(`select employee.id,employee.name,employee.name,employee.phone,employee.email from employee
            join teacher on teacher.id=employee.id
            join teach on teach.teacher_id=employee.id
            where teach.class_name=? and employee.name like ? order by TRIM(SUBSTRING_INDEX(employee.name, ' ', -1))`, [name, '%' + teacherName + '%'], (err, res) =>
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
            this.conn.query(`delete from in_class where student_id=? and class_name=?;
            delete from STUDENT_ATTENDANCE where Student_ID=? and class_name=?;`, [id, name, id, name], (err, res) =>
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
                  sql += "insert into in_class values(?,?); call addStudentToSessions(?,?);";
                  params.push(students[i], name, name, students[i]);
            }
            this.conn.query(sql, params, (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getRoom(name, callback)
      {
            this.conn.query(`select classroom.id,classroom.max_seats from classroom where classroom.max_seats >= (select class.Max_students from class where class.name=?)`, [name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getTimetable(room, date, callback)
      {
            this.conn.query(`select id,start_hour,end_hour from timetable where id not in (
                  select distinct timetable_id from session where classroom_id=? and session_date=?
            )`, [room, date], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getClassCanceledSession(name, callback)
      {
            this.conn.query(`select number from session where class_name=? and status=3`, [name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      addSessionToClass(name, room, session, date, timetable, makeUpFor, supervisor, teacher, callback)
      {
            this.conn.query(`insert into session values(?,?,?,?,?,4,?,?);
            insert into teacher_responsible values(?,?,?,null,-1);
            insert into supervisor_responsible values(?,?,?,null);
            call addSessionToStudents(?,?);
            `, [session, name, timetable, room, date, makeUpFor, makeUpFor === null ? null : name,
                  session, name, teacher,
                  session, name, supervisor,
                  name, session], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getSessionTeacher(name, number, callback)
      {
            this.conn.query(`select employee.id,employee.name,teacher_responsible.teacher_status as status,teacher_responsible.teacher_note as note from employee
            join teacher on teacher.id=employee.id
            join teacher_responsible on teacher_responsible.teacher_id=teacher.id
            where teacher_responsible.session_number=? and teacher_responsible.class_name=?`, [number, name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getSessionSupervisor(name, number, callback)
      {
            this.conn.query(`select employee.id,employee.name, employee.image from employee
            join supervisor on supervisor.id=employee.id
            join supervisor_responsible on supervisor_responsible.supervisor_id=supervisor.id
            where supervisor_responsible.session_number=? and supervisor_responsible.class_name=?`, [number, name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      removeTeacherFromClass(name, id, callback)
      {
            this.conn.query(`update TEACHER_RESPONSIBLE set teacher_id=null where class_name=? and teacher_id=?;
            delete from teach where teacher_id=? and class_name=?;
            update session set status=5 where class_name=? and number in(
                  select Session_number from TEACHER_RESPONSIBLE where Class_name=? and Teacher_ID is null
            );`, [name, id, id, name, name, name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getTeacherNotInClass(name, className, callback)
      {
            this.conn.query(`select employee.id,employee.name,employee.phone,employee.email from employee
            join teacher on teacher.id=employee.id
            where employee.name like ? and employee.id not in(
                  select teacher_id from teach where class_name=?
            )`, ['%' + name + '%', className], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      addTeacherToClass(name, teachers, callback)
      {
            let sql = "";
            const params = [];
            for (let i = 0; i < teachers.length; i++)
            {
                  sql += "insert into teach values(?,?);";
                  params.push(teachers[i], name);
            }
            this.conn.query(sql, params, (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      classSessionDetail(name, number, callback)
      {
            this.conn.query(`select session.session_date,session.status,session.classroom_id,timetable.start_hour,timetable.end_hour,session.session_number_make_up_for
            from session join timetable on session.timetable_id=timetable.id
            where session.class_name=? and session.number=?`, [name, number], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getSessionStudent(name, callback)
      {
            this.conn.query(`select student.id,student.name from student
            join IN_CLASS on IN_CLASS.student_id=student.id where IN_CLASS.class_name=? order by student.name`, [name], (err, res) =>
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

      checkAttendance(name, number, students, teacher, callback)
      {
            let sql = "update TEACHER_RESPONSIBLE set teacher_status=?,teacher_note=? where teacher_id=? and class_name=? and session_number=?;";
            const params = [teacher.status, teacher.note, teacher.id, name, number];

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

      cancelSession(name, number, callback)
      {
            this.conn.query(`update session set status=3 where class_name=? and number=?`, [name, number], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      restoreSession(name, number, callback)
      {
            this.conn.query(`call restoreSession(?,?);`, [name, number], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      changeTeacher(name, number, teacher, callback)
      {
            this.conn.query(`call changeTeacher(?,?,?);`, [name, number, teacher], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      changeSupervisor(name, number, supervisor, callback)
      {
            this.conn.query(`call changeSupervisor(?,?,?);`, [name, number, supervisor], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }
}