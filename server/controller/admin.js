import express from "express";
import { Class } from '../model/admin/class.js';
import { Staff } from "../model/admin/staff.js";
import { Student } from "../model/admin/student.js";
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
const key = process.env.SECRET_KEY;
const iv = process.env.SECRET_IV;

function encryptWithAES(data)
{
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return {
            iv: iv.toString('hex'),
            encryptedData: encrypted
      };
}

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
                  res.status(500).send('Server internal error!');
            }
            else
            {
                  if (!result.length)
                        res.status(204).send();
                  else
                  {
                        console.log(encryptWithAES(JSON.stringify(result)));
                        res.status(200).send(encryptWithAES(JSON.stringify(result)));
                  }
            }
      })
});

adminRoutes.post('/getCurrentStudent', (req, res) =>
{
      const name = req.body.params.name;
      classModel.getCurrentStudent(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(result[0]);
      })
});

adminRoutes.post('/getCurrentSession', (req, res) =>
{
      const name = req.body.params.name;
      classModel.getCurrentSession(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(result[0]);
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(result[0]);
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
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
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
                        res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send('Class status update successfully!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send('Student removed successfully!');
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
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send('Student(s) added successfully!');
      })
});

adminRoutes.post('/getRoom', (req, res) =>
{
      const name = req.body.params.name;
      classModel.getRoom(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(result);
      })
});

adminRoutes.post('/getClassCanceledSession', (req, res) =>
{
      const name = req.body.params.name;
      classModel.getClassCanceledSession(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send('Session added successfully!');
      })
});

adminRoutes.post('/getSessionTeacher', (req, res) =>
{
      const name = req.body.params.name;
      const number = req.body.params.number;
      classModel.getSessionTeacher(name, number, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(result[0]);
      })
});

adminRoutes.post('/getSessionSupervisor', (req, res) =>
{
      const name = req.body.params.name;
      const number = req.body.params.number;
      classModel.getSessionSupervisor(name, number, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(result[0]);
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send('Teacher removed successfully!');
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
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send('Teacher(s) added successfully!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(result[0]);
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
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send('Session cancelled successfully!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send('Session restored successfully!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send('Teacher changed successfully!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send('Supervisor changed successfully!');
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
                  res.status(500).send('Server internal error!');
            }
            else
            {
                  if (!result.length)
                        res.status(204).send();
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
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
            }
            else
            {
                  if (!result.length)
                        res.status(204).send();
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
                  res.status(500).send('Server internal error!');
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(result);
      })
});

export default adminRoutes;