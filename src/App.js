import { BrowserRouter, Routes, Route} from 'react-router-dom';
import {useState}         from 'react';

import './App.css';
import {SignInAs, SignIn} from './pages/SignIn/SignIn.jsx';
import User             from './pages/User/User.jsx';
import Students           from './pages/Admin/Students/Student';
import {NavBar}           from './components/NavBar/NavBar.jsx';

var employee = {
  name: 'Nguyen Thi B',
  ssn: '202511112',
  address: '5/2 Abc, Xyz',
  birthDate: '22/12/1999', 
  birthPlace: '1/2 Abc, Xyz',
  email: 'NTB@gmail.com',
  phone: '0826487896'
}

function App() {
  const [isPosition, setPosition] = useState("Admin");
  const [isNavBar, setNavBar] = useState(true);
  return (
    <div className="App container-fluid">
      <BrowserRouter>
        {isNavBar && <NavBar position = {isPosition}/>}
        <Routes>
          <Route path ='/' element ={<SignInAs position = {(position) => setPosition(position)}/>} />
          <Route path ='/SignIn' element ={<SignIn position = {isPosition} onNavBar = {()=>setNavBar(true)}/>}/>
          <Route path = {isPosition + '/User' } element = {<User employee={employee}/>}/>
          <Route path = {isPosition + '/Students' } element = {<Students/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
