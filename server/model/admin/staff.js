import mysql from 'mysql2';

export class Staff
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

      getList(name, type, callback)
      {
            if (type === 1)
                  this.conn.query(`select employee.id,name,phone,birthday,email,ssn,address from employee join teacher on teacher.id=employee.id where name like '%${ name }%'`, (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
            else
                  this.conn.query(`select employee.id,name,phone,birthday,email,ssn,address from employee join supervisor on supervisor.id=employee.id where name like '%${ name }%'`, (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
      }
}