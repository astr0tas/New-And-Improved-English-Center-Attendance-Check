import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import styles from './SessionDetail.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { domain } from '../../../../tools/domain';
import axios from 'axios';
import { DMDY } from '../../../../tools/dateFormat';
import '../../../../css/scroll.css';
import '../../../../css/modal.css';
import { Modal } from 'react-bootstrap';
import { isRefValid } from '../../../../tools/refChecker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';

const TeacherSelect = (props) =>
{
      const [searchTeacher, setSearchTeacher] = useState("");
      const [teacherListContent, setTeacherListContent] = useState([]);

      let timer;

      useEffect(() =>
      {
            if (props.changeTeacherPopUp)
            {
                  axios.post(`http://${ domain }/admin/classTeacher`, { params: { name: props.name, teacherName: searchTeacher } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<tr key={ i }>
                                          <td className='text-center align-middle'>{ i + 1 }</td>
                                          <td className='text-center align-middle'>{ res.data[i].name }</td>
                                          <td className='text-center align-middle'>{ res.data[i].phone }</td>
                                          <td className='text-center align-middle'>{ res.data[i].email }</td>
                                          <td className='text-center align-middle'>
                                                <div className='d-flex flex-column flex-sm-row align-items-center justify-content-center'>
                                                      <input className={ `me-sm-2 mb-1 mb-sm-0 ${ styles.hover }` } type='radio' style={ { width: '1.3rem', height: '1.3rem' } }
                                                            name='teacherSelector' onChange={ () => props.setNewTeacher(res.data[i].id) }
                                                            checked={ props.newTeacher === res.data[i].id }></input>
                                                      <button className='btn btn-sm btn-primary ms-sm-2' onClick={ () => props.Navigate(`/staff-list/detail/${ res.data[i].id }`) }>Detail</button>
                                                </div>
                                          </td>
                                    </tr>);
                              setTeacherListContent(temp);
                        })
                        .catch(err => console.error(err));
            }
      }, [searchTeacher, props]);

      return (
            <Modal show={ props.changeTeacherPopUp } onHide={ () =>
            {
                  props.setChangeTeacherPopUp(false);
                  props.setNewTeacher(null);
            } }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <div>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input type='text' style={ { fontSize: '1rem', paddingLeft: '30px' } } onChange={ e =>
                              {
                                    clearTimeout(timer);

                                    timer = setTimeout(() =>
                                    {
                                          setSearchTeacher(e.target.value);
                                    }, 1000);
                              } } className={ `${ styles.searchInput }` }></input>
                        </div>
                  </Modal.Header>
                  <Modal.Body className='px-1 py-0' style={ { minHeight: teacherListContent.length ? '150px' : '65px' } }>
                        <div className={ `h-100 w-100` }>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-4 text-center align-middle'>Name</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Phone number</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Email</th>
                                                <th scope="col" className='col-3 text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { teacherListContent }
                                    </tbody>
                              </table>
                        </div >
                  </Modal.Body>
                  <Modal.Footer className='justify-content-center'>
                        <button className={ `btn btn-danger me-2 me-md-4` } onClick={ () =>
                        {
                              props.setChangeTeacherPopUp(false);
                              props.setNewTeacher(null);
                        } }>Cancel</button>
                        <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () => props.setConfirmChangeTeacher(true) }
                              disabled={ props.newTeacher === props.teacherID }>Confirm</button>
                  </Modal.Footer>
            </Modal>
      )
}

