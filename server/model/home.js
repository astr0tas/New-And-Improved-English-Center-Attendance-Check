import mysql from 'mysql2';

export class Home
{
      constructor()
      {
            this.conn = mysql.createPool({
                  host: "localhost",
                  user: "englishcenter",
                  password: "englishcenter123",
                  database: "english_center",
                  multipleStatements:true
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

      getTodaySession(userID, userType, callback)
      {
            if (userType === 2)
                  this.conn.query(`select class.name,classroom.id,timetable.start_hour,timetable.end_hour,session.number,session.status
                  from class
                  join session on session.class_name=class.name
                  join timetable on timetable.id=session.timetable_id
                  join classroom on classroom.id=session.classroom_id
                  join teach on teach.class_name=class.name
                  join teacher_responsible on teacher_responsible.session_number=session.number and teacher_responsible.class_name=class.name
                  where session.session_date=curdate() and class.status=2 and (session.status=1 or session.status=4) and teacher_responsible.teacher_id=?
                  order by timetable.start_hour,class.name,session.number;`, [userID], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
            else if (userType === 3)
                  this.conn.query(`select class.name,classroom.id,timetable.start_hour,timetable.end_hour,session.number,session.status
                  from class
                  join session on session.class_name=class.name
                  join timetable on timetable.id=session.timetable_id
                  join classroom on classroom.id=session.classroom_id
                  join supervisor_responsible on supervisor_responsible.session_number=session.number and supervisor_responsible.class_name=class.name
                  where session.session_date=curdate() and class.status=2 and (session.status=1 or session.status=4 or session.status=2) and supervisor_responsible.supervisor_id=?
                  order by timetable.start_hour,class.name,session.number;`, [userID], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
      }

      getMissedSession(userID, userType, callback)
      {
            if (userType === 2)
                  this.conn.query(`select distinct class.name,classroom.id,timetable.start_hour,timetable.end_hour,session.number,session.session_date
                  from class
                  join session on session.class_name=class.name
                  join timetable on timetable.id=session.timetable_id
                  join classroom on classroom.id=session.classroom_id
                  join teach on teach.class_name=class.name
                  join teacher_responsible on teacher_responsible.session_number=session.number and teacher_responsible.class_name=class.name
                  where class.status=2 and session.status=2 and session.session_date<=curdate() and session.number in (
						select distinct session.number from STUDENT_ATTENDANCE
						join class on STUDENT_ATTENDANCE.class_name=class.name
						join session on STUDENT_ATTENDANCE.session_number=session.number and STUDENT_ATTENDANCE.class_name=session.class_name
						join teach on teach.class_name=class.name
						join teacher_responsible on teacher_responsible.session_number=session.number and teacher_responsible.class_name=class.name
						where STUDENT_ATTENDANCE.status=-1 and teacher_responsible.teacher_id='TEACHER03'
					)
                  and teacher_responsible.teacher_id='TEACHER03'
                  order by timetable.start_hour,class.name,session.number;`, [userID, userID], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
            else if (userType === 3)
                  this.conn.query(`select class.name,classroom.id,timetable.start_hour,timetable.end_hour,session.number,session.session_date
                  from class
                  join session on session.class_name=class.name
                  join timetable on timetable.id=session.timetable_id
                  join classroom on classroom.id=session.classroom_id
                  join supervisor_responsible on supervisor_responsible.session_number=session.number and supervisor_responsible.class_name=class.name
                  where session.session_date<curdate() and session.status=2 and (session.number in (
                        select distinct session.number from STUDENT_ATTENDANCE
                        join class on STUDENT_ATTENDANCE.class_name=class.name
                        join session on STUDENT_ATTENDANCE.session_number=session.number and STUDENT_ATTENDANCE.class_name=session.class_name
                        join supervisor_responsible on supervisor_responsible.session_number=session.number and supervisor_responsible.class_name=class.name
                        where STUDENT_ATTENDANCE.status=-1 and supervisor_responsible.supervisor_id=?
                  ) or session.number in (
                        select session.number from TEACHER_RESPONSIBLE
                        join session on session.class_name=TEACHER_RESPONSIBLE.class_name and TEACHER_RESPONSIBLE.session_number=session.number
                        join class on session.class_name=class.name
                        join supervisor_responsible on supervisor_responsible.session_number=session.number and supervisor_responsible.class_name=session.class_name
                        where supervisor_responsible.supervisor_id=? and TEACHER_RESPONSIBLE.teacher_status=-1
                  )) and supervisor_responsible.supervisor_id=?
                  order by timetable.start_hour,class.name,session.number;`, [userID, userID, userID], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
      }
}