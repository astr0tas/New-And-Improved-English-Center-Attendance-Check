import mysql from 'mysql2';

const con = mysql.createPool({
      host: "localhost",
      user: "englishcenter",
      password: "englishcenter123",
      database: "english_center"
});

export function getSessionDetail(sessionNumber, className, callback)
{
      con.query(`select Classroom_ID,Session_date,Status,Session_number_make_up_for,Start_hour,End_hour from SESSION join TIMETABLE on TIMETABLE.ID=SESSION.Timetable_ID where Class_name='${ className }' and Session_number='${ sessionNumber }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getTeacher(sessionNumber, className, callback)
{
      con.query(`select EMPLOYEE.name,EMPLOYEE.ID from TEACHER_RESPONSIBLE join EMPLOYEE on TEACHER_RESPONSIBLE.Teacher_ID=EMPLOYEE.ID where TEACHER_RESPONSIBLE.Session_number=${ sessionNumber } and TEACHER_RESPONSIBLE.Class_name='${ className }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getSupervisor(sessionNumber, className, callback)
{
      con.query(`select EMPLOYEE.name,EMPLOYEE.ID from SUPERVISOR_RESPONSIBLE join EMPLOYEE on SUPERVISOR_RESPONSIBLE.Supervisor_ID=EMPLOYEE.ID where SUPERVISOR_RESPONSIBLE.Session_number=${ sessionNumber } and SUPERVISOR_RESPONSIBLE.Class_name='${ className }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getStudents(className, callback)
{
      con.query(`select IN_CLASS.Student_ID,STUDENT.name from IN_CLASS join STUDENT on STUDENT.ID=IN_CLASS.Student_ID where IN_CLASS.Class_name='${ className }' order by IN_CLASS.Student_ID`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getstudentAttendance(sessionNumber, className, ID, callback)
{
      // console.log(sessionNumber, className, ID)
      con.query(`select Status,Note from STUDENT_ATTENDANCE where Session_number='${ sessionNumber }' and Class_name='${ className }' and Student_ID='${ ID }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function getTeacherAttendance(sessionNumber, className, ID, callback)
{
      con.query(`select Status,Note from TEACHER_RESPONSIBLE where Session_number='${ sessionNumber }' and Class_name='${ className }' and Teacher_ID='${ ID }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function teacherUpdateAttendace(sessionNumber, className, StudentID, Status, Note, callback)
{
      // console.log(sessionNumber, className, StudentID, Status, Note)
      if (Note === '')
            con.query(`call StudentAttendance('${ sessionNumber }','${ className }','${ StudentID }','${ Status }',NULL)`, (err, res) =>
            {
                  if (err)
                        callback(err, null);
                  else
                        callback(null, res);
            });
      else
            con.query(`call StudentAttendance('${ sessionNumber }','${ className }','${ StudentID }','${ Status }','${ Note }')`, (err, res) =>
            {
                  if (err)
                        callback(err, null);
                  else
                        callback(null, res);
            });
}


export function supervisorUpdateAttendace(sessionNumber, className, TeacherID, Status, Note, callback)
{
      // console.log(sessionNumber, className, TeacherID, Status, Note)
      if (Note === '')
            con.query(`call TeacherAttendance(${ parseInt(sessionNumber) },'${ className }','${ TeacherID }',${ Status },NULL)`, (err, res) =>
            {
                  if (err)
                        callback(err, null);
                  else
                        callback(null, res);
            });
      else
            con.query(`call TeacherAttendance(${ parseInt(sessionNumber) },'${ className }','${ TeacherID }',${ Status },'${ Note }')`, (err, res) =>
            {
                  if (err)
                        callback(err, null);
                  else
                        callback(null, res);
            });
}

export function getClassNote(sessionNumber, className, callback)
{
      con.query(`select Note_for_class from SUPERVISOR_RESPONSIBLE where Session_number='${ sessionNumber }' and Class_name='${ className }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}

export function updateClassNote(sessionNumber, className, note, callback)
{
      con.query(`update SUPERVISOR_RESPONSIBLE set Note_for_class='${ note }' where Session_number='${ sessionNumber }' and Class_name='${ className }'`, (err, res) =>
      {
            if (err)
                  callback(err, null);
            else
                  callback(null, res);
      });
}