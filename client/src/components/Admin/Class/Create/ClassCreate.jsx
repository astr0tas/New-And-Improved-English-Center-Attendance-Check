import styles from './ClassCreate.module.css';
import { Modal } from 'react-bootstrap';
import request from '../../../../tools/request';
import { domain } from "../../../../tools/domain";
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import '../../../../css/scroll.css';
import { YMD, DMY } from '../../../../tools/dateFormat';
import { NavLink } from 'react-router-dom';

const PeriodSelect = (props) =>
{
      const [periodList, setPeriodList] = useState([]);
      const [render, setRender] = useState(false);

      const toggle = (e, id, start, end) =>
      {
            props.setStudentAdded([]);
            props.setTeacherDow(null);
            if (e.target.checked && !props.period.find(element => element.dow === parseInt(props.dow.split(',')[0])))
                  props.setPeriod(prev => [...prev, { dow: parseInt(props.dow.split(',')[0]), id: id, start: start, end: end, teacherID: null, dowString: props.dow.split(',')[1], teacherName: null, room: null, roomSize: null }]);
            else if (e.target.checked && !!props.period.find(element => element.dow === parseInt(props.dow.split(',')[0])))
            {
                  const index = props.period.findIndex(elem => elem.dow === parseInt(props.dow.split(',')[0]));
                  props.period[index].id = id;
                  props.period[index].start = start;
                  props.period[index].end = end;
                  props.period[index].teacherName = null;
                  props.period[index].teacherID = null;
                  props.period[index].room = null;
                  props.period[index].roomSize = null;
                  setRender(!render);
            }
            else if (!e.target.checked)
                  props.setPeriod(props.period.filter(element => element.id !== id || element.dow !== parseInt(props.dow.split(',')[0])));
      }

      const sort = () =>
      {
            const sorted = props.period.slice().sort((elem1, elem2) => elem1.dow - elem2.dow);
            props.setPeriod(sorted);
      }

      useEffect(() =>
      {
            if (props.addPeriodPopUp && props.dow)
            {
                  request.get(`http://${ domain }/admin/getPeriods`)
                        .then(res =>
                        {
                              const temp = [];
                              if (res.status === 200)
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<tr key={ i }>
                                                <td className='text-center align-middle'>{ i + 1 }</td>
                                                <td className='text-center align-middle'>{ res.data[i].Start_hour } - { res.data[i].End_hour }</td>
                                                <td className='text-center align-middle'>
                                                      <input type='checkbox' className={ `${ styles.hover }` }
                                                            style={ { width: '1.3rem', height: '1.3rem' } }
                                                            checked={ props.period.length && !!props.period.find(element => element.dow === parseInt(props.dow.split(',')[0]) && element.id === res.data[i].ID) }
                                                            onChange={ e => toggle(e, res.data[i].ID, res.data[i].Start_hour, res.data[i].End_hour) }></input>
                                                </td>
                                          </tr>);
                              setPeriodList(temp);
                        })
                        .catch(err => console.log(err));
            }
            else
                  setPeriodList([]);

            // eslint-disable-next-line
      }, [props.dow, props.period, props.addPeriodPopUp, render]);

      return (
            <Modal show={ props.addPeriodPopUp } onHide={ () => { props.setAddPeriodPopUp(false); sort(); } }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <Dropdown onSelect={ eventKey => props.setDow(eventKey) }>
                              <Dropdown.Toggle variant="primary" size='sm' style={ { maxWidth: '250px' } } className='text-wrap'>
                                    { !props.dow ? 'Choose' : props.dow.split(',')[1] }
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={ { maxHeight: '150px', overflow: 'auto' } }>
                                    <Dropdown.Item eventKey={ null }>Clear</Dropdown.Item>
                                    <Dropdown.Item eventKey={ [1, 'Monday'] }>Monday</Dropdown.Item>
                                    <Dropdown.Item eventKey={ [2, 'Tuesday'] }>Tuesday</Dropdown.Item>
                                    <Dropdown.Item eventKey={ [3, 'Wednesday'] }>Wednesday</Dropdown.Item>
                                    <Dropdown.Item eventKey={ [4, 'Thursday'] }>Thursday</Dropdown.Item>
                                    <Dropdown.Item eventKey={ [5, 'Friday'] }>Friday</Dropdown.Item>
                                    <Dropdown.Item eventKey={ [6, 'Saturday'] }>Saturday</Dropdown.Item>
                              </Dropdown.Menu>
                        </Dropdown>
                  </Modal.Header>
                  <Modal.Body className='px-1 pt-0' style={ { minHeight: props.dow ? '165px' : '65px' } }>
                        <div className={ `h-100 w-100` }>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: 'sticky', top: '0' } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-8 text-center align-middle'>Period</th>
                                                <th scope="col" className='col text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { periodList }
                                    </tbody>
                              </table>
                        </div >
                  </Modal.Body>
                  <Modal.Footer className='justify-content-center'>
                        <button className={ `btn btn-danger` } onClick={ () =>
                        {
                              if (props.dow)
                                    props.setPeriod([]);
                        } }>Clear</button>
                  </Modal.Footer>
            </Modal>
      )
}

