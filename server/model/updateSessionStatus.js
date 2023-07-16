import mysql from 'mysql2';

export class updateSessionStatusRegularly
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
            this.conn.query(`update session join timetable on timetable.id=session.timetable_id set status=1 
            where status!=3 and status!=5 and session_date=curdate() and start_hour<=curtime() and end_hour>=curtime();
            update session join timetable on timetable.id=session.timetable_id set status=2 
            where status!=3 and status!=5 and ((session_date=curdate() and end_hour<curtime()) or session_date<curdate());`, [], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }
}