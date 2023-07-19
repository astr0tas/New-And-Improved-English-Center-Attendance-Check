import express from "express";
import { Class } from '../model/staff/class.js';
import CryptoJS from 'crypto-js';
import { key } from '../keyGenerator.js';

function encryptWithAES(data)
{
      if (data === null || data===undefined || data==='' || data==='null' || data==='undefined') return null;
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

export default staffRoutes;