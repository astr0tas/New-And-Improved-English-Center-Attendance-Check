import express from "express";
import { Class } from '../model/admin/class.js';
import { Staff } from "../model/admin/staff.js";
import { Student } from "../model/admin/student.js";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";
import fs from 'fs';
import CryptoJS from 'crypto-js';
import { key } from '../model/AESKeyGenerator.js';

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
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (decryptedData === null || decryptedData === undefined || decryptedData === '' || decryptedData === 'null' || decryptedData === 'undefined') return null;
      return JSON.parse(decryptedData);
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No class found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
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
                        res.status(500).send({ message: 'Server internal error!' });
                  }
                  else
                  {
                        if (!result.length)
                              res.status(204).send(encryptWithAES({ message: 'No teacher found!' }));
                        else
                              res.status(200).send(encryptWithAES(result));
                  }
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Class status update successfully!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Student removed successfully!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No student found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Student(s) added successfully!' }));
      })
});

adminRoutes.post('/getSuitableRoom', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      classModel.getSuitableRoom(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No class room found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No timetable found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

adminRoutes.post('/getClassCanceledMissingSession', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      classModel.getClassCanceledMissingSession(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No session found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Session added successfully!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Teacher removed successfully!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No teacher found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Teacher(s) added successfully!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Session cancelled successfully!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Session restored successfully!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Teacher changed successfully!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Supervisor changed successfully!' }));
      })
});

adminRoutes.post('/changeClassRoom', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const number = data.params.number;
      const room = data.params.room;
      classModel.changeClassRoom(name, number, room, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Session class room changed successfully!' }));
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
                  res.status(200).send(encryptWithAES(result));
      })
});

adminRoutes.post('/getSuitableTeacher', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const teacherName = data.params.teacherName;
      const startDate = data.params.start;
      const endDate = data.params.end;
      const dow = data.params.period.dow;
      const startHour = data.params.period.start;
      const endHour = data.params.period.end;
      classModel.getSuitableTeacher(teacherName, startDate, endDate, dow, startHour, endHour, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No teacher found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

adminRoutes.post('/getDuplicateName', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      classModel.getDuplicateName(name, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No duplication!' }));
                  else
                        res.status(200).send(encryptWithAES({ message: 'Duplication detected!' }));
            }
      })
});

adminRoutes.post('/getSuitableStudent', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const startDate = data.params.start;
      const endDate = data.params.end;
      const period = data.params.period;
      classModel.getSuitableStudent(name, startDate, endDate, period, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No student found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

adminRoutes.post('/getSuitableRoomForNewClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const seats = data.params.seats;
      const startDate = data.params.start;
      const endDate = data.params.end;
      const dow = data.params.period.dow;
      const startHour = data.params.period.start;
      const endHour = data.params.period.end;
      classModel.getSuitableRoomForNewClass(seats, startDate, endDate, dow, startHour, endHour, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No room found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

adminRoutes.post('/createClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const start = data.params.start;
      const end = data.params.end;
      const supervisor = data.params.supervisor;
      const period = data.params.period;
      const sessions = data.params.sessionList;
      const students = data.params.students;
      const length = data.params.courseLength;
      classModel.createClass(name, start, end, supervisor, period, sessions, students, length, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Class created successfully!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No staff found!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No info found!' }));
                  else
                        res.status(200).send(encryptWithAES(result[0]));
            }
      })
});

adminRoutes.post('/getTeacherClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const id = data.params.id;
      const className = data.params.className;
      staffModel.getTeacherClass(id, className, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No teacher found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

adminRoutes.post('/getSupervisorClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const id = data.params.id;
      const className = data.params.className;
      staffModel.getSupervisorClass(id, className, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No supervisor found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

adminRoutes.post('/isStaffDuplicatedSSN', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const ssn = data.params.ssn;
      staffModel.isDuplicatedSSN(ssn, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No duplication!' }));
                  else
                        res.status(200).send(encryptWithAES({ message: 'Duplication detected!' }));
            }
      })
});

adminRoutes.post('/isStaffDuplicatedPhone', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const phone = data.params.phone;
      staffModel.isDuplicatedPhone(phone, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No duplication!' }));
                  else
                        res.status(200).send(encryptWithAES({ message: 'Duplication detected!' }));
            }
      })
});

adminRoutes.post('/isStaffDuplicatedEmail', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const email = data.params.email;
      staffModel.isDuplicatedEmail(email, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No duplication!' }));
                  else
                        res.status(200).send(encryptWithAES({ message: 'Duplication detected!' }));
            }
      })
});

adminRoutes.post('/isStaffDuplicatedUsername', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const username = data.params.username;
      staffModel.isStaffDuplicatedUsername(username, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (result.length)
                        res.status(200).send(encryptWithAES({ message: 'Duplication detected!' }));
                  else
                        res.status(204).send(encryptWithAES({ message: 'No duplication!' }));
            }
      })
});

