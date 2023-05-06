import express from "express";
import { getSupervisors, getTeachers, newStaff, availableClassForStaff, availableSessionForStaff} from './query.js';

const adminStaffs = express.Router();

adminStaffs.get('/supervisors', async (req, res) =>
{
    const supervisors = await getSupervisors();
    res.json(supervisors);
});

adminStaffs.get('/teachers', async (req, res) =>
{
    const teachers = await getTeachers();
    res.json(teachers);
});

adminStaffs.get('/availableClassForStaff', async (req, res) =>{
    const classes = await availableClassForStaff(req.body.role);
    res.json(classes);
});

adminStaffs.get('/availableSessionForStaff', async (req, res) =>{
    const sessions = await availableSessionForStaff(req.query.role, req.query.className);
    res.json(sessions);
});

adminStaffs.post('/new/staff', async (req, res) =>
{
    let data = req.body;
    await newStaff(data.name, data.phone, data.birthday, data.birthplace, data.email, data.address, data.classes, data.role);
    res.send("add new " +  data.role +  " successfully");
});



export default adminStaffs;