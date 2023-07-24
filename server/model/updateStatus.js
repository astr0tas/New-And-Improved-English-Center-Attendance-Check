import mysql from 'mysql2';

export class updatStatusRegularly
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

      liveFunction(callback)
      {
            this.conn.query(`update session join teacher_responsible on teacher_responsible.class_name=session.class_name and teacher_responsible.session_number=session.number
            join supervisor_responsible on supervisor_responsible.session_number=session.number and supervisor_responsible.class_name=session.class_name
            set status=5 where supervisor_responsible.supervisor_id is null or teacher_responsible.teacher_id is null;
            update session join timetable on timetable.id=session.timetable_id set status=1 
            where status!=3 and status!=5 and session_date=curdate() and start_hour<=curtime() and end_hour>=curtime();
            update session join timetable on timetable.id=session.timetable_id set status=2 
            where status!=3 and status!=5 and((session_date = curdate() and end_hour<curtime()) or session_date<curdate());
            update class set class.status=0 where end_date < curdate();
            update class join session on session.class_name = class.name join timetable on timetable.id = session.timetable_id
            set class.status = 0 where session.session_date = curdate() and end_date = curdate() and timetable.end_hour < curtime();`, [], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }
}