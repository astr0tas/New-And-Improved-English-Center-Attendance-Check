import mysql from 'mysql2';

export class Profile
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

      getInfo(id, callback)
      {
            this.conn.query(`select ssn,name,phone,username,birthday,birthplace,email,address,image from employee where employee.id=?`, [id], (err, res) =>
            {
                  if (err)
                        callback(null, err);
                  else
                        callback(res, null);
            });
      }

      updateInfo(id, ssn, name, address, birthday, birthplace, email, phone, password, imagePath, callback)
      {
            let queryStmts = "";
            const queryParams = [];
            if (ssn !== null)
            {
                  queryStmts += `update employee set ssn=? where id=?;`;
                  queryParams.push(ssn, id);
            }
            if (name !== null)
            {
                  queryStmts += `update employee set name=? where id=?;`;
                  queryParams.push(name, id);
            }
            if (address !== null)
            {
                  queryStmts += `update employee set address=? where id=?;`;
                  queryParams.push(address, id);
            }
            if (birthday !== null)
            {
                  queryStmts += `update employee set birthday=? where id=?;`;
                  queryParams.push(birthday, id);
            }
            if (birthplace !== null)
            {
                  queryStmts += `update employee set birthplace=? where id=?;`;
                  queryParams.push(birthplace, id);
            }
            if (email !== null)
            {
                  queryStmts += `update employee set email=? where id=?;`;
                  queryParams.push(email, id);
            }
            if (phone !== null)
            {
                  queryStmts += `update employee set phone=? where id=?;`;
                  queryParams.push(phone, id);
            }
            if (password !== null)
            {
                  queryStmts += `update employee set password=? where id=?;`;
                  queryParams.push(password, id);
            }
            if (imagePath !== null)
            {
                  queryStmts += `update employee set image=? where id=?;`;
                  queryParams.push(imagePath, id);
            }
            if (queryStmts !== "")
                  this.conn.query(queryStmts, queryParams, (err, res) =>
                  {
                        if (err)
                              callback(null, err);
                        else
                              callback('Personal Info Update Successfully!', null);
                  });
            else
                  callback("Nothing is updated!", null);
      }
}