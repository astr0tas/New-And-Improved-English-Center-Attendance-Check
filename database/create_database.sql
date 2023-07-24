DROP SCHEMA IF EXISTS ENGLISH_CENTER;
CREATE SCHEMA ENGLISH_CENTER;
USE ENGLISH_CENTER;

CREATE TABLE EMPLOYEE (
  ID VARCHAR(15),
  SSN VARCHAR(12) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(10) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  birthday DATE not null,
  birthplace text not null,
  email VARCHAR(100) UNIQUE NOT NULL,
  address TEXT not null,
  image text,
  PRIMARY KEY (ID)
);

CREATE TABLE ADMIN (
    ID VARCHAR(15) PRIMARY KEY,
    FOREIGN KEY (ID)
        REFERENCES EMPLOYEE(ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE SUPERVISOR (
    ID VARCHAR(15) PRIMARY KEY,
    FOREIGN KEY (ID)
        REFERENCES EMPLOYEE(ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE TEACHER (
ID VARCHAR(15) PRIMARY KEY,
    FOREIGN KEY (ID)
        REFERENCES EMPLOYEE(ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE STUDENT (
  ID VARCHAR(15),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(10) UNIQUE NOT NULL,
  birthday DATE not null,
  birthplace text,
  email VARCHAR(50) UNIQUE NOT NULL,
  address text,
  SSN varchar(12) unique not null,
  image text,
  PRIMARY KEY (ID)
);

CREATE TABLE CLASS (
  Start_date DATE,
  End_date DATE,
  Name VARCHAR(100),
  Status int default 2,
  Max_students INT,
  Initial_sessions INT default 0,
  PRIMARY KEY (Name),
  check (Start_date<End_date)
);

CREATE TABLE CLASSROOM (
    ID varchar(15) PRIMARY KEY,
    Max_seats INT NOT NULL
); 

CREATE TABLE TIMETABLE (
    ID INT auto_increment,
    Start_hour TIME not null,
    End_hour TIME not null,
    PRIMARY KEY(ID),
    UNIQUE(Start_hour,End_hour)
); 

CREATE TABLE SESSION (
    Number INT,
    Class_name VARCHAR(100),
    FOREIGN KEY (Class_name)
        REFERENCES CLASS(Name)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY(Number,Class_name),
    Timetable_ID INT,
    FOREIGN KEY (Timetable_ID)
        REFERENCES TIMETABLE(ID),
    Classroom_ID varchar(15),
    FOREIGN KEY (Classroom_ID)
        REFERENCES CLASSROOM(ID),
    Session_date DATE NOT NULL,
    UNIQUE(Number,Class_name,Timetable_ID,Classroom_ID,Session_date),
	Status INT not null default 4,
	Session_number_make_up_for INT,
    Class_name_make_up_for VARCHAR(100),
    FOREIGN KEY (Session_number_make_up_for,Class_name_make_up_for)
        REFERENCES SESSION(Number,Class_name) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE TEACHER_RESPONSIBLE (
    Session_number INT,
    Class_name VARCHAR(100),
	PRIMARY KEY(Session_number,Class_name),
    FOREIGN KEY(Session_number,Class_name) REFERENCES SESSION(Number,Class_name) ON DELETE CASCADE ON UPDATE CASCADE,
    Teacher_ID VARCHAR(15),
    Teacher_Note text,
    Teacher_Status int not null default -1,
    FOREIGN KEY(Teacher_ID) REFERENCES TEACHER(ID)
);  

CREATE TABLE SUPERVISOR_RESPONSIBLE (
    Session_number INT,
    Class_name VARCHAR(100),
    PRIMARY KEY(Session_number,Class_name),
    FOREIGN KEY(Session_number,Class_name) REFERENCES SESSION(Number,Class_name) ON DELETE CASCADE ON UPDATE CASCADE,
    Supervisor_ID VARCHAR(15),
    Note_for_class text,
    FOREIGN KEY(Supervisor_ID) REFERENCES SUPERVISOR(ID)
); 

CREATE TABLE STUDENT_ATTENDANCE (
    Session_number INT,
    Class_name VARCHAR(100),
    Student_ID VARCHAR(15),
    PRIMARY KEY(Session_number,Class_name,Student_ID),
    Status int not null default -1,
    Note text,
    FOREIGN KEY(Session_number,Class_name) REFERENCES SESSION(Number,Class_name) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(Student_ID) REFERENCES STUDENT(ID)
);

CREATE TABLE IN_CLASS(
    Student_ID VARCHAR(15),
    Class_name VARCHAR(100),
    FOREIGN KEY(Student_ID) REFERENCES STUDENT(ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(Class_name) REFERENCES CLASS(Name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(Student_ID,Class_name)
);   
 
CREATE TABLE TEACH(
    Teacher_ID VARCHAR(15),
    Class_name VARCHAR(100),
    FOREIGN KEY(Teacher_ID) REFERENCES TEACHER(ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(Class_name) REFERENCES CLASS(Name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(Teacher_ID,Class_name)
); 