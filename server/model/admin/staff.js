import mysql from 'mysql2';

export class Staff
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

      getList(name, type, callback)
      {
            if (type === 1)
                  this.conn.query(`select employee.id,name,phone,birthday,email,ssn,address from employee join teacher on teacher.id=employee.id where name like ?`, ['%' + name + '%'], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
            else
                  this.conn.query(`select employee.id,name,phone,birthday,email,ssn,address from employee join supervisor on supervisor.id=employee.id where name like ?`, ['%' + name + '%'], (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback(res, null);
                  });
      }

      getInfo(id, callback)
      {
            this.conn.query(`select employee.id,ssn,name,phone,email,address,image,birthday,birthplace,username from employee join teacher on teacher.id=employee.id where employee.id=?`, [id], (err1, res1) =>
            {
                  if (err1 || !res1.length)
                  {
                        this.conn.query(`select employee.id,ssn,name,phone,email,address,image,birthday,birthplace,username from employee join supervisor on supervisor.id=employee.id where employee.id=?`, [id], (err2, res2) =>
                        {
                              if (err2 || !res2.length)
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

      getTeacherClass(id, className, callback)
      {
            this.conn.query(`select class.name,class.status,class.start_date,class.end_date 
            from class join teach on teach.class_name=class.name
            where teacher_id=? and class.name like ? order by class.status desc, class.start_date desc, class.name`, [id, className + '%'], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      getSupervisorClass(id, className, callback)
      {
            this.conn.query(`select class.name,class.status,class.start_date,class.end_date from class where class.name in (
                  select distinct SUPERVISOR_RESPONSIBLE.class_name from SUPERVISOR_RESPONSIBLE where SUPERVISOR_RESPONSIBLE.Supervisor_ID=?
            ) and class.name like ? order by class.status desc, class.start_date desc, class.name`, [id, className + '%'], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      isDuplicatedEmail(email, callback)
      {
            this.conn.query(`select email from employee where email=?`, [email], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res.length ? true : false, null);
            })
      }

      isDuplicatedPhone(phone, callback)
      {
            this.conn.query(`select phone from employee where phone=?`, [phone], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res.length ? true : false, null);
            })
      }

      isDuplicatedSSN(ssn, callback)
      {
            this.conn.query(`select ssn from employee where ssn=?`, [ssn], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res.length ? true : false, null);
            })
      }

      isStaffDuplicatedUsername(username, callback)
      {
            this.conn.query(`select username from employee where username=?`, [username], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res.length ? true : false, null);
            })
      }

      getIDForNewStaff(type, callback)
      {
            this.conn.query(`call getIDForNewStaff(?);`, [type], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res.length ? res.filter((elem, i) => i !== res.length - 1) : [], null);
            })
      }

      createStaff(id, name, ssn, address, phone, birthdate, birthplace, email, image, type, username, callback)
      {
            this.conn.query(`insert into employee values(?,?,?,?,?,?,?,?,?,?,?);
            insert into ${ type === 1 ? 'teacher' : 'supervisor' } values(?);`, [id, ssn, name, phone, username, phone, birthdate, birthplace, email, address, image, id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res.length ? true : false, null);
            })
      }

      createStaff(id, name, ssn, address, phone, birthdate, birthplace, email, image, password, callback)
      {
            let sql = '';
            const params = [];

            if (name)
            {
                  sql += `update employee set name=? where id=?`;
                  params.push(name, id);
            }

            if (ssn)
            {
                  sql += `update employee set ssn=? where id=?`;
                  params.push(ssn, id);
            }

            if (address)
            {
                  sql += `update employee set address=? where id=?`;
                  params.push(address, id);
            }

            if (phone)
            {
                  sql += `update employee set phone=? where id=?`;
                  params.push(phone, id);
            }

            if (birthdate)
            {
                  sql += `update employee set birthdate=? where id=?`;
                  params.push(birthdate, id);
            }

            if (birthplace)
            {
                  sql += `update employee set birthplace=? where id=?`;
                  params.push(birthplace, id);
            }

            if (email)
            {
                  sql += `update employee set email=? where id=?`;
                  params.push(email, id);
            }

            if (image)
            {
                  sql += `update employee set image=? where id=?`;
                  params.push(image, id);
            }

            if (password)
            {
                  sql += `update employee set password=? where id=?`;
                  params.push(password, id);
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