import express from "express";

import { getClassList, getClassDetail, getCurrentStudent, getSessions, getStudentList, getSessionList } from "./query.js";
const MyClassAPI = express.Router();

MyClassAPI.get('/myClasses', (req, res) =>
{
      getClassList(req.query.id, req.query.offset, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving data from database.');
            else
            {
                  res.status(200).send(result);
            }
      });
});
      
MyClassAPI.get('/myClasses/getCurrentStudent', (req, res) =>
{
      getCurrentStudent(req.query.className, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving data from database.');
            else
            {
                  res.status(200).send(result[0]);
            }
      });
});

MyClassAPI.get('/myClasses/detail', (req, res) =>
{
      getClassDetail(req.query.className, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving data from database.');
            else
            {
                  res.status(200).send(result[0]);
            }
      });
});

MyClassAPI.get('/myClasses/getSessions', (req, res) =>
{
      getSessions(req.query.className, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving data from database.');
            else
            {
                  res.status(200).send(result[0]);
            }
      });
});

MyClassAPI.get('/myClasses/getStudentList', (req, res) =>
{
      getStudentList(req.query.className, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving data from database.');
            else
            {
                  res.status(200).send(result);
            }
      });
});

MyClassAPI.get('/myClasses/getSessionList', (req, res) =>
{
      getSessionList(req.query.className, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving data from database.');
            else
            {
                  res.status(200).send(result);
            }
      });
});

export default MyClassAPI;