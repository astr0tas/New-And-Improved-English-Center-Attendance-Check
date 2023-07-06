import express from "express";
import { Class } from '../model/admin/class.js';
import { Staff } from "../model/admin/staff.js";
import { Student } from "../model/admin/student.js";


const adminRoutes = express.Router();

const classModel = new Class();

adminRoutes.post('/classList', (req, res) =>
{
      const name = req.body.params.name;
      classModel.getList(name, (result, err) =>
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


export default adminRoutes;