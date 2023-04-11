-- add new student to system
DELIMITER $$
CREATE PROCEDURE newStudent(
	IN p_name varchar(50),
	IN p_phone varchar(10),
	IN p_birthday date,
	IN p_birthplace varchar(50),
	IN p_address varchar(100)
)
BEGIN
	DECLARE p_ssn varchar(12) DEFAULT numberOfStudents();
	INSERT INTO student VALUES(p_ssn, p_name, p_phone, p_birthday, p_birthplace, CONCAT(p_ssn, "@gmail.com"), p_address);
END $$
DELIMITER ;

-- add new student to class
DELIMITER $$
CREATE PROCEDURE addStudent(
	IN p_ssn varchar(12),
	IN p_classname varchar(50)
)
BEGIN
	INSERT INTO in_class VALUES(p_ssn, p_classname);
    UPDATE class SET Current_stu = Current_stu + 1 WHERE Name = p_classname;
END $$
DELIMITER ;


-- change class of student
DELIMITER $$
CREATE PROCEDURE changeClass(
	IN p_ssn varchar(12),
    IN p_old_classname varchar(50),
	IN p_new_classname varchar(50)
)
BEGIN
    UPDATE class SET Current_stu = Current_stu - 1 WHERE Name = p_old_classname;
    UPDATE class SET Current_stu = Current_stu + 1 WHERE Name = p_new_classname;
    UPDATE in_class SET ClassName = p_new_classname WHERE StudentSSN = p_ssn AND ClassName = p_old_classname;
END $$
DELIMITER ;

