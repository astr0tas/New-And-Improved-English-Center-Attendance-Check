import { BrowserRouter, Routes, Route} from 'react-router-dom';
import {useState} from 'react';

import './App.css';
import {SignInAs, SignIn} from './pages/SignIn/SignIn.jsx';
import {NavBar} from './components/NavBar/NavBar.jsx';
import routes from './Route/Route'

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
  const [isPosition, setPosition] = useState("");
  const [isNavBar, setNavBar] = useState(true);
  return (
    <div className="App container-fluid">
      <BrowserRouter>
        {isNavBar && <NavBar position = {isPosition}/>}
        <Routes>
          <Route path ='/' element ={<SignInAs position = {(position) => setPosition(position)}/>} />
          <Route path ='/SignIn' element ={<SignIn position = {isPosition} onNavBar = {()=>setNavBar(true)}/>}/>
          {
            routes.map((route) => {
              var to = '/' + isPosition + route.path;
              return <Route path={to} element={route.component} />;
            })
          }
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
