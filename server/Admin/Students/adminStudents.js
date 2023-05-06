import express from "express";
import { newStudent, getStudents, getStudent} from "./query.js"

const adminStudents = express.Router();

adminStudents.get('/students', async (req, res) =>
{
    const students = await getStudents();
    res.json(students);
});

adminStudents.post('/new/student', async (req, res) =>
{
    let data = req.body;
    await newStudent(data.name, data.phone, data.birthday, data.birthplace, data.email, data.address, data.classes);
    res.send("add new student successfully");
})

export default adminStudents;