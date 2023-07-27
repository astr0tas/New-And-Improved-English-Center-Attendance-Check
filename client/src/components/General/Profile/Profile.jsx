import { useEffect, useRef, useState } from 'react';
import styles from './Profile.module.css';
import { Modal } from 'react-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import { GiCancel, GiConfirmed } from 'react-icons/gi';
import { isRefValid } from '../../../tools/refChecker';
import '../../../css/scroll.css';
import { domain } from '../../../tools/domain';
import { DMY, YMD } from '../../../tools/dateFormat';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

const Profile = () =>
{
      document.title = 'Profile';

      const [editMode, setEditMode] = useState(false);

      const [name, setName] = useState("N/A");
      const [address, setAddress] = useState("N/A");
      const [birthday, setBirthday] = useState("N/A");
      const [birthplace, setBirthplace] = useState("N/A");
      const [email, setEmail] = useState("N/A");
      const [phone, setPhone] = useState("N/A");
      const [ssn, setSSN] = useState("N/A");
      const [username, setUsername] = useState("N/A");
      const [image, setImage] = useState(null);

      const [newImage, setNewImage] = useState(null);
      const [password, setPassword] = useState("");
      const [repassword, setRepassword] = useState("");
      const [newName, setNewName] = useState("");
      const [newAddress, setNewAddress] = useState("");
      const [newBirthday, setNewBirthday] = useState("");
      const [newBirthplace, setNewBirthplace] = useState("");
      const [newSSN, setNewSSN] = useState("");
      const [newEmail, setNewEmail] = useState("");
      const [newPhone, setNewPhone] = useState("");

      const image_input = useRef(null);
      const profileImg = useRef(null);

      const [isWrong, setIsWrong] = useState(false);
      const [isYoung, setIsYoung] = useState(false);
      const [invalidSSN, setInvalidSSN] = useState(false);
      const [invalidPhone, setInvalidPhone] = useState(false);
      const [invalidEmail, setInvalidEmail] = useState(false);
      const [invalidName, setInvalidName] = useState(false);
      const [duplicateSSN, setDuplicateSSN] = useState(false);
      const [duplicatePhone, setDuplicatePhone] = useState(false);
      const [duplicateEmail, setDuplicateEmail] = useState(false);

      const [render, setRender] = useState(false);

      const popUpContainer = useRef(null);
      const [showpopup, setshowpopup] = useState(false);
      const [errorPopUp, setErrorPopUp] = useState(false);

      const userType = useOutletContext();

      useEffect(() =>
      {
            axios.get(`http://${ domain }/profile`, {
                  withCredentials: true
            })
                  .then(res =>
                  {
                        setName(res.data.name);
                        setSSN(res.data.ssn);
                        setEmail(res.data.email);
                        setPhone(res.data.phone);
                        setAddress(res.data.address);
                        setBirthplace(res.data.birthplace);
                        setUsername(res.data.username);
                        setBirthday(DMY(res.data.birthday));

                        setImage(res.data.image === null ? require('../../../images/profile.png') : `http://${ domain }/image/employee/${ res.data.image }`);
                        if (isRefValid(profileImg))
                              profileImg.current.src = res.data.image === null ? require('../../../images/profile.png') : `http://${ domain }/image/employee/${ res.data.image }`;
                  })
                  .catch(err => console.log(err));
      }, [render]);

      const triggerEdit = (val) =>
      {
            setEditMode(val);
            if (!val)
            {
                  setInvalidSSN(false);
                  setInvalidPhone(false);
                  setIsWrong(false);
                  setInvalidEmail(false);
                  setIsYoung(false);
                  setDuplicateEmail(false);
                  setDuplicatePhone(false);
                  setDuplicateSSN(false);
                  setInvalidName(false);
                  setPassword("");
                  setRepassword("");
                  setNewAddress("");
                  setNewEmail("");
                  setNewName("");
                  setNewSSN("");
                  setNewPhone("");
                  setNewBirthday("");
                  setNewBirthplace("");
                  setNewImage(null);
                  if (isRefValid(profileImg))
                        profileImg.current.src = image;
            }
      }

      function hasAlphabetCharacters(inputString)
      {
            const alphabetPattern = /[a-zA-Z]/;

            return alphabetPattern.test(inputString);
      }

      function isNameInvalid(inputString)
      {
            const pattern = /[0-9\\~!@#$%^&*()_+`|;:'"<>,.?\n\t\r\b]/;

            return pattern.test(inputString);
      }

      function isValidEmail(email)
      {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
      }

      function isValidAge(inDate)
      {
            const input = new Date(inDate);
            const now = new Date();

            return input.getFullYear() + 18 < now.getFullYear() || (
                  input.getFullYear() + 18 === now.getFullYear() && (
                        input.getMonth() < now.getMonth() || (
                              input.getMonth() === now.getMonth() && input.getDate() <= now.getDate()
                        )
                  )
            );
      }

      const changeInfo = async () =>
      {
            let isOk = true;

            setIsWrong(password !== repassword);
            isOk = !(password !== repassword) && isOk;

            setIsYoung(newBirthday !== '' && !isValidAge(newBirthday));
            isOk = !(newBirthday !== '' && !isValidAge(newBirthday)) && isOk;

            setInvalidName(newName !== '' && isNameInvalid(newName));
            isOk = !(newName !== '' && isNameInvalid(newName)) && isOk;

            if (newSSN !== '' && hasAlphabetCharacters(newSSN))
            {
                  setInvalidSSN(true);
                  isOk = false;
            }
            else if (newSSN !== '')
            {
                  const result = await axios.post(`http://${ domain }/isSSNDuplicate`, { params: { ssn: newSSN } }, { headers: { 'Content-Type': 'application/json' } });
                  setInvalidSSN(false);
                  setDuplicateSSN(result.data);
                  isOk = !result.data && isOk;
            }
            if (newPhone !== '' && hasAlphabetCharacters(newPhone))
            {
                  setInvalidPhone(true);
                  isOk = false;
            }
            else if (newPhone !== '')
            {
                  const result = await axios.post(`http://${ domain }/isPhoneDuplicate`, { params: { phone: newPhone } }, { headers: { 'Content-Type': 'application/json' } });
                  setInvalidPhone(false);
                  setDuplicatePhone(result.data);
                  isOk = !result.data && isOk;
            }
            if (newEmail !== '' && !isValidEmail(newEmail))
            {
                  setInvalidEmail(true);
                  isOk = false;
            }
            else if (newEmail !== '')
            {
                  const result = await axios.post(`http://${ domain }/isEmailDuplicate`, { params: { email: newEmail } }, { headers: { 'Content-Type': 'application/json' } });
                  setInvalidEmail(false);
                  setDuplicateEmail(result.data);
                  isOk = !result.data && isOk;
            }
            if (isOk)
            {
                  const formdata = new FormData();
                  formdata.append('ssn', newSSN === '' ? null : newSSN);
                  formdata.append('name', newName === '' ? null : newName);
                  formdata.append('address', newAddress === '' ? null : newAddress);
                  formdata.append('birthday', newBirthday === '' ? null : newBirthday);
                  formdata.append('birthplace', newBirthplace === '' ? null : newBirthplace);
                  formdata.append('email', newEmail === '' ? null : newEmail);
                  formdata.append('phone', newPhone === '' ? null : newPhone);
                  formdata.append('password', password === '' ? null : password);
                  formdata.append('userType', userType);
                  formdata.append('image', newImage);
                  axios.post(`http://${ domain }/updateProfile`, formdata, {
                        withCredentials: true,
                        headers: {
                              'Content-Type': 'multipart/form-data'
                        }
                  })
                        .then(res =>
                        {
                              triggerEdit(false);
                              setRender(!render);
                        })
                        .catch(err =>
                        {
                              setErrorPopUp(true);
                              console.error(err);
                        });
            }
      }

      return (
            <div className="w-100 h-100 d-flex overflow-auto flex-column align-items-center" ref={ popUpContainer }>
                  <Modal show={ showpopup } className={ `reAdjustModel` } container={ popUpContainer.current } onHide={ () => setshowpopup(false) }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Do you want to update your info?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className='btn btn-danger me-2 me-md-4' onClick={ () =>
                              {
                                    setshowpopup(false);
                              } }>No</button>
                              <button className='btn btn-primary ms-2 ms-md-4' onClick={ () =>
                              {
                                    setshowpopup(false);
                                    changeInfo();
                              } }>Yes</button>
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

                  <div className='d-flex flex-column align-items-center my-auto w-100'>
                        <img alt='profile' className={ `${ styles.img } mt-2 mt-md-4` } ref={ profileImg }></img>
                        {
                              editMode &&
                              <label className={ `btn btn-sm btn-light border border-dark mt-3 mx-auto` } ref={ image_input }>
                                    <input type='file' className='d-none' onChange={ e =>
                                    {
                                          if (e.target.files.length === 0)
                                          {
                                                setNewImage(null);
                                                if (isRefValid(profileImg))
                                                      profileImg.current.src = image;
                                          }
                                          else
                                          {
                                                setNewImage(e.target.files[0]);
                                                const file = e.target.files[0];
                                                const reader = new FileReader();
                                                reader.readAsArrayBuffer(file);
                                                reader.onload = () =>
                                                {
                                                      const blob = new Blob([reader.result], { type: file.type });
                                                      const url = URL.createObjectURL(blob);
                                                      if (isRefValid(profileImg))
                                                            profileImg.current.src = url;
                                                };
                                          }
                                    } } accept=".jpg,.jpeg,.png"></input>
                                    Choose file
                              </label>
                        }
                        {
                              !editMode &&
                              <h2 className='mt-3'>{ name }</h2>
                        }
                        {
                              editMode &&
                              <input placeholder='Enter your name' className='mt-3 mb-2' style={ { fontSize: '1.5rem', maxWidth: '250px' } } defaultValue={ name } type='text' onChange={ e => setNewName(e.target.value) }></input>
                        }
                        {
                              invalidName &&
                              <p className={ `${ styles.p } mb-2 text-center align-middle` }>
                                    Your name must not contain non-alphabeticalc character(s)!
                              </p>
                        }
                        <div className={ `${ styles.container } d-flex flex-column h-100 mb-3` }>
                              <div className={ `ms-auto me-3` }>
                                    {
                                          !editMode &&
                                          <BsPencilSquare className={ `${ styles.pencil } mt-1` } onClick={ () => triggerEdit(true) } />
                                    }
                                    {
                                          editMode &&
                                          <div className={ `align-items-center mt-1 d-flex` }>
                                                <GiCancel className={ `${ styles.pencil } ${ styles.cancel } me-1` } onClick={ () => triggerEdit(false) } />
                                                <GiConfirmed className={ `${ styles.pencil } ${ styles.confirm } ms-1` } onClick={ () => setshowpopup(true) } />
                                          </div>
                                    }
                              </div>
                              <div className={ `align-self-center overflow-auto hideBrowserScrollbar mt-2` } style={ { width: '85%' } }>
                                    <div className='d-flex align-items-center mt-2 justify-content-center'>
                                          <strong>SSN:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0'>{ ssn }</p>
                                          }
                                          {
                                                editMode && <input placeholder='Enter your SSN' className={ `${ styles.inputs }` } type='text'
                                                      defaultValue={ ssn } onChange={ e => setNewSSN(e.target.value) }></input>
                                          }
                                    </div>
                                    {
                                          invalidSSN &&
                                          <p className={ `${ styles.p } mt-2 mb-0 text-center align-middle` }>
                                                Your SSN must not contain alphabetical character(s)!
                                          </p>
                                    }
                                    {
                                          duplicateSSN &&
                                          <p className={ `${ styles.p } mt-2 mb-0 text-center align-middle` }>
                                                This SSN has already been used!
                                          </p>
                                    }
                                    <div className='d-flex align-items-center mt-2 justify-content-center'>
                                          <strong>Birthdate:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0'>{ birthday }</p>
                                          }
                                          {
                                                editMode && <input className={ `${ styles.inputs }` } type='date'
                                                      defaultValue={ YMD(birthday) } onChange={ (e) => setNewBirthday(e.target.value) }></input>
                                          }
                                    </div>
                                    {
                                          isYoung &&
                                          <p className={ `${ styles.p } mt-2 mb-0 text-center align-middle` }>
                                                Your age must be equal or above 18!
                                          </p>
                                    }
                                    <div className='d-flex align-items-center mt-2 mb-2 justify-content-center'>
                                          <strong>Birthplace:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0 overflow-auto' style={ { whiteSpace: 'nowrap' } }>{ birthplace }</p>
                                          }
                                          {
                                                editMode && <input placeholder='Enter your birthplace' className={ `${ styles.inputs }` }
                                                      defaultValue={ birthplace } onChange={ e => setNewBirthplace(e.target.value) }></input>
                                          }
                                    </div>
                                    <div className='d-flex align-items-center mt-2 justify-content-center'>
                                          <strong>Email:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0 overflow-auto' style={ { whiteSpace: 'nowrap' } }>{ email }</p>
                                          }
                                          {
                                                editMode && <input placeholder='Enter your email' className={ `${ styles.inputs }` } type='email'
                                                      defaultValue={ email } onChange={ e => setNewEmail(e.target.value) }></input>
                                          }
                                    </div>
                                    {
                                          invalidEmail &&
                                          <p className={ `${ styles.p } mt-2 mb-0 text-center align-middle` }>
                                                Your email is invalid!
                                          </p>
                                    }
                                    {
                                          duplicateEmail &&
                                          <p className={ `${ styles.p } mt-2 mb-0 text-center align-middle` }>
                                                This email has already been used!
                                          </p>
                                    }
                                    <div className='d-flex align-items-center mt-2 justify-content-center'>
                                          <strong>Phone:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0'>{ phone }</p>
                                          }
                                          {
                                                editMode && <input placeholder='Enter your phone' className={ `${ styles.inputs }` } type='text'
                                                      defaultValue={ phone } onChange={ e => setNewPhone(e.target.value) }></input>
                                          }
                                    </div>
                                    {
                                          invalidPhone &&
                                          <p className={ `${ styles.p } mt-2 mb-0 text-center align-middle` }>
                                                Your phone number must not contain alphabetical character(s)!
                                          </p>
                                    }
                                    {
                                          duplicatePhone &&
                                          <p className={ `${ styles.p } mt-2 mb-0 text-center align-middle` }>
                                                This phone has already been used!
                                          </p>
                                    }
                                    <div className='d-flex align-items-center mt-2 mb-2 justify-content-center'>
                                          <strong>Address:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0 overflow-auto' style={ { whiteSpace: 'nowrap' } }>{ address }</p>
                                          }
                                          {
                                                editMode && <input placeholder='Enter your address' className={ `${ styles.inputs }` } type='text'
                                                      defaultValue={ address } onChange={ e => setNewAddress(e.target.value) }></input>
                                          }
                                    </div>
                                    <div className='d-flex align-items-center mt-2 mb-2 justify-content-center'>
                                          <strong>Username:&nbsp;&nbsp;</strong>
                                          <p className='mb-0 overflow-auto' style={ { whiteSpace: 'nowrap' } }>{ username }</p>
                                    </div>
                                    {
                                          editMode &&
                                          <>
                                                <div className='d-flex align-items-center mt-2 mb-2 justify-content-center'>
                                                      <strong className='mb-0'>Password:&nbsp;&nbsp;</strong>
                                                      <input className={ `${ styles.inputs }` } type='password' placeholder='Change your password'
                                                            value={ password } onChange={ e => setPassword(e.target.value) }></input>
                                                </div>
                                                <div className='d-flex align-items-center mt-2 mb-2 justify-content-center'>
                                                      <strong className='mb-0'>Confirm password:&nbsp;&nbsp;</strong    >
                                                      <input className={ `${ styles.inputs }` } type='password' placeholder='Re-enter your password to confirm'
                                                            value={ repassword } onChange={ e => setRepassword(e.target.value) }></input>
                                                </div>
                                          </>
                                    }
                                    {
                                          isWrong
                                          &&
                                          <p className={ `${ styles.p } text-center align-middle` }>
                                                Your passwords are not matched!
                                          </p>
                                    }
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default Profile;