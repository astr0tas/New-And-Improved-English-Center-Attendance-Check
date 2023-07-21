import { useNavigate, useParams } from 'react-router-dom';
import styles from './ClassDetail.module.css';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { DMY } from '../../../../tools/dateFormat';
import { domain } from '../../../../tools/domain';
import '../../../../css/modal.css';
import { context } from '../../../../context';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { DMDY } from '../../../../tools/dateFormat';
import '../../../../css/scroll.css';
import AddStudent from './AddStudent/AddStudent';
import AddSession from './AddSession/AddSession';
import AddTeacher from './AddTeacher/AddTeacher';

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
                              <button className='btn btn-primary btn-sm me-2' onClick={ () => props.Navigate(`/student-list/detail/${ props.id }`) }>Detail</button>
                              <button className='btn btn-danger btn-sm ms-2' onClick={ removeStudent }>Remove</button>
                        </div>
                  </td>
            </tr>
      )
}

const Session = (props) =>
{
      const [teacherName, setTeacherName] = useState("N/A");
      const [teacherID, setTeacherID] = useState(null);
      const [supervisorName, setSupervisorName] = useState("N/A");
      const [supervisorID, setSupervisorID] = useState(null);
      const [status, setStatus] = useState("N/A");

      useEffect(() =>
      {
            axios.post(`http://${ domain }/admin/getSessionTeacher`, { params: { name: props.name, number: props.number } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        if (res.data)
                        {
                              setTeacherName(res.data.name);
                              setTeacherID(res.data.id);
                        }
                  })
                  .catch(err => console.error(err));

            axios.post(`http://${ domain }/admin/getSessionSupervisor`, { params: { name: props.name, number: props.number } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        if (res.data)
                        {
                              setSupervisorName(res.data.name);
                              setSupervisorID(res.data.id);
                        }
                  })
                  .catch(err => console.error(err));

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
      }, [props.name, props.number, props.status])

      return (
            <tr>
                  <td className='text-center align-middle'>Session { props.number }</td>
                  <td className='text-center align-middle'><AiOutlineClockCircle className='me-2' style={ { marginBottom: '1px' } } />{ DMDY(props.session_date) }&nbsp;:&nbsp;{ props.start }&nbsp;-&nbsp;{ props.end }</td>
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
                  <td className='text-center align-middle'><button className='btn btn-primary btn-sm' onClick={ () => props.Navigate(`./Session ${ props.number }`) }>Detail</button></td>
                  <td className='text-center align-middle'>{ teacherName }</td>
                  <td className='text-center align-middle'><button className='btn btn-primary btn-sm' onClick={ () => props.Navigate(`/staff-list/detail/${ teacherID }`) }>Detail</button></td>
                  <td className='text-center align-middle'>{ supervisorName }</td>
                  <td className='text-center align-middle'><button className='btn btn-primary btn-sm' onClick={ () => props.Navigate(`/staff-list/detail/${ supervisorID }`) }>Detail</button></td>
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
                              <button className="btn btn-sm btn-primary" onClick={ () => props.Navigate(`/staff-list/detail/${ props.id }`) }>Detail</button>
                              <button className='btn btn-danger btn-sm ms-2' onClick={ removeTeacher }>Remove</button>
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

      const Navigate = useNavigate();

      document.title = `Class ${ name }`;

      const addStudent = () =>
      {
            if (currentStudent === maxStudent)
                  setMaxPopUp(true);
            else
                  setAddPopUp(true);
      }

      useEffect(() =>
      {
            axios.post(`http://${ domain }/admin/classInfo`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        setStatus(res.data.status);
                        setStart(res.data.start_date);
                        setEnd(res.data.end_date);
                        setMaxStudent(res.data.max_students);
                        setInitialSession(res.data.initial_sessions);
                  })
                  .catch(err => console.log(err));

            axios.post(`http://${ domain }/admin/getCurrentStudent`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        setCurrentStudent(res.data.currentStudents);
                  })
                  .catch(err => console.error(err));

            axios.post(`http://${ domain }/admin/getCurrentSession`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        setCurrentSession(res.data.currentSessions);
                  })
                  .catch(err => console.error(err));

            if (listType === 0)
            {
                  axios.post(`http://${ domain }/admin/classStudent`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Student key={ i } i={ i + 1 } Navigate={ Navigate } id={ res.data[i].id } render={ render } setRender={ setRender }
                                          name={ res.data[i].name } phone={ res.data[i].phone } email={ res.data[i].email }
                                          ssn={ res.data[i].ssn } setRemoveStudentTarget={ setRemoveStudentTarget } setRemoveStudentPopUp={ setRemoveStudentPopUp } />);
                              setContent(temp);
                        })
                        .catch(err => console.error(err));
            }
            else if (listType === 1)
            {
                  axios.post(`http://${ domain }/admin/classTeacher`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Teacher key={ i } Navigate={ Navigate } i={ i + 1 }
                                          name={ res.data[i].name } phone={ res.data[i].phone } email={ res.data[i].email } id={ res.data[i].id }
                                          setRemoveTeacherTarget={ setRemoveTeacherTarget } setRemoveTeacherPopUp={ setRemoveTeacherPopUp } />);
                              setContent(temp);
                        })
                        .catch(err => console.error(err));
            }
            else if (listType === 2)
            {
                  axios.post(`http://${ domain }/admin/classSession`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Session key={ i } number={ res.data[i].number } Navigate={ Navigate } name={ name }
                                          start={ res.data[i].start_hour } end={ res.data[i].end_hour } session_date={ res.data[i].session_date } status={ res.data[i].status } />);
                              setContent(temp);
                        })
                        .catch(err => console.error(err));
            }
      }, [name, render, listType, Navigate]);

      return (
            <div className="w-100 h-100 d-flex flex-column align-items-center" ref={ containerRef }>
                  <div className="w-100 d-flex flex-column overflow-auto hideBrowserScrollbar mt-2 mb-2 flex-grow-1">
                        <strong className={ `ms-md-3 mb-0 me-md-0 mx-auto mt-2 ${ styles.back }` } onClick={ () => Navigate(-1) }>Back</strong>
                        <div className='mx-auto'>
                              <h2 className='mt-4 text-center'>{ name }</h2>
                              <div className='d-flex align-items-center'>
                                    <strong className='mb-3'>Period:&nbsp;&nbsp;</strong>
                                    <p className='mb-3'>{ start === 'N/A' ? start : DMY(start) }&nbsp;&nbsp;-&nbsp;&nbsp;{ end === 'N/A' ? end : DMY(end) }</p>
                              </div>
                              <div className='d-flex align-items-center'>
                                    <strong className='mb-3'>Status:&nbsp;&nbsp;</strong>
                                    <p className='mb-3' style={ { color: status === 1 ? '#128400' : 'red' } }>{ status === 1 ? 'Active' : 'Deactivated' }</p>
                                    <button className={ `${ status === 1 ? 'btn-danger' : 'btn-success' } btn btn-sm mb-3 ms-3` } onClick={ () => setStatusPopUp(true) }>{ status === 1 ? 'Deactivate' : 'Activate' }</button>
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
                                                            <th scope="col" className='col-3 text-center align-middle'>Time</th>
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
                                    listType === 0 &&
                                    <button className='btn btn-primary me-md-3 me-2' onClick={ addStudent }>Add student</button>
                              }
                              {
                                    listType === 1 &&
                                    <button className='btn btn-primary me-md-3 me-2' onClick={ () => setTeacherPopUp(true) }>Add teacher</button>
                              }
                              {
                                    listType === 2 &&
                                    <button className='btn btn-primary me-md-3 me-2' onClick={ () => setSessionPopUp(true) }>Add session</button>
                              }
                              <button className='btn btn-secondary ms-md-3 ms-2' onClick={ () => Navigate('./edit') }>Edit class</button>
                        </div>
                  </div>
                  <Modal show={ statusPopUp } onHide={ () => setStatusPopUp(false) } className={ `reAdjustModel hideBrowserScrollbar` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Do you want to { status === 1 ? 'deactivate' : 'activate' } this class?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn ${ status === 1 ? 'btn-primary' : 'btn-danger' } ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setStatusPopUp(false);
                              } }>No</button>
                              <button className={ `btn ${ status === 1 ? 'btn-danger' : 'btn-primary' } ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setStatusPopUp(false);
                                    axios.post(`http://${ domain }/admin/toggleStatus`, { params: { name: name, status: !status } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res =>
                                          {
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
                                    axios.post(`http://${ domain }/admin/removeStudentFromClass`, { params: { name: name, id: removeStudentTarget } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res =>
                                          {
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
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setRemoveTeacherTarget(null);
                                    setRemoveTeacherPopUp(false);
                              } }>No</button>
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setRemoveTeacherPopUp(false);
                                    axios.post(`http://${ domain }/admin/removeTeacherFromClass`, { params: { name: name, id: removeTeacherTarget } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res =>
                                          {
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
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setMaxPopUp(false);
                              } }>OKAY</button>
                        </Modal.Footer>
                  </Modal>
                  <AddStudent containerRef={ containerRef } setAddPopUp={ setAddPopUp } name={ name }
                        addPopUp={ addPopUp } currentStudent={ currentStudent } maxStudent={ maxStudent }
                        render={ render } setRender={ setRender } Navigate={ Navigate } />
                  <AddSession containerRef={ containerRef } setSessionPopUp={ setSessionPopUp } name={ name } currentSession={ currentSession }
                        sessionPopUp={ sessionPopUp } render={ render } setRender={ setRender } Navigate={ Navigate } />
                  <AddTeacher containerRef={ containerRef } setTeacherPopUp={ setTeacherPopUp } name={ name }
                        teacherPopUp={ teacherPopUp } render={ render } setRender={ setRender } Navigate={ Navigate } />
            </div >
      )
}

export default ClassDetail;