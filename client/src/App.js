import './App.css';
import { NavLink, Route, Routes } from "react-router-dom";

// General routes
import Login from './components/General/Authentication/Login/Login';
import Recovery from './components/General/Authentication/Recovery/Recovery';
import Menu from './components/General/Menu/Menu';
import Home from './components/General/Home/Home';
import Profile from './components/General/Profile/Profile';

// Admin routes
import ClassList from './components/Admin/Class/List/ClassList';
import ClassDetail from './components/Admin/Class/Detail/ClassDetail';
import AdminClassSession from './components/Admin/Class/Session/SessionDetail';

import StaffList from './components/Admin/Staff/List/StaffList';
import StaffDetail from './components/Admin/Staff/Detail/StaffDetail'

import StudentList from './components/Admin/Student/List/StudentList';
import StudentDetail from './components/Admin/Student/Detail/StudentDetail'

// Staff routes
import MyClassList from './components/Staff/MyClass/List/MyClassList';
import MyClassDetail from './components/Staff/MyClass/Detail/MyClassDetail';
import MyClassSession from './components/Staff/MyClass/Session/Session';

const NotFound = () =>
{
  document.title = "Page not found";
  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <p className='text-center' style={ { fontSize: '10rem' } }>404</p>
      <h1 className='text-center' style={ { fontSize: '2rem' } }>Ooops, page not found</h1>
      <p className='mb-0 text-center'>The page you are looking for does not exist on the server or an error has occurred.</p>
      <p className='text-center'>Go back to <NavLink to='/home'>Home</NavLink> page</p>
    </div>
  )
}


function App()
{
  return (
    <div className="App">
      <Routes>
        {/* Authentication */ }
        <Route index element={ <Login /> } />
        <Route path='recovery' element={ <Recovery /> } />
        {/* Main routes */ }
        <Route element={ <Menu /> }>
          {/* General profile */ }
          <Route path='profile' element={ <Profile /> } />
          {/* General home */ }
          <Route path='home' element={ <Home /> } />
          {/* Admin routes */ }
          <Route path='class-list'>
            <Route index element={ <ClassList /> } />
            <Route path='detail/:name'>
              <Route index element={ <ClassDetail /> } />
              <Route path=':number' element={ <AdminClassSession /> } />
            </Route>
          </Route>

          <Route path='staff-list'>
            <Route index element={ <StaffList /> } />
            <Route path='detail/:id' element={ <StaffDetail /> } />
          </Route>

          <Route path='student-list'>
            <Route index element={ <StudentList /> } />
            <Route path='detail/:id' element={ <StudentDetail /> } />
          </Route>
          {/* Staff routes */ }
          <Route path='my-class-list' >
            <Route index element={ <MyClassList /> } />
            <Route path='detail/:name'>
              <Route index element={ <MyClassDetail /> } />
              <Route path=':number' element={ <MyClassSession /> } />
            </Route>
          </Route>
        </Route>
        {/* Not found */ }
        <Route path='*' element={ <NotFound /> } />
      </Routes>
    </div >
  );
}

export default App;