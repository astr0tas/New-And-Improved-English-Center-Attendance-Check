import express from "express";
import { Class } from '../model/staff/class.js';
import CryptoJS from 'crypto-js';
import { key } from '../keyGenerator.js';

function encryptWithAES(data)
{
      const string = JSON.stringify(data);
      const result = CryptoJS.AES.encrypt(JSON.stringify(string), key).toString();
      return result;
}

function decryptWithAES(data)
{
      const bytes = CryptoJS.AES.decrypt(data, key);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
}

const staffRoutes = express.Router();

const classModel = new Class();

export default staffRoutes;