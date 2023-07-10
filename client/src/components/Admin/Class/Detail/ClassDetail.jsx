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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import '../../../../css/scroll.css';

const AddStudent = (props) =>
{
      const [studentListContent, setStudentListContent] = useState([]);
      const [searchStudent, setSearchStudent] = useState("");
      const [studentAdded, setStudentAdded] = useState([]);

      let timer;

      const configList = (e, id) =>
      {
            if (e.target.checked)
                  setStudentAdded(prevState => [...prevState, id]);
            else
                  setStudentAdded(prevState => prevState.filter(item => item !== id));
      }

      useEffect(() =>
      {
            axios.post(`http://${ domain }/admin/getStudentNotFromClass`, { params: { className: props.name, studentName: searchStudent } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        const temp = [];
                        for (let i = 0; i < res.data.length; i++)
                              temp.push(
                                    <tr key={ i }>
                                          <td className='text-center'>{ i + 1 }</td>
                                          <td className='text-center'>{ res.data[i].name }</td>
                                          <td className='text-center'>{ res.data[i].ssn }</td>
                                          <td className='text-center'>{ res.data[i].phone }</td>
                                          <td className='text-center'>{ res.data[i].email }</td>
                                          <td className='text-center'>
                                                <input type='checkbox' onChange={ e => configList(e, res.data[i].id) } style={ { width: '1.2rem', height: '1.2rem' } } className={ `${ styles.hover }` }></input>
                                          </td>
                                    </tr >
                              );
                        setStudentListContent(temp);
                  })
                  .catch(err => console.error(err));
      }, [searchStudent])

      return (
            <Modal show={ true } onHide={ () => { props.setAddPopUp(null); } }
                  dialogClassName={ `${ styles.dialog }` } contentClassName={ `${ styles.content }` }
                  className={ `reAdjustModel ${ styles.customModal }` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <div>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input type='text' style={ { fontSize: '1rem', paddingLeft: '30px', maxWidth: '200px' } } onChange={ e =>
                              {
                                    clearTimeout(timer);

                                    timer = setTimeout(() =>
                                    {
                                          setSearchStudent(e.target.value);
                                    }, 1000);
                              } }></input>
                        </div>
                  </Modal.Header>
                  <Modal.Body>
                        <div className={ `h-100 w-100 overflow-auto mt-3 mb-3` }>
                              <table className="table table-hover table-info" style={ { borderCollapse: 'separate' } }>
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center'>#</th>
                                                <th scope="col" className='col-4 text-center'>Name</th>
                                                <th scope="col" className='col-2 text-center'>SSN</th>
                                                <th scope="col" className='col-2 text-center'>Phone number</th>
                                                <th scope="col" className='col-2 text-center'>Email</th>
                                                <th scope="col" className='col-1 text-center'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { studentListContent }
                                    </tbody>
                              </table>
                        </div >
                  </Modal.Body>
                  <Modal.Footer className='justify-content-center'>
                        <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                        {
                              props.setAddPopUp(null);
                        } }>Cancel</button>
                        <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                        {
                              console.log(studentAdded);
                              props.setAddPopUp(null);
                        } }>Confirm</button>
                  </Modal.Footer>
            </Modal>
      )
}

const Student = (props) =>
{
      const removeStudent = () =>
      {
            props.setRemoveTarget(props.id);
            props.setRemovePopUp(true);
      }

      return (
            <tr>
                  <td className='text-center'>{ props.i }</td>
                  <td className='text-center'>{ props.name }</td>
                  <td className='text-center'>{ props.ssn }</td>
                  <td className='text-center'>{ props.phone }</td>
                  <td className='text-center'>{ props.email }</td>
                  <td>
                        <div className="d-flex align-items-center justify-content-center">
                              <button className='btn btn-primary btn-sm me-2' onClick={ () => props.Navigate(`/student-list/${ props.id }`) }>Detail</button>
                              <button className='btn btn-danger btn-sm ms-2' onClick={ removeStudent }>Remove</button>
                        </div>
                  </td>
            </tr>
      )
}

