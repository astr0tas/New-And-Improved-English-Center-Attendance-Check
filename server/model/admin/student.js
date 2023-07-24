import mysql from 'mysql2';

export class Student
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
            this.conn.query(`select id,name,phone,birthday,email,ssn from student where name like ? order by name,id`, ['%' + name + '%'], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }

      studentInfo(id, callback)
      {
            this.conn.query(`select * from student where id=?`, [id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }

      getStudentClass(id, className, callback)
      {
            this.conn.query(`select class.name,class.status,class.start_date,class.end_date 
            from class join in_class on in_class.class_name=class.name
            where student_id=? and class.name like ? order by class.status desc, class.start_date desc, class.name`, [id, className + '%'], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }
}