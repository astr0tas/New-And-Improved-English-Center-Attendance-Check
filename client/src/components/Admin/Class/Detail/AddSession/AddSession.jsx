import styles from './AddSession.module.css';
import { useState, useEffect } from "react";
import axios from 'axios';
import { domain } from "../../../../../tools/domain";
import { Modal } from 'react-bootstrap';
import '../../../../../css/scroll.css';
import '../../../../../css/modal.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const TeacherSelect = (props) =>
{
      const [searchTeacher, setSearchTeacher] = useState("");
      const [teacherListContent, setTeacherListContent] = useState([]);
      const [render, setRender] = useState(false);

      let timer;

      useEffect(() =>
      {
            if (props.addTeacherPopUp && props.date !== null && props.timetable !== null)
            {
                  axios.post(`http://${ domain }/admin/classTeacher`, { params: { name: props.name, teacherName: searchTeacher, date: props.date, timetable: props.timetable.split(',')[1].split(' - ') } }, { headers: { 'Content-Type': 'application/json' } })
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
                                                            name='teacherSelector' onChange={ () => { props.setTeacher(res.data[i].id); props.setTeacherName(res.data[i].name); } }
                                                            checked={ res.data[i].id === props.teacher }></input>
                                                      <NavLink to={ `/staff-list/detail/${ res.data[i].id }` }>
                                                            <button className='btn btn-sm btn-primary ms-sm-2'>Detail</button>
                                                      </NavLink>
                                                </div>
                                          </td>
                                    </tr>);
                              setTeacherListContent(temp);
                        })
                        .catch(err => console.error(err));
            }
            else if (!props.addTeacherPopUp)
                  setSearchTeacher('');

            // eslint-disable-next-line
      }, [props, render]);

      return (
            <Modal show={ props.addTeacherPopUp } onHide={ () => { props.setAddTeacherPopUp(false); setSearchTeacher(''); } }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <div>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input value={ searchTeacher } type='text' style={ { fontSize: '1rem', paddingLeft: '30px', maxWidth: '200px' } } onChange={ e =>
                              {
                                    setSearchTeacher(e.target.value);
                                    clearTimeout(timer);
                                    timer = setTimeout(() =>
                                    {
                                          setRender(!render);
                                    }, 1000);
                              } }></input>
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
                        <button className={ `btn btn-danger` } onClick={ () =>
                        {
                              props.setTeacherName(null);
                              props.setTeacher(null);
                              setSearchTeacher('');
                              setRender(!render);
                        } }>Clear</button>
                  </Modal.Footer>
            </Modal>
      )
}

const SupervisorSelect = (props) =>
{
      const [searchSupervisor, setSearchSupervisor] = useState("");
      const [supervisorListContent, setSupervisorListContent] = useState([]);
      const [render, setRender] = useState(false);

      let timer;

      useEffect(() =>
      {
            if (props.addSupervisorPopUp)
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
                                                            name='supervisorSelector' onChange={ () => { props.setSupervisor(res.data[i].id); props.setSupervisorName(res.data[i].name); } }
                                                            checked={ res.data[i].id === props.supervisor }></input>
                                                      <NavLink to={ `/staff-list/detail/${ res.data[i].id }` }>
                                                            <button className='btn btn-sm btn-primary ms-sm-2'>Detail</button>
                                                      </NavLink>
                                                </div>
                                          </td>
                                    </tr>);
                              setSupervisorListContent(temp);
                        })
                        .catch(err => console.error(err));
            }
            else
                  setSearchSupervisor('');

            // eslint-disable-next-line
      }, [props, render]);

      return (
            <Modal show={ props.addSupervisorPopUp } onHide={ () => { props.setAddSupervisorPopUp(false); setSearchSupervisor(''); } }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <div>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input value={ searchSupervisor } type='text' style={ { fontSize: '1rem', paddingLeft: '30px', maxWidth: '200px' } } onChange={ e =>
                              {
                                    setSearchSupervisor(e.target.value);
                                    clearTimeout(timer);
                                    timer = setTimeout(() =>
                                    {
                                          setRender(!render);
                                    }, 1000);
                              } }></input>
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
                        <button className={ `btn btn-danger` } onClick={ () =>
                        {
                              props.setSupervisorName(null);
                              props.setSupervisor(null);
                              setSearchSupervisor('');
                              setRender(!render);
                        } }>Clear</button>
                  </Modal.Footer>
            </Modal>
      )
}

