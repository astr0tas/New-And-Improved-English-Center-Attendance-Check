use english_center;

-- Check if session date is in between class start date and end date or not
DROP TRIGGER IF EXISTS session_trigger;
DELIMITER //
CREATE TRIGGER session_trigger
BEFORE INSERT ON session
FOR EACH ROW
BEGIN
	declare local_start_date date;
    declare local_end_date date;
    select start_date, end_date into local_start_date,local_end_date from class where class.name=new.Class_name;
    if new.Session_date<local_start_date or new.Session_date>local_end_date then
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid session date!';
    end if;
END//
DELIMITER ;

-- Check if teacher responsible for the session is in the list of teachers that are responsible for the class
DROP TRIGGER IF EXISTS teacher_responsible_trigger;
DELIMITER //
CREATE TRIGGER teacher_responsible_trigger
BEFORE INSERT ON teacher_responsible
FOR EACH ROW
BEGIN    
    if not exists (select TEACH.Teacher_ID from TEACH where TEACH.Class_name=new.Class_name and TEACH.Teacher_ID=new.Teacher_ID) then
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "This teacher is not in the class's teacher list!";
    end if;
END//
DELIMITER ;

-- Check if the number of students in a class reached maximum
DROP TRIGGER IF EXISTS in_class_trigger;
DELIMITER //
CREATE TRIGGER in_class_trigger
BEFORE INSERT ON in_class
FOR EACH ROW
BEGIN
	declare counter int;
    declare maximumStudent int;
    select count(*) into counter from in_class where class_name=new.class_name;
    select Max_students into maximumStudent from class where name=new.class_name;
    if counter>=maximumStudent then
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "This class is full!";
    end if;
END//
DELIMITER ;

-- Check if the start date of class is at least 1 week from now (only use in production mode)
DROP TRIGGER IF EXISTS class_trigger;
DELIMITER //
CREATE TRIGGER class_trigger
BEFORE INSERT ON class
FOR EACH ROW
BEGIN
    if new.start_date<DATE_ADD(curdate(), INTERVAL 7 DAY) then
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "New class start date invalid!";
    end if;
END//
DELIMITER ;

-- Check if the date of a session is at least 1 day from now (only use in production mode)
DROP TRIGGER IF EXISTS session_trigger;
DELIMITER //
CREATE TRIGGER session_trigger
BEFORE INSERT ON session
FOR EACH ROW
BEGIN
    if new.session_date<DATE_ADD(curdate(), INTERVAL 1 DAY) then
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "New session date invalid!";
    end if;
END//
DELIMITER ;