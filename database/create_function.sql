SET GLOBAL log_bin_trust_function_creators = 1;

DROP FUNCTION IF EXISTS newID;
DELIMITER $$
CREATE FUNCTION newID(
    role varchar(20)
)
RETURNS varchar(15)
begin
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

-- select SESSION.Session_number,SESSION.Class_name,SESSION.Session_date from SESSION where SESSION.Session_date<curdate() and (SESSION.Session_number,SESSION.Class_name) not in 
-- (select SESSION.Session_number,SESSION.Class_name from SESSION 
-- join STUDENT_ATTENDANCE on STUDENT_ATTENDANCE.Session_number=SESSION.Session_number and STUDENT_ATTENDANCE.Class_name=SESSION.Class_name) order by SESSION.Session_date desc;

-- select SESSION.Session_number,SESSION.Class_name,TIMETABLE.Start_hour,TIMETABLE.End_hour 
-- from SESSION join TIMETABLE on TIMETABLE.ID=SESSION.Timetable_ID 
-- join TEACHER_RESPONSIBLE on TEACHER_RESPONSIBLE.Session_number=SESSION.Session_number and TEACHER_RESPONSIBLE.Class_name=SESSION.Class_name 
-- where Session_date=CURDATE() and Teacher_ID='TEACHER07' order by TIMETABLE.Start_hour;

--  select * from session where session_date=curdate();
--  select * from teacher_responsible;