import express from "express";
import { Authentication } from "../model/authentication.js";
import { Profile } from "../model/profile.js";
import { Home } from "../model/home.js";
import { Class } from '../model/class.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";
import fs from 'fs';
import CryptoJS from 'crypto-js';
import { key } from '../AESKeyGenerator.js';

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

const generalRoutes = express.Router();

const authenticateModel = new Authentication();

generalRoutes.post('/', (req, res) =>
{
      const username = req.body.params.username;
      const password = req.body.params.password;
      const type = req.body.params.type;
      authenticateModel.login(username, password, type, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (result.length > 1)
                        res.status(400).send({ message: "Username and password duplicated!" });
                  else if (result.length === 0)
                        res.status(200).send({ message: false });
                  else
                  {
                        req.session.userID = result[0].ID;
                        req.session.userType = type;
                        req.session.save(() =>
                        {
                              // Session saved
                              res.status(200).send({ message: true });
                        });
                  }
            }
      })
});

generalRoutes.get('/logout', (req, res) =>
{
      // Get the current file path
      const currentFilePath = fileURLToPath(import.meta.url);

      // Get the current directory by resolving the file path
      const currentDirectory = path.dirname(currentFilePath);

      // Get the parrent directory
      const parentDirectory = path.resolve(currentDirectory, '..');

      // Specify the session file directory
      const sessionDir = path.join(parentDirectory, 'model', 'sessions');

      // Define the session ID or session file name for which you want to delete its additional files
      const sessionID = req.sessionID;

      // Regular expression pattern for matching the additional session files
      const additionalFilesPattern = new RegExp(`^${ sessionID }\.json\.\\d+$`);
      req.session.destroy((err) =>
      {
            if (err)
            {
                  console.log(err);
                  console.error('Error destroying session:', err);
            }
            else
            {
                  res.clearCookie('userID');
                  res.status(200).send({ message: 'Logged out successfully!' });

                  // Get a list of files in the session directory
                  fs.readdir(sessionDir, (err, files) =>
                  {
                        if (err)
                        {
                              console.error('Error reading session directory:', err);
                              return;
                        }

                        // Filter the list to include only the additional session files for the specified session
                        const additionalFiles = files.filter((file) => additionalFilesPattern.test(file));

                        // Delete each additional session file
                        additionalFiles.forEach((file) =>
                        {
                              const filePath = `${ sessionDir }/${ file }`;
                              fs.unlink(filePath, (err) =>
                              {
                                    if (err)
                                    {
                                          console.error('Error deleting additional session file:', filePath, err);
                                    } else
                                    {
                                          console.log('Additional session file deleted:', filePath);
                                    }
                              });
                        });
                  });
            }
      });
});

generalRoutes.get('/isLoggedIn', (req, res) =>
{
      const idOK = req.session.userID !== undefined && req.session.userID !== null;
      if (idOK)
            res.status(200).send({ message: [true, req.session.userType] });
      else
            res.status(200).send({ message: [false] });
});

generalRoutes.post('/recovery', (req, res) =>
{
      const username = req.body.params.username;
      const password = req.body.params.password;
      authenticateModel.recovery(username, password, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send({ message: 'Success' });
      })
});

generalRoutes.post('/validateUser', (req, res) =>
{
      const username = req.body.params.username;
      authenticateModel.validateUser(username, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (result.length)
                        res.status(200).send({ message: true });
                  else
                        res.status(200).send({ message: false });
            }
      })
});

const profileModel = new Profile();

generalRoutes.get('/profile', (req, res) =>
{
      const id = req.session.userID;
      profileModel.getInfo(id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(200).send(encryptWithAES({ message: 'No info found!' }));
                  else
                        res.status(200).send(encryptWithAES(result[0]));
            }
      });
});

