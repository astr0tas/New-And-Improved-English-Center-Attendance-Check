import {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import AddClass from './pages/Admin/Classes/addClass';

import AdminClassDetail from './pages/Admin/Classes/detail';
import AdminAttendance from './pages/Admin/Classes/classAttendance';
import AddSession from './pages/Admin/Classes/addSession';
import AddStudent from './pages/Admin/Classes/addStudent';
import StaffHome from './pages/T_S/Home/home';

import { SignInAs, SignIn } from './pages/SignIn/SignIn.jsx';

import Classes from './pages/Admin/Classes/Classes';
import Staffs from './pages/Admin/Staffs/Staffs.jsx';

import { NavBar } from './pages/NavBar/NavBar.jsx';
import { MyClasses } from './pages/T_S/MyClass';
import ClassDetail from './pages/T_S/ClassDetail';
import Attendance from './pages/T_S/Attendace';

import Home from './pages/Home/Home.jsx';
import User from './pages/User/User.jsx';
import Students from './pages/Admin/Students/Student.jsx';


function App()
{

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <SignInAs /> } />
          <Route path='/SignIn' element={ <SignIn /> } />
          <Route element={ <NavBar /> }>
            <Route path={ '/User' } element={ <User /> } />
            <Route path={ '/Students' } element={ <Students /> } />
            <Route path={ '/Classes' } element={ <Classes /> } />
            <Route path='/Classes/:name' element={ <AdminClassDetail /> } />
            <Route path='/Classes/:name/addSession' element={ <AddSession /> } />
            <Route path='/Classes/:name/addStudent' element={ <AddStudent /> } />
            <Route path='/Classes/:name/:session' element={ <AdminAttendance /> } />
            <Route path='/Classes/AddClass' element={ <AddClass /> } />
            <Route path={ '/Staffs' } element={ <Staffs /> } />
            <Route path="/Home" element={ <Home /> }/>
            <Route>
              <Route path={ `/MyClasses` } element={ <MyClasses /> } />
              <Route path={ `/MyClasses/:name` } element={ <ClassDetail name="" /> } />
              <Route path={ `/MyClasses/:name/:session` } element={ <Attendance /> } />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
