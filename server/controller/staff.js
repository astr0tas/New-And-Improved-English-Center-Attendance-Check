import express from "express";
import { Class } from '../model/staff/class.js';
const staffRoutes = express.Router();

const classModel = new Class();

export default staffRoutes;