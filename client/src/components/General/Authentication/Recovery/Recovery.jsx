import styles from './Recovery.module.css';
import request from '../../../../tools/request';
import { useNavigate, Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { domain } from '../../../../tools/domain';
import { isRefValid } from '../../../../tools/refChecker';
import '../../../../../src/css/modal.css';
import '../../../../../src/css/scroll.css';
import { Modal } from 'react-bootstrap';

function Recovery()
{
      document.title = 'Password recovery';

      const Navigate = useNavigate();

      const checkUsername = useRef(null);
      const changingPassword = useRef(null);

      // Validate username
      const [username, setUsername] = useState("");
      const [isWrong, setIsWrong] = useState(false);
      const [isMissing, setIsMissing] = useState(false);

      const usernameValidation = (event) =>
      {
            event.preventDefault();
            if (username === "")
            {
                  setIsWrong(false);
                  setIsMissing(true);
            }
            else
            {
                  setIsMissing(false);

                  request.post(`http://${ domain }/validateUser`, { params: { username: username } }, {
                        headers: { 'Content-Type': 'application/json' }
                  })
                        .then(res =>
                        {
                              if (res.data)
                              {
                                    setIsWrong(false);
                                    if (isRefValid(checkUsername))
                                          checkUsername.current.style.display = "none";
                                    if (isRefValid(changingPassword))
                                          changingPassword.current.style.display = "flex";
                              }
                              else
                              {
                                    setIsWrong(true);
                              }
                        })
                        .catch(error => console.log(error));
            }
      }

      // Changing password
      const [password, setPassword] = useState();
      const [repassword, setRepassword] = useState();
      const [isMatch, setIsMatch] = useState(true);
      const [showPopUp, setShowPopUp] = useState(false);

      const changePassword = (e) =>
      {
            e.preventDefault();
            if (password !== repassword)
            {
                  setIsMatch(false);
            }
            else
            {
                  setIsMatch(true);
                  request.post(`http://${ domain }/recovery`, { params: { username: username, password: password } }, {
                        headers: { 'Content-Type': 'application/json'}
                  })
                        .then(res =>
                        {
                              console.log(res);
                              setShowPopUp(true);
                        })
                        .catch(error => console.log(error));
            }
      }

      return (
            <>
                  <div className={ `${ styles.background }` }></div>
                  {/* Validate username first */ }
                  <div className={ `container-fluid h-100 ${ styles.checkUsername }` } ref={ checkUsername }>
                        <form onSubmit={ usernameValidation } className={ `${ styles.form } bg-light d-flex flex-column align-items-center justify-content-around fs-5 mx-auto my-auto` }>
                              <div className="border-bottom border-dark w-100 d-flex flex-column align-items-center mb-5">
                                    <h1 className={ `my-3 mx-5 ${ styles.title }` }>Password recovery</h1>
                              </div>
                              <div className="mb-2 form-outline">
                                    <label htmlFor="form_username" className={ `${ styles.font }` }>Enter your username</label>
                                    <input type="text" id="form_username" className={ `form-control ${ styles.font }` } placeholder="Username" onChange={ (e) => { setUsername(e.target.value); } } name="username" />
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
                                                Username not found!
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
                                    {
                                          isMissing
                                          &&
                                          <p className={ `${ styles.p }` }>
                                                Enter your username!
                                          </p>
                                    }
                              </div>
                              <input type="submit" className={ `btn btn-primary btn-block mb-4 ${ styles.font }` } value="Continue" />
                              <div className="row mb-4">
                                    <div className="col">
                                          <span className={ `${ styles.font }` }>Go back to <Link to="/" className={ `text-decoration-none` }>login</Link></span>
                                    </div>
                              </div>
                        </form>
                  </div>
                  {/* Changing password */ }
                  <div className={ `container-fluid h-100 ${ styles.newPassword } flex-column align-items-center` } ref={ changingPassword }>
                        <form onSubmit={ changePassword } className={ `${ styles.form } bg-light d-flex flex-column align-items-center justify-content-around fs-5 mx-auto my-auto` }>
                              <div className="border-bottom border-dark w-100 d-flex flex-column align-items-center mb-5">
                                    <h1 className={ `my-3 mx-5 ${ styles.title }` }>Password recovery</h1>
                              </div>
                              <div className="mb-4 form-outline">
                                    <label htmlFor="form_password" className={ `${ styles.font }` }>Enter new password</label>
                                    <input type="password" id="form_password" className={ `form-control ${ styles.font }` } placeholder="Password" onChange={ (e) => { setPassword(e.target.value); } } />
                              </div>
                              <div className="mb-2 form-outline">
                                    <label htmlFor="form_repassword" className={ `${ styles.font }` }>Confirm new password</label>
                                    <input type="password" id="form_repassword" className={ `form-control ${ styles.font }` } placeholder="Password" onChange={ (e) => { setRepassword(e.target.value); } } />
                              </div>
                              <div className='d-flex align-items-center mb-4'>
                                    {
                                          !isMatch &&
                                          <AiOutlineCloseCircle style={ {
                                                color: 'red',
                                                fontSize: "20px",
                                                marginRight: '5px'
                                          } } />
                                    }
                                    {
                                          !isMatch &&
                                          <p
                                                style={ {
                                                      color: 'red',
                                                      fontSize: "16px",
                                                      marginBottom: '0'
                                                } }
                                          >
                                                Passwords are not matched!
                                          </p>
                                    }
                              </div>
                              <input type="submit" className={ `btn btn-primary btn-block mb-4 ${ styles.font }` } value="Finish" />
                              <div className="row mb-4">
                                    <div className="col">
                                          <span className={ `${ styles.font }` }>Go back to <Link to="/" className={ `text-decoration-none` }>login</Link></span>
                                    </div>
                              </div>
                        </form>
                        <Modal show={ showPopUp } className={ `reAdjustModel hideBrowserScrollbar` } container={ changingPassword.current }>
                              <Modal.Header className='border border-0'>
                              </Modal.Header>
                              <Modal.Body className='border border-0 d-flex justify-content-center'>
                                    <h4 className='text-center'>Password changed successfully!</h4>
                              </Modal.Body>
                              <Modal.Footer className='justify-content-center border border-0'>
                                    <button className='btn btn-primary ms-2 ms-md-4' onClick={ () =>
                                    {
                                          Navigate("/");
                                    } }>Okay</button>
                              </Modal.Footer>
                        </Modal>
                  </div >
            </>
      );
}

export default Recovery;