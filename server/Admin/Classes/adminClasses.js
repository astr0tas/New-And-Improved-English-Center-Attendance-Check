import express from "express";
import {getClassesForStudent, getClasses, getClassesOfStudent, getNotClassesOfStudent, getNotClassesOfStaff, getClassInfo, changeClass, newClassForID} from "./query.js";

const adminClasses = express.Router();

adminClasses.get('/classesForStudent', async (req, res) => {
    const classes = await getClassesForStudent();
    res.json(classes);
});

adminClasses.get('/classes', async (req, res) =>
{
    const classes = await getClasses();
    res.json(classes);
});

adminClasses.get('/:id/classes', async (req, res) =>
{
    const sClasses = await getClassesOfStudent(req.params.id);
    res.json(sClasses);
})

adminClasses.get('/:id/notclasses', async (req, res) =>
{
    if (req.params.id.includes('STUDENT')){
        const sClasses = await getNotClassesOfStudent(req.params.id);
        res.json(sClasses);
    }
    else{
        const sClasses = await getNotClassesOfStaff(req.params.id);
        res.json(sClasses);
    }
})

adminClasses.get('/class/:name', async (req, res) =>
{
    const classInfo = await getClassInfo(req.params.name);
    res.json(classInfo);
})

adminClasses.post('/:id/classes', async (req, res) =>
{
    let data = req.body;
    await changeClass(data.id, data.old, data.new);
    res.send("update sucessfully");
})

adminClasses.post('/:id/newClasses', async (req, res) =>
{
    let data = req.body;
    await newClassForID(data.id, data.classes);
    res.send("add new class to student successfully");
})

export default adminClasses;