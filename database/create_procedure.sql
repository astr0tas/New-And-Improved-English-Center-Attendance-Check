-- add new student to system
-- DELIMITER $$
-- CREATE PROCEDURE newStudent(
-- 	IN p_name varchar(50),
-- 	IN p_phone varchar(10),
-- 	IN p_birthday date,
-- 	IN p_birthplace varchar(50),
-- 	IN p_address varchar(100)
-- )
-- BEGIN
-- 	DECLARE p_ssn varchar(12) DEFAULT numberOfStudents();
-- 	INSERT INTO student VALUES(p_ssn, p_name, p_phone, p_birthday, p_birthplace, CONCAT(p_ssn, "@gmail.com"), p_address);
-- END $$
-- DELIMITER ;

-- -- add new student to class
-- DELIMITER $$
-- CREATE PROCEDURE addStudent(
-- 	IN p_ssn varchar(12),
-- 	IN p_classname varchar(50)
-- )
-- BEGIN
-- 	INSERT INTO in_class VALUES(p_ssn, p_classname);
-- END $$
-- DELIMITER ;


-- change class of student
-- DELIMITER $$
-- CREATE PROCEDURE changeClass(
-- 	IN p_ssn varchar(12),
--     IN p_old_classname varchar(50),
-- 	IN p_new_classname varchar(50)
-- )
-- BEGIN
--     UPDATE in_class SET ClassName = p_new_classname WHERE StudentSSN = p_ssn AND ClassName = p_old_classname;
-- END $$
-- DELIMITER ;

-- create a class

-- CREATE PROCEDURE GenSession(
--    --  IN className varchar(50),
--     IN target_day VARCHAR(9),
--     IN start TIME,
--     IN end TIME,
--     IN room varchar(10),
--     IN weeks INT,
--     IN offset INT,
--     IN studyDays INT
-- )
-- BEGIN
-- 	DECLARE i INT DEFAULT 1;
--     DECLARE next_day DATE;
--     
--     WHILE i <= weeks DO
--         SET next_day = DATE_ADD(CURDATE(), INTERVAL (9 - DAYOFWEEK(CURDATE())) % 7 + 1 + (i - 1) * 7 DAY);
--         WHILE DATE_FORMAT(next_day, '%W') != target_day DO
--             SET next_day = DATE_ADD(next_day, INTERVAL 1 DAY);
--         END WHILE;
--         INSERT INTO SESSION_TIME VALUES(start,end,next_day);
--         INSERT INTO SESSION(Start_hour,End_hour,Session_date,RoomNumber,Session_number,Status,ClassName) values(start,end,next_day,room,i+offset+(studyDays-1)*(i-1),2,className);
--         UPDATE CLASS SET Status=2 WHERE Name=className;
--         SET i = i + 1;
--     END WHILE;
-- END $$

-- generate sessions for a classs
DROP PROCEDURE IF EXISTS GenSession;
DELIMITER $$
CREATE PROCEDURE GenSession(
	IN className varchar(100),
	IN current_day DATE,
	IN target_day VARCHAR(10),
    IN TimeTableID INT,
    IN room varchar(10),
    IN weeks INT,
    IN offset INT,
    IN studyDays INT
)
BEGIN
    DECLARE end_day DATE;
    DECLARE i INT DEFAULT 1;
    SET end_day = DATE_ADD(current_day, INTERVAL weeks*7 DAY);
    SET current_day= DATE_ADD(current_day, INTERVAL 7 DAY);
    WHILE current_day <= end_day DO
        IF DAYNAME(current_day) = target_day THEN
             -- SELECT current_day;
			-- SELECT i+offset+(studyDays-1)*(i-1);
			INSERT INTO SESSION(Timetable_ID,Session_date,Classroom_ID,Session_number,Status,Class_name) values(TimeTableID,current_day,room,i+offset+(studyDays-1)*(i-1),2,className);
			UPDATE CLASS SET Status=true WHERE Name=className;
            SET i = i + 1;
        END IF;
        SET current_day = DATE_ADD(current_day, INTERVAL 1 DAY);
    END WHILE;
END $$
DELIMITER ;

-- call GenSession('TOEIC04','2023-01-30','Monday',6,'ROOM03',12,0,3);
-- call GenSession('TOEIC04','2023-01-30','Wednesday',6,'ROOM03',12,1,3);
-- call GenSession('TOEIC04','2023-01-30','Friday',6,'ROOM03',12,2,3);
-- select *,DATE_FORMAT(Session_date, '%W, %M %e, %Y') AS formatted_date from SESSION where Class_name='TOEIC04' order by session_number;

-- call GenSession('TOEIC03','2023-01-30','Tuesday',6,'ROOM01',12,0,2);
-- call GenSession('TOEIC03','2023-01-30','Thursday',8,'ROOM01',12,1,2);
-- select *,DATE_FORMAT(Session_date, '%W, %M %e, %Y') AS formatted_date from SESSION where Class_name='TOEIC03'order by Session_date,session_number;

-- assign teacher for a session
-- DROP PROCEDURE IF EXISTS GenSession;
-- DELIMITER $$
-- CREATE PROCEDURE GenSession(
--     IN className varchar(50),
--     IN target_day VARCHAR(9),
--     IN start TIME,
--     IN end TIME,
--     IN room varchar(10),
--     IN weeks INT,
--     IN offset INT,
--     IN studyDays INT
-- )
-- BEGIN
-- 	DECLARE i INT DEFAULT 1;
--     DECLARE next_day DATE;
--     
--     WHILE i <= weeks DO
--         SET next_day = DATE_ADD(CURDATE(), INTERVAL (9 - DAYOFWEEK(CURDATE())) % 7 + 1 + (i - 1) * 7 DAY);
--         WHILE DATE_FORMAT(next_day, '%W') != target_day DO
--             SET next_day = DATE_ADD(next_day, INTERVAL 1 DAY);
--         END WHILE;
--         INSERT INTO SESSION_TIME VALUES(start,end,next_day);
--         INSERT INTO SESSION(Start_hour,End_hour,Session_date,RoomNumber,Session_number,Status,ClassName) values(start,end,next_day,room,i+offset+(studyDays-1)*(i-1),2,className);
--         SET i = i + 1;
--     END WHILE;
-- END $$
-- DELIMITER ;

-- SET SQL_SAFE_UPDATES=0;
-- UPDATE SESSION SET TeacherID='TEACHER01' WHERE ClassName='TOEIC03' and Session_number%2=1;
-- UPDATE SESSION SET TeacherID='TEACHER02' WHERE ClassName='TOEIC03'and Session_number%2=0;
-- UPDATE SESSION SET TeacherID='TEACHER01' WHERE ClassName='TOEIC04' and Session_number%3=1;
-- UPDATE SESSION SET TeacherID='TEACHER02' WHERE ClassName='TOEIC04' and Session_number%3=2;
-- UPDATE SESSION SET TeacherID='TEACHER03' WHERE ClassName='TOEIC04' and Session_number%3=0;
-- SET SQL_SAFE_UPDATES=0;
