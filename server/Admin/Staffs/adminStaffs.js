import express from "express";
import { getSupervisors, getTeachers, newStaff, availableClassForStaff, availableSessionForStaff, updateInfo} from './query.js';

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
    await newStaff(data.name, data.ssn, data.phone, data.birthday, data.birthplace, data.email, data.address, data.classes, data.role);
    res.send("add new " +  data.role +  " successfully");
});

adminStaffs.post('/staff/updateInfo/:id', async (req, res) =>
{
    let data = req.body;
    await updateInfo(data.id, data.name, data.address, data.birthday, data.birthplace, data.email, data.phone);
    res.send("update staff information successfully");
})


export default adminStaffs;