import session from "express-session";
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import FileStoreFactory from 'session-file-store';
import path from 'path';
import { fileURLToPath } from 'url';
import { domain } from "./domain.js";
import { key, updateKey } from './AESKeyGenerator.js';
import NodeRSA from "node-rsa";
import { IDValidation } from './IDValidation.js';

import staffRoutes from "./controller/staff.js";
import adminRoutes from "./controller/admin.js";
import generalRoutes from "./controller/general.js";

import { updatStatusRegularly } from './model/updateStatus.js';

export const FileStore = FileStoreFactory(session);

const validation = new IDValidation();
let timer;

const app = express();
app.use(cors({
      origin: `http://${ domain }`,
      methods: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(session({
      store: new FileStore({
            path: './model/sessions',
      }),
      secret: 'englishcenter123',
      resave: false,
      saveUninitialized: false,
      cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 3600000 * 24 * 3,
      },
      name: 'userID'
}));

app.use((req, res, next) =>
{
      const contentType = req.get('Content-Type');
      const authorization = req.header('Authorization');

      console.log('Content-Type:', contentType);
      console.log('Authorization:', authorization);

      // Check if it is a GET request
      if (req.method === 'GET')
      {
            // Allow undefined or null Content-Type
            if (contentType !== undefined && contentType !== null)
            {
                  return res.status(400).send({ message: 'Invalid Content-Type' });
            }
      }
      else
      {
            // Verify the Content-Type header for other request methods (only POST requests are used in this project)
            if (contentType !== 'application/json' && !contentType.includes('multipart/form-data'))
            {
                  return res.status(400).send({ message: 'Invalid Content-Type' });
            }
      }

      // Verify the Authorization header (not needed for this project)
      // if (!authorization)
      // {
      //       return res.status(401).send('Authorization header is missing');
      // }

      // Perform any other necessary verification steps here

      // If all verification steps pass, proceed to the API endpoint
      next();
});

app.post('/getKey', (req, res) =>
{
      console.log('Key fetched!');
      if (!req.session.userID)
            res.status(403).send({ message: 'No key for you!' });
      else
            validation.validateID(req.session.userID, (result, err) =>
            {
                  if (err)
                  {
                        console.log(err);
                        res.status(500).send({ message: 'Server internal error!' });
                  }
                  else
                  {
                        if (result)
                        {
                              clearTimeout(timer);
                              const keys = new NodeRSA(req.body.params.key, 'public', { encryptionScheme: 'pkcs1' });
                              const encryptedKey = keys.encrypt(key, 'base64');
                              res.status(200).send({ key: encryptedKey });
                              timer = updateKey();
                        }
                        else
                              res.status(403).send({ message: 'No key for you!' });
                  }
            });
});

app.use('/admin', adminRoutes);
app.use('/', generalRoutes);
app.use('/staff', staffRoutes);

app.use('/image/employee', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'model', 'image', 'employee')));
app.use('/image/student', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'model', 'image', 'student')));

const updateFunction = (conn) =>
{
      conn.liveFunction((res, err) =>
      {
            if (err)
                  console.log(err);
            else
                  console.log('Sessions status updated!');
      });
      setTimeout(() => updateFunction(conn), 30000);
}

app.listen(8080, () =>
{
      console.log("Server is listening on port 8080");

      const conn = new updatStatusRegularly();
      updateFunction(conn);
});