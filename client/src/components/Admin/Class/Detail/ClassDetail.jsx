import { useParams, NavLink } from 'react-router-dom';
import styles from './ClassDetail.module.css';
import { useContext, useEffect, useRef, useState } from 'react';
import request from '../../../../tools/request';
import { Modal } from 'react-bootstrap';
import { DMY } from '../../../../tools/dateFormat';
import { domain } from '../../../../tools/domain';
import '../../../../css/modal.css';
import { context } from '../../../../context';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { DMDY } from '../../../../tools/dateFormat';
import '../../../../css/scroll.css';
import AddStudent from '../AddStudent/AddStudent';
import AddSession from '../AddSession/AddSession';
import AddTeacher from '../AddTeacher/AddTeacher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Stats from '../Stats/Stats';

const Student = (props) =>
{
      const removeStudent = () =>
      {
            props.setRemoveStudentTarget(props.id);
            props.setRemoveStudentPopUp(true);
      }

      return (
            <tr>
                  <td className='text-center align-middle'>{ props.i }</td>
                  <td className='text-center align-middle'>{ props.name }</td>
                  <td className='text-center align-middle'>{ props.ssn }</td>
                  <td className='text-center align-middle'>{ props.phone }</td>
                  <td className='text-center align-middle'>{ props.email }</td>
                  <td className="text-center align-middle">
                        <div className="d-flex align-items-center justify-content-center">
                              <NavLink to={ `/student-list/detail/${ props.id }` }>
                                    <button className='btn btn-primary btn-sm me-2'>Detail</button>
                              </NavLink>
                              {
                                    props.status !== 0 &&
                                    <button className='btn btn-danger btn-sm ms-2' onClick={ removeStudent }>Remove</button>
                              }
                        </div>
                  </td>
            </tr>
      )
}

const Session = (props) =>
{
      const [status, setStatus] = useState("N/A");

      useEffect(() =>
      {
            if (props.status === 1)
                  setStatus("On going");
            else if (props.status === 2)
                  setStatus("Finished");
            else if (props.status === 3)
                  setStatus("Canceled");
            else if (props.status === 4)
                  setStatus("Scheduled");
            else if (props.status === 5)
                  setStatus("Missing teacher/supervisor");
      }, [props.status])

      return (
            <tr>
                  <td className='text-center align-middle'>Session { props.number }</td>
                  <td className='text-center align-middle'><AiOutlineClockCircle className='me-2' style={ { marginBottom: '1px' } } />{ DMDY(props.session_date) }&nbsp;:&nbsp;{ props.start }&nbsp;-&nbsp;{ props.end }</td>
                  <td className='text-center align-middle'>{ props.room }</td>
                  <td className={ `text-center align-middle` } style={ {
                        color: props.status === 1 ? '#128400' : (
                              props.status === 2 ? 'gray' : (
                                    (props.status === 3 || props.status === 5) ? 'red' :
                                          (
                                                props.status === 4 ? 'blue' : 'black'
                                          )
                              )
                        )
                  } }>{ status }</td>
                  <td className='text-center align-middle'>
                        <NavLink to={ `./Session ${ props.number }` }>
                              <button className='btn btn-primary btn-sm'>Detail</button>
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>{ props.teacherName ? props.teacherName : 'N/A' }</td>
                  <td className='text-center align-middle'>
                        {
                              props.teacherName &&
                              <NavLink to={ `/staff-list/detail/${ props.teacherID }` }>
                                    <button className='btn btn-primary btn-sm'>Detail</button>
                              </NavLink>
                        }
                  </td>
                  <td className='text-center align-middle'>{ props.supervisorName ? props.supervisorName : 'N/A' }</td>
                  <td className='text-center align-middle'>
                        {
                              props.supervisorName &&
                              <NavLink to={ `/staff-list/detail/${ props.supervisorID }` }>
                                    <button className='btn btn-primary btn-sm'>Detail</button>
                              </NavLink>
                        }
                  </td>
            </tr>
      )
}

const Teacher = (props) =>
{
      const removeTeacher = () =>
      {
            props.setRemoveTeacherTarget(props.id);
            props.setRemoveTeacherPopUp(true);
      }

      return (
            <tr>
                  <td className="text-center align-middle">{ props.i }</td>
                  <td className="text-center align-middle">{ props.name }</td>
                  <td className="text-center align-middle">{ props.phone }</td>
                  <td className="text-center align-middle">{ props.email }</td>
                  <td className="text-center align-middle">
                        <div className="d-flex align-items-center justify-content-center">
                              <NavLink to={ `/staff-list/detail/${ props.id }` }>
                                    <button className="btn btn-sm btn-primary">Detail</button>
                              </NavLink>
                              {
                                    props.status !== 0 &&
                                    <button className='btn btn-danger btn-sm ms-2' onClick={ removeTeacher }>Remove</button>
                              }
                        </div>
                  </td>
            </tr>
      )
}

