import styles from './StudentCreate.module.css';
import { Modal } from 'react-bootstrap';
import '../../../../css/modal.css';
import '../../../../css/scroll.css';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { domain } from '../../../../tools/domain';
import axios from 'axios';
import { isRefValid } from '../../../../tools/refChecker';

const StudentCreate = (props) =>
{
      const [id, setID] = useState(null);
      const [name, setName] = useState(null);
      const [ssn, setSSN] = useState(null);
      const [phone, setPhone] = useState(null);
      const [email, setEmail] = useState(null);
      const [birthdate, setBirthdate] = useState(null);
      const [birthplace, setBirthplace] = useState(null);
      const [address, setAddress] = useState(null);
      const [image, setImage] = useState(null);

      const [isEmptyName, setIsEmptyName] = useState(false);
      const [isEmptySSN, setIsEmptySSN] = useState(false);
      const [isEmptyPhone, setIsEmptyPhone] = useState(false);
      const [isEmptyEmail, setIsEmptyEmail] = useState(false);
      const [isEmptyDate, setIsEmptyDate] = useState(false);
      const [invalidDate, setInvalidDate] = useState(false);
      const [invalidEmail, setInvalidEmail] = useState(false);
      const [invalidSSN, setInvalidSSN] = useState(false);
      const [invalidPhone, setInvalidPhone] = useState(false);
      const [invalidName, setInvalidName] = useState(false);
      const [isDuplicateSSN, setDuplicateSSN] = useState(false);
      const [isDuplicatePhone, setDuplicatePhone] = useState(false);
      const [isDuplicateEmail, setDuplicateEmail] = useState(false);

      const [confirmPopUp, setConfirmPopUp] = useState(false);
      const [errorPopUp, setErrorPopUp] = useState(false);

      const image_input = useRef(null);
      const profileImg = useRef(null);

      useEffect(() =>
      {
            if (!image && isRefValid(profileImg))
                  profileImg.current.src = require('../../../../images/profile.png');
            else if (image)
            {
                  // const file = image;
                  const reader = new FileReader();
                  reader.readAsArrayBuffer(image);
                  reader.onload = () =>
                  {
                        const blob = new Blob([reader.result], { type: image.type });
                        const url = URL.createObjectURL(blob);
                        if (isRefValid(profileImg))
                              profileImg.current.src = url;
                  };
            }
      }, [props.showPopUp, image]);

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

      const createStudent = async () =>
      {
            let isOk = true;
            if (!name)
            {
                  setIsEmptyName(true);
                  isOk = false;
            }
            else if (isNameInvalid(name))
            {
                  setIsEmptyName(false);
                  setInvalidName(true);
                  isOk = false;
            }
            else
            {
                  setIsEmptyName(false);
                  setInvalidName(false);
            }
            if (!birthdate)
            {
                  setIsEmptyDate(true);
                  isOk = false;
            }
            else if (!isValidAge(birthdate))
            {
                  setIsEmptyDate(false);
                  setInvalidDate(true);
                  isOk = false;
            }
            else
            {
                  setIsEmptyDate(false);
                  setInvalidDate(false);
            }
            if (!ssn)
            {
                  setIsEmptySSN(true);
                  isOk = false;
            }
            else if (hasAlphabetCharacters(ssn))
            {
                  setIsEmptySSN(false);
                  setInvalidSSN(true);
                  isOk = false;
            }
            else
            {
                  const result = await axios.post(`http://${ domain }/admin/isStudentDuplicatedSSN`, { params: { ssn: ssn } }, { headers: { 'Content-Type': 'application/json' } });
                  setIsEmptySSN(false);
                  setInvalidSSN(false);
                  setDuplicateSSN(result.data);
                  isOk = !result.data && isOk;
            }
            if (!email)
            {
                  setIsEmptyEmail(true);
                  isOk = false;
            }
            else if (!isValidEmail(email))
            {
                  setIsEmptyEmail(false);
                  setInvalidEmail(true);
                  isOk = false;
            }
            else
            {
                  const result = await axios.post(`http://${ domain }/admin/isStudentDuplicatedEmail`, { params: { email: email } }, { headers: { 'Content-Type': 'application/json' } });
                  setIsEmptyEmail(false);
                  setInvalidEmail(false);
                  setDuplicateEmail(result.data);
                  isOk = !result.data && isOk;
            }
            if (!phone)
            {
                  setIsEmptyPhone(true);
                  isOk = false;
            }
            else if (hasAlphabetCharacters(phone))
            {
                  setIsEmptyPhone(false);
                  setInvalidPhone(true);
                  isOk = false;
            }
            else
            {
                  const result = await axios.post(`http://${ domain }/admin/isStudentDuplicatedPhone`, { params: { phone: phone } }, { headers: { 'Content-Type': 'application/json' } });
                  setIsEmptyPhone(false);
                  setInvalidPhone(false);
                  setDuplicatePhone(result.data);
                  isOk = !result.data && isOk;
            }
            if (isOk)
            {
                  const result = await axios.get(`http://${ domain }/admin/getIDForNewStudent`);
                  setID(result.data[0][0].id);
                  setConfirmPopUp(true);
            }
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
            setIsEmptyDate(false);
            setIsEmptyEmail(false);
            setIsEmptySSN(false);
            setIsEmptyName(false);
            setIsEmptyPhone(false);
            setInvalidDate(false);
            setInvalidEmail(false);
            setInvalidSSN(false);
            setInvalidName(false);
            setInvalidPhone(false);
      }


      return (
            <>
                  <Modal show={ props.showPopUp } onHide={ () => props.setShowPopUp(false) }
                        dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                        className={ `reAdjustModel ${ styles.customModal1 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="d-flex flex-column align-items-center">
                                    <img alt='profile' className={ `${ styles.img } mt-2 mt-md-4` } ref={ profileImg }></img>
                                    <label className={ `btn btn-sm btn-light border border-dark mt-3 mx-auto mb-3` } ref={ image_input }>
                                          <input type='file' className='d-none' onChange={ e =>
                                          {
                                                if (e.target.files.length === 0)
                                                      setImage(null);
                                                else
                                                      setImage(e.target.files[0]);
                                          } } accept=".jpg,.jpeg,.png"></input>
                                          Choose file
                                    </label>
                              </div>
                              <div className='row mt-2'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Name</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input type='text' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setName(null);
                                                else setName(e.target.value);
                                          } }></input>
                                    </div>
                              </div>
                              {
                                    isEmptyName
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Name field is empty!
                                          </p>
                                    </div>
                              }
                              {
                                    invalidName
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Name field must not contain non-alphabetical character(s)!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ (isEmptyName || invalidName) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>SSN</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input type='text' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setSSN(null);
                                                else setSSN(e.target.value);
                                          } } maxLength={ 12 }></input>
                                    </div>
                              </div>
                              {
                                    isEmptySSN
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                SSN field is empty!
                                          </p>
                                    </div>
                              }
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
                              <div className={ `row ${ (isEmptySSN || invalidSSN || isDuplicateSSN) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Birthdate</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input className={ `${ styles.inputs } w-100` } type="date" onChange={ e =>
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
                              {
                                    isEmptyDate
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Birthdate field is empty!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ (invalidDate || isEmptyDate) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Birthplace</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input type='text' className={ `${ styles.inputs } w-100` } onChange={ e =>
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
                                          <input type='text' className={ `${ styles.inputs } w-100` } onChange={ e =>
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
                                          <input type='text' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setPhone(null);
                                                else setPhone(e.target.value);
                                          } } maxLength={ 10 }></input>
                                    </div>
                              </div>
                              {
                                    isEmptyPhone
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Phone number field is empty!
                                          </p>
                                    </div>
                              }
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
                              <div className={ `row ${ (isEmptyPhone || invalidPhone || isDuplicatePhone) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Email</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input type='email' className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                if (e.target.value === '') setEmail(null);
                                                else setEmail(e.target.value);
                                          } }></input>
                                    </div>
                              </div>
                              {
                                    isEmptyEmail
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Email field is empty!
                                          </p>
                                    </div>
                              }
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
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center'>
                              <button className='btn btn-danger me-sm-3 me-2' onClick={ clearOut }>Cancel</button>
                              <button className='btn btn-primary ms-sm-3 ms-2' onClick={ createStudent }>Create</button>
                        </Modal.Footer>
                  </Modal>
                  <Modal show={ confirmPopUp } onHide={ () => setConfirmPopUp(false) } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ props.containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to create this student info?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-danger me-2 me-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                              } }>No</button>
                              <button className={ `btn btn-primary me-2 me-md-4` } onClick={ () =>
                              {
                                    const formdata = new FormData();
                                    formdata.append('id', id);
                                    formdata.append('name', name);
                                    formdata.append('phone', phone);
                                    formdata.append('ssn', ssn);
                                    formdata.append('birthdate', birthdate);
                                    formdata.append('birthplace', birthplace);
                                    formdata.append('address', address);
                                    formdata.append('email', email);
                                    formdata.append('image', image);
                                    axios.post(`http://${ domain }/admin/createStudent`, formdata, { headers: { 'Content-Type': 'multipart/form-data' } })
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

export default StudentCreate;