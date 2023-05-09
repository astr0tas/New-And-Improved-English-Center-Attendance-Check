USE ENGLISH_CENTER;

--  add new student to system
DROP PROCEDURE IF EXISTS newStudent;
DELIMITER $$
CREATE PROCEDURE newStudent(
	IN p_name varchar(50),
    IN p_ssn varchar(12),
	IN p_phone varchar(10),
	IN p_birthday date,
	IN p_birthplace varchar(50),
    IN p_email varchar(50),
	IN p_address varchar(100)
)
BEGIN
	DECLARE p_id VARCHAR(12) DEFAULT newID('student');
    DECLARE numStu DECIMAL(10,0) DEFAULT 0;
    
	INSERT INTO student VALUES(p_id, p_name, p_phone, p_birthday, p_birthplace, p_email, p_address, p_ssn);
END $$
DELIMITER ;

--  add new staff to system
DROP PROCEDURE IF EXISTS newStaff;
DELIMITER $$
CREATE PROCEDURE newStaff(
	IN p_name varchar(50),
    IN p_ssn varchar(12),
	IN p_phone varchar(10),
	IN p_birthday date,
	IN p_birthplace varchar(50),
    IN p_email varchar(50),
	IN p_address varchar(100),
    IN role varchar(20)
)
BEGIN
	DECLARE p_id VARCHAR(12) DEFAULT newID(role);
    DECLARE numStu, p_password DECIMAL(10,0) DEFAULT 0;
    
    IF role = 'teacher' THEN
        SET p_password = 1;
    ELSE
        SET p_password = 2;
    END IF;	
    SELECT COUNT(*) INTO numStu FROM student;
	INSERT INTO employee VALUES(p_id, p_ssn, p_name, p_phone, p_id, p_password, p_birthday, p_birthplace, p_email, p_address);
    
    IF role = 'teacher' THEN
		INSERT INTO teacher VALUE(p_id);
    ELSE
		INSERT INTO supervisor VALUE(p_id);
    END IF;	
END $$
DELIMITER ;

-- add new student to class
DROP PROCEDURE IF EXISTS addStudent;
DELIMITER $$
CREATE PROCEDURE addStudent(
	IN p_id varchar(12),
	IN p_classname varchar(50)
)
BEGIN
	INSERT INTO in_class VALUES(p_id, p_classname);
    UPDATE class SET Current_number_of_student = Current_number_of_student + 1 WHERE Name = p_classname;
END $$
DELIMITER ;

--   add new teacher to class
DROP PROCEDURE IF EXISTS addTeacherToClass;
DELIMITER $$
CREATE PROCEDURE addTeacherToClass(
	IN p_id varchar(50),
    IN className varchar(100)
)
BEGIN
	INSERT INTO teach VALUES(p_id, className);
END $$
DELIMITER ;

-- change class of student
DROP PROCEDURE IF EXISTS changeClass;
DELIMITER $$
CREATE PROCEDURE changeClass(
	IN role varchar(20),
	IN p_id varchar(12),
    IN p_old_classname varchar(50),
	IN p_new_classname varchar(50)
)
BEGIN
    if role = 'student' then
		UPDATE class SET Current_number_of_student = Current_number_of_student - 1 WHERE Name = p_old_classname;
		UPDATE class SET Current_number_of_student = Current_number_of_student + 1 WHERE Name = p_new_classname;
		UPDATE in_class SET Class_name = p_new_classname WHERE Student_ID = p_id AND Class_name = p_old_classname;
	else
		if role = 'teacher' then
			UPDATE teach SET Class_name = p_new_classname WHERE Teacher_ID = p_id and Class_name = p_old_classname;
        else
			DELETE from supervisor_responsible where Supervisor_ID = p_id and Class_name = p_old_classname;
            
            INSERT INTO supervisor_responsible (Session_number, Class_Name, Supervisor_ID)
			SELECT Session_number, Class_Name, ID
			FROM session join supervisor
            WHERE Class_name = p_new_classname and ID = p_id;
		end if;
    end if;
END $$
DELIMITER ;--  add new student to system

