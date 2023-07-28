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

      isDuplicatedEmail(email, callback)
      {
            this.conn.query(`select email from student where email=?`, [email], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }

      isDuplicatedPhone(phone, callback)
      {
            this.conn.query(`select phone from student where phone=?`, [phone], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }

      isDuplicatedSSN(ssn, callback)
      {
            this.conn.query(`select ssn from student where ssn=?`, [ssn], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }

      getIDForNewStudent(callback)
      {
            this.conn.query(`call getIDForNewStudent();`, [], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res.length ? res.filter((elem, i) => i !== res.length - 1) : [], null);
            })
      }

      createStudent(id, name, ssn, address, phone, birthdate, birthplace, email, image, callback)
      {
            this.conn.query(`insert into student values(?,?,?,?,?,?,?,?,?);`, [id, name, phone, birthdate, birthplace, email, address, ssn, image], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            })
      }

      updateStudent(id, name, ssn, address, phone, birthdate, birthplace, email, image, callback)
      {
            let sql = '';
            const params = [];

            if (name)
            {
                  sql += `update student set name=? where id=?`;
                  params.push(name, id);
            }

            if (ssn)
            {
                  sql += `update student set ssn=? where id=?`;
                  params.push(ssn, id);
            }

            if (address)
            {
                  sql += `update student set address=? where id=?`;
                  params.push(address, id);
            }

            if (phone)
            {
                  sql += `update student set phone=? where id=?`;
                  params.push(phone, id);
            }

            if (birthdate)
            {
                  sql += `update student set birthdate=? where id=?`;
                  params.push(birthdate, id);
            }

            if (birthplace)
            {
                  sql += `update student set birthplace=? where id=?`;
                  params.push(birthplace, id);
            }

            if (email)
            {
                  sql += `update student set email=? where id=?`;
                  params.push(email, id);
            }

            if (image)
            {
                  sql += `update student set image=? where id=?`;
                  params.push(image, id);
            }

            if (sql === '')
                  callback('Nothing to update', null);
            else
                  this.conn.query(sql, params, (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  })
      }
}