const ClassDetail = () =>
{
      const name = useParams().name;

      const [render, setRender] = useState(false);
      const [start, setStart] = useState("N/A");
      const [end, setEnd] = useState("N/A");
      const [status, setStatus] = useState("N/A");
      const [currentStudent, setCurrentStudent] = useState(0);
      const [maxStudent, setMaxStudent] = useState(0);
      const [currentSession, setCurrentSession] = useState(0);
      const [initialSession, setInitialSession] = useState(0);

      const [content, setContent] = useState([]);

      const { listType, setListType } = useContext(context);

      const containerRef = useRef(null);
      const [statusPopUp, setStatusPopUp] = useState(false);
      const [maxPopUp, setMaxPopUp] = useState(false);
      const [addPopUp, setAddPopUp] = useState(false);
      const [sessionPopUp, setSessionPopUp] = useState(false);
      const [teacherPopUp, setTeacherPopUp] = useState(false);

      const [removeStudentPopUp, setRemoveStudentPopUp] = useState(false);
      const [removeStudentTarget, setRemoveStudentTarget] = useState(null);

      const [removeTeacherTarget, setRemoveTeacherTarget] = useState(null);
      const [removeTeacherPopUp, setRemoveTeacherPopUp] = useState(false);

      const [statsPopUp, setStatsPopUp] = useState(false);

      document.title = `Class ${ name }`;

      let timer;

      const [searchStudent, setSearchStudent] = useState('');

      const addStudent = () =>
      {
            if (currentStudent === maxStudent)
                  setMaxPopUp(true);
            else
                  setAddPopUp(true);
      }

      useEffect(() =>
      {
            request.post(`http://${ domain }/classInfo`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        if (res.status === 200)
                        {
                              setStatus(res.data[0][0].status);
                              setStart(res.data[0][0].start_date);
                              setEnd(res.data[0][0].end_date);
                              setMaxStudent(res.data[0][0].max_students);
                              setInitialSession(res.data[0][0].initial_sessions);
                              setCurrentStudent(res.data[1][0].currentStudents);
                              setCurrentSession(res.data[2][0].currentSessions);
                        }
                  })
                  .catch(err => console.log(err));

            if (listType === 0)
            {
                  request.post(`http://${ domain }/classStudent`, { params: { name: name, studentName: searchStudent } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              if (res.status === 200)
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<Student key={ i } i={ i + 1 } id={ res.data[i].id } render={ render } setRender={ setRender }
                                                name={ res.data[i].name } phone={ res.data[i].phone } email={ res.data[i].email }
                                                ssn={ res.data[i].ssn } setRemoveStudentTarget={ setRemoveStudentTarget } setRemoveStudentPopUp={ setRemoveStudentPopUp } />);
                              setContent(temp);
                        })
                        .catch(err => console.error(err));
            }
            else if (listType === 1)
            {
                  request.post(`http://${ domain }/admin/classTeacher`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              if (res.status === 200)
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<Teacher key={ i } i={ i + 1 }
                                                name={ res.data[i].name } phone={ res.data[i].phone } email={ res.data[i].email } id={ res.data[i].id }
                                                setRemoveTeacherTarget={ setRemoveTeacherTarget } setRemoveTeacherPopUp={ setRemoveTeacherPopUp } />);
                              setContent(temp);
                        })
                        .catch(err => console.error(err));
            }
            else if (listType === 2)
            {
                  request.post(`http://${ domain }/classSession`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              if (res.status === 200)
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<Session key={ i } number={ res.data[i][0].number } name={ name } room={ res.data[i][0].sessionClassroomID }
                                                start={ res.data[i][0].startHour } end={ res.data[i][0].endHour } session_date={ res.data[i][0].sessionDate } status={ res.data[i][0].sessionStatus }
                                                teacherName={ res.data[i][0].sessionTeacherName } teacherID={ res.data[i][0].sessionTeacherID }
                                                supervisorName={ res.data[i][0].sessionSupervisorName } supervisorID={ res.data[i][0].sessionSupervisorID } />);
                              setContent(temp);
                        })
                        .catch(err => console.error(err));
            }

            // eslint-disable-next-line
      }, [name, render, listType]);

      return (
            <div className="w-100 h-100 d-flex flex-column align-items-center" ref={ containerRef }>
                  <div className="w-100 d-flex flex-column overflow-auto hideBrowserScrollbar mt-2 mb-2 flex-grow-1">
                        <NavLink to={ '/class-list' } style={ { textDecoration: 'none' } }>
                              <strong className={ `ms-md-3 mb-0 me-md-0 mx-auto mt-2 ${ styles.back }` }>Back</strong>
                        </NavLink>
                        <div className='mx-auto'>
                              <h2 className='mt-4 text-center'>{ name }</h2>
                              <div className='d-flex align-items-center'>
                                    <strong className='mb-3'>Period:&nbsp;&nbsp;</strong>
                                    <p className='mb-3'>{ start === 'N/A' ? start : DMY(start) }&nbsp;&nbsp;-&nbsp;&nbsp;{ end === 'N/A' ? end : DMY(end) }</p>
                              </div>
                              <div className='d-flex align-items-center'>
                                    <strong className='mb-3'>Status:&nbsp;&nbsp;</strong>
                                    <p className='mb-3' style={ { color: status === 2 ? '#128400' : (status === 1 ? 'red' : (status === 0 ? 'gray' : 'black')) } }>{
                                          status === 2 ? 'Active' : (status === 1 ? 'Deactivated' : (status === 0 ? 'Finished' : 'N/A'))
                                    }</p>
                                    { status !== 0 && <button className={ `${ status === 2 ? 'btn-danger' : 'btn-success' } btn btn-sm mb-3 ms-3` } onClick={ () => setStatusPopUp(true) }>{ status === 2 ? 'Deactivate' : 'Activate' }</button> }
                              </div>
                              <div className='d-flex align-items-center'>
                                    <strong className='mb-3'>Number of students:&nbsp;&nbsp;</strong>
                                    <p className='mb-3'>{ currentStudent }&nbsp;/&nbsp;{ maxStudent }</p>
                              </div>
                              <div className='d-flex align-items-center'>
                                    <strong className='mb-3'>Number of sessions:&nbsp;&nbsp;</strong>
                                    <p className='mb-3'>{ currentSession }&nbsp;/&nbsp;{ initialSession }</p>
                              </div>
                        </div>
                        <br></br>
                        <div className='d-flex mx-auto flex-column flex-sm-row'>
                              <button className={ `mx-sm-3 my-1 btn ${ listType === 0 ? 'btn-primary' : 'btn-secondary' }` } onClick={ () => setListType(0) }>Student</button>
                              <button className={ `mx-sm-3 my-1 btn ${ listType === 1 ? 'btn-primary' : 'btn-secondary' }` } onClick={ () => setListType(1) }>Teacher</button>
                              <button className={ `mx-sm-3 my-1 btn ${ listType === 2 ? 'btn-primary' : 'btn-secondary' }` } onClick={ () => setListType(2) }>Session</button>
                        </div>
                        { listType === 0 &&
                              <div className='mt-3 ms-2 position-relative'>
                                    <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                                    <input value={ searchStudent } type='text' placeholder='Find student' className={ `ps-4` } onChange={ (e) =>
                                    {
                                          clearTimeout(timer);
                                          setSearchStudent(e.target.value);
                                          timer = setTimeout(() => setRender(!render), 1000);
                                    } }></input>
                              </div>
                        }
                        <div className={ `flex-grow-1 w-100 overflow-auto mt-3 px-1 mb-3` } style={ { minHeight: content.length ? '250px' : '65px' } }>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                {
                                                      listType === 0 &&
                                                      <>
                                                            <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                            <th scope="col" className='col-4 text-center align-middle'>Name</th>
                                                            <th scope="col" className='col-1 text-center align-middle'>SSN</th>
                                                            <th scope="col" className='col-2 text-center align-middle'>Phone number</th>
                                                            <th scope="col" className='col-2 text-center align-middle'>Email</th>
                                                            <th scope="col" className='col-2 text-center align-middle'>Action</th>
                                                      </>
                                                }
                                                {
                                                      listType === 1 &&
                                                      <>
                                                            <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                            <th scope="col" className='col-4 text-center align-middle'>Name</th>
                                                            <th scope="col" className='col-2 text-center align-middle'>Phone number</th>
                                                            <th scope="col" className='col-2 text-center align-middle'>Email</th>
                                                            <th scope="col" className='col-3 text-center align-middle'>Action</th>
                                                      </>
                                                }
                                                {
                                                      listType === 2 &&
                                                      <>
                                                            <th scope="col" className='col-1 text-center align-middle'>Session number</th>
                                                            <th scope="col" className='col-2 text-center align-middle'>Time</th>
                                                            <th scope="col" className='col-1 text-center align-middle'>Room</th>
                                                            <th scope="col" className='col-1 text-center align-middle'>Status</th>
                                                            <th scope="col" className='col-1 text-center align-middle'>Action</th>
                                                            <th scope="col" className='col-2 text-center align-middle'>Teacher</th>
                                                            <th scope="col" className='col-1 text-center align-middle'>Action</th>
                                                            <th scope="col" className='col-2 text-center align-middle'>Supervisor</th>
                                                            <th scope="col" className='col-1 text-center align-middle'>Action</th>
                                                      </>
                                                }
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { content }
                                    </tbody>
                              </table>
                        </div >
                        <div className="d-flex align-items-center mx-auto mb-3">
                              {
                                    listType === 0 && status !== 0 &&
                                    <button className='btn btn-primary me-2' onClick={ addStudent }>Add student</button>
                              }
                              {
                                    listType === 1 && status !== 0 &&
                                    <button className='btn btn-primary me-2' onClick={ () => setTeacherPopUp(true) }>Add teacher</button>
                              }
                              {
                                    listType === 2 && status !== 0 &&
                                    <button className='btn btn-primary me-2' onClick={ () => setSessionPopUp(true) }>Add session</button>
                              }
                              <button className='btn btn-secondary ms-2' onClick={ () => setStatsPopUp(true) }>Stats</button>
                        </div>
                  </div>
                  <Modal show={ statusPopUp } onHide={ () => setStatusPopUp(false) } className={ `reAdjustModel hideBrowserScrollbar` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Do you want to { status === 2 ? 'deactivate' : 'activate' } this class?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn ${ status === 2 ? 'btn-primary' : 'btn-danger' } me-2 me-md-4` } onClick={ () =>
                              {
                                    setStatusPopUp(false);
                              } }>No</button>
                              <button className={ `btn ${ status === 2 ? 'btn-danger' : 'btn-primary' } ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setStatusPopUp(false);
                                    request.post(`http://${ domain }/admin/toggleStatus`, { params: { name: name, status: status } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res =>
                                          {
                                                if (res.status === 200)
                                                      setRender(!render);
                                          })
                                          .catch(err => console.log(err));
                              } }>Yes</button>
                        </Modal.Footer>
                  </Modal>
                  <Modal show={ removeStudentPopUp } onHide={ () => { setRemoveStudentTarget(null); setRemoveStudentPopUp(false); } } className={ `reAdjustModel hideBrowserScrollbar` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Do you want to remove this student from this class?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setRemoveStudentTarget(null);
                                    setRemoveStudentPopUp(false);
                              } }>No</button>
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setRemoveStudentPopUp(false);
                                    request.post(`http://${ domain }/admin/removeStudentFromClass`, { params: { name: name, id: removeStudentTarget } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res =>
                                          {
                                                if (res.status === 200)
                                                      setRender(!render);
                                          })
                                          .catch(err => console.log(err));
                              } }>Yes</button>
                        </Modal.Footer>
                  </Modal>
                  <Modal show={ removeTeacherPopUp } onHide={ () => { setRemoveTeacherTarget(null); setRemoveTeacherPopUp(false); } } className={ `reAdjustModel hideBrowserScrollbar` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Do you want to remove this teacher from this class?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-primary me-2 me-md-4` } onClick={ () =>
                              {
                                    setRemoveTeacherTarget(null);
                                    setRemoveTeacherPopUp(false);
                              } }>No</button>
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setRemoveTeacherPopUp(false);
                                    request.post(`http://${ domain }/admin/removeTeacherFromClass`, { params: { name: name, id: removeTeacherTarget } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res =>
                                          {
                                                if (res.status === 200)
                                                      setRender(!render);
                                          })
                                          .catch(err => console.log(err));
                              } }>Yes</button>
                        </Modal.Footer>
                  </Modal>
                  <Modal show={ maxPopUp } onHide={ () => { setMaxPopUp(false); } } className={ `reAdjustModel hideBrowserScrollbar` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Maximum number of students reached!</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-primary` } onClick={ () =>
                              {
                                    setMaxPopUp(false);
                              } }>OKAY</button>
                        </Modal.Footer>
                  </Modal>
                  <AddStudent containerRef={ containerRef } setAddPopUp={ setAddPopUp } name={ name }
                        addPopUp={ addPopUp } currentStudent={ currentStudent } maxStudent={ maxStudent }
                        render={ render } setRender={ setRender } status={ status } />
                  <AddSession containerRef={ containerRef } setSessionPopUp={ setSessionPopUp } name={ name } currentSession={ currentSession }
                        sessionPopUp={ sessionPopUp } render={ render } setRender={ setRender } />
                  <AddTeacher containerRef={ containerRef } setTeacherPopUp={ setTeacherPopUp } name={ name }
                        teacherPopUp={ teacherPopUp } render={ render } setRender={ setRender } status={ status } />
                  <Stats name={ name } containerRef={ containerRef } setShowPopUp={ setStatsPopUp } showPopUp={ statsPopUp } />
            </div >
      )
}

export default ClassDetail;