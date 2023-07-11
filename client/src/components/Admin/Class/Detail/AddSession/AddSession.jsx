import styles from './AddSession.module.css';
import { useState, useEffect } from "react";
import axios from 'axios';
import { domain } from "../../../../../tools/domain";
import { Modal } from 'react-bootstrap';
import '../../../../../css/scroll.css';
import '../../../../../css/modal.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Dropdown } from 'react-bootstrap';

const AddSession = (props) =>
{
      const [room, setRoom] = useState(null);
      const [date, setDate] = useState(null);
      const [timetable, setTimetable] = useState(null);
      const [makeUpSession, setMakeUpSession] = useState(null);
      const [teacher, setTeacher] = useState(null);
      const [supervisor, setSupervisor] = useState(null);

      const [timetableList, setTimetableList] = useState(null);
      const [teacherList, setTeacherList] = useState(null);
      const [sessionList, setSessionList] = useState(null);
      const [roomList, setRoomList] = useState(null);

      const [confirmPopUp, setConfirmPopUp] = useState(false);

      return (
            <>
                  <Modal show={ props.sessionPopUp } onHide={ () => props.setSessionPopUp(false) }
                        dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                        className={ `reAdjustModel ${ styles.customModal } hideBrowserScrollbar` } container={ props.containerRef.current }>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                              <div className='row my-5'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Session</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input value={ `Session ${ props.currentSession + 1 }` } disabled className={ `${ styles.inputs } w-100` }></input>
                                    </div>
                              </div>
                              <div className='row my-5'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Room</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <Dropdown onSelect={ eventKey => setTimetable(eventKey) }>
                                                <Dropdown.Toggle variant="secondary" style={ { maxWidth: '250px' } } className='text-wrap'>
                                                      { room === null ? 'Choose' : room }
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu style={ { maxHeight: '150px', overflow: 'auto' } }>
                                                      <Dropdown.Item eventKey={ null }>Clear</Dropdown.Item>
                                                      { roomList }
                                                </Dropdown.Menu>
                                          </Dropdown>
                                    </div>
                              </div>
                              <div className='row my-5'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Date</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input className={ `${ styles.inputs } w-100` } type="date" onChange={ e => setDate(e.target.value) }></input>
                                    </div>
                              </div>
                              <div className='row my-5'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong className='text-center'>Time period</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <Dropdown onSelect={ eventKey => setTimetable(eventKey) }>
                                                <Dropdown.Toggle variant="secondary" style={ { maxWidth: '250px' } } className='text-wrap'>
                                                      { timetable === null ? 'Choose' : timetable }
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu style={ { maxHeight: '150px', overflow: 'auto' } }>
                                                      <Dropdown.Item eventKey={ null }>Clear</Dropdown.Item>
                                                      { timetableList }
                                                </Dropdown.Menu>
                                          </Dropdown>
                                    </div>
                              </div>
                              <div className='row my-5'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Teacher</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <Dropdown onSelect={ eventKey => setTimetable(eventKey) }>
                                                <Dropdown.Toggle variant="secondary" style={ { maxWidth: '250px' } } className='text-wrap'>
                                                      { teacher === null ? 'Choose' : teacher }
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu style={ { maxHeight: '150px', overflow: 'auto' } }>
                                                      <Dropdown.Item eventKey={ null }>Clear</Dropdown.Item>
                                                      { teacherList }
                                                </Dropdown.Menu>
                                          </Dropdown>
                                    </div>
                              </div>
                              <div className='row my-5'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Supervisor</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input className={ `${ styles.inputs } ${ styles.hover } w-100` } disabled></input>
                                    </div>
                              </div>
                              <div className='row my-5'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong className='text-center'>Make up for</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <Dropdown onSelect={ eventKey => setTimetable(eventKey) }>
                                                <Dropdown.Toggle variant="secondary" style={ { maxWidth: '250px' } } className='text-wrap'>
                                                      { makeUpSession === null ? 'Choose' : makeUpSession }
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
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () => props.setSessionPopUp(false) }>Cancel</button>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () => setConfirmPopUp(true) }>Confirm</button>
                        </Modal.Footer>
                  </Modal>
                  <Modal show={ confirmPopUp } onHide={ () => { setConfirmPopUp(false); } } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ props.containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to add this session?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                              } }>NO</button>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                                    props.setSessionPopUp(false);
                                    // axios.post(`http://${ domain }/admin/addSessionToClass`, {
                                    //       params: {
                                    //             name: props.name,
                                    //             room: room,
                                    //             session: props.currentSession + 1,
                                    //             date: date,
                                    //             timetable: timetable,
                                    //             makeUpFor: makeUpSession,
                                    //             teacher: teacher,
                                    //             supervisor: supervisor
                                    //       }
                                    // }, { headers: { 'Content-Type': 'application/json' } })
                                    //       .then(res =>
                                    //       {
                                    //             props.setRender(!props.render);
                                    //       })
                                    //       .catch(err => console.error(err));
                              } }>YES</button>
                        </Modal.Footer>
                  </Modal>
            </>
      )
}

export default AddSession;