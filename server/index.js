import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";

import { domain } from "./domain";

const app = express();
app.use(cors({
      origin: domain,
      methods: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());


app.listen(8080, () => { console.log("Server is listening on port 8080"); });