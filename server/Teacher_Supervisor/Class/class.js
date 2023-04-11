import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";


import { getClassList } from "./query.js";
const MyClassAPI = express.Router();

MyClassAPI.use(cookieParser())
// MyClassAPI.use(bodyParser.json());

MyClassAPI.get('/myClasses', (req, res) =>
{
      // console.log(req);
      getClassList(req.cookies.id,req.query.offset, (err, result) =>
      {
            if (err)
                  res.status(500).send('Error retrieving user from database.');
            else
            {
                  res.status(200).send(result);
            }
      });
});

export default MyClassAPI;