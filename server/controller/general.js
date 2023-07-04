import express from "express";
import { Authentication } from "../model/authentication.js";
import { Profile } from "../model/profile.js";
import { AdminHome } from "../model/admin/home.js";
import { StaffHome } from '../model/staff/home.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
                  res.status(500).send('Server internal error!');
            }
            else
            {
                  if (result.length > 1)
                        res.status(400).send("Username and password duplicated!");
                  else if (result.length === 0)
                        res.status(200).send(false);
                  else
                  {
                        req.session.userID = result[0].ID;
                        req.session.userType = type;
                        req.session.save(() =>
                        {
                              // Session saved
                              res.status(200).send(true);
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
                  res.status(200).send('Logged out successfully!');

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
            res.status(200).send([true, req.session.userType]);
      else
            res.status(200).send([false]);
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send('Success');
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
                  res.status(500).send('Server internal error!');
            }
            else
            {
                  if (result.length)
                        res.status(200).send(true);
                  else
                        res.status(200).send(false);
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
                  res.status(500).send('Server internal error!');
            }
            else
                  res.status(200).send(result[0]);
      });
});

generalRoutes.post('/updateProfile', (req, res) =>
{
      const id = req.session.userID;
      console.log(req, id);
      // profileModel.updateInfo(id, (result, err) =>
      // {
      //       if (err)
      //       {
      //             console.log(err);
      //             res.status(500).send('Server internal error!');
      //       }
      //       else
      //             res.status(200).send(result[0]);
      // });
});

const adminHomeModel = new AdminHome();

const staffHomeModel = new StaffHome();

export default generalRoutes;