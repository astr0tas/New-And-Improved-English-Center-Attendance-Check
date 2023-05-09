import express from "express";
import { newStudent, getStudents, getStudent, updateInfo, statsStudent} from "./query.js"

const adminStudents = express.Router();

adminStudents.get('/students', async (req, res) =>
{
    const students = await getStudents();
    res.json(students);
});

adminStudents.get('/student/:id', async (req, res) =>
{
    const student = await getStudent(req.params.id);
    res.json(student);
});

adminStudents.get('/student/stats/:id/:classname', async (req, res) =>
{
    const student = await statsStudent(req.params.id, req.params.classname);
    res.json(student);
});

adminStudents.post('/new/student', async (req, res) =>
{
    let data = req.body;
    await newStudent(data.name, data.ssn, data.phone, data.birthday, data.birthplace, data.email, data.address, data.classes);
    res.send("add new student successfully");
})

adminStudents.post('/student/updateInfo/:id', async (req, res) =>
{
    let data = req.body;
    await updateInfo(data.id, data.name, data.address, data.birthday, data.birthplace, data.email, data.phone);
    res.send("update student information successfully");
})

export default adminStudents;