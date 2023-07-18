import express from "express";
import { Class } from '../model/admin/class.js';
import { Staff } from "../model/admin/staff.js";
import { Student } from "../model/admin/student.js";
import CryptoJS from 'crypto-js';
import { key } from '../keyGenerator.js';

function encryptWithAES(data)
{
      if (data === null || data === undefined || data === '' || data === 'null' || data === 'undefined') return null;
      const string = JSON.stringify(data);
      const result = CryptoJS.AES.encrypt(JSON.stringify(string), key).toString();
      return result;
}

function decryptWithAES(data)
{
      if (data === null || data === undefined || data === '' || data === 'null' || data === 'undefined') return null;
      const bytes = CryptoJS.AES.decrypt(data, key);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
}

const adminRoutes = express.Router();

const classModel = new Class();

adminRoutes.post('/classList', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const status = data.params.status;
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
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

adminRoutes.post('/getCurrentStudent', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      classModel.getCurrentStudent(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result[0]));
      })
});

adminRoutes.post('/getCurrentSession', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      classModel.getCurrentSession(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result[0]));
      })
});

adminRoutes.post('/classInfo', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      classModel.getInfo(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result[0]));
      })
});

adminRoutes.post('/classStudent', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      classModel.classStudent(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/classSession', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      classModel.classSession(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/classTeacher', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const teacherName = data.params.teacherName;
      const date = data.params.date;
      const timetable = data.params.timetable;
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
                        res.status(200).send(encryptWithAES(result));
            })
});

adminRoutes.post('/toggleStatus', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const status = data.params.status;
      classModel.toggleStatus(name, status, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES('Class status update successfully!'));
      })
});

adminRoutes.post('/removeStudentFromClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const id = data.params.id;
      classModel.removeStudentFromClass(name, id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES('Student removed successfully!'));
      })
});

adminRoutes.post('/getStudentNotFromClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const className = data.params.className;
      const studentName = data.params.studentName;
      classModel.getStudentNotFromClass(className, studentName, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/addStudentToClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const students = data.params.students;
      classModel.addStudentToClass(name, students, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES('Student(s) added successfully!'));
      })
});

adminRoutes.post('/getRoom', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      classModel.getRoom(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/getTimetable', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const room = data.params.room;
      const date = data.params.date;
      classModel.getTimetable(room, date, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/getClassCanceledSession', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      classModel.getClassCanceledSession(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/addSessionToClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const room = data.params.room;
      const session = data.params.session;
      const date = data.params.date;
      const timetable = data.params.timetable;
      const makeUpFor = data.params.makeUpFor;
      const teacher = data.params.teacher;
      const supervisor = data.params.supervisor;
      classModel.addSessionToClass(name, room, session, date, timetable, makeUpFor, supervisor, teacher, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES('Session added successfully!'));
      })
});

adminRoutes.post('/getSessionTeacher', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const number = data.params.number;
      classModel.getSessionTeacher(name, number, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result[0]));
      })
});

adminRoutes.post('/getSessionSupervisor', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const number = data.params.number;
      classModel.getSessionSupervisor(name, number, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result[0]));
      })
});

adminRoutes.post('/removeTeacherFromClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const id = data.params.id;
      classModel.removeTeacherFromClass(name, id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES('Teacher removed successfully!'));
      })
});

adminRoutes.post('/getTeacherNotInClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const className = data.params.className;
      classModel.getTeacherNotInClass(name, className, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/addTeacherToClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const teachers = data.params.teachers;
      classModel.addTeacherToClass(name, teachers, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES('Teacher(s) added successfully!'));
      })
});

adminRoutes.post('/classSessionDetail', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const number = data.params.number;
      classModel.classSessionDetail(name, number, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result[0]));
      })
});

adminRoutes.post('/getSessionStudent', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      classModel.getSessionStudent(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/getStudentSessionAttendace', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const className = data.params.className;
      const sessionNumber = data.params.sessionNumber;
      const id = data.params.id;
      classModel.getStudentSessionAttendace(className, sessionNumber, id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/checkAttendance', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const number = data.params.number;
      const students = data.params.students;
      const teacher = data.params.teacher;
      classModel.checkAttendance(name, number, students, teacher, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/cancelSession', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const number = data.params.number;
      classModel.cancelSession(name, number, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES('Session cancelled successfully!'));
      })
});

adminRoutes.post('/restoreSession', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const number = data.params.number;
      classModel.restoreSession(name, number, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES('Session restored successfully!'));
      })
});

adminRoutes.post('/changeTeacher', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const number = data.params.number;
      const teacher = data.params.teacher;
      classModel.changeTeacher(name, number, teacher, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES('Teacher changed successfully!'));
      })
});

adminRoutes.post('/changeSupervisor', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const number = data.params.number;
      const supervisor = data.params.supervisor;
      classModel.changeSupervisor(name, number, supervisor, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES('Supervisor changed successfully!'));
      })
});

const staffModel = new Staff();

adminRoutes.post('/staffList', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const type = data.params.type;
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
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

adminRoutes.post('/staffInfo', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const id = data.params.id;
      staffModel.getInfo(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result[0]));
      })
});

adminRoutes.post('/getTeacherClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const id = data.params.id;
      staffModel.getTeacherClass(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/getSupervisorClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const id = data.params.id;
      staffModel.getSupervisorClass(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});


const studentModel = new Student();

adminRoutes.post('/studentList', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
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
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

adminRoutes.post('/studentInfo', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const id = data.params.id;
      studentModel.studentInfo(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result[0]));
      })
});

adminRoutes.post('/getStudentClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const id = data.params.id;
      studentModel.getStudentClass(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(encryptWithAES(result));
      })
});

export default adminRoutes;