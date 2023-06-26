import styles from './Login.module.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import React from 'react';
import { isRefValid } from '../../../../tools/refChecker';
import { domain } from '../../../../tools/domain';

const Login = () =>
{
      document.title = 'Login';
      const Navigate = useNavigate();

      const [inputs, setInputs] = useState({});
      const [isWrong, setIsWrong] = useState(false);
      const [isMissing, setIsMissing] = useState(false);

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
                  // const formData = new FormData();
                  // formData.append("username", inputs.username);
                  // formData.append("password", inputs.password);
                  // axios.post(`http://${ domain }/admin/login`, formData, { withCredentials: true })
                  //       .then(res =>
                  //       {
                  //             if (res.data)
                  //             {
                  //                   setIsWrong(false);
                  //                   Navigate("./home");
                  //             }
                  //             else
                  //             {
                  //                   setIsWrong(true);
                  //             }
                  //       })
                  //       .catch(error => console.log(error));
            }
      }

      return (
            <>
                  <div className={ `${ styles.background }` }></div>
                  <div className={ `container-fluid d-flex h-100 flex-column` }>
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
                                    <div className="col">
                                          <a href="./recovery" className={ `text-decoration-none ${ styles.font }` }>Forgot password?</a>
                                    </div>
                              </div>
                        </form>
                  </div>
            </>
      );
}

export default Login;