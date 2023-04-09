create user 'englishcenter'@'localhost' identified with mysql_native_password by 'englishcenter123';
-- Or use this line if the above one does not work
-- create user 'englishcenter'@'localhost' identified by 'englishcenter123';

grant all privileges on english_center.* to 'englishcenter'@'localhost';

grant file on *.* to 'englishcenter'@'localhost';