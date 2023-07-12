import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

// General routes
import Login from './components/General/Authentication/Login/Login';
import Recovery from './components/General/Authentication/Recovery/Recovery';
import Menu from './components/General/Menu/Menu';
import Home from './components/General/Home/Home';
import Profile from './components/General/Profile/Profile';

// Admin routes
import ClassList from './components/Admin/Class/List/ClassList';
import ClassCreate from './components/Admin/Class/Create/ClassCreate';
import ClassDetail from './components/Admin/Class/Detail/ClassDetail';
import ClassEdit from './components/Admin/Class/Edit/ClassEdit';
import AdminClassSession from './components/Admin/Class/Session/SessionDetail';

import StaffList from './components/Admin/Staff/List/StaffList';
import StaffCreate from './components/Admin/Staff/Create/StaffCreate';
import StaffDetail from './components/Admin/Staff/Detail/StaffDetail'
import StaffEdit from './components/Admin/Staff/Edit/StaffEdit';

import StudentList from './components/Admin/Student/List/StudentList';
import StudentCreate from './components/Admin/Student/Create/StudentCreate';
import StudentDetail from './components/Admin/Student/Detail/StudentDetail'
import StudentEdit from './components/Admin/Student/Edit/StudentEdit';

// Staff routes
import MyClassList from './components/Staff/MyClass/List/MyClassList';
import MyClassDetail from './components/Staff/MyClass/Detail/MyClassDetail';
import MyClassSession from './components/Staff/MyClass/Session/Session';

import { ContextProvider } from './context';

const NotFound = () =>
{
  document.title = "Page not found";
  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <p className='text-center' style={ { fontSize: '10rem' } }>404</p>
      <h1 className='text-center' style={ { fontSize: '2rem' } }>Ooops, page not found</h1>
      <p className='mb-0 text-center'>The page you are looking for does not exist on the server or an error has occurred.</p>
      <p className='text-center'>Go back or choose a new direction!</p>
    </div>
  )
}


function App()
{
  return (
    <div className="App">
      <BrowserRouter>
        <ContextProvider>
          <Routes>
            {/* Authentication */ }
            <Route>
              <Route index element={ <Login /> } />
              <Route path='recovery' element={ <Recovery /> } />
            </Route>
            {/* Main routes */ }
            <Route element={ <Menu /> }>

              {/* General profile */ }
              <Route path='profile' element={ <Profile /> } />
              {/* General home */ }
              <Route path='home' element={ <Home /> } />
              {/* Admin routes */ }
              <Route>
                <Route path='class-list' element={ <ClassList /> } />
                <Route path='class-list/create' element={ <ClassCreate /> } />
                <Route path='class-list/detail/:name' element={ <ClassDetail /> } />
                <Route path='class-list/detail/:name/edit' element={ <ClassEdit /> } />
                <Route path='class-list/detail/:name/:number' element={ <AdminClassSession /> } />
              </Route>

              <Route>
                <Route path='staff-list' element={ <StaffList /> } />
                <Route path='staff-list/create' element={ <StaffCreate /> } />
                <Route path='staff-list/detail/:id' element={ <StaffDetail /> } />
                <Route path='staff-list/detail/:id/edit' element={ <StaffEdit /> } />
              </Route>

              <Route>
                <Route path='student-list' element={ <StudentList /> } />
                <Route path='student-list/create' element={ <StudentCreate /> } />
                <Route path='student-list/detail/:id' element={ <StudentDetail /> } />
                <Route path='student-list/detail/:id/edit' element={ <StudentEdit /> } />
              </Route>
              {/* Staff routes */ }
              <Route>
                <Route path='my-class-list' element={ <MyClassList /> } />
                <Route path=':name' element={ <MyClassDetail /> } />
                <Route path=':number' element={ <MyClassSession /> } />
              </Route>

            </Route>
            {/* Not found */ }
            <Route path='*' element={ <NotFound /> } />
          </Routes>
        </ContextProvider>
      </BrowserRouter>
    </div >
  );
}

export default App;


