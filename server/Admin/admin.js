import express from "express";

import { getUser, updateInfo, getNewID, getRooms, getPeriod } from "./query.js";

const adminRoutes = express.Router();

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
    await updateInfo(data.ssn, data.address, data.birthday, data.birthplace, data.email, data.phone);
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
