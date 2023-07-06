import mysql from 'mysql2';

export class Class
{
      constructor()
      {
            this.conn = mysql.createPool({
                  host: "localhost",
                  user: "englishcenter",
                  password: "englishcenter123",
                  database: "english_center"
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

      getList(name, callback)
      {
            this.conn.query(`select * from class where name like '${ name }%' order by status desc, start_date desc, name`, (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }

      getCurrentStudent(name, callback)
      {
            this.conn.query(`select count(in_class.class_name) as currentStudents from class join in_class on in_class.class_name=class.name where name='${ name }'`, (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }

      getCurrentSession(name, callback)
      {
            this.conn.query(`select count(session.class_name) as currentSessions from class join session on session.class_name=class.name where name='${ name }'`, (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }
}