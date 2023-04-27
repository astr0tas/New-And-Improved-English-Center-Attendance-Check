-- add new student to system
DELIMITER $$
CREATE PROCEDURE newStudent(
	IN p_name varchar(50),
	IN p_phone varchar(10),
	IN p_birthday date,
	IN p_birthplace varchar(50),
    IN p_email varchar(50),
	IN p_address varchar(100)
)
BEGIN
	DECLARE p_id VARCHAR(12) DEFAULT newID();
    DECLARE p_ssn VARCHAR(12);
    DECLARE numStu DECIMAL(10,0) DEFAULT 0;
    
    SELECT COUNT(*) INTO numStu FROM student;
    SET p_ssn = CONCAT(LPAD(CAST(RAND() * 1000000000 AS UNSIGNED), 9, '0'), CAST(numStu AS CHAR));

	INSERT INTO student VALUES(p_id, p_name, p_phone, p_birthday, p_birthplace, p_email, p_address, p_ssn);
END $$
DELIMITER ;

--add new student to class
DELIMITER $$
CREATE PROCEDURE addStudent(
	IN p_id varchar(12),
	IN p_classname varchar(50)
)
BEGIN
	INSERT INTO in_class VALUES(p_id, p_classname);
    UPDATE class SET Current_stu = Current_stu + 1 WHERE Name = p_classname;
END $$
DELIMITER ;


--change class of student
DELIMITER $$
CREATE PROCEDURE changeClass(
	IN p_id varchar(12),
    IN p_old_classname varchar(50),
	IN p_new_classname varchar(50)
)
BEGIN
    UPDATE class SET Current_number_of_student = Current_number_of_student - 1 WHERE Name = p_old_classname;
    UPDATE class SET Current_number_of_student = Current_number_of_student + 1 WHERE Name = p_new_classname;
    UPDATE in_class SET Class_name = p_new_classname WHERE Student_ID = p_id AND Class_name = p_old_classname;
END $$
DELIMITER ;

