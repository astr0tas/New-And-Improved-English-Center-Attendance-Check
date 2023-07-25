import styles from './StudentCreate.module.css';
import { Modal } from 'react-bootstrap';
import '../../../../css/modal.css';
import '../../../../css/scroll.css';
import { useState, useEffect } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const ClassSelect = (props) =>
{
      const [searchName, setSearchName] = useState('');
      const [render, setRender] = useState(false);
      const [tableContent, setTableContent] = useState([]);

      let timer;

      const configList = (e, name) =>
      {
            if (e.target.checked)
                  props.setClassList(prev => [...prev, name]);
            else
                  props.setClassList(props.classList.filter(elem => elem !== name));
      }

      useEffect(() =>
      {

      }, [props.showPopUp, props.classList]);

      return (
            <Modal show={ props.showPopUp } onHide={ () => { props.setShowPopUp(false); setSearchName(''); } }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <div>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input value={ searchName } type='text' style={ { fontSize: '1rem', paddingLeft: '30px', maxWidth: '200px' } } onChange={ e =>
                              {
                                    setSearchName(e.target.value);
                                    clearTimeout(timer);
                                    timer = setTimeout(() =>
                                    {
                                          setRender(!render);
                                    }, 1000);
                              } }></input>
                        </div>
                  </Modal.Header>
                  <Modal.Body className='px-1 py-0' style={ { minHeight: tableContent.length ? '150px' : '65px' } }>
                        <div className={ `h-100 w-100` }>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-3 text-center align-middle'>Name</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Start date</th>
                                                <th scope="col" className='col-2 text-center align-middle'>End date</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Students</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { tableContent }
                                    </tbody>
                              </table>
                        </div >
                  </Modal.Body>
                  <Modal.Footer className='justify-content-center'>
                        <button className={ `btn btn-danger` } onClick={ () =>
                        {
                              props.setClassList([]);
                              setSearchName('');
                        } }>Clear</button>
                  </Modal.Footer>
            </Modal>
      )
}

const StudentCreate = (props) =>
{
      const [name, setName] = useState(null);
      const [ssn, setSSN] = useState(null);
      const [phone, setPhone] = useState(null);
      const [email, setEmail] = useState(null);
      const [birthdate, setBirthdate] = useState(null);
      const [birthplace, setBirthplace] = useState(null);
      const [address, setAddress] = useState(null);
      const [classList, setClassList] = useState([]);

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

      const [classPopUp, setClassPopUp] = useState(false);
      const [errorPopUp, setErrorPopUp] = useState(false);

      function hasAlphabetCharacters(inputString)
      {
            const alphabetPattern = /[a-zA-Z]/;

            return alphabetPattern.test(inputString);
      }

      function hasNumericalCharacters(inputString)
      {
            const numbericalPattern = /[0-9]/;

            return numbericalPattern.test(inputString);
      }

      function isValidEmail(email)
      {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
      }

      const createStudent = () =>
      {
            let isOk = true;
            if (!name)
            {
                  setIsEmptyName(true);
                  isOk = false;
            }
            else if (hasNumericalCharacters(name))
            {
                  setInvalidName(true);
                  isOk = false;
            }
            if (!birthdate)
            {
                  setIsEmptyDate(true);
                  isOk = false;
            }
            else if (birthdate)
            {
                  setInvalidDate(true);
                  isOk = false;
            }
            if (!ssn)
            {
                  setIsEmptySSN(true);
                  isOk = false;
            }
            else if (hasAlphabetCharacters(ssn))
            {
                  setInvalidSSN(true);
                  isOk = false;
            }
            if (!email)
            {
                  setIsEmptyEmail(true);
                  isOk = false;
            }
            else if (!isValidEmail(email))
            {
                  setInvalidEmail(true);
                  isOk = false;
            }
            if (!phone)
            {
                  setIsEmptyPhone(true);
                  isOk = false;
            }
            else if (hasAlphabetCharacters(phone))
            {
                  setInvalidPhone(true);
                  isOk = false;
            }
            props.setShowPopUp(isOk);
      }

      const clearOut = () =>
      {
            props.setShowPopUp(false);
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
                              <div className='row mb-5 mt-2'>
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
                                                Name field must not contain numerical character(s)!
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
                                          } }></input>
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
                              <div className={ `row ${ (isEmptySSN || invalidSSN) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Birthdate</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input className={ `${ styles.inputs } w-100` } type="date" onChange={ e =>
                                          {

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
                                          } }></input>
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
                                                Phone field must not contain alphabetical character(s)!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ (isEmptyPhone || invalidPhone) ? 'mt-1' : 'mt-5' }` }>
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
                              <div className={ `row ${ (isEmptyEmail || invalidEmail) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Class</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <p className={ `${ styles.inputs } ${ styles.hover } w-100 mb-0 ps-2 pt-1 hideBrowserScrollbar` } onClick={ () => setClassPopUp(true) }>{
                                                classList.length !== 0 && classList.map((elem, i) => `${ elem }${ i === classList.length - 1 ? '' : ',' }`)
                                          }</p>
                                    </div>
                              </div>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center'>
                              <button className='btn btn-danger me-sm-3 me-2' onClick={ clearOut }>Cancel</button>
                              <button className='btn btn-primary ms-sm-3 ms-2' onClick={ createStudent }>Create</button>
                        </Modal.Footer>
                  </Modal>
                  <Modal show={ errorPopUp } onHide={ () => { setErrorPopUp(false); } } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ props.containerRef.current }>
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
                  <ClassSelect showPopUp={ classPopUp } setShowPopUp={ setClassPopUp }
                        classList={ classList } setClassList={ setClassList } containerRef={ props.containerRef } />
            </>
      )
}

export default StudentCreate;