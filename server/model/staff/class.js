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

      classList(name, limit, userType, offset, status, id, callback)
      {
            if (userType === 2)
                  this.conn.query(`call getTeacherClass(?,?,?,?,?);`, [name, status, id, offset, limit], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                        {
                              callback(res.length ? res.filter((elem, i) => i !== res.length - 1) : [], null);
                        }
                  });
            else if (userType === 3)
                  this.conn.query(`call getSupervisorClass(?,?,?,?,?);`, [name, status, id, offset, limit], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                        {
                              callback(res.length ? res.filter((elem, i) => i !== res.length - 1) : [], null);
                        }
                  });
      }
}