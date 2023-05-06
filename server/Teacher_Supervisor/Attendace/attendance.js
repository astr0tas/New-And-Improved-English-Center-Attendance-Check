import express from "express";
// import bodyParser from "body-parser";

import { getSessionDetail, getTeacher, getSupervisor, getStudents, teacherUpdateAttendace, supervisorUpdateAttendace, getstudentAttendance, getTeacherAttendance, getClassNote, updateClassNote } from "./query.js";

const Attendace = express.Router();

// Attendace.use(bodyParser.json());


Attendace.get('/attendance/session', (req, res) =>
{
      getSessionDetail(req.query.sessionNumber, req.query.className, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result[0]);
            }
      });
});

Attendace.get('/attendance/teacher', (req, res) =>
{
      getTeacher(req.query.sessionNumber, req.query.className, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result[0]);
            }
      });
});


Attendace.get('/attendance/supervisor', (req, res) =>
{
      getSupervisor(req.query.sessionNumber, req.query.className, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result[0]);
            }
      });
});

Attendace.get('/attendance/students', (req, res) =>
{
      getStudents(req.query.className, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result);
            }
      });
});

Attendace.get('/attendance/classNote', (req, res) =>
{
      getClassNote(req.query.sessionNumber, req.query.className, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result[0]);
            }
      });
});

Attendace.get('/attendance/studentAttendance', (req, res) =>
{
      getstudentAttendance(req.query.sessionNumber, req.query.className, req.query.ID, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result[0]);
            }
      });
});

Attendace.get('/attendance/teacherAttendance', (req, res) =>
{
      getTeacherAttendance(req.query.sessionNumber, req.query.className, req.query.ID, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result[0]);
            }
      });
});

Attendace.post('/attendance/teacherUpdate', (req, res) =>
{
      teacherUpdateAttendace(req.body.params.sessionNumber, req.body.params.className, req.body.params.id, req.body.params.status, req.body.params.note, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result);
            }
      });
});

Attendace.post('/attendance/supervisorUpdate', (req, res) =>
{
      supervisorUpdateAttendace(req.body.params.sessionNumber, req.body.params.className, req.body.params.id, req.body.params.status, req.body.params.note, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result);
            }
      });
});

Attendace.post('/attendance/classNote', (req, res) =>
{
      updateClassNote(req.body.params.sessionNumber, req.body.params.className, req.body.params.note, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result);
            }
      });
});

export default Attendace;