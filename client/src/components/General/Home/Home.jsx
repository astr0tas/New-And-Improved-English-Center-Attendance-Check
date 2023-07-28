import styles from './Home.module.css';
import { NavLink, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { domain } from '../../../tools/domain';
import { useEffect, useState } from 'react';
import '../../../css/scroll.css';
import { DMY } from '../../../tools/dateFormat';

const Staff = (props) =>
{
      const [today, setToday] = useState([]);
      const [missed, setMissed] = useState([]);

      useEffect(() =>
      {
            axios.get(`http://${ domain }/getTodaySession`, { withCredentials: true })
                  .then(res =>
                  {
                        const temp = [];
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

            axios.get(`http://${ domain }/getMissedSession`, { withCredentials: true })
                  .then(res =>
                  {
                        const temp = [];
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
                                                props.userType === 3 &&
                                                <NavLink to={ `/my-class-list/detail/${ res.data[i].name }/Session ${ res.data[i].number }` }>
                                                      <button className='btn btn-sm btn-danger'>Check attendance</button>
                                                </NavLink>
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
      }, []);

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
      return (
            <div className='w-100 h-100'>

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