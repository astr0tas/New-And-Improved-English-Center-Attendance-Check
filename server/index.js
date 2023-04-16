import express from "express";
import cors from "cors";
import adminRoutes from './Admin/admin.js';
import TSLogin from "./Teacher_Supervisor/Login/login.js";
import MyClassAPI from "./Teacher_Supervisor/Class/class.js";
import Attendace from "./Teacher_Supervisor/Attendace/attendance.js";


const app = express();
app.use(cors());

app.use('/admin', adminRoutes);


app.use('/TS', TSLogin);
app.use('/TS', MyClassAPI);
app.use('/TS', Attendace);

app.listen(3030, () => { console.log("Server is listening on port 3030"); });