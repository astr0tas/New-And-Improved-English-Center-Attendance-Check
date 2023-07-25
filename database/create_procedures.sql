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

drop procedure if exists getClassList;
delimiter //
create procedure getClassList(
	in searchName varchar(100),
    in searchStatus int
)
begin
	declare nameLoop varchar(100);
    declare startDate date;
    declare endDate date;
    declare classStatus int;
    declare maxStudent int;
    declare initialSession int;
    declare currentStudents int;
    declare currentSessions int;
	
	DECLARE done INT DEFAULT FALSE;
	declare reader cursor for select name from class where name like concat('%',searchName,'%') and status=searchStatus order by start_date desc, name;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    open reader;
        read_loop: loop
			fetch reader into nameLoop;
            IF done THEN
				LEAVE read_loop;
			END IF;
            set startDate=null,endDate=null,classStatus=null,maxStudent=null,initialSession=null,currentStudents=null,currentSessions=null;
            select start_date,end_date,status,max_students,Initial_sessions into startDate,endDate,classStatus,maxStudent,initialSession from class where name=nameLoop;
            select count(in_class.class_name) into currentStudents from class join in_class on in_class.class_name=class.name where name=nameLoop;
            select count(session.class_name) into currentSessions from class join session on session.class_name=class.name where name=nameLoop;
            select nameLoop as name,startDate,endDate,classStatus,maxStudent,initialSession,currentStudents,currentSessions;
        end loop;
	close reader;
end//
delimiter ;

drop procedure if exists getSessionList;
delimiter //
create procedure getSessionList(
	in className varchar(100)
)
begin
	declare numberLoop int;
    declare sessionDate date;
    declare startHour time;
    declare endHour time;
    declare sessionStatus int;
    declare sessionClassroomID varchar(15);
    declare sessionTeacherID varchar(15);
    declare sessionSupervisorID varchar(15);
    declare sessionTeacherName varchar(100);
    declare sessionSupervisorName varchar(100);
	
	DECLARE done INT DEFAULT FALSE;
	declare reader cursor for select number from session where class_name=className order by number;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    open reader;
        read_loop: loop
			fetch reader into numberLoop;
            IF done THEN
				LEAVE read_loop;
			END IF;
            
            set sessionDate=null,startHour=null,endHour=null,sessionStatus=null,sessionClassroomID=null,
            sessionTeacherID=null,sessionTeacherName=null,
            sessionSupervisorID=null,sessionSupervisorName=null;
                        
            select session_date,start_hour,end_hour,status,classroom_id into sessionDate,startHour,endHour,sessionStatus,sessionClassroomID from session 
            join timetable on timetable.id=session.timetable_id where class_name=className and number=numberLoop;
                        
            select employee.id,employee.name into sessionTeacherID,sessionTeacherName from employee
            join teacher on teacher.id=employee.id
            join teacher_responsible on teacher_responsible.teacher_id=teacher.id
            where teacher_responsible.session_number=numberLoop and teacher_responsible.class_name=className;
            
            set done=false;
                        
            select employee.id,employee.name into sessionSupervisorID,sessionSupervisorName from employee
            join supervisor on supervisor.id=employee.id
            join supervisor_responsible on supervisor_responsible.supervisor_id=supervisor.id
            where supervisor_responsible.session_number=numberLoop and supervisor_responsible.class_name=className;
            
            set done=false;
                        
            select numberLoop as number,sessionDate,startHour,endHour,sessionStatus,sessionClassroomID,sessionTeacherID,sessionTeacherName,sessionSupervisorID,sessionSupervisorName;
        end loop;
	close reader;
end//
delimiter ;

drop procedure if exists getSessionDetail;
delimiter //
create procedure getSessionDetail(
	in className varchar(100),
    in sessionNumber int
)
begin
	declare sessionDate date;
    declare sessionStatus int;
	declare sessionClassroomID varchar(15);
    declare startHour time;
    declare endHour time;
    declare sessionNumberMakeUpFor int;
    
    declare sessionTeacherID varchar(15);
	declare sessionTeacherName varchar(100);
	declare sessionTeacherImage text;
    declare sessionTeacherStatus int;
	declare sessionTeacherNote text;
    
    declare sessionSupervisorID varchar(15);
    declare sessionSupervisorName varchar(100);
    declare sessionSupervisorImage text;
	declare sessionSupervisorNote text;

	select session.session_date,session.status,session.classroom_id,timetable.start_hour,timetable.end_hour,session.session_number_make_up_for
    into sessionDate,sessionStatus,sessionClassroomID,startHour,endHour,sessionNumberMakeUpFor
    from session join timetable on session.timetable_id=timetable.id
    where session.class_name=className and session.number=sessionNumber;
    
    select employee.id,employee.name,employee.image,teacher_responsible.teacher_status,teacher_responsible.teacher_note
    into sessionTeacherID,sessionTeacherName,sessionTeacherImage,sessionTeacherStatus,sessionTeacherNote
    from employee
	join teacher on teacher.id=employee.id
	join teacher_responsible on teacher_responsible.teacher_id=teacher.id
	where teacher_responsible.session_number=sessionNumber and teacher_responsible.class_name=className;
    
    select employee.id,employee.name, employee.image,supervisor_responsible.Note_for_class
    into sessionSupervisorID,sessionSupervisorName,sessionSupervisorImage,sessionSupervisorNote
    from employee
	join supervisor on supervisor.id=employee.id
	join supervisor_responsible on supervisor_responsible.supervisor_id=supervisor.id
	where supervisor_responsible.session_number=sessionNumber and supervisor_responsible.class_name=className;
    
    select sessionDate,sessionStatus,sessionClassroomID,startHour,endHour,sessionNumberMakeUpFor,
    sessionTeacherID,sessionTeacherName,sessionTeacherImage,sessionTeacherStatus,sessionTeacherNote,
    sessionSupervisorID,sessionSupervisorName,sessionSupervisorImage,sessionSupervisorNote;
end//
delimiter ;

drop procedure if exists toggleStatus;
delimiter //
create procedure toggleStatus(
	in className varchar(100),
    in classStatus int
)
begin
	declare endDate date;
    declare numberLoop int;
    DECLARE done INT DEFAULT FALSE;
	declare reader cursor for select number from session where class_name=className order by number;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	if classStatus=2 then
		update class set status=1 where name=className;
        update session set status=3 where class_name=className and (status=1 or status=4);
    elseif classStatus=1 then
		select end_date into endDate from class where name=className;
        if curdate()<=endDate then
			update class set status=2 where name=className;
			open reader;
				read_loop: loop
				fetch reader into numberLoop;
				IF done THEN
					LEAVE read_loop;
				END IF;
                call restoreSession(className,numberLoop);
			end loop;
			close reader;
        else
			update class set status=0 where name=className;
            update session set status=2 where class_name=className and (status=1 or status=4 or status=3);
        end if;
    end if;
end//
delimiter ;

drop procedure if exists preparationProc;
delimiter //
create procedure preparationProc(
	in className varchar(100)
)
begin
	create table if not exists tempClassName(name varchar(100));
    insert into tempClassName values(className);
end//
delimiter ;