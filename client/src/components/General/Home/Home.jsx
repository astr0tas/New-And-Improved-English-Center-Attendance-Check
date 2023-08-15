import styles from './Home.module.css';
import { NavLink, useOutletContext } from 'react-router-dom';
import request from '../../../tools/request';
import { domain } from '../../../tools/domain';
import { useEffect, useState } from 'react';
import '../../../css/scroll.css';
import { DMY } from '../../../tools/dateFormat';

const Staff = (props) =>
{
      const [today, setToday] = useState([]);
      const [missed, setMissed] = useState([]);

      const isValidDate = (date) =>
      {
            if (date)
            {
                  const currentDate = new Date();
                  const eightDaysAgo = new Date();
                  eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

                  const inputDateObj = new Date(date);

                  return inputDateObj >= eightDaysAgo && inputDateObj <= currentDate;
            }
            return false;
      }

      useEffect(() =>
      {
            request.get(`http://${ domain }/getTodaySession`, { withCredentials: true })
                  .then(res =>
                  {
                        const temp = [];
                        if (res.status === 200)
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<tr key={ i }>
                                          <td className='align-middle text-center'>{ i + 1 }</td>
                                          <td className='align-middle text-center'>{ res.data[i].name }</td>
                                          <td className='align-middle text-center'>Session { res.data[i].number }</td>
                                          <td className='align-middle text-center'>{ res.data[i].start_hour }</td>
                                          <td className='align-middle text-center'>{ res.data[i].end_hour }</td>
                                          <td className='align-middle text-center' style={ {
                                                color: res.data[i].status === 1 ? '#128400' : (
                                                      res.data[i].status === 2 ? 'gray' : (
                                                            res.data[i].status === 4 ? 'blue' : 'black'
                                                      )
                                                )
                                          } }>{ res.data[i].status === 1 ? 'On going' : (
                                                res.data[i].status === 2 ? 'Finished' : (
                                                      res.data[i].status === 4 ? 'Scheduled' : 'N/A'
                                                )
                                          ) }</td>
                                          <td className='align-middle text-center'>
                                                <NavLink to={ `/my-class-list/detail/${ res.data[i].name }/Session ${ res.data[i].number }` }>
                                                      <button className='btn btn-sm btn-primary'>Detail</button>
                                                </NavLink>
                                          </td>
                                    </tr>);
                        setToday(temp);
                  })
                  .catch(err => console.log(err));

            request.get(`http://${ domain }/getMissedSession`, { withCredentials: true })
                  .then(res =>
                  {
                        const temp = [];
                        if (res.status === 200)
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<tr key={ i }>
                                          <td className='align-middle text-center'>{ i + 1 }</td>
                                          <td className='align-middle text-center'>{ res.data[i].name }</td>
                                          <td className='align-middle text-center'>Session { res.data[i].number }</td>
                                          <td className='align-middle text-center'>{ DMY(res.data[i].session_date) }</td>
                                          <td className='align-middle text-center'>{ res.data[i].start_hour }</td>
                                          <td className='align-middle text-center'>{ res.data[i].end_hour }</td>
                                          <td className='align-middle text-center'>
                                                {
                                                      props.userType === 3 && isValidDate(res.data[i].session_date) &&
                                                      <NavLink to={ `/my-class-list/detail/${ res.data[i].name }/Session ${ res.data[i].number }` }>
                                                            <button className='btn btn-sm btn-danger'>Check attendance</button>
                                                      </NavLink>
                                                }
                                                {
                                                      props.userType === 3 && !isValidDate(res.data[i].session_date) &&
                                                      <strong className='text-danger'>Contact admin</strong>
                                                }
                                                {
                                                      props.userType === 2 &&
                                                      <strong className='text-danger'>Contact supervisor or admin</strong>
                                                }
                                          </td>
                                    </tr>);
                        setMissed(temp);
                  })
                  .catch(err => console.log(err));
      }, [props.userType]);

      return (
            <div className='w-100 h-100 d-flex flex-column align-items-center overflow-auto hideBrowserScrollbar'>
                  <div className={ `bg-light ${ styles.sections } mt-5 mb-5 d-flex flex-column` }>
                        <h3 className='align-middle text-center mt-3' style={ { color: '#128400' } }>Today sessions</h3>
                        <div className='w-100 flex-grow-1 px-2 overflow-auto mt-2 mb-2'>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Name</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Session</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Start hour</th>
                                                <th scope="col" className='col-2 text-center align-middle'>End hour</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Status</th>
                                                <th scope="col" className='col-1 text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { today }
                                    </tbody>
                              </table>
                        </div>
                  </div>
                  <div className={ `bg-light  ${ styles.sections } mt-auto mb-5 d-flex flex-column` }>
                        <h3 className='align-middle text-center mt-3' style={ { color: 'red' } }>Missed sessions</h3>
                        <div className='w-100 flex-grow-1 px-2 overflow-auto mt-2 mb-2'>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Name</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Session</th>
                                                <th scope="col" className='col-1 text-center align-middle'>Date</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Start hour</th>
                                                <th scope="col" className='col-2 text-center align-middle'>End hour</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { missed }
                                    </tbody>
                              </table>
                        </div>
                  </div>
            </div>
      )
}

