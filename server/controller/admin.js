import express from "express";
import { Class } from '../model/admin/class.js';
import { Staff } from "../model/admin/staff.js";
import { Student } from "../model/admin/student.js";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";
import fs from 'fs';

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
      const className = req.body.params.className;
      staffModel.getTeacherClass(id, className, (result, err) =>
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
      const className = req.body.params.className;
      staffModel.getSupervisorClass(id, className, (result, err) =>
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

adminRoutes.post('/isStaffDuplicatedSSN', (req, res) =>
{
      const ssn = req.body.params.ssn;
      staffModel.isDuplicatedSSN(ssn, (result, err) =>
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

adminRoutes.post('/isStaffDuplicatedPhone', (req, res) =>
{
      const phone = req.body.params.phone;
      staffModel.isDuplicatedPhone(phone, (result, err) =>
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

adminRoutes.post('/isStaffDuplicatedEmail', (req, res) =>
{
      const email = req.body.params.email;
      staffModel.isDuplicatedEmail(email, (result, err) =>
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

adminRoutes.post('/isStaffDuplicatedUsername', (req, res) =>
{
      const username = req.body.params.username;
      staffModel.isStaffDuplicatedUsername(username, (result, err) =>
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

adminRoutes.post('/getIDForNewStaff', (req, res) =>
{
      const type = req.body.params.type;
      staffModel.getIDForNewStaff(type, (result, err) =>
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

adminRoutes.post('/createStaff', multer().fields([
      { name: 'id' },
      { name: 'ssn' },
      { name: 'name' },
      { name: 'address' },
      { name: 'birthdate' },
      { name: 'birthplace' },
      { name: 'email' },
      { name: 'phone' },
      { name: 'type' },
      { name: 'username' },
      { name: 'image', maxCount: 1 },
]), (req, res) =>
{
      const { id, ssn, name, address, birthdate, birthplace, email, phone, type, username } = req.body;

      let imagePath = null;
      if (req.files['image'] !== null && req.files['image'] !== undefined)
      {
            const imageFile = req.files['image'][0];
            // Get the target directory to store the image
            const directory = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'model', 'image', 'employee', type === 1 ? 'admin' : 'staff', id);
            // Create the uploads folder if it doesn't exist
            if (!fs.existsSync(directory))
                  fs.mkdirSync(directory, { recursive: true });
            // Generate a unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extname = path.extname(imageFile.originalname);
            const filename = 'image-' + uniqueSuffix + extname;
            // Retrieve the name of the existing image, if it exists
            const existingImageName = fs.readdirSync(directory).find(file => /^image-\d+-\d+\.(png|jpg|jpeg)$/.test(file));
            // Delete the pre-existing image, if it exists
            if (existingImageName)
            {
                  const preExistingImagePath = path.join(directory, existingImageName);
                  fs.unlinkSync(preExistingImagePath);
            }
            // Move the uploaded file to the destination folder
            const filePath = path.join(directory, filename);
            fs.writeFileSync(filePath, imageFile.buffer);

            imagePath = (type === 1 ? 'admin' : 'staff') + '/' + id + '/' + filename;
      }

      staffModel.createStaff(id, name, ssn, address, phone, birthdate, birthplace, email, imagePath, type === '1' ? 1 : 2, username, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Staff successfully created!' });
      })
});

adminRoutes.post('/updateStaff', multer().fields([
      { name: 'id' },
      { name: 'ssn' },
      { name: 'name' },
      { name: 'address' },
      { name: 'birthdate' },
      { name: 'birthplace' },
      { name: 'email' },
      { name: 'phone' },
      { name: 'password' },
      { name: 'type' },
      { name: 'image', maxCount: 1 },
]), (req, res) =>
{
      const { id, ssn, name, address, birthdate, birthplace, email, phone, password, type } = req.body;

      let imagePath = null;
      if (req.files['image'] !== null && req.files['image'] !== undefined)
      {
            const imageFile = req.files['image'][0];
            // Get the target directory to store the image
            const directory = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'model', 'image', 'employee', type === 1 ? 'admin' : 'staff', id);
            // Create the uploads folder if it doesn't exist
            if (!fs.existsSync(directory))
                  fs.mkdirSync(directory, { recursive: true });
            // Generate a unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extname = path.extname(imageFile.originalname);
            const filename = 'image-' + uniqueSuffix + extname;
            // Retrieve the name of the existing image, if it exists
            const existingImageName = fs.readdirSync(directory).find(file => /^image-\d+-\d+\.(png|jpg|jpeg)$/.test(file));
            // Delete the pre-existing image, if it exists
            if (existingImageName)
            {
                  const preExistingImagePath = path.join(directory, existingImageName);
                  fs.unlinkSync(preExistingImagePath);
            }
            // Move the uploaded file to the destination folder
            const filePath = path.join(directory, filename);
            fs.writeFileSync(filePath, imageFile.buffer);

            imagePath = (type === 1 ? 'admin' : 'staff') + '/' + id + '/' + filename;
      }

      staffModel.createStaff(id,
            name === 'null' ? null : name,
            ssn === 'null' ? null : ssn,
            address === 'null' ? null : address,
            phone === 'null' ? null : phone,
            birthdate === 'null' ? null : birthdate,
            birthplace === 'null' ? null : birthplace,
            email === 'null' ? null : email,
            imagePath,
            password === 'null' ? null : password, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Staff info successfully updated!' });
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
      const className = req.body.params.className;
      studentModel.getStudentClass(id, className, (result, err) =>
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

adminRoutes.post('/isStudentDuplicatedSSN', (req, res) =>
{
      const ssn = req.body.params.ssn;
      studentModel.isDuplicatedSSN(ssn, (result, err) =>
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

adminRoutes.post('/isStudentDuplicatedPhone', (req, res) =>
{
      const phone = req.body.params.phone;
      studentModel.isDuplicatedPhone(phone, (result, err) =>
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

adminRoutes.post('/isStudentDuplicatedEmail', (req, res) =>
{
      const email = req.body.params.email;
      studentModel.isDuplicatedEmail(email, (result, err) =>
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

adminRoutes.get('/getIDForNewStudent', (req, res) =>
{
      studentModel.getIDForNewStudent((result, err) =>
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

adminRoutes.post('/createStudent', multer().fields([
      { name: 'id' },
      { name: 'ssn' },
      { name: 'name' },
      { name: 'address' },
      { name: 'birthdate' },
      { name: 'birthplace' },
      { name: 'email' },
      { name: 'phone' },
      { name: 'image', maxCount: 1 },
]), (req, res) =>
{
      const { id, ssn, name, address, birthdate, birthplace, email, phone } = req.body;

      let imagePath = null;
      if (req.files['image'] !== null && req.files['image'] !== undefined)
      {
            const imageFile = req.files['image'][0];
            // Get the target directory to store the image
            const directory = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'model', 'image', 'student', id);
            // Create the uploads folder if it doesn't exist
            if (!fs.existsSync(directory))
                  fs.mkdirSync(directory, { recursive: true });
            // Generate a unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extname = path.extname(imageFile.originalname);
            const filename = 'image-' + uniqueSuffix + extname;
            // Retrieve the name of the existing image, if it exists
            const existingImageName = fs.readdirSync(directory).find(file => /^image-\d+-\d+\.(png|jpg|jpeg)$/.test(file));
            // Delete the pre-existing image, if it exists
            if (existingImageName)
            {
                  const preExistingImagePath = path.join(directory, existingImageName);
                  fs.unlinkSync(preExistingImagePath);
            }
            // Move the uploaded file to the destination folder
            const filePath = path.join(directory, filename);
            fs.writeFileSync(filePath, imageFile.buffer);

            imagePath = id + '/' + filename;
      }

      studentModel.createStudent(id, name, ssn, address === 'null' ? null : address, phone, birthdate, birthplace === 'null' ? null : birthplace, email, imagePath, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Student successfully created!' });
      })
});

adminRoutes.post('/updateStudent', multer().fields([
      { name: 'id' },
      { name: 'ssn' },
      { name: 'name' },
      { name: 'address' },
      { name: 'birthdate' },
      { name: 'birthplace' },
      { name: 'email' },
      { name: 'phone' },
      { name: 'image', maxCount: 1 },
]), (req, res) =>
{
      const { id, ssn, name, address, birthdate, birthplace, email, phone } = req.body;

      let imagePath = null;
      if (req.files['image'] !== null && req.files['image'] !== undefined)
      {
            const imageFile = req.files['image'][0];
            // Get the target directory to store the image
            const directory = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'model', 'image', 'student', id);
            // Create the uploads folder if it doesn't exist
            if (!fs.existsSync(directory))
                  fs.mkdirSync(directory, { recursive: true });
            // Generate a unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extname = path.extname(imageFile.originalname);
            const filename = 'image-' + uniqueSuffix + extname;
            // Retrieve the name of the existing image, if it exists
            const existingImageName = fs.readdirSync(directory).find(file => /^image-\d+-\d+\.(png|jpg|jpeg)$/.test(file));
            // Delete the pre-existing image, if it exists
            if (existingImageName)
            {
                  const preExistingImagePath = path.join(directory, existingImageName);
                  fs.unlinkSync(preExistingImagePath);
            }
            // Move the uploaded file to the destination folder
            const filePath = path.join(directory, filename);
            fs.writeFileSync(filePath, imageFile.buffer);

            imagePath = id + '/' + filename;
      }

      studentModel.updateStudent(id,
            name === 'null' ? null : name,
            ssn === 'null' ? null : ssn,
            address === 'null' ? null : address,
            phone === 'null' ? null : phone,
            birthdate === 'null' ? null : birthdate,
            birthplace === 'null' ? null : birthplace,
            email === 'null' ? null : email,
            imagePath, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Student info successfully updated!' });
      })
});

export default adminRoutes;