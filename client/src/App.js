import { BrowserRouter, Routes, Route} from 'react-router-dom';
import {useState, useEffect}         from 'react';

import './App.css';
import UserContext from './pages/General/UserContext.jsx';
import {SignInAs, SignIn} from './pages/SignIn/SignIn.jsx';
import User             from './pages/User/User.jsx';
import Students           from './pages/Admin/Students/Student.jsx';
import {NavBar }          from './pages/NavBar/NavBar.jsx';


function App() {
  const [user, setUser] = useState({user: null, position: ""});

  useEffect(() => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
          setUser(JSON.parse(savedUser));
      }
  }, []);

  const [isNavBar, setNavBar] = useState(true);

  return (
    <div className="App container-fluid">
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          {isNavBar && <NavBar position = {user.position}/>}
          <Routes>
            <Route path ='/' element = {<SignInAs/>} />
            <Route path ='/SignIn' element ={<SignIn onNavBar = {()=>setNavBar(true)}/>}/>
            <Route path = {user.position + '/User' } element = {<User/>}/>
            <Route path = {user.position + '/Students' } element = {<Students/>}/>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
