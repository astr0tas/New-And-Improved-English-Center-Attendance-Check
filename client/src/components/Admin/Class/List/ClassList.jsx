import styles from './ClassList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { DMY } from '../../../../tools/dateFormat';
import { useNavigate } from 'react-router-dom';
import { domain } from '../../../../tools/domain';
import { context } from '../../../../context';
import '../../../../css/scroll.css';
import request from '../../../../tools/request';

const Class = (props) =>
{
      const [currentStudents, setCurrentStudents] = useState(0);
      const [currentSessions, setCurrentSessions] = useState(0);

      useEffect(() =>
      {
            // request.post(`http://${ domain }/admin/getCurrentStudent`, { params: { name: props.name } }, { headers: { 'Content-Type': 'application/json' } })
            //       .then(res =>
            //       {
            //             setCurrentStudents(res.data.currentStudents);
            //       })
            //       .catch(err => console.error(err));

            // request.post(`http://${ domain }/admin/getCurrentSession`, { params: { name: props.name } }, { headers: { 'Content-Type': 'application/json' } })
            //       .then(res =>
            //       {
            //             setCurrentSessions(res.data.currentSessions);
            //       })
            //       .catch(err => console.error(err));
      }, [props.name])

      return (
            <tr className={ `${ styles.hover }` } onClick={ () => { props.setListType(0); props.Navigate(`./detail/${ props.name }`); } }>
                  <td className='text-center align-middle'>{ props.i }</td>
                  <td className='text-center align-middle'>{ props.name }</td>
                  <td className='text-center align-middle'>{ currentStudents }/{ props.initialStudents }</td>
                  <td className='text-center align-middle'>{ currentSessions }/{ props.initialSessions }</td>
                  <td className='text-center align-middle'>{ props.start === null ? 'N/A' : DMY(props.start) }</td>
                  <td className='text-center align-middle'>{ props.end === null ? 'N/A' : DMY(props.end) }</td>
                  <td className='text-center align-middle' style={ { color: props.status === 0 ? 'red' : '#128400' } }>{ props.status === 0 ? 'Deactivated' : 'Active' }</td>
            </tr>
      )
}

const ClassList = () =>
{
      document.title = 'Class List';

      const [tableContent, setTableContent] = useState([]);
      const [name, setName] = useState("");
      const { classState, setClassState } = useContext(context);
      const { setListType } = useContext(context);
      const Navigate = useNavigate();

      let timer1;

      useEffect(() =>
      {
            request.post(`http://${ domain }/admin/classList`, { params: { name: name, status: classState } },
                  {
                        headers: { 'Content-Type': 'application/json' }
                  })
                  .then(res =>
                  {
                        const temp = [];
                        for (let i = 0; i < res.data.length; i++)
                              temp.push(<Class key={ i } i={ i + 1 } Navigate={ Navigate } setListType={ setListType }
                                    initialStudents={ res.data[i].Max_students } initialSessions={ res.data[i].Initial_sessions } name={ res.data[i].Name }
                                    start={ res.data[i].Start_date } end={ res.data[i].End_date } status={ res.data[i].Status } />);
                        setTableContent(temp);
                  })
                  .catch(err => console.log(err));

            // eslint-disable-next-line
      }, [name, Navigate, classState]);

      const findClass = (e) =>
      {
            clearTimeout(timer1);

            timer1 = setTimeout(() =>
            {
                  setName(e.target.value);
            }, 1500);
      }

      const changeStatus = (val) =>
      {
            setClassState(val);
      }

      return (
            <div className='w-100 d-flex flex-column overflow-auto flex-grow-1 mt-2 mb-2 hideBrowserScrollbar'>
                  <div className='mt-4 mt-md-2 me-md-auto ms-md-3 mx-auto d-flex align-items-center flex-column flex-sm-row'>
                        <div className='mb-3 mb-sm-0 position-relative'>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input type='text' placeholder='Find class' className={ `ps-4` } onChange={ findClass }></input>
                        </div>
                        <div className='ms-3 d-flex align-items-center'>
                              <strong>Status</strong>
                              <div className='d-flex align-items-center'>
                                    <input type="radio" id="active" name="status" value={ 1 } className={ `ms-2 me-1 ${ styles.hover } ${ styles.radios }` } onChange={ () => changeStatus(1) } checked={ classState === 1 } />
                                    <label htmlFor="active" className={ `me-3` } style={ { color: '#128400' } }>Active</label>
                              </div>
                              <div className='d-flex align-items-center'>
                                    <input type="radio" id="deactivated" name="status" value={ 0 } className={ `me-1 ${ styles.hover } ${ styles.radios }` } onChange={ () => changeStatus(0) } checked={ classState === 0 } />
                                    <label htmlFor="deactivated" style={ { color: 'red' } }>Deactivated</label>
                              </div>
                        </div>
                  </div>
                  <div className={ `flex-grow-1 w-100 overflow-auto mt-3 px-1 mb-3` } style={ { minHeight: tableContent.length ? '200px' : '65px' } }>
                        <table className="table table-hover table-info">
                              <thead style={ { position: "sticky", top: "0" } }>
                                    <tr>
                                          <th scope="col" className='col-1 text-center align-middle'>#</th>
                                          <th scope="col" className='col-4 text-center align-middle'>Name</th>
                                          <th scope="col" className='col-1 text-center align-middle'>Students</th>
                                          <th scope="col" className='col-1 text-center align-middle'>Sessions</th>
                                          <th scope="col" className='col-2 text-center align-middle'>Start date</th>
                                          <th scope="col" className='col-2 text-center align-middle'>End date</th>
                                          <th scope="col" className='col-1 text-center align-middle'>Status</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    { tableContent }
                              </tbody>
                        </table>
                  </div>
                  <div className="w-100 d-flex align-items-center mb-3 justify-content-center">
                        <button className="btn btn-primary" onClick={ () => Navigate('./create') }>Add a class</button>
                  </div>
            </div>
      )
}

export default ClassList;