generalRoutes.post('/updateProfile', multer().fields([
      { name: 'ssn' },
      { name: 'name' },
      { name: 'address' },
      { name: 'birthday' },
      { name: 'birthplace' },
      { name: 'email' },
      { name: 'phone' },
      { name: 'password' },
      { name: 'userType' },
      { name: 'image', maxCount: 1 },
]), (req, res) =>
{
      const id = req.session.userID;

      const name = decryptWithAES(req.body.name);
      const address = decryptWithAES(req.body.address);
      const birthday = decryptWithAES(req.body.birthday);
      const birthplace = decryptWithAES(req.body.birthplace);
      const email = decryptWithAES(req.body.email);
      const phone = decryptWithAES(req.body.phone);
      const password = decryptWithAES(req.body.password);
      const userType = decryptWithAES(req.body.userType);
      const ssn = decryptWithAES(req.body.ssn);

      let imagePath = null;
      if (req.files['image'] !== null && req.files['image'] !== undefined)
      {
            const imageFile = req.files['image'][0];
            // Get the target directory to store the image
            const directory = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'model', 'image', 'employee', userType === 1 ? 'admin' : 'staff', id);
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

            imagePath = (userType === 1 ? 'admin' : 'staff') + '/' + id + '/' + filename;
      }
      profileModel.updateInfo(id, ssn, name, address, birthday, birthplace, email, phone, password, imagePath, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Personal Info updated successfully!' }));
      });
});

generalRoutes.post('/isSSNDuplicate', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const ssn = data.params.ssn;
      profileModel.isSSNDuplicate(ssn, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send(encryptWithAES({message:'No duplication!'}));
                  else
                        res.status(200).send(encryptWithAES({ message: 'Duplication detected!' }));
            }
      });
});

generalRoutes.post('/isPhoneDuplicate', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const phone = data.params.phone;
      profileModel.isPhoneDuplicate(phone, (result, err) =>
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
      });
});

generalRoutes.post('/isEmailDuplicate', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const email = data.params.email;
      profileModel.isEmailDuplicate(email, (result, err) =>
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
      });
});

const generalClassModel = new Class();
generalRoutes.post('/classInfo', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      generalClassModel.getInfo(name, (result, err) =>
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
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

generalRoutes.post('/classStudent', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const studentName = data.params.studentName;
      generalClassModel.classStudent(name, studentName, (result, err) =>
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

generalRoutes.post('/classSession', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const id = req.session.userID ? req.session.userID : null;
      const type = req.session.userType ? req.session.userType : null;
      generalClassModel.classSession(name, id, type, (result, err) =>
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
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

generalRoutes.post('/classSessionDetail', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const number = data.params.number;
      generalClassModel.classSessionDetail(name, number, (result, err) =>
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
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

generalRoutes.post('/getSessionStudent', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const studentName = data.params.studentName;
      generalClassModel.getSessionStudent(name, studentName, (result, err) =>
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

generalRoutes.post('/getStudentSessionAttendace', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const className = data.params.className;
      const sessionNumber = data.params.sessionNumber;
      const id = data.params.id;
      generalClassModel.getStudentSessionAttendace(className, sessionNumber, id, (result, err) =>
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
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

generalRoutes.post('/checkAttendance', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const number = data.params.number;
      const students = data.params.students;
      const teacher = data.params.teacher;
      const userType = data.params.userType ? data.params.userType : 1;
      const supervisor = data.params.supervisor ? data.params.supervisor : null;
      generalClassModel.checkAttendance(name, number, students, teacher, userType, supervisor, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
                  res.status(200).send(encryptWithAES({ message: 'Attendance checked successful!' }));
      })
});

const homeModel = new Home();
generalRoutes.get('/getTodaySession', (req, res) =>
{
      const userID = req.session.userID;
      const userType = req.session.userType;
      homeModel.getTodaySession(userID, userType, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!res.length)
                        res.status(204).send(encryptWithAES({ message: 'No session found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

generalRoutes.get('/getMissedSession', (req, res) =>
{
      const userID = req.session.userID;
      const userType = req.session.userType;
      homeModel.getMissedSession(userID, userType, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!res.length)
                        res.status(204).send(encryptWithAES({ message: 'No session found!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
      })
});


export default generalRoutes;