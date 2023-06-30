import express from "express";
import { Authentication } from "../model/authentication.js";

const model = new Authentication();

const generalRoutes = express.Router();

generalRoutes.post('/', (req, res) =>
{
      const username = req.body.params.username;
      const password = req.body.params.password;
      const type = req.body.params.type;
      model.login(username, password, (result, err) =>
      {
            if (err)
                  res.status(500).send('Server internal error!');
            else
            {
                  if (result.length > 1)
                        res.status(400).send("Username and password duplicated!");
                  else if (result.length === 0)
                        res.status(200).send(false);
                  else
                  {
                        res.cookie('userType', type === 1 ? 'admin' : (type === 2 ? 'teacher' : 'supervisor'), {
                              httpOnly: false,
                              secure: false,
                              maxAge: 3600000 * 24 * 3,
                        });
                        req.session.userID = result[0].ID;
                        res.status(200).send(true);
                  }
            }
      })
});

generalRoutes.get('/logout', (req, res) =>
{
      req.session.destroy((err) =>
      {
            if (err)
                  console.error('Error destroying session:', err);
            else
            {
                  res.clearCookie('userID');
                  res.clearCookie('userType');
                  res.status(200).send('Logged out successfully!');
            }
      });
});

generalRoutes.post('/recovery', (req, res) =>
{
      const username = req.body.params.username;
      const password = req.body.params.password;
      model.recovery(username, password, (result, err) =>
      {
            if (err)
                  res.status(500).send('Server internal error!');
            else
                  res.status(200).send('Success');
      })
});

generalRoutes.post('/validateUser', (req, res) =>
{
      const username = req.body.params.username;
      model.validateUser(username, (result, err) =>
      {
            if (err)
                  res.status(500).send('Server internal error!');
            else
            {
                  if (result.length)
                        res.status(200).send(true);
                  else
                        res.status(200).send(false);
            }
      })
});

export default generalRoutes;