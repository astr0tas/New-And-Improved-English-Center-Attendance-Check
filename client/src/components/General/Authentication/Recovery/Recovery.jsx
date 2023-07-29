import styles from './Recovery.module.css';
import authRequest from '../../../../tools/authenticationRequest';
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
      document.title = 'Account recovery';

      const Navigate = useNavigate();

      const checkUsername = useRef(null);
      const changingPassword = useRef(null);

      // Validate username
      const [username, setUsername] = useState("");
      const [email, setEmail] = useState("");
      const [phone, setPhone] = useState('');
      const [isWrong, setIsWrong] = useState(false);
      const [isUsernameMissing, setIsUsernameMissing] = useState(false);
      const [isPhoneMissing, setIsPhoneMissing] = useState(false);
      const [isEmailMissing, setIsEmailMissing] = useState(false);
      const [usernameInvalid, setUsernameInvalid] = useState(false);
      const [isPhoneInvalid, setIsPhoneInvalid] = useState(false);
      const [isEmailInvalid, setIsEmailInvalid] = useState(false);
      const [errorPopUp, setErrorPopUp] = useState(false);
      const popUpContainer = useRef(null);

      function isContainOnlyNumeric(inputString)
      {
            const pattern = /[a-zA-Z\\~!@#$%^&*()_+`|;:'"<>,.?\n\t\r\b]/;

            return !pattern.test(inputString);
      }

      function isValidEmail(email)
      {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
      }

      function isUsernameInvalid(inputString)
      {
            const pattern = /[\\~!@#$%^&*()+`|;:'"<>,?\n\t\r\b]/;

            return pattern.test(inputString);
      }

      const usernameValidation = (event) =>
      {
            event.preventDefault();
            let isOk = true;
            if (username === "")
            {
                  setIsUsernameMissing(true);
                  isOk = false;
            }
            else if (isUsernameInvalid(username))
            {
                  setUsernameInvalid(true);
                  isOk = false;
            }

            if (phone === '')
            {
                  setIsPhoneMissing(true);
                  isOk = false;
            }
            else if (!isContainOnlyNumeric(phone))
            {
                  setIsPhoneInvalid(true);
                  isOk = false;
            }

            if (email === '')
            {
                  setIsEmailMissing(true);
                  isOk = false;
            }
            else if (!isValidEmail(email))
            {
                  setIsEmailInvalid(true);
                  isOk = false;
            }

            if (isOk)
            {
                  setIsUsernameMissing(false);
                  setUsernameInvalid(false);
                  setIsPhoneInvalid(false);
                  setIsPhoneMissing(false);
                  setIsEmailInvalid(false);
                  setIsEmailMissing(false);

                  authRequest.post(`http://${ domain }/validateUser`, { params: { username: username, email: email, phone: phone } }, {
                        headers: { 'Content-Type': 'application/json' }
                  })
                        .then(res =>
                        {
                              if (res.status === 200)
                              {
                                    setIsWrong(false);
                                    if (isRefValid(checkUsername))
                                          checkUsername.current.style.display = "none";
                                    if (isRefValid(changingPassword))
                                          changingPassword.current.style.display = "flex";
                              }
                              else if (res.status === 204)
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
                  authRequest.post(`http://${ domain }/recovery`, { params: { username: username, password: password, email: email, phone: phone } }, {
                        headers: { 'Content-Type': 'application/json' }
                  })
                        .then(res =>
                        {
                              if (res.status === 200)
                                    setShowPopUp(true);
                        })
                        .catch(error => console.log(error));
            }
      }

      return (
            <>
                  <div className={ `${ styles.background }` }></div>
                  {/* Validate username first */ }
                  <div className='w-100 h-100 align-items-center d-flex flex-column' ref={ popUpContainer }>
                        <div className={ `container-fluid h-100 ${ styles.checkUsername }` } ref={ checkUsername }>
                              <form onSubmit={ usernameValidation } className={ `${ styles.form } bg-light d-flex flex-column align-items-center justify-content-around fs-5 mx-auto my-auto` }>
                                    <div className="border-bottom border-dark w-100 d-flex flex-column align-items-center mb-5">
                                          <h1 className={ `my-3 mx-5 ${ styles.title }` }>User validation</h1>
                                    </div>
                                    <div className="mb-4 form-outline">
                                          <label htmlFor="form_username" className={ `${ styles.font }` }>Username</label>
                                          <input type="text" id="form_username" className={ `form-control ${ styles.font }` } placeholder="Username" onChange={ (e) => { setUsername(e.target.value); } } name="username" />
                                    </div>
                                    {
                                          isUsernameMissing
                                          &&
                                          <div className="d-flex align-items-center">
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                                <p className={ `${ styles.p }` }>
                                                      Enter username!
                                                </p>
                                          </div>
                                    }
                                    {
                                          usernameInvalid
                                          &&
                                          <div className="d-flex align-items-center">
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                                <p className={ `${ styles.p }` }>
                                                      Username invalid!
                                                </p>
                                          </div>
                                    }
                                    <div className="mb-4 form-outline">
                                          <label htmlFor="form_email" className={ `${ styles.font }` }>Email</label>
                                          <input type="email" id="form_email" className={ `form-control ${ styles.font }` } placeholder="Email" onChange={ (e) => { setEmail(e.target.value); } } name="email" />
                                    </div>
                                    {
                                          isEmailMissing
                                          &&
                                          <div className="d-flex align-items-center">
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                                <p className={ `${ styles.p }` }>
                                                      Enter email!
                                                </p>
                                          </div>
                                    }
                                    {
                                          isEmailInvalid
                                          &&
                                          <div className="d-flex align-items-center">
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                                <p className={ `${ styles.p }` }>
                                                      Email invalid!
                                                </p>
                                          </div>
                                    }
                                    <div className="mb-4 form-outline">
                                          <label htmlFor="form_phone" className={ `${ styles.font }` }>Phone number</label>
                                          <input type="text" id="form_phone" className={ `form-control ${ styles.font }` } placeholder="Phone number" onChange={ (e) => { setPhone(e.target.value); } } name="phone" maxLength={ 10 } />
                                    </div>
                                    {
                                          isPhoneMissing
                                          &&
                                          <div className="d-flex align-items-center">
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                                <p className={ `${ styles.p }` }>
                                                      Enter phone number!
                                                </p>
                                          </div>
                                    }
                                    {
                                          isPhoneInvalid
                                          &&
                                          <div className="d-flex align-items-center">
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                                <p className={ `${ styles.p }` }>
                                                      Phone number invalid!
                                                </p>
                                          </div>
                                    }
                                    <div className='d-flex align-items-center mb-4'>
                                          {
                                                isWrong
                                                &&
                                                <>
                                                      <AiOutlineCloseCircle style={ {
                                                            marginRight: '5px',
                                                            marginBottom: '16px'
                                                      } } className={ `${ styles.p }` } />
                                                      <p className={ `${ styles.p }` }>
                                                            User not found!
                                                      </p>
                                                </>
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
                                          <h1 className={ `my-3 mx-5 ${ styles.title }` }>Change password</h1>
                                    </div>
                                    <div className="mb-4 form-outline">
                                          <label htmlFor="form_password" className={ `${ styles.font }` }>New password</label>
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
                        </div >
                  </div>
            </>
      );
}

export default Recovery;