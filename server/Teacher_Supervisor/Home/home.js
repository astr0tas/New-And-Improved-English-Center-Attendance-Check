import express from "express";

import { getTodaySession, getMissed } from './query.js';

const StaffHomeAPI = express.Router();

StaffHomeAPI.get('/getTodaySession', (req, res) =>
{
      getTodaySession(req.query.id, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving data from database.');
            else
            {
                  res.status(200).send(result);
            }
      });
});

StaffHomeAPI.get('/getMissed', (req, res) =>
{
      getMissed((err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving data from database.');
            else
            {
                  res.status(200).send(result);
            }
      });
});

export default StaffHomeAPI;