const AddSession = (props) =>
{
      const [room, setRoom] = useState(null);
      const [date, setDate] = useState(null);
      const [timetable, setTimetable] = useState(null);
      const [makeUpSession, setMakeUpSession] = useState(null);
      const [teacher, setTeacher] = useState(null);
      const [supervisor, setSupervisor] = useState(null);
      const [teacherName, setTeacherName] = useState(null);
      const [supervisorName, setSupervisorName] = useState(null);

      const [timetableList, setTimetableList] = useState(null);
      const [sessionList, setSessionList] = useState(null);
      const [roomList, setRoomList] = useState(null);

      const [confirmPopUp, setConfirmPopUp] = useState(false);

      const [isPast, setIsPast] = useState(false);

      const [addTeacherPopUp, setAddTeacherPopUp] = useState(false);
      const [addSupervisorPopUp, setAddSupervisorPopUp] = useState(false);

      const [isEmptyRoom, setIsEmptyRoom] = useState(false);
      const [isEmptyDate, setIsEmptyDate] = useState(false);
      const [isEmptyPeriod, setIsEmptyPeriod] = useState(false);
      const [isEmptyTeacher, setIsEmptyTeacher] = useState(false);
      const [isEmptySupervisor, setIsEmptySupervisor] = useState(false);

      const handleData = () =>
      {
            let isOK = true;

            if (!room)
            {
                  setIsEmptyRoom(true);
                  isOK = false;
            }
            else
                  setIsEmptyRoom(false);

            if (!isPast)
            {
                  if (!date)
                  {
                        setIsEmptyDate(true);
                        isOK = false;
                  }
                  else
                        setIsEmptyDate(false);
            }
            else
                  isOK = false;

            if (!timetable)
            {
                  setIsEmptyPeriod(true);
                  isOK = false;
            }
            else
                  setIsEmptyPeriod(false);

            if (!teacher)
            {
                  setIsEmptyTeacher(true);
                  isOK = false;
            }
            else
                  setIsEmptyTeacher(false);

            if (!supervisor)
            {
                  setIsEmptySupervisor(true);
                  isOK = false;
            }
            else
                  setIsEmptySupervisor(false);

            setConfirmPopUp(isOK)
      }

      useEffect(() =>
      {
            if (props.sessionPopUp)
            {
                  axios.post(`http://${ domain }/admin/getSuitableRoom`, { params: { name: props.name } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Dropdown.Item key={ i } eventKey={ [res.data[i].id, `${ res.data[i].id } - ${ res.data[i].max_seats }`] }>
                                          { res.data[i].id }&nbsp;-&nbsp;{ res.data[i].max_seats }
                                    </Dropdown.Item>);
                              setRoomList(temp);
                        })
                        .catch(err => console.log(err));

                  if (room && date)
                  {
                        axios.post(`http://${ domain }/admin/getTimetable`, { params: { room: room.split(',')[0], date: date } }, { headers: { 'Content-Type': 'application/json' } })
                              .then(res =>
                              {
                                    const temp = [];
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<Dropdown.Item key={ i } eventKey={ [res.data[i].id, `${ res.data[i].start_hour } - ${ res.data[i].end_hour }`] }>
                                                { res.data[i].start_hour }&nbsp;-&nbsp;{ res.data[i].end_hour }
                                          </Dropdown.Item>);
                                    setTimetableList(temp);
                              })
                              .catch(err => console.log(err));
                  }

                  axios.post(`http://${ domain }/admin/getClassCanceledMissingSession`, { params: { name: props.name } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Dropdown.Item key={ i } eventKey={ res.data[i].number }>
                                          Session { res.data[i].number }
                                    </Dropdown.Item>);
                              setSessionList(temp);
                        })
                        .catch(err => console.log(err));
            }
      }, [props.sessionPopUp, props.name, room, date]);

      return (
            <>
                  <Modal show={ props.sessionPopUp } onHide={ () => props.setSessionPopUp(false) }
                        dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                        className={ `reAdjustModel ${ styles.customModal1 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                              <div className='row mb-5 mt-2'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Session</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input value={ `Session ${ props.currentSession + 1 }` } disabled className={ `${ styles.inputs } w-100` }></input>
                                    </div>
                              </div>
                              <div className='row mt-5'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Room</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <Dropdown onSelect={ eventKey =>
                                          {
                                                setRoom(eventKey);
                                                setTimetable(null);
                                          }
                                          }>
                                                <Dropdown.Toggle variant="secondary" style={ { maxWidth: '250px' } } className='text-wrap'>
                                                      { room === null ? 'Choose' : room.split(',')[1] }
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu style={ { maxHeight: '150px', overflow: 'auto' } }>
                                                      <Dropdown.Item eventKey={ null }>Clear</Dropdown.Item>
                                                      { roomList }
                                                </Dropdown.Menu>
                                          </Dropdown>
                                    </div>
                              </div>
                              {
                                    isEmptyRoom
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Session room field is empty!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ isEmptyRoom ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Date</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input className={ `${ styles.inputs } w-100` } type="date" onChange={ e =>
                                          {
                                                setTimetable(null);
                                                if (e.target.value !== '')
                                                {
                                                      if (new Date(e.target.value) <= new Date())
                                                      {
                                                            setDate(null);
                                                            setIsPast(true);
                                                      }
                                                      else
                                                      {
                                                            setDate(e.target.value);
                                                            setIsPast(false);
                                                      }
                                                }
                                                else
                                                {
                                                      setIsPast(false);
                                                      setDate(null);
                                                }
                                          } }></input>
                                    </div>
                              </div>
                              {
                                    isPast
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Session date invalid!
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
                                                Session date field is empty!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ (isPast || isEmptyDate) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong className='text-center'>Time period</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <Dropdown onSelect={ eventKey => setTimetable(eventKey) }>
                                                <Dropdown.Toggle variant="secondary" style={ { maxWidth: '250px' } } className='text-wrap'>
                                                      { timetable === null ? 'Choose' : timetable.split(',')[1] }
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu style={ { maxHeight: '150px', overflow: 'auto' } }>
                                                      <Dropdown.Item eventKey={ null }>Clear</Dropdown.Item>
                                                      { timetableList }
                                                </Dropdown.Menu>
                                          </Dropdown>
                                    </div>
                              </div>
                              {
                                    isEmptyPeriod
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Session time period field is empty!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ isEmptyPeriod ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Teacher</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <p className={ `${ styles.inputs } ${ styles.hover } w-100 mb-0 ps-2 pt-1 hideBrowserScrollbar` } onClick={ () => setAddTeacherPopUp(true) }>{ teacherName }</p>
                                    </div>
                              </div>
                              {
                                    isEmptyTeacher
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Session teacher field is empty!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ isEmptyTeacher ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Supervisor</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <p className={ `${ styles.inputs } ${ styles.hover } w-100 mb-0 ps-2 pt-1 hideBrowserScrollbar` } onClick={ () => setAddSupervisorPopUp(true) }>{ supervisorName }</p>
                                    </div>
                              </div>
                              {
                                    isEmptySupervisor
                                    &&
                                    <div className="d-flex align-items-center justify-content-center mt-3">
                                          <AiOutlineCloseCircle style={ {
                                                marginRight: '5px',
                                                marginBottom: '16px'
                                          } } className={ `${ styles.p }` } />
                                          <p className={ `${ styles.p }` }>
                                                Session supervisor field is empty!
                                          </p>
                                    </div>
                              }
                              <div className={ `row ${ isEmptySupervisor ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong className='text-center'>Make up for</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <Dropdown onSelect={ eventKey => setMakeUpSession(eventKey) }>
                                                <Dropdown.Toggle variant="secondary" style={ { maxWidth: '250px' } } className='text-wrap'>
                                                      { makeUpSession === null ? 'Choose' : `Session ${ makeUpSession }` }
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu style={ { maxHeight: '150px', overflow: 'auto' } }>
                                                      <Dropdown.Item eventKey={ null }>Clear</Dropdown.Item>
                                                      { sessionList }
                                                </Dropdown.Menu>
                                          </Dropdown>
                                    </div>
                              </div>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center'>
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setTeacher(null);
                                    setSupervisor(null);
                                    setRoom(null);
                                    setDate(null);
                                    setTimetable(null);
                                    setTimetableList(null);
                                    setMakeUpSession(null);
                                    setTeacherName(null);
                                    setSupervisorName(null);
                                    setRoomList(null);
                                    setSessionList(null);
                                    props.setSessionPopUp(false);
                              } }>Cancel</button>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ handleData }>Confirm</button>
                        </Modal.Footer>
                  </Modal>
                  <Modal show={ confirmPopUp } onHide={ () => { setConfirmPopUp(false); } } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ props.containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to add this session?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-danger me-2 me-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                              } }>NO</button>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                                    props.setSessionPopUp(false);
                                    axios.post(`http://${ domain }/admin/addSessionToClass`, {
                                          params: {
                                                name: props.name,
                                                room: room.split(',')[0],
                                                session: props.currentSession + 1,
                                                date: date,
                                                timetable: timetable.split(',')[0],
                                                makeUpFor: makeUpSession,
                                                teacher: teacher,
                                                supervisor: supervisor
                                          }
                                    }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res =>
                                          {
                                                setTeacher(null);
                                                setSupervisor(null);
                                                setRoom(null);
                                                setDate(null);
                                                setTimetable(null);
                                                setMakeUpSession(null);
                                                setTeacherName(null);
                                                setTimetableList(null);
                                                setSupervisorName(null);
                                                setRoomList(null);
                                                setSessionList(null);
                                                props.setRender(!props.render);
                                          })
                                          .catch(err => console.error(err));
                              } }>YES</button>
                        </Modal.Footer>
                  </Modal>
                  <TeacherSelect addTeacherPopUp={ addTeacherPopUp } setAddTeacherPopUp={ setAddTeacherPopUp } name={ props.name }
                        containerRef={ props.containerRef } teacher={ teacher } setTeacher={ setTeacher } teacherName={ teacherName }
                        setTeacherName={ setTeacherName } date={ date } timetable={ timetable } />
                  <SupervisorSelect addSupervisorPopUp={ addSupervisorPopUp } setAddSupervisorPopUp={ setAddSupervisorPopUp } name={ props.name }
                        containerRef={ props.containerRef } supervisor={ supervisor } setSupervisor={ setSupervisor }
                        supervisorName={ supervisorName } setSupervisorName={ setSupervisorName } />
            </>
      )
}

export default AddSession;