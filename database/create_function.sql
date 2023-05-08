USE ENGLISH_CENTER;

SET GLOBAL log_bin_trust_function_creators = 1;

DROP FUNCTION IF EXISTS newID;
DELIMITER $$
CREATE FUNCTION newID(
    role varchar(20)
)
RETURNS varchar(12)
BEGIN
	DECLARE numStu DEC(10,0) DEFAULT 0;
    IF role = 'student' THEN 
		SELECT COUNT(*) INTO numStu FROM student;
	ELSEIF role = 'teacher' THEN
		SELECT COUNT(*) INTO numStu FROM teacher;
	ELSE
		SELECT COUNT(*) INTO numStu FROM supervisor;
	END IF;
    
    RETURN CONCAT(UPPER(role), CAST(numStu + 1 AS CHAR));
END $$
DELIMITER ;