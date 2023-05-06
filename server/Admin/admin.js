import express from "express";
import { getEmployees } from './query.js';
import
{
    newStudent, getStudents, getStudent,
    getClasses, getNewID, getClassesOfStudent,
    getNotClassesOfStudent, getClassInfo, changeClass,
    getTeachers, getRooms, getPeriod,
    addClass, deleteStudent, deactivateClass,
    activateClass, cancelSession, activateSession,
    getClassTeachers, countSession, getSessions,
    supervisor, times, getSuitableRoom, createNewSession,
    searchByName, searchBySSN, addStudentToClass,
    replaceTeacher, replaceSupervisor
} from "./query.js";

import { getUser, updateInfo } from "./query.js";

const adminRoutes = express.Router();


adminRoutes.get('/students', async (req, res) =>
{
    const students = await getStudents();
    res.json(students);
});

adminRoutes.get('/user/:account', async (req, res) =>
{
    const account = req.params.account
    const user = await getUser(account);
    res.json(user);
});

adminRoutes.get('/classes', async (req, res) =>
{
    const classes = await getClasses();
    res.json(classes);
});

adminRoutes.get('/newID', async (req, res) =>
{
    // const [id] = await getNewID();
    // res.json(id);
});

adminRoutes.get('/class/:name', async (req, res) =>
{
    const classInfo = await getClassInfo(req.params.name);
    res.json(classInfo);
})

adminRoutes.get('/:id/classes', async (req, res) =>
{
    const sClasses = await getClassesOfStudent(req.params.id);
    res.json(sClasses);
})

adminRoutes.get('/:id/notclasses', async (req, res) =>
{
    const sClasses = await getNotClassesOfStudent(req.params.id);
    res.json(sClasses);
})

adminRoutes.post('/:id/classes', async (req, res) =>
{
    let data = req.body;
    await changeClass(data.id, data.old, data.new);
    res.send("update sucessfully");
})

adminRoutes.post('/user/:account', async (req, res) =>
{
    let data = req.body;
    await updateInfo(data.ssn, data.address, data.birthday, data.birthplace, data.email, data.phone);
    res.send("update user information successfully");
})

adminRoutes.post('/new/student', async (req, res) =>
{
    let data = req.body;
    await newStudent(data.name, data.phone, data.birthday, data.birthplace, data.email, data.address, data.classes);
    res.send("add new student successfully");
})

// app.post('/', (req, res) => {
//     let data = req.body;
//     res.send('Data Received: ' + JSON.stringify(data));
// })

adminRoutes.use((err, req, res, next) =>
{
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

adminRoutes.get('/rooms', async (req, res) =>
{
    const rooms = await getRooms();
    res.json(rooms);
});

adminRoutes.get('/teachers', async (req, res) =>
{
    const teachers = await getTeachers();
    res.json(teachers);
});

adminRoutes.post('/getPeriod', async (req, res) =>
{
    const data = req.body.params;
    const result = await getPeriod(data.dow, data.room, data.start, data.end);
    res.json(result);
})

adminRoutes.post('/addClass', async (req, res) =>
{
    const data = req.body.params;
    const result = await addClass(data.name, data.startDate, data.endDate, data.timeTable, data.room, data.teachers,data.supervisor);
    res.json(result);
})

adminRoutes.post('/deleteStudent', async (req, res) =>
{
    const data = req.body.params;
    const result = await deleteStudent(data.id, data.class);
    res.json(result);
})

adminRoutes.post('/activateClass', async (req, res) =>
{
    const data = req.body.params;
    const result = await activateClass(data.name);
    res.json(result);
})

adminRoutes.post('/deactivateClass', async (req, res) =>
{
    const data = req.body.params;
    const result = await deactivateClass(data.name);
    res.json(result);
})

adminRoutes.post('/cancelSession', async (req, res) =>
{
    const data = req.body.params;
    const result = await cancelSession(data.className, data.sessionNumber);
    res.json(result);
})

adminRoutes.post('/activateSession', async (req, res) =>
{
    const data = req.body.params;
    const result = await activateSession(data.className, data.sessionNumber);
    res.json(result);
})

adminRoutes.post('/getClassTeachers', async (req, res) =>
{
    const data = req.body.params;
    const result = await getClassTeachers(data.name);
    res.json(result);
})

adminRoutes.post('/countSession', async (req, res) =>
{
    const data = req.body.params;
    const result = await countSession(data.name);
    res.json(result);
})

adminRoutes.post('/getSessions', async (req, res) =>
{
    const data = req.body.params;
    const result = await getSessions(data.name);
    res.json(result);
})

adminRoutes.get('/supervisor', async (req, res) =>
{
    const result = await supervisor();
    res.json(result);
})


adminRoutes.post('/times', async (req, res) =>
{
    const data = req.body.params;
    const result = await times(data.room, data.date);
    res.json(result);
})

adminRoutes.post('/getRooms', async (req, res) =>
{
    const data = req.body.params;
    const result = await getSuitableRoom(data.name);
    res.json(result);
})

adminRoutes.post('/createNewSession', async (req, res) =>
{
    const data = req.body.params;
    const result = await createNewSession(data.name, data.newSession, data.room, data.date, data.time, data.session, data.teacher, data.supervisor);
    res.json(result);
})

adminRoutes.post('/searchByName', async (req, res) =>
{
    const data = req.body.params;
    const result = await searchByName(data.name);
    res.json(result);
})

adminRoutes.post('/searchBySSN', async (req, res) =>
{
    const data = req.body.params;
    const result = await searchBySSN(data.ssn);
    res.json(result);
})

adminRoutes.post('/addStudentToClass', async (req, res) =>
{
    const data = req.body.params;
    const result = await addStudentToClass(data.id, data.name);
    res.json(result);
})

adminRoutes.post('/replaceTeacher', async (req, res) =>
{
    const data = req.body.params;
    const result = await replaceTeacher(data.session, data.name, data.id);
    res.json(result);
})

adminRoutes.post('/replaceSupervisor', async (req, res) =>
{
    const data = req.body.params;
    const result = await replaceSupervisor(data.session, data.name, data.id);
    res.json(result);
})

export default adminRoutes;