const SupervisorSelect = (props) =>
{
      const [searchSupervisor, setSearchSupervisor] = useState("");
      const [supervisorListContent, setSupervisorListContent] = useState([]);

      let timer;

      useEffect(() =>
      {
            if (props.changeSupervisorPopUp)
            {
                  axios.post(`http://${ domain }/admin/staffList`, { params: { name: searchSupervisor, type: 2 } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<tr key={ i }>
                                          <td className='text-center align-middle'>{ i + 1 }</td>
                                          <td className='text-center align-middle'>{ res.data[i].name }</td>
                                          <td className='text-center align-middle'>{ res.data[i].phone }</td>
                                          <td className='text-center align-middle'>{ res.data[i].email }</td>
                                          <td className='text-center align-middle'>
                                                <div className='d-flex flex-column flex-sm-row align-items-center justify-content-center'>
                                                      <input className={ `me-sm-2 mb-1 mb-sm-0 ${ styles.hover }` } type='radio' style={ { width: '1.3rem', height: '1.3rem' } }
                                                            name='supervisorSelector' onChange={ () => props.setNewSupervisor(res.data[i].id) }
                                                            checked={ props.newSupervisor === res.data[i].id }></input>
                                                      <button className='btn btn-sm btn-primary ms-sm-2' onClick={ () => props.Navigate(`/staff-list/detail/${ res.data[i].id }`) }>Detail</button>
                                                </div>
                                          </td>
                                    </tr>);
                              setSupervisorListContent(temp);
                        })
                        .catch(err => console.error(err));
            }
      }, [searchSupervisor, props]);

      return (
            <Modal show={ props.changeSupervisorPopUp } onHide={ () =>
            {
                  props.setChangeSupervisorPopUp(false);
                  props.setNewSupervisor(null);
            } }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <div>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input type='text' style={ { fontSize: '1rem', paddingLeft: '30px' } } onChange={ e =>
                              {
                                    clearTimeout(timer);

                                    timer = setTimeout(() =>
                                    {
                                          setSearchSupervisor(e.target.value);
                                    }, 1000);
                              } } className={ `${ styles.searchInput }` }></input>
                        </div>
                  </Modal.Header>
                  <Modal.Body className='px-1 py-0' style={ { minHeight: supervisorListContent.length ? '150px' : '65px' } }>
                        <div className={ `h-100 w-100` }>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-4 text-center align-middle'>Name</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Phone number</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Email</th>
                                                <th scope="col" className='col-3 text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { supervisorListContent }
                                    </tbody>
                              </table>
                        </div >
                  </Modal.Body>
                  <Modal.Footer className='justify-content-center'>
                        <button className={ `btn btn-danger me-2 me-md-4` } onClick={ () =>
                        {
                              props.setChangeSupervisorPopUp(false);
                              props.setNewSupervisor(null);
                        } }>Cancel</button>
                        <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () => props.setConfirmChangeSupervisor(true) }
                              disabled={ props.newSupervisor === props.supervisorID }>Confirm</button>
                  </Modal.Footer>
            </Modal>
      )
}

const Student = forwardRef((props, ref) =>
{
      const [studentStatus, setStudentStatus] = useState(-1);
      const [studentNote, setStudentNote] = useState(null);

      const toggleStatus = (status) =>
      {
            setStudentStatus(status);
      }

      useImperativeHandle(ref, () => ({
            id: props.id,
            status: studentStatus,
            note: studentNote,
            toggleStatus: toggleStatus
      }));

      useEffect(() =>
      {
            axios.post(`http://${ domain }/admin/getStudentSessionAttendace`, { params: { className: props.className, sessionNumber: props.sessionNumber, id: props.id } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        if (res.data.length)
                        {
                              setStudentStatus(res.data[0].status);
                              setStudentNote(res.data[0].note);
                        }
                  })
                  .catch(err => console.log(err));

      }, [props.id, props.className, props.sessionNumber, props.i, props.status]);

      return (
            <tr>
                  <td className='text-center align-middle'>{ props.i }</td>
                  <td className='text-center align-middle'>{ props.name }</td>
                  <td className='text-center align-middle'><button className='btn btn-sm btn-primary' onClick={ () => props.Navigate(`/student-list/detail/${ props.id }`) }>Detail</button></td>
                  <td className='text-center align-middle'>
                        <input name={ `${ props.id }_attendace` } type='radio' className={ `${ (props.status === 1 || props.status === 2) ? styles.hover : '' }` }
                              style={ { width: '1.3rem', height: '1.3rem' } }
                              checked={ studentStatus === 1 }
                              onChange={ () => toggleStatus(1) }
                              disabled={ !(props.status === 1 || props.status === 2) }>
                        </input>
                  </td>
                  <td className='text-center align-middle'>
                        <input name={ `${ props.id }_attendace` } type='radio' className={ `${ (props.status === 1 || props.status === 2) ? styles.hover : '' }` }
                              style={ { width: '1.3rem', height: '1.3rem' } }
                              checked={ studentStatus === 2 }
                              onChange={ () => toggleStatus(2) }
                              disabled={ !(props.status === 1 || props.status === 2) }>
                        </input>
                  </td>
                  <td className='text-center align-middle'>
                        <input name={ `${ props.id }_attendace` } type='radio' className={ `${ (props.status === 1 || props.status === 2) ? styles.hover : '' }` }
                              style={ { width: '1.3rem', height: '1.3rem' } }
                              checked={ studentStatus === 3 }
                              onChange={ () => toggleStatus(3) }
                              disabled={ !(props.status === 1 || props.status === 2) }>
                        </input>
                  </td>
                  <td className='text-center align-middle'>
                        <input type='text'
                              value={ studentNote ? studentNote : '' }
                              onChange={ e =>
                              {
                                    if (e.target.value !== '')
                                          setStudentNote(e.target.value)
                                    else
                                          setStudentNote(null);
                              } } disabled={ !(props.status === 1 || props.status === 2) }>
                        </input>
                  </td>
            </tr>
      )
});

