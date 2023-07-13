import { useEffect, useRef, useState } from 'react';
import styles from './SessionDetail.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { domain } from '../../../../tools/domain';
import axios from 'axios';
import { DMDY } from '../../../../tools/dateFormat';
import '../../../../css/scroll.css';
import { Modal } from 'react-bootstrap';

const Student = (props) =>
{
      const toggleStatus = (status) =>
      {
            if (props.studentAttendence.length)
            {
                  console.log(status);
                  props.studentAttendence[props.i - 1].status = status;
            }
      }

      useEffect(() =>
      {
            // console.log('ok');
            props.setStudentAttendence(prev => [...prev, { id: props.id, status: null, note: null, i: props.i }]);

            axios.post(`http://${ domain }/admin/getStudentSessionAttendace`, { params: { className: props.className, sessionNumber: props.sessionNumber, id: props.id } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        if (res.data.length)
                        {
                              // if (isRefValid(props.studentAttendence, props.i - 1))
                              // {
                              //       props.studentAttendence.current[props.i - 1].status = res.data[0].status;
                              //       props.studentAttendence.current[props.i - 1].note = res.data[0].note;
                              // }
                        }
                  })
                  .catch(err => console.log(err));
            // eslint-disable-next-line
      }, [props.id, props.className, props.sessionNumber, props.i])

      return (
            <tr>
                  <td className='text-center align-middle'>{ props.i }</td>
                  <td className='text-center align-middle'>{ props.name }</td>
                  <td className='text-center align-middle'><button className='btn btn-sm btn-primary' onClick={ () => props.Navigate(`/student-list/detail/${ props.id }`) }>Detail</button></td>
                  <td className='text-center align-middle'>
                        <input name={ `${ props.id }_attendace` } type='radio' className={ `${ styles.hover }` }
                              style={ { width: '1.3rem', height: '1.3rem' } }
                              checked={ props.studentAttendence.length && props.studentAttendence[props.i - 1].status === 1 }
                              onChange={ () => toggleStatus(1) }></input>
                  </td>
                  <td className='text-center align-middle'>
                        <input name={ `${ props.id }_attendace` } type='radio' className={ `${ styles.hover }` }
                              style={ { width: '1.3rem', height: '1.3rem' } }
                              checked={ props.studentAttendence.length && props.studentAttendence[props.i - 1].status === 2 }
                              onChange={ () => toggleStatus(2) }></input>
                  </td>
                  <td className='text-center align-middle'>
                        <input name={ `${ props.id }_attendace` } type='radio' className={ `${ styles.hover }` }
                              style={ { width: '1.3rem', height: '1.3rem' } }
                              checked={ props.studentAttendence.length && props.studentAttendence[props.i - 1].status === 3 }
                              onChange={ () => toggleStatus(3) }></input>
                  </td>
                  <td className='text-center align-middle'>
                        <input type='text'
                              // value={ (isRefValid(props.studentAttendence, props.i - 1) && props.studentAttendence.current[props.i - 1].note !== null) ? props.studentAttendence.current[props.i - 1].note : '' }
                              onChange={ e =>
                              {
                                    // if (isRefValid(props.studentAttendence, props.i - 1))
                                    //       props.studentAttendence.current[props.i - 1].note = e.target.value;
                              } }></input>
                  </td>
            </tr>
      )
}

