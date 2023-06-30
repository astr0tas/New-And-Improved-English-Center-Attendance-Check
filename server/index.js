import session from "express-session";
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import FileStoreFactory from 'session-file-store';

import { domain } from "./domain.js";

import staffRoutes from "./controller/staff.js";
import adminRoutes from "./controller/admin.js";
import generalRoutes from "./controller/general.js";

const FileStore = FileStoreFactory(session);

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
      saveUninitialized: true,
      cookie: {
            secure: false,
            httpOnly: false,
            maxAge: 3600000 * 24 * 3,
      },
      name: 'userID'
}));

app.use('/admin', adminRoutes);
app.use('/', generalRoutes);
app.use('/staff', staffRoutes);


app.listen(8080, () => { console.log("Server is listening on port 8080"); });