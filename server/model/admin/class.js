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
            this.conn.query(`call getClassList(?,?);`, [name, status], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                  {
                        callback(res.length ? res.filter((elem, i) => i !== res.length - 1) : [], null);
                  }
            })
      }

      classTeacher(name, teacherName, date, timetable, callback)
      {
            if (date === null || timetable === null)
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
            else
                  this.conn.query(`select employee.id,employee.name,employee.name,employee.phone,employee.email from employee
            join teacher on teacher.id=employee.id
            join teach on teach.teacher_id=employee.id
            where teach.class_name=? and employee.name like ? and employee.id not in(
                  select Teacher_ID from TEACHER_RESPONSIBLE 
                  join session on TEACHER_RESPONSIBLE.class_name=session.class_name and TEACHER_RESPONSIBLE.session_number=session.number
                  join timetable on timetable.id=session.timetable_id
                  where session.session_date=? and not (?<timetable.start_hour or ?>timetable.end_hour)
            ) order by TRIM(SUBSTRING_INDEX(employee.name, ' ', -1))`, [name, '%' + teacherName + '%', date, timetable[1], timetable[0]], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
      }

      toggleStatus(name, status, callback)
      {
            this.conn.query(`call toggleStatus(?,?);`, [name, status], (err, res) =>
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

      getSuitableRoom(name, callback)
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

      getClassCanceledMissingSession(name, callback)
      {
            this.conn.query(`select number from session where class_name=? and (status=3 or status=5)`, [name], (err, res) =>
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
            update class set end_date=? where end_date<? and name=?;
            `, [session, name, timetable, room, date, makeUpFor, makeUpFor === null ? null : name,
                  session, name, teacher,
                  session, name, supervisor,
                  name, session,
                  date, date, name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      removeTeacherFromClass(name, id, callback)
      {
            this.conn.query(`update TEACHER_RESPONSIBLE set teacher_id=null,teacher_note=null,teacher_status=-1 where class_name=? and teacher_id=?;
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

      getPeriods(callback)
      {
            this.conn.query(`select * from timetable`, [], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getSuitableTeacher(teacherName, startDate, endDate, dow, startHour, endHour, callback)
      {
            this.conn.query(`select employee.id,employee.name,employee.email,employee.phone from employee
            join teacher on teacher.id=employee.id where employee.name like ? and teacher.id not in (
                  select teacher_responsible.teacher_id from teacher_responsible
                  join session on session.number=teacher_responsible.session_number and session.class_name=teacher_responsible.class_name
                  join timetable on timetable.id=session.timetable_id
                  join class on class.name=session.class_name
                  where class.status=2 and not (class.start_date>? or class.end_date<?)
                  and WEEKDAY(session.session_date)+1=?
                  and not (timetable.start_hour>? or timetable.end_hour<?) and teacher_responsible.teacher_id is not null
                  )`, ['%' + teacherName + '%', endDate, startDate, dow, endHour, startHour], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getDuplicateName(name, callback)
      {
            this.conn.query(`select name from class where name=?`, [name], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      changeClassRoom(name, number, room, callback)
      {
            this.conn.query(`update session set classroom_id=? where class_name=? and number=?`, [room, name, number], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getSuitableStudent(name, startDate, endDate, period, callback)
      {
            let sql = `select s1.id,s1.name,s1.ssn,s1.phone,s1.email from student s1 
                  where s1.name like ? and s1.id not in(
                  select s2.id from student s2
                  join in_class on in_class.student_id=s2.id
                  join class on class.name=in_class.class_name
                  join session on session.class_name=class.name
                  join timetable on timetable.id=session.timetable_id
                  where class.status=2 and not (class.start_date>? or class.end_date<?)
                  and ((WEEKDAY(session.session_date)+1=?
                  and not (timetable.start_hour>? or timetable.end_hour<?))`;
            const params = ['%' + name + '%', endDate, startDate, period[0].dow, period[0].end, period[0].start];
            for (let i = 1; i < period.length; i++)
            {
                  sql += `or (WEEKDAY(session.session_date)+1=?
                  and not (timetable.start_hour>? or timetable.end_hour<?))`;
                  params.push(period[i].dow, period[i].end, period[i].start);
            }
            sql += ')) order by s1.id';
            this.conn.query(sql, params, (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getSuitableRoomForNewClass(seats, startDate, endDate, dow, startHour, endHour, callback)
      {
            this.conn.query(`select id,max_seats from classroom where max_seats>=? and id not in(
                  select classroom.id from classroom
                  join session on session.classroom_id=classroom.id
                  join timetable on timetable.id=session.timetable_id
                  join class on class.name=session.class_name
                  where class.status=2 and not (class.start_date>? or class.end_date<?)
                  and WEEKDAY(session.session_date)+1=?
                  and not (timetable.start_hour>? or timetable.end_hour<?)
            ) order by id`, [seats, endDate, startDate, dow, endHour, startHour], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      createClass(name, start, end, supervisor, period, sessions, students, length, callback)
      {
            const sorted = period.slice().sort((elem1, elem2) => elem1.roomSize - elem2.roomSize);
            const maxSeats = sorted[0].roomSize;
            const params = [start, end, name, maxSeats, length * 4 * period.length];
            const addedTeacher = [];
            let sql = `insert into class values(?,?,?,2,?,?);`;
            for (let i = 0; i < students.length; i++)
            {
                  sql += `insert into in_class values(?,?);`;
                  params.push(students[i].id, name);
            }
            for (let i = 0; i < period.length; i++)
            {
                  if (!addedTeacher.includes(period[i].teacherID))
                  {
                        sql += `insert into teach values(?,?);`;
                        params.push(period[i].teacherID, name);
                        addedTeacher.push(period[i].teacherID);
                  }
            }
            for (let i = 0; i < sessions.length; i++)
            {
                  const date = new Date(sessions[i]);
                  const index = period.findIndex(elem => elem.dow === date.getDay());
                  sql += `insert into session values(?,?,?,?,?,4,null,null);
                  insert into teacher_responsible values(?,?,?,null,-1);
                  insert into supervisor_responsible values(?,?,?,null);
                  call addSessionToStudents(?,?);`;
                  params.push(i + 1, name, period[index].id, period[index].room, sessions[i],
                        i + 1, name, period[index].teacherID,
                        i + 1, name, supervisor,
                        name, i + 1);
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