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

      getInfo(id, callback)
      {
            this.conn.query(`select employee.id,ssn,name,phone,email,address,image,birthday,birthplace from employee join teacher on teacher.id=employee.id where employee.id='${ id }'`, (err1, res1) =>
            {
                  if (err1)
                  {
                        this.conn.query(`select employee.id,ssn,name,phone,email,address,image,birthday,birthplace from employee join supervisor on supervisor.id=employee.id where employee.id='${ id }'`, (err2, res2) =>
                        {
                              if (err2)
                                    callback(null, "No staff found!");
                              else
                              {
                                    res2[0].type = 2;
                                    callback(res2, null);
                              }
                        });
                  }
                  else
                  {
                        res1[0].type = 1;
                        callback(res1, null);
                  }
            });
      }

      getTeacherClass(id, callback)
      {
            this.conn.query(`select class.name,class.status,class.start_date,class.end_date from class join teach on teach.class_name=class.name where teacher_id='${ id }' order by class.status desc, class.start_date desc, class.name`, (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getSupervisorClass(id, callback)
      {
            // this.conn.query(`select class.name,class.status,class.start_date,class.end_date 
            // from class join teach on teach.class_name=class.name
            // where teacher_id='${ id }' order by class.status desc, class.start_date desc, class.name`, (err, res) =>
            // {
            //       if (err)
            //             callback(null, err);
            //       else
            //             callback(res, null);
            // });
      }
}