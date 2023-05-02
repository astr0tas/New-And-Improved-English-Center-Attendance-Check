import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AddClass from './pages/Admin/Classes/addClass';
import { SignInAs, SignIn } from './pages/SignIn/SignIn.jsx';
import { NavBar } from './pages/NavBar/NavBar.jsx';
import { MyClasses } from './pages/T_S/MyClass';
import ClassDetail from './pages/T_S/ClassDetail';
import Attendance from './pages/T_S/Attendace';


function App()
{

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" >
            <Route index element={ <SignInAs /> } />
            <Route path='/SignIn' element={ <SignIn /> } />
            <Route element={ <NavBar /> }>
              {/* <Route path={ user.position + '/User' } element={ <User /> } />
          <Route path={ user.position + '/Students' } element={ <Students /> } /> */}
              <Route path="/Home" />
              <Route>
                <Route path={ `/MyClasses` } element={ <MyClasses /> } />
                <Route path={ `/MyClasses/:name` } element={ <ClassDetail name="" /> } />
                <Route path={ `/MyClasses/:name/:session` } element={ <Attendance /> } />
              </Route>
              <Route path='AddClass' element={ <AddClass /> } />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