const Session = (props) =>
{
      return (
            <tr>
                  <td className='text-center'>Session { props.number }</td>
                  <td className='text-center'><AiOutlineClockCircle className='me-2' style={ { marginBottom: '1px' } } />{ DMDY(props.session_date) }&nbsp;:&nbsp;{ props.start }&nbsp;-&nbsp;{ props.end }</td>
                  <td className='text-center'><button className='btn btn-primary btn-sm' onClick={ () => props.Navigate(`./Session ${ props.number }`) }>Detail</button></td>
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

      const { studentList, setStudentList } = useContext(context);

      const containerRef = useRef(null);
      const [statusPopUp, setStatusPopUp] = useState(false);
      const [removePopUp, setRemovePopUp] = useState(false);
      const [removeTarget, setRemoveTarget] = useState(null);
      const [maxPopUp, setMaxPopUp] = useState(false);

      const [addPopUp, setAddPopUp] = useState(null);

      const Navigate = useNavigate();

      document.title = `Class ${ name }`;

      const addAStudent = () =>
      {
            if (currentStudent === maxStudent)
                  setMaxPopUp(true);
            else
                  setAddPopUp(<AddStudent containerRef={ containerRef } setAddPopUp={ setAddPopUp } name={ name } />);
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

            if (studentList)
            {
                  axios.post(`http://${ domain }/admin/classStudent`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Student key={ i } i={ i + 1 } Navigate={ Navigate } id={ res.data[i].id } render={ render } setRender={ setRender }
                                          name={ res.data[i].name } phone={ res.data[i].phone } email={ res.data[i].email }
                                          ssn={ res.data[i].ssn } setRemoveTarget={ setRemoveTarget } setRemovePopUp={ setRemovePopUp } />);
                              setContent(temp);
                        })
                        .catch(err => console.error(err));
            }
            else
            {
                  axios.post(`http://${ domain }/admin/classSession`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Session key={ i } number={ res.data[i].number } Navigate={ Navigate }
                                          start={ res.data[i].start_hour } end={ res.data[i].end_hour } session_date={ res.data[i].session_date } />);
                              setContent(temp);
                        })
                        .catch(err => console.error(err));
            }
      }, [name, render, studentList]);

      return (
            <div className="w-100 h-100 d-flex flex-column align-items-center" ref={ containerRef }>
                  <div className="w-100 h-100 d-flex flex-column overflow-auto">
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
                        <div className='d-flex mx-auto'>
                              <button className={ `mx-3 btn ${ studentList ? 'btn-primary' : 'btn-secondary' }` } onClick={ () => setStudentList(true) }>Student</button>
                              <button className={ `mx-3 btn ${ studentList ? 'btn-secondary' : 'btn-primary' }` } onClick={ () => setStudentList(false) }>Session</button>
                        </div>
                        <div className={ `flex-grow-1 w-100 overflow-auto mt-3 px-md-2 mb-3` }>
                              <table className="table table-hover table-info" style={ { borderCollapse: 'separate' } }>
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                {
                                                      studentList &&
                                                      <>
                                                            <th scope="col" className='col-1 text-center'>#</th>
                                                            <th scope="col" className='col-4 text-center'>Name</th>
                                                            <th scope="col" className='col-1 text-center'>SSN</th>
                                                            <th scope="col" className='col-2 text-center'>Phone number</th>
                                                            <th scope="col" className='col-2 text-center'>Email</th>
                                                            <th scope="col" className='col-2 text-center'>Action</th>
                                                      </>
                                                }
                                                {
                                                      !studentList &&
                                                      <>
                                                            <th scope="col" className='col-3 text-center'>Session number</th>
                                                            <th scope="col" className='col-7 text-center'>Time</th>
                                                            <th scope="col" className='col-2 text-center'>Action</th>
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
                              <button className='btn btn-primary me-md-3 me-2' onClick={ addAStudent }>Add student</button>
                              <button className='btn btn-secondary ms-md-3 ms-2' onClick={ () => Navigate('./edit') }>Edit class</button>
                        </div>
                  </div>
                  <Modal show={ statusPopUp } onHide={ () => setStatusPopUp(false) } className={ `reAdjustModel` } container={ containerRef.current }>
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
                  <Modal show={ removePopUp } onHide={ () => { setRemoveTarget(null); setRemovePopUp(false); } } className={ `reAdjustModel` } container={ containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Do you want to remove this student from this class?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setRemoveTarget(null);
                                    setRemovePopUp(false);
                              } }>No</button>
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setRemovePopUp(false);
                                    axios.post(`http://${ domain }/admin/removeStudentFromClass`, { params: { name: name, id: removeTarget } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res =>
                                          {
                                                setRender(!render);
                                          })
                                          .catch(err => console.log(err));
                              } }>Yes</button>
                        </Modal.Footer>
                  </Modal>
                  <Modal show={ maxPopUp } onHide={ () => { setMaxPopUp(false); } } className={ `reAdjustModel` } container={ containerRef.current }>
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
                  { addPopUp }
            </div >
      )
}

export default ClassDetail;