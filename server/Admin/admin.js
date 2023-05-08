import express from "express";

import { getUser, updateInfo, getNewID, getRooms, getPeriod, pieChartDaily, pieChartWeekly, pieChartMonthly, lineChartDaily, lineChartWeekly, lineChartMonthly, statsClass, late10Student, absent5Student} from "./query.js";

const adminRoutes = express.Router();

adminRoutes.get('/pieChart', async (req, res) => {
    const daily =  await pieChartDaily();
    const weekly = await pieChartWeekly();
    const monthly = await pieChartMonthly();
    res.json({
        daily: daily,
        weekly: weekly,
        monthly: monthly
    });
})

adminRoutes.get('/barChart', async (req, res) => {
    const daily =  await lineChartDaily();
    const weekly = await lineChartWeekly();
    const monthly = await lineChartMonthly();
    res.json({
        daily: daily,
        weekly: weekly,
        monthly: monthly
    });
})


adminRoutes.get('/stats', async (req, res) => {
    const worstClass = await statsClass(0), lateClass = await statsClass(1), bestClass = await statsClass(2);
    const absentStudent = await absent5Student(), lateStudent = await late10Student();

    res.json({
        bestClass: bestClass.map(obj => obj.Class_name).join(', '),
        worstClass: worstClass.map(obj => obj.Class_name).join(', '),
        lateClass: lateClass.map(obj => obj.Class_name).join(', '),
        absentStudent: absentStudent.map(obj => obj.Student_ID).join(', '),
        lateStudent: lateStudent.map(obj => obj.Student_ID).join(', ')
    }
    );
})

adminRoutes.get('/user/:account', async (req, res) =>
{
    const account = req.params.account
    const user = await getUser(account);
    res.json(user);
});

adminRoutes.get('/newID/:id', async (req, res) =>
{
    const [id] = await getNewID(req.params.id);
    res.json(id);
});

adminRoutes.post('/user/:account', async (req, res) =>
{
    let data = req.body;
    await updateInfo(data.id, data.address, data.birthday, data.birthplace, data.email, data.phone);
    res.send("update user information successfully");
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

adminRoutes.post('/getPeriod', async (req, res) =>
{
    const data = req.body.params;
    const result = await getPeriod(data.dow, data.room, data.start, data.end);
    res.json(result);
})



export default adminRoutes;
