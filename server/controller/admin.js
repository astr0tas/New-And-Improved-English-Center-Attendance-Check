import express from "express";
import { Class } from '../model/admin/class.js';
import { Staff } from "../model/admin/staff.js";
import { Student } from "../model/admin/student.js";


const adminRoutes = express.Router();

const classModel = new Class();

const staffModel = new Staff();

const studentModel = new Student();


export default adminRoutes;