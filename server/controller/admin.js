import express from "express";
import { Class } from '../model/admin/class.js';
import { Staff } from "../model/admin/staff.js";
import { Student } from "../model/admin/student.js";

const adminRoutes = express.Router();

const classModel = new Class();

adminRoutes.post('/classList', (req, res) =>
{
      const name = req.body.params.name;
      const status = req.body.params.status;
      classModel.getList(name, status, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send({ message: 'No class found in the database!' });
                  else
                        res.status(200).send(result);
            }
      })
});

adminRoutes.post('/classInfo', (req, res) =>
{
      const name = req.body.params.name;
      classModel.getInfo(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/classStudent', (req, res) =>
{
      const name = req.body.params.name;
      classModel.classStudent(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/classSession', (req, res) =>
{
      const name = req.body.params.name;
      classModel.classSession(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/classTeacher', (req, res) =>
{
      const name = req.body.params.name;
      const teacherName = req.body.params.teacherName;
      const date = req.body.params.date;
      const timetable = req.body.params.timetable;
      classModel.classTeacher(name,
            (teacherName === undefined || teacherName === null) ? '' : teacherName,
            (date === undefined || date === null) ? null : date,
            (timetable === undefined || timetable === null) ? null : timetable,
            (result, err) =>
            {
                  if (err)
                  {
                        console.log(err);
                        res.status(500).send({ message: 'Server internal error!' });
                  }
                  else
                        res.status(200).send(result);
            })
});

adminRoutes.post('/toggleStatus', (req, res) =>
{
      const name = req.body.params.name;
      const status = req.body.params.status;
      classModel.toggleStatus(name, status, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Class status update successfully!' });
      })
});

adminRoutes.post('/removeStudentFromClass', (req, res) =>
{
      const name = req.body.params.name;
      const id = req.body.params.id;
      classModel.removeStudentFromClass(name, id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Student removed successfully!' });
      })
});

adminRoutes.post('/getStudentNotFromClass', (req, res) =>
{
      const className = req.body.params.className;
      const studentName = req.body.params.studentName;
      classModel.getStudentNotFromClass(className, studentName, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/addStudentToClass', (req, res) =>
{
      const name = req.body.params.name;
      const students = req.body.params.students;
      classModel.addStudentToClass(name, students, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Student(s) added successfully!' });
      })
});

adminRoutes.post('/getSuitableRoom', (req, res) =>
{
      const name = req.body.params.name;
      classModel.getSuitableRoom(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/getTimetable', (req, res) =>
{
      const room = req.body.params.room;
      const date = req.body.params.date;
      classModel.getTimetable(room, date, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/getClassCanceledMissingSession', (req, res) =>
{
      const name = req.body.params.name;
      classModel.getClassCanceledMissingSession(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/addSessionToClass', (req, res) =>
{
      const name = req.body.params.name;
      const room = req.body.params.room;
      const session = req.body.params.session;
      const date = req.body.params.date;
      const timetable = req.body.params.timetable;
      const makeUpFor = req.body.params.makeUpFor;
      const teacher = req.body.params.teacher;
      const supervisor = req.body.params.supervisor;
      classModel.addSessionToClass(name, room, session, date, timetable, makeUpFor, supervisor, teacher, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Session added successfully!' });
      })
});

adminRoutes.post('/removeTeacherFromClass', (req, res) =>
{
      const name = req.body.params.name;
      const id = req.body.params.id;
      classModel.removeTeacherFromClass(name, id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Teacher removed successfully!' });
      })
});

adminRoutes.post('/getTeacherNotInClass', (req, res) =>
{
      const name = req.body.params.name;
      const className = req.body.params.className;
      classModel.getTeacherNotInClass(name, className, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/addTeacherToClass', (req, res) =>
{
      const name = req.body.params.name;
      const teachers = req.body.params.teachers;
      classModel.addTeacherToClass(name, teachers, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Teacher(s) added successfully!' });
      })
});

adminRoutes.post('/classSessionDetail', (req, res) =>
{
      const name = req.body.params.name;
      const number = req.body.params.number;
      classModel.classSessionDetail(name, number, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/getSessionStudent', (req, res) =>
{
      const name = req.body.params.name;
      classModel.getSessionStudent(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/getStudentSessionAttendace', (req, res) =>
{
      const className = req.body.params.className;
      const sessionNumber = req.body.params.sessionNumber;
      const id = req.body.params.id;
      classModel.getStudentSessionAttendace(className, sessionNumber, id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/checkAttendance', (req, res) =>
{
      const name = req.body.params.name;
      const number = req.body.params.number;
      const students = req.body.params.students;
      const teacher = req.body.params.teacher;
      classModel.checkAttendance(name, number, students, teacher, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/cancelSession', (req, res) =>
{
      const name = req.body.params.name;
      const number = req.body.params.number;
      classModel.cancelSession(name, number, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Session cancelled successfully!' });
      })
});

adminRoutes.post('/restoreSession', (req, res) =>
{
      const name = req.body.params.name;
      const number = req.body.params.number;
      classModel.restoreSession(name, number, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Session restored successfully!' });
      })
});

adminRoutes.post('/changeTeacher', (req, res) =>
{
      const name = req.body.params.name;
      const number = req.body.params.number;
      const teacher = req.body.params.teacher;
      classModel.changeTeacher(name, number, teacher, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Teacher changed successfully!' });
      })
});

adminRoutes.post('/changeSupervisor', (req, res) =>
{
      const name = req.body.params.name;
      const number = req.body.params.number;
      const supervisor = req.body.params.supervisor;
      classModel.changeSupervisor(name, number, supervisor, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Supervisor changed successfully!' });
      })
});

adminRoutes.post('/changeClassRoom', (req, res) =>
{
      const name = req.body.params.name;
      const number = req.body.params.number;
      const room = req.body.params.room;
      classModel.changeClassRoom(name, number, room, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Session class room changed successfully!' });
      })
});

adminRoutes.get('/getPeriods', (req, res) =>
{
      classModel.getPeriods((result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/getSuitableTeacher', (req, res) =>
{
      const teacherName = req.body.params.teacherName;
      const startDate = req.body.params.start;
      const endDate = req.body.params.end;
      const dow = req.body.params.period.dow;
      const startHour = req.body.params.period.start;
      const endHour = req.body.params.period.end;
      classModel.getSuitableTeacher(teacherName, startDate, endDate, dow, startHour, endHour, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/getDuplicateName', (req, res) =>
{
      const name = req.body.params.name;
      classModel.getDuplicateName(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/getSuitableStudent', (req, res) =>
{
      const name = req.body.params.name;
      const startDate = req.body.params.start;
      const endDate = req.body.params.end;
      const period = req.body.params.period;
      classModel.getSuitableStudent(name, startDate, endDate, period, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/getSuitableRoomForNewClass', (req, res) =>
{
      const seats = req.body.params.seats;
      const startDate = req.body.params.start;
      const endDate = req.body.params.end;
      const dow = req.body.params.period.dow;
      const startHour = req.body.params.period.start;
      const endHour = req.body.params.period.end;
      classModel.getSuitableRoomForNewClass(seats, startDate, endDate, dow, startHour, endHour, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/createClass', (req, res) =>
{
      const name = req.body.params.name;
      const start = req.body.params.start;
      const end = req.body.params.end;
      const supervisor = req.body.params.supervisor;
      const period = req.body.params.period;
      const sessions = req.body.params.sessionList;
      const students = req.body.params.students;
      const length = req.body.params.courseLength;
      classModel.createClass(name, start, end, supervisor, period, sessions, students, length, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

const staffModel = new Staff();

adminRoutes.post('/staffList', (req, res) =>
{
      const name = req.body.params.name;
      const type = req.body.params.type;
      staffModel.getList(name, type, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send({ message: 'No staff found in the database!' });
                  else
                        res.status(200).send(result);
            }
      })
});

adminRoutes.post('/staffInfo', (req, res) =>
{
      const id = req.body.params.id;
      staffModel.getInfo(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result[0]);
      })
});

adminRoutes.post('/getTeacherClass', (req, res) =>
{
      const id = req.body.params.id;
      staffModel.getTeacherClass(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/getSupervisorClass', (req, res) =>
{
      const id = req.body.params.id;
      staffModel.getSupervisorClass(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});


const studentModel = new Student();

adminRoutes.post('/studentList', (req, res) =>
{
      const name = req.body.params.name;
      studentModel.getList(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send({ message: 'No student found in the database!' });
                  else
                        res.status(200).send(result);
            }
      })
});

adminRoutes.post('/studentInfo', (req, res) =>
{
      const id = req.body.params.id;
      studentModel.studentInfo(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result[0]);
      })
});

adminRoutes.post('/getStudentClass', (req, res) =>
{
      const id = req.body.params.id;
      studentModel.getStudentClass(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(result);
      })
});

export default adminRoutes;