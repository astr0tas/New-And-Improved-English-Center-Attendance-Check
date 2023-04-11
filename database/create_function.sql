SET GLOBAL log_bin_trust_function_creators = 1;

DELIMITER $$
CREATE FUNCTION numberOfStudents()
RETURNS varchar(12)
BEGIN
	DECLARE numStu DEC(10,0) DEFAULT 0;
    SELECT COUNT(*) INTO numStu FROM student;
    
    RETURN CONCAT('STUDENT', CAST((numStu+1) AS CHAR));
END $$
DELIMITER ;