const AdminClassSessionDetail = () =>
{
      const name = useParams().name;
      const number = useParams().number.split(' ')[1];

      document.title = `Class ${ name } session ${ number }`;

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

      const [studentAttendence, setStudentAttendence] = useState([]);

      const Navigate = useNavigate();

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
                  })
                  .catch(err => console.error(err));

            axios.post(`http://${ domain }/admin/sessionTeacher`, { params: { name: name, number: number } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        if (res.data !== '')
                        {
                              setTeacherID(res.data.id ? res.data.id : null);
                              setTeacherName(res.data.name ? res.data.name : 'N/A');
                              setTeacherImage(res.data.image ? `http://${ domain }/image/employee/${ res.data.image }` : require('../../../../images/profile.png'));
                        }
                  })
                  .catch(err => console.error(err));

            axios.post(`http://${ domain }/admin/sessionSupervisor`, { params: { name: name, number: number } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        if (res.data !== '')
                        {
                              setSupervisorID(res.data.id ? res.data.id : null);
                              setSupervisorName(res.data.name ? res.data.name : 'N/A');
                              setSupervisorImage(res.data.image ? `http://${ domain }/image/employee/${ res.data.image }` : require('../../../../images/profile.png'));
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
                                    temp.push(<Student Navigate={ Navigate } key={ i } i={ i + 1 }
                                          id={ res.data[i].id } name={ res.data[i].name }
                                          studentAttendence={ studentAttendence } setStudentAttendence={ setStudentAttendence }
                                          className={ name } sessionNumer={ number } />);
                              setStudentList(temp);
                        }
                  })
                  .catch(err => console.error(err));
      }, [number, name, Navigate, studentAttendence]);

      return (
            <div className='w-100 h-100 d-flex flex-column overflow-auto hideBrowserScrollbar'>
                  <div className='w-100 d-flex flex-column flex-xl-row align-items-center'>
                        <div className={ `d-flex flex-column align-items-center ms-xl-5 mt-5 ${ styles.section } h-75` }>
                              <h2>Session { number ? number : 'N/A' }</h2>
                              <p className='text-center align-middle'>Date: { date ? DMDY(date) : 'N/A' }</p>
                              <p>Time: { start ? start : 'N/A' } - { end ? end : 'N/A' }</p>
                              <p>Room: { room }</p>
                              <div className='d-flex align-items-center'>
                                    <p>Satus:&nbsp;</p>
                                    <p style={ {
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
                              </div>
                              { makeUp && <p>Make for session { makeUp }</p> }
                        </div>
                        <div className={ `${ styles.section } d-flex flex-column flex-xl-row align-items-center align-items-xl-start justify-content-xl-around` }>
                              <div className='d-flex flex-column align-items-center mt-3'>
                                    <h4>{ teacherName }</h4>
                                    <img className={ `${ styles.images }` } alt='' src={ teacherImage }></img>
                                    <button className='btn btn-sm btn-primary mt-2' onClick={ () => Navigate(`/staff-list/detail/${ teacherID }`) }>Detail</button>
                                    <div className='d-flex align-items-center justify-content-center mt-2 mb-2'>
                                          <div className='d-flex flex-column align-items-center me-4'>
                                                <label htmlFor='teacherOnClass' style={ { color: '#128400' } }>On class</label>
                                                <input name='teacherAttendance' id='teacherOnClass' type='radio' style={ { width: '1.3rem', height: '1.3rem' } } className={ `${ styles.hover } ` }></input>
                                          </div>
                                          <div className='d-flex flex-column align-items-center'>
                                                <label htmlFor='teacherLate' style={ { color: 'orange' } }>Late</label>
                                                <input name='teacherAttendance' id='teacherLate' type='radio' style={ { width: '1.3rem', height: '1.3rem' } } className={ `${ styles.hover }` }></input>
                                          </div>
                                          <div className='d-flex flex-column align-items-center ms-4'>
                                                <label htmlFor='teacherAbsent' style={ { color: 'red' } }>Absent</label>
                                                <input name='teacherAttendance' id='teacherAbsent' type='radio' style={ { width: '1.3rem', height: '1.3rem' } } className={ `${ styles.hover }` }></input>
                                          </div>
                                    </div>
                                    <label htmlFor='teacherNote'>Note</label>
                                    <input type='text' id='teacherNote' className='w-100'></input>
                              </div>
                              <div className='d-flex flex-column align-items-center mt-3'>
                                    <h4>{ supervisorName }</h4>
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
                                                            studentList.length &&
                                                            <input name="allAttendance" type="radio" className={ `${ styles.hover }` } style={ { width: '1.3rem', height: '1.3rem' } }></input>
                                                      }
                                                </div>
                                          </th>
                                          <th scope="col" className='col-1 text-center align-middle'>
                                                <div className="d-flex flex-column align-items-center justify-content-center">
                                                      <p className='mb-2'>Late</p>
                                                      {
                                                            studentList.length &&
                                                            <input name="allAttendance" type="radio" className={ `${ styles.hover }` } style={ { width: '1.3rem', height: '1.3rem' } }></input>
                                                      }                                                </div>
                                          </th>
                                          <th scope="col" className='col-1 text-center align-middle'>
                                                <div className="d-flex flex-column align-items-center justify-content-center">
                                                      <p className='mb-2'>Absent</p>
                                                      {
                                                            studentList.length &&
                                                            <input name="allAttendance" type="radio" className={ `${ styles.hover }` } style={ { width: '1.3rem', height: '1.3rem' } }></input>
                                                      }                                                </div>
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
                        <input id='classNote' type='text' style={ { width: '250px' } }></input>
                  </div>
                  <div className='w-100 d-flex align-items-center justify-content-center mb-3'>
                        <button className='btn btn-secondary me-3' onClick={ () => Navigate(`/class-list/detail/${ name }`) }>Back</button>
                        <button className='btn btn-primary ms-3' onClick={ () => { console.log(studentAttendence); } }>Confirm</button>
                  </div>
            </div>
      )
}

export default AdminClassSessionDetail;