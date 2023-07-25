import styles from './Login.module.css';
import { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import React from 'react';
import { domain } from '../../../../tools/domain';
import { context } from '../../../../context';
import { Modal } from 'react-bootstrap';

const Login = () =>
{
      document.title = 'Login';
      const Navigate = useNavigate();

      const [inputs, setInputs] = useState({});
      const [isWrong, setIsWrong] = useState(false);
      const [isMissing, setIsMissing] = useState(false);
      const { chosenRole, setChosenRole } = useContext(context);

      const [errorPopUp, setErrorPopUp] = useState(false);
      const popUpContainer = useRef(null);

      const formChange = (event) =>
      {
            const name = event.target.name;
            const value = event.target.value;
            setInputs(values => ({ ...values, [name]: value }))
      }

      const formSubmit = (event) =>
      {
            event.preventDefault();
            if (inputs.username === "" || inputs.password === "" || typeof (inputs.password) === "undefined" || typeof (inputs.username) === "undefined")
            {
                  setIsMissing(true);
                  setIsWrong(false);
            }
            else
            {
                  setIsMissing(false);
                  axios.post(`http://${ domain }/`, { params: { username: inputs.username, password: inputs.password, type: chosenRole } }, {
                        withCredentials: true,
                        headers: {
                              'Content-Type': 'application/json'
                        }
                  })
                        .then(res =>
                        {
                              if (res.data.message)
                              {
                                    setIsWrong(false);
                                    Navigate("./home");
                              }
                              else
                              {
                                    setIsWrong(true);
                              }
                        })
                        .catch(error =>
                        {
                              console.log(error);
                              setErrorPopUp(true);
                        });
            }
      }

      useEffect(() =>
      {
            axios.get(`http://${ domain }/isLoggedIn`, {
                  withCredentials: true
            })
                  .then(res =>
                  {
                        if (res.data.message[0])
                              Navigate('./home');
                  })
                  .catch(error => console.log(error));
      }, [Navigate])

      return (
            <>
                  <div className={ `${ styles.background }` }></div>
                  <div className={ `container-fluid d-flex h-100 flex-column align-items-center` } ref={ popUpContainer }>
                        {
                              chosenRole === 0 &&
                              <form onSubmit={ formSubmit } className={ `${ styles.form } bg-light d-flex flex-column align-items-center justify-content-around fs-5 align-self-start mx-auto my-auto` }>
                                    <div className="border-bottom border-dark w-100 d-flex flex-column align-items-center mb-5">
                                          <h1 className={ `my-3 mx-5 ${ styles.title }` }>Who are you?</h1>
                                    </div>
                                    <input type="button" className={ `btn btn-primary btn-lg btn-block mb-4 ${ styles.font }` } value="Admin" onClick={ () => setChosenRole(1) } style={ { minWidth: '150px' } } />
                                    <input type="button" className={ `btn btn-primary btn-lg btn-block mb-4 ${ styles.font }` } value="Teacher" onClick={ () => setChosenRole(2) } style={ { minWidth: '150px ' } } />
                                    <input type="button" className={ `btn btn-primary btn-lg btn-block mb-4 ${ styles.font }` } value="Supervisor" onClick={ () => setChosenRole(3) } style={ { minWidth: '150px ' } } />
                              </form>
                        }
                        {
                              chosenRole !== 0 &&
                              <form onSubmit={ formSubmit } className={ `${ styles.form } bg-light d-flex flex-column align-items-center justify-content-around fs-5 align-self-start mx-auto my-auto` }>
                                    <div className="border-bottom border-dark w-100 d-flex flex-column align-items-center mb-5">
                                          <h1 className={ `my-3 mx-5 ${ styles.title }` }>Welcome!</h1>
                                    </div>
                                    <div className="mb-4 form-outline">
                                          <label htmlFor="form_username" className={ `${ styles.font }` }>Username</label>
                                          <input type="text" id="form_username" className={ `form-control ${ styles.font }` } onChange={ formChange } name="username" />
                                    </div>
                                    <div className="form-outline mb-2">
                                          <label htmlFor="form_password" className={ `${ styles.font }` } >Password</label>
                                          <input type="password" id="form_password" className={ `form-control ${ styles.font }` } onChange={ formChange } name="password" />
                                    </div>
                                    <div className='d-flex align-items-center mb-4'>
                                          {
                                                isWrong
                                                &&
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                          }
                                          {
                                                isWrong
                                                &&
                                                <p className={ `${ styles.p }` }>
                                                      Username or password is not correct!
                                                </p>
                                          }
                                          {
                                                isMissing
                                                &&
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                          }
                                          { isMissing
                                                &&
                                                <p className={ `${ styles.p }` }>
                                                      Username or password is missing!
                                                </p>
                                          }
                                    </div>
                                    <input type="submit" className={ `btn btn-primary btn-block mb-4 ${ styles.font }` } value="Sign in" />
                                    <div className="row mb-4">
                                          <div className="col-12 text-center">
                                                <Link to="./recovery" className={ `text-decoration-none ${ styles.font }` }>Forgot password?</Link>
                                          </div>
                                          <div className="col-12 text-center mt-2">
                                                <button type='button' onClick={ () => setChosenRole(0) } className={ `text-decoration-none ${ styles.font } btn btn-sm btn-secondary` }>Choose another role</button>
                                          </div>
                                    </div>
                              </form>
                        }
                        <Modal show={ errorPopUp } onHide={ () => { setErrorPopUp(false); } } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ popUpContainer.current }>
                              <Modal.Header className='border border-0' closeButton>
                              </Modal.Header>
                              <Modal.Body className='border border-0 d-flex justify-content-center'>
                                    <h4 className='text-center'>An error has occurred!</h4>
                              </Modal.Body>
                              <Modal.Footer className='justify-content-center border border-0'>
                                    <button className={ `btn btn-primary me-2 me-md-4` } onClick={ () =>
                                    {
                                          setErrorPopUp(false);
                                    } }>Okay</button>
                              </Modal.Footer>
                        </Modal>
                  </div>
            </>
      );
}

export default Login;