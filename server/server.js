import express from "express";
import cors from "cors";
import {getEmployees, getStudents, getStudent, getUser, getClasses} from "./query.js";

const app = express();

app.use(cors());

app.get('/api/students', async (req, res) => {
    const students = await getStudents();
    res.json(students);
});

app.get('/api/user/:account', async (req, res) => {
    const account = req.params.account
    const user = await getUser(account);
    res.json(user);
});

app.get('/api/classes', async (req, res) => {
    const classes = await getClasses();
    res.json(classes);
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(3030, () => {console.log("Server is listening on port 3030");});
