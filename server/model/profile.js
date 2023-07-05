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
            this.conn.query(`select ssn,name,phone,username,birthday,birthplace,email,address,image from employee where employee.id='${ id }'`, (err, res) =>
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
            if (ssn !== 'null')
                  queryStmts += `update employee set ssn='${ ssn }' where id='${ id }';`;
            if (name !== 'null')
                  queryStmts += `update employee set name='${ name }' where id='${ id }';`;
            if (address !== 'null')
                  queryStmts += `update employee set address='${ address }' where id='${ id }';`;
            if (birthday !== 'null')
                  queryStmts += `update employee set birthday='${ birthday }' where id='${ id }';`;
            if (birthplace !== 'null')
                  queryStmts += `update employee set birthplace='${ birthplace }' where id='${ id }';`;
            if (email !== 'null')
                  queryStmts += `update employee set email='${ email }' where id='${ id }';`;
            if (phone !== 'null')
                  queryStmts += `update employee set phone='${ phone }' where id='${ id }';`;
            if (password !== 'null')
                  queryStmts += `update employee set password='${ password }' where id='${ id }';`;
            if (imagePath !== null)
                  queryStmts += `update employee set image='${ imagePath }' where id='${ id }';`;
            if (queryStmts !== "")
                  this.conn.query(queryStmts, (err, res) =>
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