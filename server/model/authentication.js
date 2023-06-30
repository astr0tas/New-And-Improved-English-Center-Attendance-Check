import mysql from 'mysql2';

export class Authentication
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

      login(username, password, callback)
      {
            this.conn.query(`select ID from employee where username='${ username }' and password='${ password }'`, (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      recovery(username, password, callback)
      {
            this.conn.query(`update employee set password='${ password }' where username='${ username }'`, (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      validateUser(username, callback)
      {
            this.conn.query(`select * from employee where username='${ username }'`, (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }
}