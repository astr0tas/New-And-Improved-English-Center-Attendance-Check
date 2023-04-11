import express from "express";
import cors from "cors";
import adminRoutes from './Admin/admin.js';
import TSLogin from "./Teacher_Supervisor/Login/login.js";

const app = express();
app.use(cors());

app.use('/admin', adminRoutes);


app.use('/TS', TSLogin);

app.listen(3030, () => { console.log("Server is listening on port 3030"); });