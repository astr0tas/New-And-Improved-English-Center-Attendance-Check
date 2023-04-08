import { BrowserRouter, Routes, Route} from 'react-router-dom';
import {useState, useEffect, useContext}         from 'react';

import './App.css';
import UserContext from './pages/General/UserContext.jsx';
import {SignInAs, SignIn} from './pages/SignIn/SignIn.jsx';
import User             from './pages/User/User.jsx';
import Students           from './pages/Admin/Students/Student.jsx';
import {NavBar }          from './components/NavBar/NavBar.jsx';


function App() {
  const [isPosition, setPosition] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
          setUser(JSON.parse(savedUser));
          setPosition(JSON.parse(savedUser).position);
      }
  }, []);

  const [isNavBar, setNavBar] = useState(true);

  return (
    <div className="App container-fluid">
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          {isNavBar && <NavBar position = {isPosition}/>}
          <Routes>
            <Route path ='/' element ={<SignInAs position = {(position) => setPosition(position)}/>} />
            <Route path ='/SignIn' element ={<SignIn position = {isPosition} onNavBar = {()=>setNavBar(true)}/>}/>
            <Route path = {isPosition + '/User' } element = {<User user = {user}/>}/>
            <Route path = {isPosition + '/Students' } element = {<Students/>}/>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
