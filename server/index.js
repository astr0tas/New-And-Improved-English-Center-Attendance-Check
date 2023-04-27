import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';

import adminRoutes from './Admin/admin.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/admin', adminRoutes);

app.listen(3030, () => {console.log("Server is listening on port 3030");});