--  generate sessions for a classs
DROP PROCEDURE IF EXISTS GenSession;
DELIMITER $$
CREATE PROCEDURE GenSession(
	IN className varchar(100),
	IN current_day DATE,
    IN end_day DATE,
	IN target_day VARCHAR(10),
    IN TimeTableID INT,
    IN room varchar(10),
    IN offset INT,
    IN studyDays INT
)
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE current_day <= end_day AND i<=12 DO
        IF DAYNAME(current_day) = target_day THEN
			INSERT INTO SESSION(Timetable_ID,Session_date,Classroom_ID,Session_number,Status,Class_name) values(TimeTableID,current_day,room,i+offset+(studyDays-1)*(i-1),2,className);
			UPDATE CLASS SET Status=true WHERE Name=className;
            SET i = i + 1;
        END IF;
        SET current_day = DATE_ADD(current_day, INTERVAL 1 DAY);
    END WHILE;
END $$
DELIMITER ;

--  call GenSession('TOEIC04','2023-01-30','2023-04-30','Monday',6,'ROOM03',0,3);
--  call GenSession('TOEIC04','2023-01-30','2023-04-30','Wednesday',6,'ROOM03',1,3);
--  call GenSession('TOEIC04','2023-01-30','2023-04-30','Friday',6,'ROOM03',2,3);
--  select *,DATE_FORMAT(Session_date, '%W, %M %e, %Y') AS formatted_date from SESSION where Class_name='TOEIC04' order by session_number;

--  call GenSession('TOEIC03','2023-01-30','2023-04-30','Tuesday',6,'ROOM01',0,2);
--  call GenSession('TOEIC03','2023-01-30','2023-04-30','Thursday',8,'ROOM01',1,2);
--  select *,DATE_FORMAT(Session_date, '%W, %M %e, %Y') AS formatted_date from SESSION where Class_name='TOEIC03'order by Session_date,session_number;

--  assign teacher for a session
DROP PROCEDURE IF EXISTS AssignSessionForTeacher;
DELIMITER $$
CREATE PROCEDURE AssignSessionForTeacher(
	IN sessionNumber INT,
    IN className varchar(100),
    IN teacherID varchar(15)
)
BEGIN
	IF teacherID IN (select Teacher_ID from TEACH where Class_name=className) THEN
		INSERT INTO TEACHER_RESPONSIBLE(Session_number,Class_name,Teacher_ID) VALUES(sessionNumber,className,teacherID);
    END IF;
END $$
DELIMITER ;

--  call AssignSessionForTeacher(1,'TOEIC03','TEACHER01');
--  call AssignSessionForTeacher(2,'TOEIC03','TEACHER01');
--  call AssignSessionForTeacher(3,'TOEIC03','TEACHER01');
--  call AssignSessionForTeacher(4,'TOEIC03','TEACHER01');
--  call AssignSessionForTeacher(5,'TOEIC03','TEACHER02');
--  call AssignSessionForTeacher(6,'TOEIC03','TEACHER02');
--  call AssignSessionForTeacher(7,'TOEIC03','TEACHER02');
--  call AssignSessionForTeacher(8,'TOEIC03','TEACHER02');
--  call AssignSessionForTeacher(21,'TOEIC03','TEACHER02');

--  call AssignSessionForTeacher(1,'TOEIC04','TEACHER01');
--  call AssignSessionForTeacher(2,'TOEIC04','TEACHER01');
--  call AssignSessionForTeacher(3,'TOEIC04','TEACHER01');
--  call AssignSessionForTeacher(4,'TOEIC04','TEACHER02');
--  call AssignSessionForTeacher(5,'TOEIC04','TEACHER02');
--  call AssignSessionForTeacher(6,'TOEIC04','TEACHER02');
--  call AssignSessionForTeacher(7,'TOEIC04','TEACHER03');
--  call AssignSessionForTeacher(8,'TOEIC04','TEACHER03');
--  call AssignSessionForTeacher(9,'TOEIC04','TEACHER03');

--  check teacher attendace
DROP PROCEDURE IF EXISTS TeacherAttendance;
DELIMITER $$
CREATE PROCEDURE TeacherAttendance(
	IN sessionNumber INT,
    IN className varchar(100),
    IN teacherID varchar(15),
    IN Status INT,
    IN Note text
)
BEGIN
	update TEACHER_RESPONSIBLE set TEACHER_RESPONSIBLE.Status=Status,TEACHER_RESPONSIBLE.Note=Note where Session_number=sessionNumber and Class_name=className and Teacher_ID=teacherID;
