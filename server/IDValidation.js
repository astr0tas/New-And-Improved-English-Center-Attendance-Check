import mysql from 'mysql2';

export class IDValidation
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

      validateID(id, callback)
      {
            this.conn.query(`select id from employee where id=?`, [id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res.length ? true : false, null);
            });
      }
}