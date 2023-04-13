DROP SCHEMA IF EXISTS ENGLISH_CENTER;
CREATE DATABASE ENGLISH_CENTER;
USE ENGLISH_CENTER;

CREATE TABLE EMPLOYEE (
  id VARCHAR(12),
  ssn VARCHAR(12) unique NOT NULL,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(10) not null,
  username VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  birthday DATE,
  birthplace VARCHAR(50),
  email VARCHAR(100) not null,
  address VARCHAR(100),
  PRIMARY KEY (id)
);

CREATE TABLE STUDENT (
  ssn VARCHAR(12) NOT NULL,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(10) not null,
  birthday DATE,
  birthplace VARCHAR(50),
  email VARCHAR(100),
  address VARCHAR(100),
  PRIMARY KEY (ssn)
);

CREATE TABLE ADMIN (
    id VARCHAR(12) PRIMARY KEY,
    FOREIGN KEY (id)
        REFERENCES EMPLOYEE(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE SUPERVISOR (
    id VARCHAR(12) PRIMARY KEY,
    FOREIGN KEY (id)
        REFERENCES EMPLOYEE(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE TEACHER (
    id VARCHAR(12) PRIMARY KEY,
    FOREIGN KEY (id)
        REFERENCES EMPLOYEE(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE CLASS (
  Start_date DATE,
  End_date DATE,
  Name VARCHAR(50),
  Status int NOT NULL,
  Max_stu INT NOT NULL,
  PRIMARY KEY (Name)
);

CREATE TABLE IN_CLASS (
    StudentSSN VARCHAR(12),
    ClassName VARCHAR(50),
    FOREIGN KEY (StudentSSN)
        REFERENCES STUDENT(ssn)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (ClassName)
        REFERENCES CLASS(Name)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY(StudentSSN,ClassName)
); 

CREATE TABLE CLASSROOM (
    Number varchar(10) PRIMARY KEY,
    Max_seat INT NOT NULL
); 
CREATE TABLE TIMETABLE (
    Start_hour TIME,
    End_hour TIME,
    PRIMARY KEY(Start_hour,End_hour)
); 

CREATE TABLE SESSION_TIME (
    Start_hour TIME,
    End_hour TIME,
    Date DATE,
    FOREIGN KEY (Start_hour, End_hour)
        REFERENCES TIMETABLE(Start_hour, End_hour)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY(Start_hour,End_hour,Date)
); 

CREATE TABLE SESSION (
	Start_hour TIME,
    End_hour TIME,
	Session_date DATE,
    FOREIGN KEY (Start_hour, End_hour,Session_date)
	REFERENCES SESSION_TIME(Start_hour, End_hour,Date)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
    RoomNumber varchar(10) references CLASSROOM(Number) on delete cascade on update cascade,
    Session_number INT,
    Status INT,
     -- Teacher responsible for the session
    TeacherID varchar(12) not null references TEACHER(id) on delete cascade on update cascade,
     -- Supervisor responsible for the session
    SupervisorID VARCHAR(12) NOT NULL references SUPERVISOR(id) on delete cascade on update cascade,
    NoteForClass text,
    TeacherAttendanceStatus int,
    TeacherAttendanceNote text,
    ClassName VARCHAR(50) not null references CLASS(Name) on delete cascade on update cascade,
    -- Make up for a session
    MakeUpRoomNumber varchar(10),
    MakeUpSession_date date,
    MakeUpStart_hour time,
    MakeUpEnd_hour time,
    MakeUpSession_number int,
    foreign key(MakeUpRoomNumber,MakeUpSession_date,MakeUpStart_hour,MakeUpEnd_hour,MakeUpSession_number) references SESSION(RoomNumber,Session_date,Start_hour,End_hour,Session_number),
    PRIMARY KEY(RoomNumber,Session_date,Start_hour,End_hour,Session_number)
);

CREATE TABLE STUDENT_ATTENDANCE (
    StudentSSN VARCHAR(12),
    Start_hour TIME,
    End_hour TIME,
	Session_date DATE,
	RoomNumber varchar(10),
    Session_number INT,
    Status int not null,
    Note text,
    PRIMARY KEY(StudentSSN, Start_hour,End_hour,Session_date,RoomNumber,Session_number),
    FOREIGN KEY(Start_hour,End_hour,Session_date,RoomNumber,Session_number) REFERENCES SESSION(Start_hour,End_hour,Session_date,RoomNumber,Session_number) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(StudentSSN) REFERENCES STUDENT(ssn) ON DELETE CASCADE ON UPDATE CASCADE
);  