const AdminClassSessionDetail = () =>
{
      const name = useParams().name;
      const number = useParams().number.split(' ')[1];

      document.title = `Class ${ name } Session ${ number }`;

      const [room, setRoom] = useState("N/A");
      const [status, setStatus] = useState("N/A");
      const [makeUp, setMakeUp] = useState(null);
      const [date, setDate] = useState(null);
      const [start, setStart] = useState(null);
      const [end, setEnd] = useState(null);

      const [teacherID, setTeacherID] = useState(null);
      const [teacherName, setTeacherName] = useState("N/A");
      const [teacherImage, setTeacherImage] = useState(require('../../../../images/profile.png'));
      const [supervisorID, setSupervisorID] = useState(null);
      const [supervisorName, setSupervisorName] = useState("N/A");
      const [supervisorImage, setSupervisorImage] = useState(require('../../../../images/profile.png'));

      const [studentList, setStudentList] = useState([]);
      const [roomList, setRoomList] = useState([]);
      const [newClassRoom, setNewClassRoom] = useState(null);
      const childrenRefs = useRef([]);

      const [teacherStatus, setTeacherStatus] = useState(-1);
      const [teacherNote, setTeacherNote] = useState(null);

      const [render, setRender] = useState(false);

      const [showPopUp1, setShowPopUp1] = useState(false);
      const [showPopUp2, setShowPopUp2] = useState(false);
      const [showPopUp3, setShowPopUp3] = useState(false);
      const [showPopUp4, setShowPopUp4] = useState(false);
      const [showPopUp5, setShowPopUp5] = useState(false);
      const containerRef = useRef(null);
      const radioOnClass = useRef(null);
      const radioAbsent = useRef(null);
      const radioLate = useRef(null);

      const [changeTeacherPopUp, setChangeTeacherPopUp] = useState(false);
      const [changeSupervisorPopUp, setChangeSupervisorPopUp] = useState(false);
      const [newTeacher, setNewTeacher] = useState(null);
      const [newSupervisor, setNewSupervisor] = useState(null);

      const [confirmChangeTeacher, setConfirmChangeTeacher] = useState(false);
      const [confirmChangeSupervisor, setConfirmChangeSupervisor] = useState(false);
      const [confirmChangeClassRoom, setConfirmChangeClassRoom] = useState(false);

      const Navigate = useNavigate();

      const toggleStatus = (status) =>
      {
            for (let i = 0; i < childrenRefs.current.length; i++)
            {
                  if (isRefValid(childrenRefs, i))
                  {
                        childrenRefs.current[i].toggleStatus(status);
                  }
            }
      }

      const toggleSessionStatus = (status) =>
      {
            if (status)
                  setShowPopUp4(true);
            else
                  setShowPopUp1(true);
      }

      const checkAttendance = () =>
      {
            let isOK = true;
            if (teacherStatus === -1)
            {
                  setShowPopUp2(true);
                  isOK = false;
            }
            else
            {
                  for (let i = 0; i < childrenRefs.current.length; i++)
                  {
                        if (childrenRefs.current[i].status === -1)
                        {
                              setShowPopUp3(true);
                              isOK = false;
                              break;
                        }
                  }
            }
            if (isOK)
            {
                  axios.post(`http://${ domain }/admin/checkAttendance`,
                        { params: { name: name, number: number, students: childrenRefs.current, teacher: { id: teacherID, status: teacherStatus, note: teacherNote } } },
                        { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              setShowPopUp5(true);
                        })
                        .catch(err => console.log(err));
            }
      }

      useEffect(() =>
      {
            axios.post(`http://${ domain }/admin/classSessionDetail`, { params: { name: name, number: number } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        setDate(res.data.session_date);
                        setRoom(res.data.classroom_id ? res.data.classroom_id : 'N/A');
                        setStart(res.data.start_hour);
                        setEnd(res.data.end_hour);
                        setStatus(res.data.status ? res.data.status : 'N/A');
                        setMakeUp(res.data.session_number_make_up_for);

                        if (res.data.status === 4)
                        {
                              axios.post(`http://${ domain }/admin/getSuitableRoom`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                                    .then(respone =>
                                    {
                                          const temp = [];
                                          for (let i = 0; i < respone.data.length; i++)
                                                if (respone.data[i].id !== res.data.classroom_id)
                                                      temp.push(<Dropdown.Item key={ i } eventKey={ respone.data[i].id }>
                                                            { respone.data[i].id }&nbsp;-&nbsp;{ respone.data[i].max_seats }
                                                      </Dropdown.Item>);
                                          setRoomList(temp);
                                    })
                                    .catch(err => console.log(err));
                        }
                  })
                  .catch(err => console.error(err));

            axios.post(`http://${ domain }/admin/getSessionTeacher`, { params: { name: name, number: number } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        if (res.data !== '')
                        {
                              setTeacherID(res.data.id ? res.data.id : null);
                              setTeacherName(res.data.name ? res.data.name : 'N/A');
                              setTeacherImage(res.data.image ? `http://${ domain }/image/employee/${ res.data.image }` : require('../../../../images/profile.png'));
                              setTeacherStatus(res.data.status);
                              setTeacherNote(res.data.note);
                              setNewTeacher(res.data.id ? res.data.id : null);
                        }
                  })
                  .catch(err => console.error(err));

            axios.post(`http://${ domain }/admin/getSessionSupervisor`, { params: { name: name, number: number } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        if (res.data !== '')
                        {
                              setSupervisorID(res.data.id ? res.data.id : null);
                              setSupervisorName(res.data.name ? res.data.name : 'N/A');
                              setSupervisorImage(res.data.image ? `http://${ domain }/image/employee/${ res.data.image }` : require('../../../../images/profile.png'));
                              setNewSupervisor(res.data.id ? res.data.id : null);
                        }
                  })
                  .catch(err => console.error(err));

            axios.post(`http://${ domain }/admin/getSessionStudent`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        if (res.data !== '')
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Student Navigate={ Navigate } key={ i } i={ i + 1 } ref={ el => childrenRefs.current[i] = el }
                                          id={ res.data[i].id } name={ res.data[i].name }
                                          className={ name } sessionNumber={ number } status={ status } />);
                              setStudentList(temp);
                        }
                  })
                  .catch(err => console.error(err));

            if (isRefValid(radioOnClass))
                  radioOnClass.current.checked = false;
            if (isRefValid(radioLate))
                  radioLate.current.checked = false;
            if (isRefValid(radioAbsent))
                  radioAbsent.current.checked = false;

      }, [number, name, Navigate, render, status]);

      return (
            <div className='w-100 h-100 d-flex flex-column align-items-center' ref={ containerRef }>
                  <div className='w-100 flex-grow-1 d-flex flex-column mb-2 mt-2 overflow-auto hideBrowserScrollbar'>
                        <div className='w-100 d-flex flex-column flex-xl-row align-items-center'>
                              <div className={ `d-flex flex-column align-items-center ms-xl-5 mt-5 ${ styles.section } h-75` }>
                                    <h2>Session { number ? number : 'N/A' }</h2>
                                    <p className='text-center align-middle'>Date: { date ? DMDY(date) : 'N/A' }</p>
                                    <p>Time: { start ? start : 'N/A' } - { end ? end : 'N/A' }</p>
                                    <div className='d-flex align-items-center'>
                                          <p>Room: { room }</p>
                                          {
                                                status === 4 &&
                                                <Dropdown onSelect={ eventKey => { setNewClassRoom(eventKey); setConfirmChangeClassRoom(true); } } className='ms-2 mb-3'>
                                                      <Dropdown.Toggle variant="secondary" size='sm' style={ { maxWidth: '150px' } } className='text-wrap'>
                                                            { room }
                                                      </Dropdown.Toggle>
                                                      <Dropdown.Menu style={ { maxHeight: '150px', overflow: 'auto' } }>
                                                            <Dropdown.Item eventKey={ null }>Clear</Dropdown.Item>
                                                            { roomList }
                                                      </Dropdown.Menu>
                                                </Dropdown> }
                                    </div>
                                    <div className='d-flex align-items-center'>
                                          <p className='mb-0'>Satus:&nbsp;</p>
                                          <p className='mb-0 me-3' style={ {
                                                color: status === 1 ? '#128400' : (
                                                      status === 2 ? 'gray' : (
                                                            (status === 3 || status === 5) ? 'red' : (
                                                                  status === 4 ? 'blue' : 'black'
                                                            )
                                                      )
                                                )
                                          } }>{ status === 1 ? 'On going' : (
                                                status === 2 ? 'Finished' : (
                                                      status === 3 ? 'Canceled' : (
                                                            status === 4 ? 'Scheduled' : (
                                                                  status === 5 ? 'Missing teacher/supervisor' : 'N/A'
                                                            )
                                                      )
                                                )
                                          ) }</p>
                                          { (status === 1 || status === 2 || status === 4 || status === 5) && <button className='btn btn-sm btn-danger' onClick={ () => toggleSessionStatus(false) }>Cancel</button> }
                                          { status === 3 && <button className='btn btn-sm btn-success' onClick={ () => toggleSessionStatus(true) }>Restore</button> }
                                    </div>
                                    { makeUp && <p>Make for session { makeUp }</p> }
                              </div>
                              <div className={ `${ styles.section } d-flex flex-column flex-xl-row align-items-center align-items-xl-start justify-content-xl-around` }>
                                    <div className='d-flex flex-column align-items-center mt-3'>
                                          <h4>{ teacherName }</h4>
                                          <button className='btn btn-sm btn-secondary mb-3' onClick={ () => setChangeTeacherPopUp(true) }>Change</button>
                                          <img className={ `${ styles.images }` } alt='' src={ teacherImage }></img>
                                          <button className='btn btn-sm btn-primary mt-2' onClick={ () => Navigate(`/staff-list/detail/${ teacherID }`) }>Detail</button>
                                          <div className='d-flex align-items-center justify-content-center mt-2 mb-2'>
                                                <div className='d-flex flex-column align-items-center me-4'>
                                                      <label htmlFor='teacherOnClass' style={ { color: '#128400' } }>On class</label>
                                                      <input name='teacherAttendance' id='teacherOnClass' type='radio'
                                                            style={ { width: '1.3rem', height: '1.3rem' } } className={ `${ (status === 1 || status === 2) ? styles.hover : '' } ` }
                                                            checked={ teacherStatus === 1 } onChange={ () => setTeacherStatus(1) } disabled={ !(status === 1 || status === 2) }></input>
                                                </div>
                                                <div className='d-flex flex-column align-items-center'>
                                                      <label htmlFor='teacherLate' style={ { color: 'orange' } }>Late</label>
                                                      <input name='teacherAttendance' id='teacherLate' type='radio'
                                                            style={ { width: '1.3rem', height: '1.3rem' } } className={ `${ (status === 1 || status === 2) ? styles.hover : '' }` }
                                                            checked={ teacherStatus === 2 } onChange={ () => setTeacherStatus(2) } disabled={ !(status === 1 || status === 2) }></input>
                                                </div>
                                                <div className='d-flex flex-column align-items-center ms-4'>
                                                      <label htmlFor='teacherAbsent' style={ { color: 'red' } }>Absent</label>
                                                      <input name='teacherAttendance' id='teacherAbsent' type='radio'
                                                            style={ { width: '1.3rem', height: '1.3rem' } } className={ `${ (status === 1 || status === 2) ? styles.hover : '' }` }
                                                            checked={ teacherStatus === 3 } onChange={ () => setTeacherStatus(3) } disabled={ !(status === 1 || status === 2) }></input>
                                                </div>
                                          </div>
                                          <label htmlFor='teacherNote'>Note</label>
                                          <input type='text' id='teacherNote' className='w-100' value={ teacherNote ? teacherNote : '' } onChange={ e =>
                                          {
                                                if (e.target.value !== '')
                                                      setTeacherNote(e.target.value);
                                                else
                                                      setTeacherNote(null);
                                          } } disabled={ !(status === 1 || status === 2) }></input>
                                    </div>
                                    <div className='d-flex flex-column align-items-center mt-3'>
                                          <h4>{ supervisorName }</h4>
                                          <button className='btn btn-sm btn-secondary mb-3' onClick={ () => setChangeSupervisorPopUp(true) }>Change</button>
                                          <img className={ `${ styles.images }` } alt='' src={ supervisorImage }></img>
                                          <button className='btn btn-sm btn-primary mt-2' onClick={ () => Navigate(`/staff-list/detail/${ supervisorID }`) }>Detail</button>
                                    </div>
                              </div>
                        </div>
                        <div className='flex-grow-1 w-100 overflow-auto mt-3 px-1' style={ { minHeight: studentList.length ? '250px' : '70px' } }>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-3 text-center align-middle'>Name</th>
                                                <th scope="col" className='col-1 text-center align-middle'></th>
                                                <th scope="col" className='col-1 text-center align-middle'>
                                                      <div className="d-flex flex-column align-items-center justify-content-center">
                                                            <p className='mb-2'>On class</p>
                                                            {
                                                                  studentList.length && (status === 1 || status === 2) &&
                                                                  <input name="allAttendance" type="radio"
                                                                        className={ `${ styles.hover }` } style={ { width: '1.3rem', height: '1.3rem' } }
                                                                        onChange={ () => toggleStatus(1) } ref={ radioOnClass }>
                                                                  </input>
                                                            }
                                                      </div>
                                                </th>
                                                <th scope="col" className='col-1 text-center align-middle'>
                                                      <div className="d-flex flex-column align-items-center justify-content-center">
                                                            <p className='mb-2'>Late</p>
                                                            {
                                                                  studentList.length && (status === 1 || status === 2) &&
                                                                  <input name="allAttendance" type="radio"
                                                                        className={ `${ styles.hover }` } style={ { width: '1.3rem', height: '1.3rem' } }
                                                                        onChange={ () => toggleStatus(2) } ref={ radioLate }>
                                                                  </input>
                                                            }
                                                      </div>
                                                </th>
                                                <th scope="col" className='col-1 text-center align-middle'>
                                                      <div className="d-flex flex-column align-items-center justify-content-center">
                                                            <p className='mb-2'>Absent</p>
                                                            {
                                                                  studentList.length && (status === 1 || status === 2) &&
                                                                  <input name="allAttendance" type="radio"
                                                                        className={ `${ styles.hover }` } style={ { width: '1.3rem', height: '1.3rem' } }
                                                                        onChange={ () => toggleStatus(3) } ref={ radioAbsent }>
                                                                  </input>
                                                            }
                                                      </div>
                                                </th>
                                                <th scope="col" className='col-3 text-center align-middle'>Note</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { studentList }
                                    </tbody>
                              </table>
                        </div>
                        <div className='w-100 d-flex flex-column align-items-center mb-3 mt-2'>
                              <label htmlFor='classNote' style={ { fontWeight: 'bold' } }>Note for class&nbsp;&nbsp;</label>
                              <input id='classNote' type='text' style={ { width: '250px' } } disabled={ !(status === 1 || status === 2) }></input>
                        </div>
                        <div className='w-100 d-flex align-items-center justify-content-center mb-3'>
                              <button className='btn btn-secondary me-3' onClick={ () => Navigate(`/class-list/detail/${ name }`) }>Back</button>
                              {
                                    (status === 1 || status === 2) &&
                                    <button className='btn btn-primary ms-3' onClick={ checkAttendance }>Confirm</button>
                              }
                        </div>
                  </div>
                  <Modal show={ showPopUp1 } onHide={ () => setShowPopUp1(false) } className={ `reAdjustModel hideBrowserScrollbar` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to cancel this session?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-primary me-2 me-md-4` } onClick={ () => setShowPopUp1(false) }>NO</button>
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setShowPopUp1(false);
                                    axios.post(`http://${ domain }/admin/cancelSession`, { params: { name: name, number: number } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res => setRender(!render))
                                          .catch(err => console.error(err));
                              } }>YES</button>
                        </Modal.Footer>
                  </Modal>

                  <Modal show={ showPopUp4 } onHide={ () => setShowPopUp4(false) } className={ `reAdjustModel hideBrowserScrollbar` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to restore this session?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-primary me-2 me-md-4` } onClick={ () => setShowPopUp4(false) }>No</button>
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setShowPopUp4(false);
                                    axios.post(`http://${ domain }/admin/restoreSession`, { params: { name: name, number: number } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res => setRender(!render))
                                          .catch(err => console.error(err));
                              } }>Yes</button>
                        </Modal.Footer>
                  </Modal>

                  <Modal show={ showPopUp2 } onHide={ () => setShowPopUp2(false) } className={ `reAdjustModel hideBrowserScrollbar` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Teach has not been checked!</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-primary` } onClick={ () => setShowPopUp2(false) }>Yes</button>
                        </Modal.Footer>
                  </Modal>

                  <Modal show={ showPopUp3 } onHide={ () => setShowPopUp3(false) } className={ `reAdjustModel hideBrowserScrollbar` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>One or more students have not been checked!</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-primary` } onClick={ () => setShowPopUp3(false) }>Yes</button>
                        </Modal.Footer>
                  </Modal>

                  <Modal show={ showPopUp5 } onHide={ () =>
                  {
                        setShowPopUp5(false);
                        setRender(!render);
                  } } className={ `reAdjustModel hideBrowserScrollbar` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Attendance check successfully!</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-primary` } onClick={ () =>
                              {
                                    setShowPopUp5(false);
                                    setRender(!render);
                              } }>Confirm</button>
                        </Modal.Footer>
                  </Modal>

                  <Modal show={ confirmChangeClassRoom } onHide={ () => setConfirmChangeClassRoom(false) } className={ `reAdjustModel hideBrowserScrollbar` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to change this session class room?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-danger me-2 me-md-4` } onClick={ () => setConfirmChangeClassRoom(false) }>No</button>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setConfirmChangeClassRoom(false);
                                    axios.post(`http://${ domain }/admin/changeClassRoom`, { params: { name: name, number: number, room: newClassRoom } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res => setRender(!render))
                                          .catch(err => console.error(err));
                              } }>Yes</button>
                        </Modal.Footer>
                  </Modal>

                  <TeacherSelect changeTeacherPopUp={ changeTeacherPopUp } setChangeTeacherPopUp={ setChangeTeacherPopUp } name={ name } setConfirmChangeTeacher={ setConfirmChangeTeacher }
                        containerRef={ containerRef } newTeacher={ newTeacher } setNewTeacher={ setNewTeacher } Navigate={ Navigate } teacherID={ teacherID } />
                  <SupervisorSelect changeSupervisorPopUp={ changeSupervisorPopUp } setChangeSupervisorPopUp={ setChangeSupervisorPopUp } name={ name } setConfirmChangeSupervisor={ setConfirmChangeSupervisor }
                        containerRef={ containerRef } newSupervisor={ newSupervisor } setNewSupervisor={ setNewSupervisor } Navigate={ Navigate } supervisorID={ supervisorID } />

                  <Modal show={ confirmChangeTeacher } onHide={ () => { setConfirmChangeTeacher(false); } } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to change this session teacher?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-danger me-2 me-md-4` } onClick={ () =>
                              {
                                    setConfirmChangeTeacher(false);
                              } }>No</button>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setNewTeacher(null);
                                    setConfirmChangeTeacher(false);
                                    setChangeTeacherPopUp(false);
                                    axios.post(`http://${ domain }/admin/changeTeacher`, {
                                          params: {
                                                name: name,
                                                number: number,
                                                teacher: newTeacher
                                          }
                                    }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res => setRender(!render))
                                          .catch(err => console.error(err));
                              } }>Yes</button>
                        </Modal.Footer>
                  </Modal>

                  <Modal show={ confirmChangeSupervisor } onHide={ () => { setConfirmChangeSupervisor(false); } } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to change this session supervisor?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-danger me-2 me-md-4` } onClick={ () =>
                              {
                                    setConfirmChangeSupervisor(false);
                              } }>No</button>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setNewSupervisor(null);
                                    setConfirmChangeSupervisor(false);
                                    setChangeSupervisorPopUp(false);
                                    axios.post(`http://${ domain }/admin/changeSupervisor`, {
                                          params: {
                                                name: name,
                                                number: number,
                                                supervisor: newSupervisor
                                          }
                                    }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res => setRender(!render))
                                          .catch(err => console.error(err));
                              } }>Yes</button>
                        </Modal.Footer>
                  </Modal>
            </div >
      )
}

export default AdminClassSessionDetail;