adminRoutes.post('/getIDForNewStaff', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const type = data.params.type;
      staffModel.getIDForNewStaff(type, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (result.length)
                        res.status(200).send(encryptWithAES(result));
                  else
                        res.status(204).send(encryptWithAES({ message: 'Can not get new ID!' }));
            }
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
      const id = decryptWithAES(req.body.id);
      const ssn = decryptWithAES(req.body.ssn);
      const name = decryptWithAES(req.body.name);
      const address = decryptWithAES(req.body.address);
      const birthdate = decryptWithAES(req.body.birthdate);
      const birthplace = decryptWithAES(req.body.birthplace);
      const email = decryptWithAES(req.body.email);
      const phone = decryptWithAES(req.body.phone);
      const username = decryptWithAES(req.body.username);
      const type = decryptWithAES(req.body.type);

      let imagePath = null;
      if (req.files['image'] !== null && req.files['image'] !== undefined)
      {
            const imageFile = req.files['image'][0];
            // Get the target directory to store the image
            const directory = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'model', 'image', 'employee', 'staff', id);
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

            imagePath = 'staff' + '/' + id + '/' + filename;
      }

      staffModel.createStaff(id, name, ssn, address, phone, birthdate, birthplace, email, imagePath, type, username, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Staff successfully created!' }));
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
      const id = decryptWithAES(req.body.id);
      const ssn = decryptWithAES(req.body.ssn);
      const name = decryptWithAES(req.body.name);
      const address = decryptWithAES(req.body.address);
      const birthdate = decryptWithAES(req.body.birthdate);
      const birthplace = decryptWithAES(req.body.birthplace);
      const email = decryptWithAES(req.body.email);
      const phone = decryptWithAES(req.body.phone);
      const password = decryptWithAES(req.body.password);

      let imagePath = null;
      if (req.files['image'] !== null && req.files['image'] !== undefined)
      {
            const imageFile = req.files['image'][0];
            // Get the target directory to store the image
            const directory = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'model', 'image', 'employee', 'staff', id);
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

            imagePath = 'staff' + '/' + id + '/' + filename;
      }

      staffModel.updateStaff(id, name, ssn, address, phone, birthdate, birthplace, email, imagePath, password, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Staff info successfully updated!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No student found!' }));
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
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No info found!' }));
                  else
                        res.status(200).send(encryptWithAES(result[0]));
            }
      })
});

adminRoutes.post('/getStudentClass', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const id = data.params.id;
      const className = data.params.className;
      studentModel.getStudentClass(id, className, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No class found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

adminRoutes.post('/isStudentDuplicatedSSN', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const ssn = data.params.ssn;
      studentModel.isDuplicatedSSN(ssn, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No Duplication!' }));
                  else
                        res.status(200).send(encryptWithAES({ message: 'Duplication detected!' }));
            }
      })
});

adminRoutes.post('/isStudentDuplicatedPhone', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const phone = data.params.phone;
      studentModel.isDuplicatedPhone(phone, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No Duplication!' }));
                  else
                        res.status(200).send(encryptWithAES({ message: 'Duplication detected!' }));
            }
      })
});

adminRoutes.post('/isStudentDuplicatedEmail', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const email = data.params.email;
      studentModel.isDuplicatedEmail(email, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'No Duplication!' }));
                  else
                        res.status(200).send(encryptWithAES({ message: 'Duplication detected!' }));
            }
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
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({ message: 'Can not get new ID!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
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
      const id = decryptWithAES(req.body.id);
      const ssn = decryptWithAES(req.body.ssn);
      const name = decryptWithAES(req.body.name);
      const address = decryptWithAES(req.body.address);
      const birthdate = decryptWithAES(req.body.birthdate);
      const birthplace = decryptWithAES(req.body.birthplace);
      const email = decryptWithAES(req.body.email);
      const phone = decryptWithAES(req.body.phone);

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
                  res.status(200).send(encryptWithAES({ message: 'Student successfully created!' }));
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
      const id = decryptWithAES(req.body.id);
      const ssn = decryptWithAES(req.body.ssn);
      const name = decryptWithAES(req.body.name);
      const address = decryptWithAES(req.body.address);
      const birthdate = decryptWithAES(req.body.birthdate);
      const birthplace = decryptWithAES(req.body.birthplace);
      const email = decryptWithAES(req.body.email);
      const phone = decryptWithAES(req.body.phone);

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

      studentModel.updateStudent(id, name, ssn, address, phone, birthdate, birthplace, email, imagePath, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Student info successfully updated!' }));
      })
});

export default adminRoutes;