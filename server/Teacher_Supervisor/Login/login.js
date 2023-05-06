import express from "express";
import bodyParser from "body-parser";

import { validateTSLoginInfo } from "./query.js";

const TSLogin = express.Router();

TSLogin.use(bodyParser.json());

TSLogin.post('/login', (req, res) =>
{
      const account = req.body.params.account;
      const password = req.body.params.password;
      validateTSLoginInfo(account, password, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result);
            }
      });
});

export default TSLogin;