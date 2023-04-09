import express from "express";
import cors from "cors";
import adminRoutes from './Admin/admin.js';

const app = express();
app.use(cors());

app.use('/admin', adminRoutes);

app.listen(3030, () => {console.log("Server is listening on port 3030");});