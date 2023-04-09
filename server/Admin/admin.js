import express from "express";
import {getEmployees, getStudents, getStudent, getUser, getClasses} from "./query.js";

const adminRoutes = express.Router();

adminRoutes.get('/students', async (req, res) => {
    const students = await getStudents();
    res.json(students);
});

adminRoutes.get('/user/:account', async (req, res) => {
    const account = req.params.account
    const user = await getUser(account);
    res.json(user);
});

adminRoutes.get('/classes', async (req, res) => {
    const classes = await getClasses();
    res.json(classes);
});

// adminRoutes.post()

adminRoutes.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

export default adminRoutes;
