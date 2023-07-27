import styles from './MyClassDetail.module.css';
import { useParams, NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { DMY } from '../../../../tools/dateFormat';
import { domain } from '../../../../tools/domain';
import '../../../../css/modal.css';
import { context } from '../../../../context';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { DMDY } from '../../../../tools/dateFormat';
import '../../../../css/scroll.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Student = (props) =>
{
      return (
            <tr>
                  <td className='text-center align-middle'>{ props.i }</td>
                  <td className='text-center align-middle'>{ props.name }</td>
                  <td className='text-center align-middle'>{ props.ssn }</td>
                  <td className='text-center align-middle'>{ props.phone }</td>
                  <td className='text-center align-middle'>{ props.email }</td>
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
                  <td className='text-center align-middle'>{ props.teacherName ? props.teacherName : 'N/A' }</td>
                  <td className='text-center align-middle'>{ props.supervisorName ? props.supervisorName : 'N/A' }</td>
                  <td className='text-center align-middle'>
                        <NavLink to={ `./Session ${ props.number }` }>
                              <button className='btn btn-sm btn-primary'>Detail</button>
                        </NavLink>
                  </td>
            </tr>
      )
}

const MyClassDetail = () =>
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

      document.title = `Class ${ name }`;

      let timer;

      const [searchStudent, setSearchStudent] = useState('');

      useEffect(() =>
      {
            axios.post(`http://${ domain }/classInfo`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        setStatus(res.data[0][0].status);
                        setStart(res.data[0][0].start_date);
                        setEnd(res.data[0][0].end_date);
                        setMaxStudent(res.data[0][0].max_students);
                        setInitialSession(res.data[0][0].initial_sessions);
                        setCurrentStudent(res.data[1][0].currentStudents);
                        setCurrentSession(res.data[2][0].currentSessions);
                  })
                  .catch(err => console.log(err));

            if (listType === 0)
            {
                  axios.post(`http://${ domain }/classStudent`, { params: { name: name, studentName: searchStudent } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Student key={ i } i={ i + 1 } id={ res.data[i].id } render={ render } setRender={ setRender }
                                          name={ res.data[i].name } phone={ res.data[i].phone } email={ res.data[i].email }
                                          ssn={ res.data[i].ssn } />);
                              setContent(temp);
                        })
                        .catch(err => console.error(err));
            }
            else if (listType === 2)
            {
                  axios.post(`http://${ domain }/classSession`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                        .then(res =>
                        {
                              const temp = [];
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
            <div className="w-100 h-100 d-flex flex-column align-items-center">
                  <div className="w-100 d-flex flex-column overflow-auto hideBrowserScrollbar mt-2 mb-2 flex-grow-1">
                        <NavLink to={ '/my-class-list' } style={ { textDecoration: 'none' } }>
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
                                                            <th scope="col" className='col-3 text-center align-middle'>Email</th>
                                                      </>
                                                }
                                                {
                                                      listType === 2 &&
                                                      <>
                                                            <th scope="col" className='col-1 text-center align-middle'>Session number</th>
                                                            <th scope="col" className='col-3 text-center align-middle'>Time</th>
                                                            <th scope="col" className='col-1 text-center align-middle'>Room</th>
                                                            <th scope="col" className='col-1 text-center align-middle'>Status</th>
                                                            <th scope="col" className='col-2 text-center align-middle'>Teacher</th>
                                                            <th scope="col" className='col-2 text-center align-middle'>Supervisor</th>
                                                            <th scope="col" className='col-2 text-center align-middle'>Action</th>
                                                      </>
                                                }
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { content }
                                    </tbody>
                              </table>
                        </div >
                  </div>
            </div >
      )
}

export default MyClassDetail;