import { useEffect, useRef, useState } from 'react';
import styles from './Profile.module.css';
import { Modal } from 'react-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import { GiCancel, GiConfirmed } from 'react-icons/gi';
import { isRefValid } from '../../../tools/refChecker';
import '../../../css/scroll.css';
import axios from 'axios';
import { domain } from '../../../tools/domain';
import { DMY, YMD } from '../../../tools/dateFormat';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useOutletContext } from 'react-router-dom';

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
      const [isFuture, setIsFuture] = useState(false);

      const [render, setRender] = useState(false);

      const popUpContainer = useRef(null);
      const [showpopup, setshowpopup] = useState(false);

      const userType = useOutletContext();

      useEffect(() =>
      {
            axios.get(`http://${ domain }/profile`, {
                  withCredentials: true,
                  headers: {
                        'Content-Type': 'application/json'
                  }
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
                  setIsWrong(false);
                  setIsFuture(false);
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

      const changeInfo = (e) =>
      {
            e.preventDefault();
            let isOk = true;
            if (password !== repassword)
            {
                  setIsWrong(true);
                  isOk = false;
            }
            if (new Date(newBirthday) > new Date())
            {
                  setIsFuture(true);
                  isOk = false;
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
                              'Content-Type': 'application/json'
                        }
                  })
                        .then(res =>
                        {
                              triggerEdit(false);
                              setRender(!render);
                        })
                        .catch(err => console.log(err));
            }
      }

      return (
            <div className="w-100 h-100 d-flex overflow-auto">
                  <form className='my-auto d-flex flex-column align-items-center w-100' onSubmit={ changeInfo } ref={ popUpContainer }>
                        <Modal show={ showpopup } className={ `reAdjustModel` } container={ popUpContainer.current }>
                              <Modal.Header className='border border-0'>
                              </Modal.Header>
                              <Modal.Body className='border border-0 d-flex justify-content-center'>
                                    <h4 className='text-center'>Do you want to update your info?</h4>
                              </Modal.Body>
                              <Modal.Footer className='justify-content-center border border-0'>
                                    <button type='button' className='btn btn-danger ms-2 ms-md-4' onClick={ () =>
                                    {
                                          setshowpopup(false);
                                    } }>No</button>
                                    <button type='submit' className='btn btn-primary ms-2 ms-md-4' onClick={ () =>
                                    {
                                          setshowpopup(false);
                                    } }>Yes</button>
                              </Modal.Footer>
                        </Modal>
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
                                                      profileImg.current.src = require('../../../images/profile.png');
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
                              <input placeholder='Enter your name' className='my-3' style={ { fontSize: '1.5rem', maxWidth: '250px' } } defaultValue={ name } type='text' onChange={ e => setNewName(e.target.value) }></input>
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
                              <div className={ `align-self-center overflow-auto hideBrowserScrollbar` } style={ { width: '85%' } }>
                                    <div className='d-flex align-items-center mt-2 justify-content-center'>
                                          <strong>SSN:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0'>{ ssn }</p>
                                          }
                                          {
                                                editMode && <input placeholder='Enter your SSN' className={ `${ styles.inputs }` } type='text' maxLength='12' pattern='[0-9]{12}'
                                                      defaultValue={ ssn } onChange={ e => setNewSSN(e.target.value) }></input>
                                          }
                                    </div>
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
                                          isFuture &&
                                          <div className='d-flex align-items-center mb-2 justify-content-center'>
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px'
                                                } } className={ `${ styles.p } mt-2` } />
                                                <p className={ `${ styles.p } mt-2 mb-0` }>
                                                      Your birthday must not be the future!
                                                </p>
                                          </div>
                                    }
                                    <div className='d-flex align-items-center mt-2 justify-content-center'>
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
                                    <div className='d-flex align-items-center mt-2 mb-2 justify-content-center'>
                                          <strong>Phone:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0'>{ phone }</p>
                                          }
                                          {
                                                editMode && <input placeholder='Enter your phone' className={ `${ styles.inputs }` } type='text' maxLength='10' pattern='[0-9]{10}'
                                                      defaultValue={ phone } onChange={ e => setNewPhone(e.target.value) }></input>
                                          }
                                    </div>
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
                                          <div className='d-flex align-items-center mb-2 justify-content-center'>
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                                <p className={ `${ styles.p }` }>
                                                      Passwords are not matched!
                                                </p>
                                          </div>
                                    }
                              </div>
                        </div>
                  </form>
            </div>
      )
}

export default Profile;