const TeacherSelect = (props) =>
{
      const [searchTeacher, setSearchTeacher] = useState("");
      const [teacherListContent, setTeacherListContent] = useState([]);
      const [render, setRender] = useState(false);

      let timer;

      const addTeacher = (id, name, dow) =>
      {
            const index = props.period.findIndex(elem => elem.dow === dow);
            props.period[index].teacherID = id;
            props.period[index].teacherName = name;
            setRender(!render);
      }

      useEffect(() =>
      {
            if (props.addTeacherPopUp && props.endDate && props.dow)
            {
                  // The query to get data for the request is not every sufficient because teachers might be assign
                  // to multiple continous sessions in a day without having a break (I can't figure out a way for this because of my tiny brain)
                  request.post(`http://${ domain }/admin/getSuitableTeacher`, {
                        params: {
                              teacherName: searchTeacher,
                              start: props.startDate,
                              end: props.endDate,
                              period: props.period.find(elem => elem.dow === parseInt(props.dow.split(',')[0]))
                        }
                  }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              if (res.status === 200)
                                    for (let i = 0; i < res.data.length; i++)
                                    {
                                          temp.push(<tr key={ i }>
                                                <td className='text-center align-middle'>{ i + 1 }</td>
                                                <td className='text-center align-middle'>{ res.data[i].name }</td>
                                                <td className='text-center align-middle'>{ res.data[i].phone }</td>
                                                <td className='text-center align-middle'>{ res.data[i].email }</td>
                                                <td className='text-center align-middle'>
                                                      <div className='d-flex flex-column flex-sm-row align-items-center justify-content-center'>
                                                            <input className={ `me-sm-2 mb-1 mb-sm-0 ${ styles.hover }` } type='radio' style={ { width: '1.3rem', height: '1.3rem' } }
                                                                  onChange={ () => addTeacher(res.data[i].id, res.data[i].name, parseInt(props.dow.split(',')[0])) }
                                                                  checked={ !!props.period.find(elem => elem.dow === parseInt(props.dow.split(',')[0]) && elem.teacherID === res.data[i].id) }
                                                                  name={ props.dow.split(',')[1] }></input>
                                                            <NavLink to={ `/staff-list/detail/${ res.data[i].id }` }>
                                                                  <button className='btn btn-sm btn-primary ms-sm-2'>Detail</button>
                                                            </NavLink>
                                                      </div>
                                                </td>
                                          </tr>);
                                    }
                              setTeacherListContent(temp);
                        })
                        .catch(err => console.error(err));
            }
            else if (!props.addTeacherPopUp)
                  setSearchTeacher('');
            else if (!props.dow)
                  setTeacherListContent([]);

            // eslint-disable-next-line
      }, [render, props]);

      return (
            <Modal show={ props.addTeacherPopUp } onHide={ () => props.setAddTeacherPopUp(false) }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header className='justify-content-start'>
                        <div style={ { maxWidth: '200px', width: '60%' } }>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input placeholder='Find teacher' className='w-100' value={ searchTeacher } type='text' style={ { fontSize: '1rem', paddingLeft: '30px' } } onChange={ e =>
                              {
                                    setSearchTeacher(e.target.value);
                                    clearTimeout(timer);
                                    timer = setTimeout(() =>
                                    {
                                          setRender(!render);
                                    }, 1000);
                              } }></input>
                        </div>
                        <Dropdown onSelect={ eventKey => props.setDow(eventKey) } className='ms-2'>
                              <Dropdown.Toggle variant="primary" size='sm' style={ { maxWidth: '250px' } } className='text-wrap'>
                                    { !props.dow ? 'Choose' : props.dow.split(',')[1] }
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={ { maxHeight: '150px', overflow: 'auto' } }>
                                    <Dropdown.Item eventKey={ null }>Clear</Dropdown.Item>
                                    { props.endDate && props.period.map((elem, i) => <Dropdown.Item key={ i } eventKey={ [elem.dow, elem.dowString] }>{ elem.dowString }</Dropdown.Item>) }
                              </Dropdown.Menu>
                        </Dropdown>
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
                              props.period.forEach(elem => { elem.teacherID = null; elem.teacherName = null });
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
                  request.post(`http://${ domain }/admin/staffList`, { params: { name: searchSupervisor, type: 2 } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              if (res.status === 200)
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
                              <input placeholder='Find supervisor' value={ searchSupervisor } type='text' style={ { fontSize: '1rem', paddingLeft: '30px', maxWidth: '200px' } } onChange={ e =>
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

const AddStudent = (props) =>
{
      const [studentListContent, setStudentListContent] = useState([]);
      const [searchStudent, setSearchStudent] = useState("");

      let timer;

      const configList = (e, id, name) =>
      {
            if (e.target.checked)
                  props.setStudentAdded(prevStudentAdded => [...prevStudentAdded, { id: id, name: name }]);
            else
                  props.setStudentAdded(prevState => prevState.filter(item => item.id !== id));
      }

      useEffect(() =>
      {
            if (props.addPopUp && props.period.length !== 0)
            {
                  request.post(`http://${ domain }/admin/getSuitableStudent`, {
                        params: {
                              name: searchStudent,
                              start: props.startDate,
                              end: props.endDate,
                              period: props.period
                        }
                  }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              if (res.status === 200)
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(
                                                <tr key={ i }>
                                                      <td className='text-center align-middle'>{ i + 1 }</td>
                                                      <td className='text-center align-middle'>{ res.data[i].name }</td>
                                                      <td className='text-center align-middle'>{ res.data[i].ssn }</td>
                                                      <td className='text-center align-middle'>{ res.data[i].phone }</td>
                                                      <td className='text-center align-middle'>{ res.data[i].email }</td>
                                                      <td className='text-center align-middle'>
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                  <input type='checkbox'
                                                                        onChange={ e => configList(e, res.data[i].id, res.data[i].name) }
                                                                        style={ { width: '1.2rem', height: '1.2rem' } } className={ `${ styles.hover } me-2` }
                                                                        checked={ props.studentAdded.length !== 0 && !!props.studentAdded.find(elem => elem.id === res.data[i].id) }></input>
                                                                  <NavLink to={ `/student-list/detail/${ res.data[i].id }` }>
                                                                        <button className="ms-2 btn-sm btn btn-primary">Detail</button>
                                                                  </NavLink>
                                                            </div>
                                                      </td>
                                                </tr >
                                          );
                              setStudentListContent(temp);
                        })
                        .catch(err => console.error(err));
            }

            // eslint-disable-next-line
      }, [searchStudent, props.name, props.addPopUp, props.studentAdded])

      return (
            <>
                  <Modal show={ props.addPopUp } onHide={ () => props.setAddPopUp(false) }
                        dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                        className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                        <Modal.Header closeButton>
                              <div>
                                    <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                                    <input placeholder='Find student' type='text' style={ { fontSize: '1rem', paddingLeft: '30px', maxWidth: '200px' } } onChange={ e =>
                                    {
                                          clearTimeout(timer);

                                          timer = setTimeout(() =>
                                          {
                                                setSearchStudent(e.target.value);
                                          }, 1000);
                                    } }></input>
                              </div>
                        </Modal.Header>
                        <Modal.Body className='px-1 py-0' style={ { minHeight: !studentListContent.length ? '65px' : '150px' } }>
                              <div className={ `h-100 w-100` }>
                                    <table className="table table-hover table-info">
                                          <thead style={ { position: "sticky", top: "0" } }>
                                                <tr>
                                                      <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                      <th scope="col" className='col-3 text-center align-middle'>Name</th>
                                                      <th scope="col" className='col-2 text-center align-middle'>SSN</th>
                                                      <th scope="col" className='col-2 text-center align-middle'>Phone number</th>
                                                      <th scope="col" className='col-2 text-center align-middle'>Email</th>
                                                      <th scope="col" className='col-2 text-center align-middle'>Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                { studentListContent }
                                          </tbody>
                                    </table>
                              </div >
                        </Modal.Body>
                        <Modal.Footer className='flex-column justify-content-center'>
                              <div className='d-flex align-items-center'>
                                    <strong>Total students:&nbsp;&nbsp;</strong>
                                    <strong >{ props.studentAdded.length }</strong>
                              </div>
                              <div className='d-flex align-items-center'>
                                    <button className={ `btn btn-danger` } onClick={ () =>
                                    {
                                          props.setAddPopUp(false);
                                          props.setStudentAdded([]);
                                    } }>Clear</button>
                              </div>
                        </Modal.Footer>
                  </Modal>
            </>
      )
}

const RoomSelect = (props) =>
{
      const [roomListContent, setRoomListContent] = useState([]);
      const [render, setRender] = useState(false);

      const addRoom = (id, dow, seats) =>
      {
            const index = props.period.findIndex(elem => elem.dow === dow);
            props.period[index].room = id;
            props.period[index].roomSize = seats;
            setRender(!render);
      }

      useEffect(() =>
      {
            if (props.addRoomPopUp && props.studentAdded.length && props.dow)
            {
                  request.post(`http://${ domain }/admin/getSuitableRoomForNewClass`, {
                        params: {
                              seats: props.studentAdded.length,
                              start: props.startDate,
                              end: props.endDate,
                              period: props.period.find(elem => elem.dow === parseInt(props.dow.split(',')[0]))
                        }
                  }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              if (res.status === 200)
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<tr key={ i }>
                                                <td className='text-center align-middle'>{ i + 1 }</td>
                                                <td className='text-center align-middle'>{ res.data[i].id }</td>
                                                <td className='text-center align-middle'>{ res.data[i].max_seats }</td>
                                                <td className='text-center align-middle'>
                                                      <input className={ `me-sm-2 mb-1 mb-sm-0 ${ styles.hover }` } type='radio' style={ { width: '1.3rem', height: '1.3rem' } }
                                                            onChange={ () => addRoom(res.data[i].id, parseInt(props.dow.split(',')[0]), res.data[i].max_seats) }
                                                            checked={ !!props.period.find(elem => elem.dow === parseInt(props.dow.split(',')[0]) && elem.room === res.data[i].id) }
                                                            name={ props.dow.split(',')[1] }></input>
                                                </td>
                                          </tr>);
                              setRoomListContent(temp);
                        })
                        .catch(err => console.log(err));
            }
            else if (!props.dow)
                  setRoomListContent([]);

            // eslint-disable-next-line
      }, [render, props]);

      return (
            <Modal show={ props.addRoomPopUp } onHide={ () => props.setAddRoomPopUp(false) }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <Dropdown onSelect={ eventKey => props.setDow(eventKey) } className='ms-2'>
                              <Dropdown.Toggle variant="primary" size='sm' style={ { maxWidth: '250px' } } className='text-wrap'>
                                    { !props.dow ? 'Choose' : props.dow.split(',')[1] }
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={ { maxHeight: '150px', overflow: 'auto' } }>
                                    <Dropdown.Item eventKey={ null }>Clear</Dropdown.Item>
                                    { props.endDate && props.period.map((elem, i) => <Dropdown.Item key={ i } eventKey={ [elem.dow, elem.dowString] }>{ elem.dowString }</Dropdown.Item>) }
                              </Dropdown.Menu>
                        </Dropdown>
                  </Modal.Header>
                  <Modal.Body className='px-1 py-0' style={ { minHeight: roomListContent.length ? '150px' : '65px' } }>
                        <div className={ `h-100 w-100` }>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-5 text-center align-middle'>Room</th>
                                                <th scope="col" className='col-3 text-center align-middle'>Number of seats</th>
                                                <th scope="col" className='col-3 text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { roomListContent }
                                    </tbody>
                              </table>
                        </div >
                  </Modal.Body>
                  <Modal.Footer className='justify-content-center'>
                        <button className={ `btn btn-danger` } onClick={ () =>
                        {
                              props.period.forEach(elem => { elem.room = null; elem.roomSize = null });
                              setRender(!render);
                        } }>Clear</button>
                  </Modal.Footer>
            </Modal>
      )
}

const ClassCreate = (props) =>
{
      const [confirmPopUp, setConfirmPopUp] = useState(false);

      const [isStartDatePast, setIsStartDatePast] = useState(false);
      const [isPeriodEmpty, setIsPeriodEmpty] = useState(false);
      const [isEmptyTeacher, setIsEmptyTeacher] = useState(false);
      const [isEmptySupervisor, setIsEmptySupervisor] = useState(false);
      const [isEmptyStudent, setIsEmptyStudent] = useState(false);
      const [isEmptyName, setIsEmptyName] = useState(false);
      const [isEmptyStartDate, setIsEmptyStartDate] = useState(false);
      const [isEmptyLength, setIsEmptyLength] = useState(false);
      const [isInvalidLength, setInvalidLength] = useState(false);
      const [isEmptyEndDate, setIsEmptyEndDate] = useState(false);
      const [isNameDuplicate, setNameDuplicate] = useState(false);
      const [isEmptyRoom, setIsEmptyRoom] = useState(false);

      const [name, setName] = useState(null);
      const [startDate, setStartDate] = useState(null);
      const [endDate, setEndDate] = useState(null);
      const [length, setLength] = useState(null);
      const [period, setPeriod] = useState([]);
      const [supervisor, setSupervisor] = useState(null);
      const [supervisorName, setSupervisorName] = useState(null);
      const [periodDow, setPeriodDow] = useState(null);
      const [teacherDow, setTeacherDow] = useState(null);
      const [sessionList, setSessionList] = useState([]);
      const [studentAdded, setStudentAdded] = useState([]);
      const [roomDow, setRoomDow] = useState(null);

      const [addTeacherPopUp, setAddTeacherPopUp] = useState(false);
      const [addSupervisorPopUp, setAddSupervisorPopUp] = useState(false);
      const [addPeriodPopUp, setAddPeriodPopUp] = useState(false);
      const [addStudentPopUp, setAddStudentPopUp] = useState(false);
      const [addRoomPopUp, setAddRoomPopUp] = useState(false);
      const [errorPopUp, setErrorPopUp] = useState(false);

      let timer;

      useEffect(() =>
      {
            const getEndDate = () =>
            {
                  if (!startDate) return '';
                  const year = startDate.split('-')[0];
                  const month = startDate.split('-')[1];
                  const day = startDate.split('-')[2];
                  let endDate = new Date(year, month - 1, day), i = 0, firstEncounter = '';
                  const totalSession = period.length * 4 * length;

                  const temp = [];
                  while (true)
                  {
                        if (!!period.find(elem => elem.dow === endDate.getDay()))
                        {
                              temp.push(YMD(DMY(endDate)));
                              i++;
                              if (firstEncounter === '') firstEncounter = YMD(DMY(endDate));
                        }
                        if (i === totalSession) break;
                        endDate.setDate(endDate.getDate() + 1);

                  }
                  if (firstEncounter !== startDate)
                        setStartDate(firstEncounter);
                  setSessionList(temp);
                  setEndDate(YMD(DMY(endDate)));
            }

            if (period.length !== 0 && length && startDate && !isInvalidLength)
                  getEndDate();
            else
            {
                  setSessionList([]);
                  setEndDate(null);
                  setTeacherDow(null);
                  setRoomDow(null);
            }
      }, [period, length, startDate, isInvalidLength, studentAdded, endDate]);

      const handleData = (e) =>
      {
            e.preventDefault();
            let isOk = true;
            const future = new Date();
            if (!startDate)
            {
                  isOk = false;
                  setIsEmptyStartDate(true);
            }
            else if (new Date(startDate) < future.setDate(future.getDate() + 7))
            {
                  isOk = false;
                  setIsStartDatePast(true);
            }
            else
            {
                  setIsEmptyStartDate(false);
                  setIsStartDatePast(false);
            }
            if (!endDate)
            {
                  isOk = false;
                  setIsEmptyEndDate(true);
            }
            else
                  setIsEmptyEndDate(false);
            if (!!period.find(elem => elem.teacherID === null))
            {
                  isOk = false;
                  setIsEmptyTeacher(true);
            }
            else
                  setIsEmptyTeacher(false);
            if (!supervisorName)
            {
                  isOk = false;
                  setIsEmptySupervisor(true);
            }
            else
                  setIsEmptySupervisor(false);
            if (!name)
            {
                  isOk = false;
                  setIsEmptyName(true);
            }
            else if (isNameDuplicate)
                  isOk = false;
            else
                  setIsEmptyName(false);
            if (period.length === 0)
            {
                  isOk = false;
                  setIsPeriodEmpty(true);
            }
            else
                  setIsPeriodEmpty(false);
            if (studentAdded.length === 0)
            {
                  isOk = false;
                  setIsEmptyStudent(true);
            }
            else
                  setIsEmptyStudent(false);
            if (!length)
            {
                  isOk = false;
                  setIsEmptyLength(true);
            }
            else if (isInvalidLength)
                  isOk = false;
            else
            {
                  setIsEmptyLength(false);
                  setInvalidLength(false);
            }
            if (!!period.find(elem => elem.room === null))
            {
                  isOk = false;
                  setIsEmptyRoom(true);
            }
            else
                  setIsEmptyRoom(false);
            setConfirmPopUp(isOk);
      }

      const convertToDateOfWeek = (input) =>
      {
            if (input === 1) return 'Monday';
            else if (input === 2) return 'Tuesday';
            else if (input === 3) return 'Wednesday';
            else if (input === 4) return 'Thursday';
            else if (input === 5) return 'Friday';
            else return 'Saturday';
      }

      return (
            <>
                  <Modal show={ props.createClassPopUp } onHide={ () => props.setCreateClassPopUp(false) }
                        dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                        className={ `reAdjustModel ${ styles.customModal1 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                              <div className='row mt-2'>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Class name</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input placeholder='Class name' value={ name ? name : '' } className={ `${ styles.inputs } w-100` } onChange={ e =>
                                          {
                                                setName(e.target.value);
                                                clearTimeout(timer);
                                                timer = setTimeout(() =>
                                                {
                                                      request.post(`http://${ domain }/admin/getDuplicateName`, { params: { name: e.target.value } }, { headers: { 'Content-Type': 'application/json' } })
                                                            .then(res =>
                                                            {
                                                                  if (res.status === 200)
                                                                        setNameDuplicate(true);
                                                                  else
                                                                        setNameDuplicate(false);
                                                            })
                                                            .catch(err => console.log(err));
                                                }, 1000);
                                          } } type="text"></input>
                                    </div>
                              </div>
                              {
                                    isEmptyName
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Class name field is empty!
                                    </p>
                              }
                              {
                                    isNameDuplicate
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Class name is already used!
                                    </p>
                              }
                              <div className={ `row ${ (isEmptyName || isNameDuplicate) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Start date</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input value={ startDate ? startDate : '' } className={ `${ styles.inputs } w-100` } type="date" onChange={ e =>
                                          {
                                                if (e.target.value !== '')
                                                      setStartDate(e.target.value);
                                                else
                                                      setStartDate(null);
                                          } }></input>
                                    </div>
                              </div>
                              {
                                    isStartDatePast
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Start date invalid!
                                    </p>
                              }
                              {
                                    isEmptyStartDate
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Start date field is empty!
                                    </p>
                              }
                              <div className={ `row ${ (isStartDatePast || isEmptyStartDate) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong className='text-center'>Course length (months)</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                                <input placeholder='Course length' value={ length ? length : '' } className={ `${ styles.inputs } w-100` } type="number" onChange={ e =>
                                                {
                                                      setLength(e.target.value);
                                                      if (e.target.value === '')
                                                            setLength(null);
                                                      else if (e.target.value < 1 || e.target.value > 24)
                                                            setInvalidLength(true);
                                                      else
                                                            setInvalidLength(false);
                                                } }></input>
                                          </div>
                                    </div>
                              </div>
                              {
                                    isEmptyLength
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Course length field is empty!
                                    </p>
                              }
                              {
                                    isInvalidLength
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Course length field must be from 1 month to 2 years!
                                    </p>
                              }
                              <div className={ `row ${ (isEmptyLength || isInvalidLength) ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong className='text-center'>Timetable</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <p className={ `${ styles.inputs } ${ styles.hover } w-100 mb-0 ps-2 pt-1 hideBrowserScrollbar` } onClick={ () => setAddPeriodPopUp(true) }>
                                                {
                                                      !period.length && 'Choose timetable'
                                                }
                                                {
                                                      period.length !== 0 && period.map((elem, i) => `${ convertToDateOfWeek(elem.dow) }: ${ elem.start } - ${ elem.end }${ i === period.length - 1 ? '' : ', ' }`)
                                                }
                                          </p>
                                    </div>
                              </div>
                              {
                                    isPeriodEmpty
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Timetable field is empty!
                                    </p>
                              }
                              <div className={ `row ${ isPeriodEmpty ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>End date</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <input value={ endDate ? endDate : '' } className={ `${ styles.inputs } w-100` } type="date" disabled></input>
                                    </div>
                              </div>
                              {
                                    isEmptyEndDate
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Class end date field is empty!
                                    </p>
                              }
                              <div className={ `row ${ isEmptyEndDate ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Teacher</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <p className={ `${ styles.inputs } ${ styles.hover } w-100 mb-0 ps-2 pt-1 hideBrowserScrollbar` } onClick={ () => setAddTeacherPopUp(true) }>
                                                {
                                                      (!period.length || !!period.find(elem => elem.teacherName === null)) && 'Choose teacher'
                                                }
                                                {
                                                      period.length !== 0 && !period.find(elem => elem.teacherName === null) && period.map((elem, i) => `${ elem.teacherName === null ? '' : elem.teacherName }${ i === period.length - 1 ? '' : ', ' }`)
                                                }
                                          </p>
                                    </div>
                              </div>
                              {
                                    isEmptyTeacher
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Teacher field is empty!
                                    </p>
                              }
                              <div className={ `row ${ isEmptyTeacher ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Supervisor</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <p className={ `${ styles.inputs } ${ styles.hover } w-100 mb-0 ps-2 pt-1 hideBrowserScrollbar` } onClick={ () => setAddSupervisorPopUp(true) }>{ supervisorName ? supervisorName : 'Choose a supervisor' }</p>
                                    </div>
                              </div>
                              {
                                    isEmptySupervisor
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Supervisor field is empty!
                                    </p>
                              }
                              <div className={ `row ${ isEmptySupervisor ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Student(s)</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <p className={ `${ styles.inputs } ${ styles.hover } w-100 mb-0 ps-2 pt-1 hideBrowserScrollbar` } onClick={ () => setAddStudentPopUp(true) }>
                                                {
                                                      !studentAdded.length && 'Choose student'
                                                }
                                                {
                                                      studentAdded.length !== 0 && studentAdded.map((elem, i) => `${ elem.name }${ i === studentAdded.length - 1 ? '' : ', ' }`)
                                                }
                                          </p>
                                    </div>
                              </div>
                              {
                                    isEmptyStudent
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Supervisor field is empty!
                                    </p>
                              }
                              <div className={ `row ${ isEmptyStudent ? 'mt-1' : 'mt-5' }` }>
                                    <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                          <strong>Room(s)</strong>
                                    </div>
                                    <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                          <p className={ `${ styles.inputs } ${ styles.hover } w-100 mb-0 ps-2 pt-1 hideBrowserScrollbar` } onClick={ () => setAddRoomPopUp(true) }>
                                                {
                                                      (!period.length || !!period.find(elem => elem.room === null)) && 'Choose room'
                                                }
                                                {
                                                      period.length !== 0 && !period.find(elem => elem.room === null) && period.map((elem, i) => `${ elem.room === null ? '' : elem.room }${ i === period.length - 1 ? '' : ', ' }`)
                                                }
                                          </p>
                                    </div>
                              </div>
                              {
                                    isEmptyRoom
                                    &&
                                    <p className={ `${ styles.p } text-center align-middle` }>
                                          Room field is empty!
                                    </p>
                              }
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center'>
                              <button className={ `btn btn-danger me-2 me-md-4` } onClick={ () =>
                              {
                                    props.setCreateClassPopUp(false);
                                    setName(null);
                                    setStartDate(null);
                                    setLength(null);
                                    setPeriod([]);
                                    setSupervisor(null);
                                    setSupervisorName(null);
                                    setPeriodDow(null);
                                    setEndDate(null);
                                    setTeacherDow(null);
                              } }>Cancel</button>
                              <button onClick={ handleData } className={ `btn btn-primary ms-2 ms-md-4` }>Create</button>
                        </Modal.Footer>
                  </Modal >
                  <Modal show={ confirmPopUp } onHide={ () => { setConfirmPopUp(false); } } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ props.containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to add this class?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-danger me-2 me-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                              } }>No</button>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                                    props.setCreateClassPopUp(false);
                                    request.post(`http://${ domain }/admin/createClass`, {
                                          params: {
                                                period: period,
                                                start: startDate,
                                                end: endDate,
                                                name: name,
                                                supervisor: supervisor,
                                                sessionList: sessionList,
                                                students: studentAdded,
                                                courseLength: length
                                          }
                                    }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res =>
                                          {
                                                if (res.status === 200)
                                                      props.setRender(!props.render);
                                          })
                                          .catch(err =>
                                          {
                                                setErrorPopUp(true);
                                                console.error(err);
                                          });
                                    setName(null);
                                    setStartDate(null);
                                    setLength(null);
                                    setPeriod([]);
                                    setSupervisor(null);
                                    setSupervisorName(null);
                                    setPeriodDow(null);
                                    setEndDate(null);
                                    setTeacherDow(null);
                              } }>Yes</button>
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

                  <TeacherSelect addTeacherPopUp={ addTeacherPopUp } setAddTeacherPopUp={ setAddTeacherPopUp }
                        containerRef={ props.containerRef } dow={ teacherDow } setDow={ setTeacherDow }
                        startDate={ startDate } endDate={ endDate } period={ period } />
                  <SupervisorSelect addSupervisorPopUp={ addSupervisorPopUp } setAddSupervisorPopUp={ setAddSupervisorPopUp } name={ props.name }
                        containerRef={ props.containerRef } supervisor={ supervisor } setSupervisor={ setSupervisor }
                        supervisorName={ supervisorName } setSupervisorName={ setSupervisorName } />
                  <PeriodSelect addPeriodPopUp={ addPeriodPopUp } setAddPeriodPopUp={ setAddPeriodPopUp } setStudentAdded={ setStudentAdded }
                        containerRef={ props.containerRef } period={ period } setPeriod={ setPeriod } dow={ periodDow } setDow={ setPeriodDow } setTeacherDow={ setTeacherDow } />
                  <AddStudent containerRef={ props.containerRef } addPopUp={ addStudentPopUp } setAddPopUp={ setAddStudentPopUp }
                        studentAdded={ studentAdded } setStudentAdded={ setStudentAdded } startDate={ startDate } endDate={ endDate } period={ period } />
                  <RoomSelect addRoomPopUp={ addRoomPopUp } setAddRoomPopUp={ setAddRoomPopUp }
                        containerRef={ props.containerRef } dow={ roomDow } setDow={ setRoomDow }
                        startDate={ startDate } endDate={ endDate }
                        period={ period } studentAdded={ studentAdded } />

            </>
      )
}

export default ClassCreate;