use english_center;

drop procedure if exists addSessionToStudents;
delimiter //
create procedure addSessionToStudents(
	in className varchar(100),
    in sessionNumber int
)
begin
	declare idLoop varchar(15);
	
	DECLARE done INT DEFAULT FALSE;
	declare reader cursor for select student_id from in_class where class_name=className;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    open reader;
        read_loop: loop
			fetch reader into idLoop;
            IF done THEN
				LEAVE read_loop;
			END IF;
            insert into STUDENT_ATTENDANCE values(sessionNumber,className,idLoop,-1,null);
        end loop;
	close reader;
end//
delimiter ;

drop procedure if exists addStudentToSessions;
delimiter //
create procedure addStudentToSessions(
	in className varchar(100),
    in studentID varchar(15)
)
begin
	declare sessionNumber int;
	
	DECLARE done INT DEFAULT FALSE;
	declare reader cursor for select number from session join timetable on timetable.id=session.timetable_id where class_name=className and ((session_date=curdate() and start_hour>curtime()) or session_date>curdate());
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    open reader;
        read_loop: loop
			fetch reader into sessionNumber;
            IF done THEN
				LEAVE read_loop;
			END IF;
            insert into STUDENT_ATTENDANCE values(sessionNumber,className,studentID,-1,null);
        end loop;
	close reader;
end//
delimiter ;

drop procedure if exists restoreSession;
delimiter //
create procedure restoreSession(
	in className varchar(100),
    in sessionNumber int
)
begin
	declare teacherID varchar(15) default null;
    declare supervisorID varchar(15) default null;
    declare sessionDate date default null;
    declare startHour time default null;
    declare endHour time default null;
    
    select supervisor_id into supervisorID from SUPERVISOR_RESPONSIBLE where class_name=className and session_number=sessionNumber;
    select teacher_id into teacherID from TEACHER_RESPONSIBLE where class_name=className and session_number=sessionNumber;
    
    if teacherID is not null and supervisorID is not null then
		select session_date,start_hour,end_hour into sessionDate,startHour,endHour from session join timetable on timetable.id=session.timetable_id where class_name=className and number=sessionNumber;
        if sessionDate<curdate() or (sessionDate=curdate() and curtime()>endHour) then
			update session set status=2 where class_name=className and number=sessionNumber;
        elseif sessionDate=curdate() and (curtime()>=startHour and curtime()<=endHour) then
			update session set status=1 where class_name=className and number=sessionNumber;
        elseif sessionDate>curdate() or (sessionDate=curdate() and curtime()<startHour) then
			update session set status=4 where class_name=className and number=sessionNumber;
        end if;
    else
		update session set status=5 where class_name=className and number=sessionNumber;
    end if;
end//
delimiter ;

drop procedure if exists changeTeacher;
delimiter //
create procedure changeTeacher(
	in className varchar(100),
    in sessionNumber int,
    in teacherID varchar(15)
)
begin
	declare existsTeacherID varchar(15) default null;
    declare existsSupervisorID varchar(15) default null;
    declare previousStatus int default null;
    declare sessionDate date default null;
    declare startHour time default null;
    declare endHour time default null;
    
	select teacher_id into existsTeacherID from TEACHER_RESPONSIBLE where class_name=className and session_number=sessionNumber;
	
    if teacherID is not null and ((existsTeacherID is not null and not existsTeacherID=teacherID) or existsTeacherID is null) then
		update TEACHER_RESPONSIBLE set teacher_id=teacherID,teacher_status=-1,teacher_note=null where class_name=className and session_number=sessionNumber;
        select session_date,start_hour,end_hour,status into sessionDate,startHour,endHour,previousStatus from session join timetable on timetable.id=session.timetable_id where class_name=className and number=sessionNumber;
        select supervisor_id into existsSupervisorID from supervisor_responsible where class_name=className and session_number=sessionNumber;
        if previousStatus=5 and existsSupervisorID is not null then
			if sessionDate<curdate() or (sessionDate=curdate() and curtime()>endHour) then
				update session set status=2 where class_name=className and number=sessionNumber;
			elseif sessionDate=curdate() and (curtime()>=startHour and curtime()<=endHour) then
				update session set status=1 where class_name=className and number=sessionNumber;
			elseif sessionDate>curdate() or (sessionDate=curdate() and curtime()<startHour) then
				update session set status=4 where class_name=className and number=sessionNumber;
			end if;
        end if;
    end if;
end//
delimiter ;

drop procedure if exists changeSupervisor;
delimiter //
create procedure changeSupervisor(
	in className varchar(100),
    in sessionNumber int,
    in supervisorID varchar(15)
)
begin
	declare existsTeacherID varchar(15) default null;
    declare existsSupervisorID varchar(15) default null;
    declare previousStatus int default null;
    declare sessionDate date default null;
    declare startHour time default null;
    declare endHour time default null;
    
	select supervisor_id into existsSupervisorID from supervisor_responsible where class_name=className and session_number=sessionNumber;
    
    if supervisorID is not null and ((existsSupervisorID is not null and not existsSupervisorID=supervisorID) or existsSupervisorID is null) then
		update supervisor_responsible set supervisor_id=supervisorID where class_name=className and session_number=sessionNumber;
        select session_date,start_hour,end_hour,status into sessionDate,startHour,endHour,previousStatus from session join timetable on timetable.id=session.timetable_id where class_name=className and number=sessionNumber;
        select teacher_id into existsTeacherID from teacher_responsible where class_name=className and session_number=sessionNumber;
        if previousStatus=5 and existsTeacherID is not null then
			if sessionDate<curdate() or (sessionDate=curdate() and curtime()>endHour) then
				update session set status=2 where class_name=className and number=sessionNumber;
			elseif sessionDate=curdate() and (curtime()>=startHour and curtime()<=endHour) then
				update session set status=1 where class_name=className and number=sessionNumber;
			elseif sessionDate>curdate() or (sessionDate=curdate() and curtime()<startHour) then
				update session set status=4 where class_name=className and number=sessionNumber;
			end if;
        end if;
    end if;
end//
delimiter ;