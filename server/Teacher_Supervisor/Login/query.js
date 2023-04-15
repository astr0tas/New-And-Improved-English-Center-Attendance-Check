import mysql from 'mysql2';

const con = mysql.createPool({
      host: "localhost",
      user: "englishcenter",
      password: "englishcenter123",
      database: "english_center"
});

export function validateTSLoginInfo(account, password, callback)
{
      con.query(`select * from EMPLOYEE where username='${ account }' and password='${ password }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}