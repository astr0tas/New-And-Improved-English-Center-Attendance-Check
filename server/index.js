import TSLogin from "./Teacher_Supervisor/Login/login.js";
import MyClassAPI from "./Teacher_Supervisor/Class/class.js";
import StaffHomeAPI from "./Teacher_Supervisor/Home/home.js";
import Attendace from "./Teacher_Supervisor/Attendace/attendance.js";
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';

import adminRoutes from './Admin/admin.js';
import adminClasses from './Admin/Classes/adminClasses.js';
import adminStaffs from './Admin/Staffs/adminStaffs.js';
import adminStudents from './Admin/Students/adminStudents.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.use('/admin', adminRoutes);
app.use('/admin', adminClasses);
app.use('/admin', adminStaffs);
app.use('/admin', adminStudents);


app.use('/TS', TSLogin);
app.use('/TS', MyClassAPI);
app.use('/TS', Attendace);
app.use('/TS', StaffHomeAPI);

app.listen(3030, () => { console.log("Server is listening on port 3030"); });