import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from './components/General/Authentication/Login/Login';
import Recovery from './components/General/Authentication/Recovery/Recovery';
import Menu from './components/General/Menu/Menu';

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
              <Route path='/' element={ <Login /> } />
              <Route path='/recovery' element={ <Recovery /> } />
            </Route>
            <Route path='home' element={ <Menu /> }>

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


