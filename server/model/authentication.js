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

      login(username, password, type, callback)
      {
            if (type === 1)
                  this.conn.query(`select employee.ID from employee join admin on admin.id=employee.id where username=? and password=?`, [username, password], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
            else if (type === 2)
                  this.conn.query(`select employee.ID from employee join teacher on teacher.id=employee.id where username=? and password=?`, [username, password], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
            else if (type === 3)
                  this.conn.query(`select employee.ID from employee join supervisor on supervisor.id=employee.id where username=? and password=?`, [username, password], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
      }

      recovery(username, password, callback)
      {
            this.conn.query(`update employee set password=? where username=?`, [password, username], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      validateUser(username, callback)
      {
            this.conn.query(`select * from employee where username=?`, [username], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }
}