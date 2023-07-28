import express from "express";
import { Class } from '../model/staff/class.js';
import CryptoJS from 'crypto-js';
import { key } from '../AESKeyGenerator.js';

function encryptWithAES(data)
{
      if (data === null || data === undefined || data === '' || data === 'null' || data === 'undefined') return null;
      const string = JSON.stringify(data);
      const result = CryptoJS.AES.encrypt(JSON.stringify(string), key).toString();
      return result;
}

function decryptWithAES(data)
{
      if (data === null || data === undefined || data === '' || data === 'null' || data === 'undefined') return null;
      const bytes = CryptoJS.AES.decrypt(data, key);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (decryptedData === null || decryptedData === undefined || decryptedData === '' || decryptedData === 'null' || decryptedData === 'undefined') return null;
      return JSON.parse(decryptedData);
}

const staffRoutes = express.Router();

const classModel = new Class();
staffRoutes.post('/classList', (req, res) =>
{
      const data = decryptWithAES(req.body.data);
      const name = data.params.name;
      const limit = data.params.limit;
      const userType = data.params.userType;
      const offset = data.params.offset;
      const status = data.params.status;
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
                        res.status(204).send(encryptWithAES({ message: 'No class found in the database!' }));
                  else
                        res.status(200).send(encryptWithAES(result));
            }
      })
});

export default staffRoutes;