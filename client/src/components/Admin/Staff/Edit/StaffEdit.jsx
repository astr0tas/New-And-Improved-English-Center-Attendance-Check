import styles from './StaffEdit.module.css';
import { Modal } from 'react-bootstrap';
import '../../../../css/modal.css';
import '../../../../css/scroll.css';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { domain } from '../../../../tools/domain';
import axios from 'axios';
import { isRefValid } from '../../../../tools/refChecker';
import { YMD } from '../../../../tools/dateFormat';

const StaffEdit = (props) =>
{
      const [oldName, setOldName] = useState(null);
      const [oldSSN, setOldSSN] = useState(null);
      const [oldPhone, setOldPhone] = useState(null);
      const [oldEmail, setOldEmail] = useState(null);
      const [oldBirthdate, setOldBirthdate] = useState(null);
      const [oldBirthplace, setOldBirthplace] = useState(null);
      const [oldAddress, setOldAddress] = useState(null);
      const [oldImage, setOldImage] = useState(null);
      const [username, setUsername] = useState(null);

      const [name, setName] = useState(null);
      const [ssn, setSSN] = useState(null);
      const [phone, setPhone] = useState(null);
      const [email, setEmail] = useState(null);
      const [birthdate, setBirthdate] = useState(null);
      const [birthplace, setBirthplace] = useState(null);
      const [address, setAddress] = useState(null);
      const [image, setImage] = useState(null);
      const [password, setPassword] = useState(null);
      const [repassword, setRepassword] = useState(null);

      const [invalidDate, setInvalidDate] = useState(false);
      const [invalidEmail, setInvalidEmail] = useState(false);
      const [invalidSSN, setInvalidSSN] = useState(false);
      const [invalidPhone, setInvalidPhone] = useState(false);
      const [invalidName, setInvalidName] = useState(false);
      const [isDuplicateSSN, setDuplicateSSN] = useState(false);
      const [isDuplicatePhone, setDuplicatePhone] = useState(false);
      const [isDuplicateEmail, setDuplicateEmail] = useState(false);
      const [passwordNotMatch, setPasswordNotMatch] = useState(false);

      const [confirmPopUp, setConfirmPopUp] = useState(false);
      const [errorPopUp, setErrorPopUp] = useState(false);

      const image_input = useRef(null);
      const profileImg = useRef(null);

      useEffect(() =>
      {
            if (props.showPopUp)
            {
                  axios.post(`http://${ domain }/admin/staffInfo`, { params: { id: props.id } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              setUsername(res.data.username);
                              setOldName(res.data.name);
                              setOldSSN(res.data.ssn);
                              setOldPhone(res.data.phone);
                              setOldEmail(res.data.email);
                              setOldAddress(res.data.address);
                              setOldBirthdate(YMD(res.data.birthday));
                              setOldBirthplace(res.data.birthplace);
                              setOldImage(res.data.image === null ? require('../../../../images/profile.png') : `http://${ domain }/image/employee/${ res.data.image }`);
                              if (!image && isRefValid(profileImg))
                                    profileImg.current.src = res.data.image === null ? require('../../../../images/profile.png') : `http://${ domain }/image/employee/${ res.data.image }`;
                              else if (image)
                              {
                                    const file = image;
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
                        })
                        .catch(err => console.log(err));
            }

            // eslint-disable-next-line
      }, [props.showPopUp, props.id]);

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

            return input.getFullYear() + 5 < now.getFullYear() || (
                  input.getFullYear() + 5 === now.getFullYear() && (
                        input.getMonth() < now.getMonth() || (
                              input.getMonth() === now.getMonth() && input.getDate() <= now.getDate()
                        )
                  )
            );
      }

      const updateStaff = async () =>
      {
            let isOk = true;
            if (name && isNameInvalid(name))
            {
                  setInvalidName(true);
                  isOk = false;
            }
            else
                  setInvalidName(false);
            if (birthdate && !isValidAge(birthdate))
            {
                  setInvalidDate(true);
                  isOk = false;
            }
            else
                  setInvalidDate(false);
            if (ssn && hasAlphabetCharacters(ssn))
            {
                  setInvalidSSN(true);
                  isOk = false;
            }
            else
            {
                  const result = await axios.post(`http://${ domain }/admin/isStaffDuplicatedSSN`, { params: { ssn: ssn } }, { headers: { 'Content-Type': 'application/json' } });
                  setInvalidSSN(false);
                  setDuplicateSSN(result.data);
                  isOk = !result.data && isOk;
            }
            if (email && !isValidEmail(email))
            {
                  setInvalidEmail(true);
                  isOk = false;
            }
            else
            {
                  const result = await axios.post(`http://${ domain }/admin/isStaffDuplicatedEmail`, { params: { email: email } }, { headers: { 'Content-Type': 'application/json' } });
                  setInvalidEmail(false);
                  setDuplicateEmail(result.data);
                  isOk = !result.data && isOk;
            }
            if (phone && hasAlphabetCharacters(phone))
            {
                  setInvalidPhone(true);
                  isOk = false;
            }
            else
            {
                  const result = await axios.post(`http://${ domain }/admin/isStaffDuplicatedPhone`, { params: { phone: phone } }, { headers: { 'Content-Type': 'application/json' } });
                  setInvalidPhone(false);
                  setDuplicatePhone(result.data);
                  isOk = !result.data && isOk;
            }
            if (password !== repassword)
            {
                  setPasswordNotMatch(true);
                  isOk = false;
            }
            setConfirmPopUp(isOk);
      }

      const clearOut = () =>
      {
            props.setShowPopUp(false);
            setImage(null);
            setName(null);
            setPhone(null);
            setSSN(null);
            setBirthdate(null);
            setBirthplace(null);
            setEmail(null);
            setAddress(null);
            setInvalidDate(false);
            setInvalidEmail(false);
            setInvalidSSN(false);
            setInvalidName(false);
            setInvalidPhone(false);
            setDuplicateSSN(false);
            setDuplicatePhone(false);
            setDuplicateEmail(false);
            setPasswordNotMatch(false);
      }


      return (
            <>
                  <Modal show={ props.showPopUp } onHide={ () => { props.setShowPopUp(false); clearOut(); } }
                        dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                        className={ `reAdjustModel ${ styles.customModal1 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="d-flex flex-column align-items-center">
                                    <img alt='profile' className={ `${ styles.img } mt-2 mt-md-4 p-0` } ref={ profileImg }></img>
                                    <label className={ `btn btn-sm btn-light border border-dark mt-3 mx-auto mb-3` } ref={ image_input }>
                                          <input type='file' className='d-none' onChange={ e =>
                                          {
                                                if (e.target.files.length === 0)
                                                {
                                                      setImage(null);
                                                      if (isRefValid(profileImg))
                                                            profileImg.current.src = oldImage;
                                                }
                                                else
                                                {
                                                      setImage(e.target.files[0]);
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
                              </div>
                              <div className='row mt-2'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Name</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input defaultValue={ oldName } placeholder={ oldName } type='text' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setName(null);
                                                else setName(e.target.value);
                                          } }></input>
                                    </div>
                              </div>
                              {
                                    invalidName
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Name field must not contain non-alphabetic character(s)!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ invalidName ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>SSN</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input defaultValue={ oldSSN } placeholder={ oldSSN } type='text' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setSSN(null);
                                                else setSSN(e.target.value);
                                          } } maxLength={ 12 }></input>
                                    </div>
                              </div>
                              {
                                    invalidSSN
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                SSN field must not contain alphabetical character(s)!
                                          </p>
                                    </div>
                              }
                              {
                                    isDuplicateSSN
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                This SSN has already been used!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ (invalidSSN || isDuplicateSSN) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Birthdate</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input defaultValue={ oldBirthdate } placeholder={ oldBirthdate } className={ `${ styles.inputs } w-100` } type="date" onChange={ e =>
                                          {
                                                if (e.target.value === '')
                                                {
                                                      setBirthdate(null);
                                                      setInvalidDate(false);
                                                }
                                                else setBirthdate(e.target.value);
                                          } }></input>
                                    </div>
                              </div>
                              {
                                    invalidDate
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Birthdate field is invalid!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ invalidDate ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Birthplace</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input defaultValue={ oldBirthplace } placeholder={ oldBirthplace } type='text' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setBirthplace(null);
                                                else setBirthplace(e.target.value);
                                          } }></input>
                                    </div>
                              </div>
                              <div className={ `row mt-5` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Address</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input defaultValue={ oldAddress } placeholder={ oldAddress } type='text' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setAddress(null);
                                                else setAddress(e.target.value);
                                          } }></input>
                                    </div>
                              </div>
                              <div className={ `row mt-5` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Phone number</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input defaultValue={ oldPhone } placeholder={ oldPhone } type='text' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setPhone(null);
                                                else setPhone(e.target.value);
                                          } } maxLength={ 10 }></input>
                                    </div>
                              </div>
                              {
                                    invalidPhone
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Phone number field must not contain alphabetical character(s)!
                                          </p>
                                    </div>
                              }
                              {
                                    isDuplicatePhone
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                This phone number has already been used!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ (invalidPhone || isDuplicatePhone) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Email</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input defaultValue={ oldEmail } placeholder={ oldEmail } type='email' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setEmail(null);
                                                else setEmail(e.target.value);
                                          } }></input>
                                    </div>
                              </div>
                              {
                                    invalidEmail
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Email field is invalid!
                                          </p>
                                    </div>
                              }
                              {
                                    isDuplicateEmail
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                This email has already been used!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ (invalidEmail || isDuplicateEmail) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Username</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input type='text' className={ `${ styles.inputs } w-100` } disabled value={ username ? username : '' }></input>
                                    </div>
                              </div>
                              <div className={ `row mt-5` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Password</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input type='password' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setPassword(null);
                                                else setPassword(e.target.value);
                                          } }></input>
                                    </div>
                              </div>
                              <div className={ `row mt-5` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Re-enter password</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input type='password' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setRepassword(null);
                                                else setRepassword(e.target.value);
                                          } }></input>
                                    </div>
                              </div>
                              {
                                    passwordNotMatch
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Passwords are not matched!
                                          </p>
                                    </div>
                              }
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center'>
                              <button className='btn btn-danger me-sm-3 me-2' onClick={ clearOut }>Cancel</button>
                              <button className='btn btn-primary ms-sm-3 ms-2' onClick={ updateStaff }>Create</button>
                        </Modal.Footer>
                  </Modal>
                  <Modal show={ confirmPopUp } onHide={ () => setConfirmPopUp(false) } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ props.containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to create this { props.staffType === 1 ? 'teacher' : 'supervisor' } info?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-danger me-2 me-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                              } }>No</button>
                              <button className={ `btn btn-primary me-2 me-md-4` } onClick={ () =>
                              {
                                    const formdata = new FormData();
                                    formdata.append('id', props.id);
                                    formdata.append('name', name);
                                    formdata.append('phone', phone);
                                    formdata.append('ssn', ssn);
                                    formdata.append('birthdate', birthdate);
                                    formdata.append('birthplace', birthplace);
                                    formdata.append('address', address);
                                    formdata.append('email', email);
                                    formdata.append('image', image);
                                    formdata.append('password', password);
                                    formdata.append('type', props.staffType);
                                    axios.post(`http://${ domain }/admin/updateStaff`, formdata, { headers: { 'Content-Type': 'multipart/form-data' } })
                                          .then(res =>
                                          {
                                                setConfirmPopUp(false);
                                                clearOut();
                                                props.setRender(!props.render);
                                          })
                                          .catch(err =>
                                          {
                                                console.log(err);
                                                setErrorPopUp(true);
                                          });
                              } }>Okay</button>
                        </Modal.Footer>
                  </Modal>
                  <Modal show={ errorPopUp } onHide={ () => setErrorPopUp(false) } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ props.containerRef.current }>
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
            </>
      )
}

export default StaffEdit;