const Admin = () =>
{
      const [classCount, setClassCount] = useState("N/A");
      const [activeClassCount, setActiveClassCount] = useState("N/A");
      const [finishedClassCount, setFinishedClassCount] = useState("N/A");
      const [deactivatedClassCount, setDeactivatedClassCount] = useState("N/A");
      const [staffCount, setStaffCount] = useState("N/A");
      const [teacherCount, setTeacherCount] = useState("N/A");
      const [studentCount, setStudentCount] = useState("N/A");
      const [activeStudentCount, setActiveStudentCount] = useState("N/A");
      const [inactiveStudentCount, setInactiveStudentCount] = useState("N/A");
      const [today, setToday] = useState([]);
      const [missed, setMissed] = useState([]);
      const [supervisorCount, setSupervisorCount] = useState("N/A");

      useEffect(() =>
      {
            request.get(`http://${ domain }/getClasses`)
                  .then(res =>
                  {
                        if (res.status === 200)
                        {
                              setActiveClassCount(res.data[0][0].totalActive);
                              setFinishedClassCount(res.data[1][0].totalFinished);
                              setDeactivatedClassCount(res.data[2][0].totalDeactivated);
                              setClassCount(res.data[0][0].totalActive + res.data[1][0].totalFinished + res.data[2][0].totalDeactivated);
                        }
                  })
                  .catch(err => console.log(err));

            request.get(`http://${ domain }/getStaffs`)
                  .then(res =>
                  {
                        if (res.status === 200)
                        {
                              setTeacherCount(res.data[0][0].totalTeacher);
                              setSupervisorCount(res.data[1][0].totalSupervisor);
                              setStaffCount(res.data[0][0].totalTeacher + res.data[1][0].totalSupervisor);
                        }
                  })
                  .catch(err => console.log(err));

            request.get(`http://${ domain }/getStudents`)
                  .then(res =>
                  {
                        if (res.status === 200)
                        {
                              setActiveStudentCount(res.data[0][0].totalActive);
                              setInactiveStudentCount(res.data[1][0].totalInactive);
                              setStudentCount(res.data[0][0].totalActive + res.data[1][0].totalInactive);
                        }
                  })
                  .catch(err => console.log(err));

            request.get(`http://${ domain }/getTodaySession`)
                  .then(res =>
                  {
                        const temp = [];
                        if (res.status === 200)
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<tr key={ i }>
                                          <td className='align-middle text-center'>{ i + 1 }</td>
                                          <td className='align-middle text-center'>{ res.data[i].name }</td>
                                          <td className='align-middle text-center'>Session { res.data[i].number }</td>
                                          <td className='align-middle text-center'>{ res.data[i].start_hour }</td>
                                          <td className='align-middle text-center'>{ res.data[i].end_hour }</td>
                                          <td className='align-middle text-center' style={ {
                                                color: res.data[i].status === 1 ? '#128400' : (
                                                      res.data[i].status === 2 ? 'gray' : (
                                                            res.data[i].status === 4 ? 'blue' : 'black'
                                                      )
                                                )
                                          } }>{ res.data[i].status === 1 ? 'On going' : (
                                                res.data[i].status === 2 ? 'Finished' : (
                                                      res.data[i].status === 4 ? 'Scheduled' : 'N/A'
                                                )
                                          ) }</td>
                                          <td className='align-middle text-center'>
                                                <NavLink to={ `/class-list/detail/${ res.data[i].name }/Session ${ res.data[i].number }` }>
                                                      <button className='btn btn-sm btn-primary'>Detail</button>
                                                </NavLink>
                                          </td>
                                    </tr>);
                        setToday(temp);
                  })
                  .catch(err => console.log(err));

            request.get(`http://${ domain }/getMissedSession`)
                  .then(res =>
                  {
                        const temp = [];
                        if (res.status === 200)
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<tr key={ i }>
                                          <td className='align-middle text-center'>{ i + 1 }</td>
                                          <td className='align-middle text-center'>{ res.data[i].name }</td>
                                          <td className='align-middle text-center'>Session { res.data[i].number }</td>
                                          <td className='align-middle text-center'>{ DMY(res.data[i].session_date) }</td>
                                          <td className='align-middle text-center'>{ res.data[i].start_hour }</td>
                                          <td className='align-middle text-center'>{ res.data[i].end_hour }</td>
                                          <td className='align-middle text-center'>
                                                <NavLink to={ `/class-list/detail/${ res.data[i].name }/Session ${ res.data[i].number }` }>
                                                      <button className='btn btn-sm btn-danger'>Check attendance</button>
                                                </NavLink>
                                          </td>
                                    </tr>);
                        setMissed(temp);
                  })
                  .catch(err => console.log(err));
      }, []);

      return (
            <div className='w-100 h-100 overflow-auto hideBrowserScrollbar d-flex flex-column align-items-center'>
                  <div className='mt-xl-5 mt-2 d-flex align-items-center justify-content-evenly flex-xl-row flex-column w-100'>
                        <div className='d-flex flex-column align-items-center'>
                              <div className='d-flex align-items-center my-xl-0 my-2'>
                                    <h4>Total classes:&nbsp;&nbsp;</h4>
                                    <h4>{ classCount }</h4>
                              </div>
                              <div className='d-flex align-items-center my-xl-0 my-2'>
                                    <h4>Total active classes:&nbsp;&nbsp;</h4>
                                    <h4 className='text-success'>{ activeClassCount }</h4>
                              </div>
                              <div className='d-flex align-items-center my-xl-0 my-2'>
                                    <h4>Total finished classes:&nbsp;&nbsp;</h4>
                                    <h4 className='text-secondary'>{ finishedClassCount }</h4>
                              </div>
                              <div className='d-flex align-items-center my-xl-0 my-2'>
                                    <h4>Total deactivated classes:&nbsp;&nbsp;</h4>
                                    <h4 className='text-danger'>{ deactivatedClassCount }</h4>
                              </div>
                        </div>
                        <hr className={ `${ styles.horizontal }` }></hr>
                        <div className='d-flex align-items-center flex-column'>
                              <div className='d-flex align-items-center my-xl-0 my-2'>
                                    <h4>Total students:&nbsp;&nbsp;</h4>
                                    <h4>{ studentCount }</h4>
                              </div>
                              <div className='d-flex align-items-center my-xl-0 my-2'>
                                    <h4>Total active students:&nbsp;&nbsp;</h4>
                                    <h4 className='text-success'>{ activeStudentCount }</h4>
                              </div>
                              <div className='d-flex align-items-center my-xl-0 my-2'>
                                    <h4>Total inactive students:&nbsp;&nbsp;</h4>
                                    <h4 className='text-danger'>{ inactiveStudentCount }</h4>
                              </div>
                        </div>
                        <hr className={ `${ styles.horizontal }` }></hr>
                        <div className='d-flex align-items-center flex-column'>
                              <div className='d-flex align-items-center my-xl-0 my-2'>
                                    <h4>Total staffs:&nbsp;&nbsp;</h4>
                                    <h4>{ staffCount }</h4>
                              </div>
                              <div className='d-flex align-items-center my-xl-0 my-2'>
                                    <h4>Total teachers:&nbsp;&nbsp;</h4>
                                    <h4 >{ teacherCount }</h4>
                              </div>
                              <div className='d-flex align-items-center my-xl-0 my-2'>
                                    <h4>Total supervisors:&nbsp;&nbsp;</h4>
                                    <h4 >{ supervisorCount }</h4>
                              </div>
                        </div>
                  </div>
                  <div className={ `bg-light ${ styles.sections } mt-5 mb-5 d-flex flex-column` }>
                        <h3 className='align-middle text-center mt-3' style={ { color: '#128400' } }>Today sessions</h3>
                        <div className='w-100 flex-grow-1 px-2 overflow-auto mt-2 mb-2'>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Name</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Session</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Start hour</th>
                                                <th scope="col" className='col-2 text-center align-middle'>End hour</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Status</th>
                                                <th scope="col" className='col-1 text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { today }
                                    </tbody>
                              </table>
                        </div>
                  </div>
                  <div className={ `bg-light  ${ styles.sections } mt-auto mb-5 d-flex flex-column` }>
                        <h3 className='align-middle text-center mt-3' style={ { color: 'red' } }>Missed sessions</h3>
                        <div className='w-100 flex-grow-1 px-2 overflow-auto mt-2 mb-2'>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Name</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Session</th>
                                                <th scope="col" className='col-1 text-center align-middle'>Date</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Start hour</th>
                                                <th scope="col" className='col-2 text-center align-middle'>End hour</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { missed }
                                    </tbody>
                              </table>
                        </div>
                  </div>
            </div>
      )
}

const Home = () =>
{
      document.title = 'Home';

      const userType = useOutletContext();

      return (
            <>
                  { userType === 1 && <Admin /> }
                  { userType !== 1 && <Staff userType={ userType } /> }
            </>
      )
}

export default Home;