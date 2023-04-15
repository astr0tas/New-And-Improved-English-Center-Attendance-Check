import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
// import { useEffect } from 'react';

import './App.css';
// import UserContext from './pages/General/UserContext.jsx';
import { SignInAs, SignIn } from './pages/SignIn/SignIn.jsx';
// import User from './pages/User/User.jsx';
// import Students from './pages/Admin/Students/Student.jsx';
import { NavBar } from './pages/NavBar/NavBar.jsx';
import { MyClasses } from './pages/T_S/MyClass';
import ClassDetail from './pages/T_S/ClassDetail';
import Attendance from './pages/T_S/Attendace';


function App()
{
  // const [user, setUser] = useState({ user: null, position: "" });
  const [isNavBar, setNavBar] = useState(false);

  // useEffect(() =>
  // {
  //   const savedUser = localStorage.getItem('user');
  //   if (savedUser)
  //   {
  //     setUser(JSON.parse(savedUser));
  //   }
  //   setNavBar(localStorage.getItem('navbar'));

  // }, []);

  return (
    <div className="App">
      {/* <UserContext.Provider value={ { user, setUser } }> */ }
      <BrowserRouter>
        {/* { isNavBar && <NavBar /> } */ }
        <Routes>
          <Route path='/' element={ <SignInAs /> } />
          <Route path='/SignIn' element={ <SignIn onNavBar={ () => setNavBar(true) } /> } />
          <Route element={ <NavBar /> }>
            {/* <Route path={ user.position + '/User' } element={ <User /> } />
          <Route path={ user.position + '/Students' } element={ <Students /> } /> */}
            <Route path="/Home" />
            <Route>
              <Route path={ `/MyClasses` } element={ <MyClasses /> } />
              <Route path={ `/MyClasses/:name` } element={ <ClassDetail name="" /> } />
              <Route path={ `/MyClasses/:name/:session` } element={ <Attendance /> } />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      {/* </UserContext.Provider> */ }
    </div>
  );
}

export default App;
