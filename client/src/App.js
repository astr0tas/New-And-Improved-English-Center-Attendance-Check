import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from 'react';
import Login from './components/General/Authentication/Login/Login';
import Recovery from './components/General/Authentication/Recovery/Recovery';


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
  const [isPaid, setIsPaid] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Authentication */ }
          <Route>
            <Route path='/' element={ <Login /> } />
            <Route path='/recovery' element={ <Recovery /> } />
          </Route>
          {/* Not found */ }
          <Route path='*' element={ <NotFound /> } />
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;


