import express from "express";
import { Class } from '../model/staff/class.js';
import CryptoJS from 'crypto-js';
import { key } from '../keyGenerator.js';

function encryptWithAES(data)
{
      const string = JSON.stringify(data);
      return CryptoJS.AES.encrypt(JSON.stringify(string), key).toString();
}

const staffRoutes = express.Router();

const classModel = new Class();

export default staffRoutes;