END $$
DELIMITER ;

--  check student attendace
DROP PROCEDURE IF EXISTS StudentAttendance;
DELIMITER $$
CREATE PROCEDURE StudentAttendance(
	IN sessionNumber INT,
    IN className varchar(100),
    IN studentID varchar(15),
    IN Status INT,
    IN Note text
)
BEGIN
	if exists(select Status from STUDENT_ATTENDANCE where Session_number=sessionNumber and Class_name=className and Student_ID=studentID) then
		update STUDENT_ATTENDANCE set Status=Status, Note=Note where Session_number=sessionNumber and Class_name=className and Student_ID=studentID;
    else
		insert into STUDENT_ATTENDANCE values(sessionNumber,className,studentID,Status,Note);
    end if;
END $$
DELIMITER ;

--  select * from TEACHER_RESPONSIBLE where Session_number='21' and Class_name='TOEIC03' and Teacher_ID='TEACHER02';
--  select * from STUDENT_ATTENDANCE;
--  select * from SUPERVISOR_RESPONSIBLE;

DROP PROCEDURE IF EXISTS availableClassForStaff;
DELIMITER $$
CREATE PROCEDURE availableClassForStaff(
	IN role varchar(20),
    IN id varchar(12)
)
BEGIN
	if(id = "") then
		if role = "teacher" then
			select *
			from class c left join (select distinct(Class_name) as Class_name
										from session 
										where (Session_number, Class_name) not in (select Session_number, Class_name from teacher_responsible) 
									) tmp
				on c.Name = tmp.Class_name
            where c.Status = 1;
		else
			select *
			from class c left join (select distinct(Class_name) as Class_name
								from session 
								where (Session_number, Class_name) not in (select Session_number, Class_name from supervisor_responsible) 
							  ) tmp
				on c.Name = tmp.Class_name
            where c.Status = 1;
		end if;
	else
		if role = "teacher" then
			select *
            from class 
            where Status = 1 and (Name not in (select Class_name from teach where Teacher_ID = id));
        else
			select *
			from class c 
			where c.Status = 1 and c.Name not in (
													select *
													from
														(
															select distinct(Class_name) as Class_name
															from session 
															where (Session_number, Class_name) not in (select Session_number, Class_name from supervisor_responsible)
														) tmp1
													where
														tmp1.Class_name in
														(
															select distinct(Class_name) as class_name
															from supervisor_responsible
															where SUPERVISOR_ID = id
														)
												)
			;
		end if;
    end if;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS availableSessionForStaff;
DELIMITER $$
CREATE PROCEDURE availableSessionForStaff(
    IN className varchar(100),
    IN role varchar(20)
)
BEGIN
	if role = "teacher" then
		select *
		from session 
		where Class_name = className and ((Session_number, Class_name) not in (select Session_number, Class_name from teacher_responsible));
	else
		select *
		from session 
		where Class_name = className and ((Session_number, Class_name) not in (select Session_number, Class_name from supervisor_responsible));
	end if;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS addSessionToStaff;
DELIMITER $$
CREATE PROCEDURE addSessionToStaff(
	IN sessionNumber int,
    IN className varchar(100),
    IN p_id varchar(15),
    IN role varchar(20)
)
BEGIN
	if role = "teacher" then
		INSERT teacher_responsible VALUES(sessionNumber, className, p_id, NULL, NULL);
	else
		INSERT supervisor_responsible VALUES(sessionNumber, className, p_id, NULL, NULL);
	end if;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS createClass;
DELIMITER $$
CREATE PROCEDURE createClass(
	className VARCHAR(100),
    start_date DATE,
	end_date DATE,
    roomID varchar(15),
    session int
)
BEGIN
	declare seats int;
    select Max_of_seat into seats from CLASSROOM where ID=roomID;
    insert into CLASS values(start_date,end_date,className,1,seats,session,0);
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS statsStudent;
DELIMITER $$
CREATE PROCEDURE statsStudent(
	IN p_id varchar(15),
    IN p_classname varchar(100)
)
BEGIN
	select count(*) as count, st.Status
	from student_attendance st join session se
	where st.Student_ID = p_id and st.Class_name = p_classname and se.Class_name = st.Class_name and se.Session_number = st.Session_number and se.Session_date <= curdate()
	group by st.Status;
END $$
DELIMITER ;