import express from "express";
import { Class } from '../model/staff/class.js';

const staffRoutes = express.Router();

const classModel = new Class();
staffRoutes.post('/classList', (req, res) =>
{
      const name = req.body.params.name;
      const limit = req.body.params.limit;
      const userType = req.body.params.userType;
      const offset = req.body.params.offset;
      const status = req.body.params.status;
      const id = req.session.userID;
      classModel.classList(name, limit, userType, offset, status, id, (result, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500).send({ message: 'Server internal error!' });
            }
            else
            {
                  if (!result.length)
                        res.status(204).send({ message: 'No class found in the database!' });
                  else
                        res.status(200).send(result);
            }
      })
});

export default staffRoutes;