import express from "express";
// import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";

import { getSessionDetail, getTeacher, getSupervisor } from "./query.js";

const Attendace = express.Router();

// Attendace.use(bodyParser.json());
// Attendace.use(cookieParser())


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

export default Attendace;