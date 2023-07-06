import styles from './ClassList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import '../../../../css/scroll.css';
import { useEffect, useState } from 'react';
import { DMY } from '../../../../tools/dateFormat';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { domain } from '../../../../tools/domain';

const Class = (props) =>
{
      const [currentStudents, setCurrentStudents] = useState(0);
      const [currentSessions, setCurrentSessions] = useState(0);

      useEffect(() =>
      {
            axios.post(`http://${ domain }/admin/getCurrentStudent`, { params: { name: props.name } })
                  .then(res =>
                  {
                        setCurrentStudents(res.data.currentStudents);
                  })
                  .catch(err => console.error(err));

            axios.post(`http://${ domain }/admin/getCurrentSession`, { params: { name: props.name } })
                  .then(res =>
                  {
                        setCurrentSessions(res.data.currentSessions);
                  })
                  .catch(err => console.error(err));
      }, [props.name])

      return (
            <tr className={ `${ styles.hover }` } onClick={ () => { props.Navigate(`./${ props.name }`); } }>
                  <td className='text-center'>{ props.i }</td>
                  <td className='text-center'>{ props.name }</td>
                  <td className='text-center'>{ currentStudents }/{ props.initialStudents }</td>
                  <td className='text-center'>{ currentSessions }/{ props.initialSessions }</td>
                  <td className='text-center'>{ DMY(props.start) }</td>
                  <td className='text-center'>{ DMY(props.end) }</td>
                  <td className='text-center' style={ { color: props.status === 0 ? 'red' : '#128400' } }>{ props.status === 0 ? 'Deactivated' : 'Active' }</td>
            </tr>
      )
}

const ClassList = () =>
{
      document.title = 'Class List';

      const [tableContent, setTableContent] = useState([]);
      const [render, setRender] = useState([]);
      const [name, setName] = useState("");
      const Navigate = useNavigate();

      let timer;

      useEffect(() =>
      {
            axios.post(`http://${ domain }/admin/classList`, { params: { name: name } })
                  .then(res =>
                  {
                        const temp = [];
                        for (let i = 0; i < res.data.length; i++)
                              temp.push(<Class key={ i } i={ i + 1 } Navigate={ Navigate }
                                    initialStudents={ res.data[i].Max_students } initialSessions={ res.data[i].Initial_sessions } name={ res.data[i].Name }
                                    start={ res.data[i].Start_date } end={ res.data[i].End_date } status={ res.data[i].Status } />);
                        setTableContent(temp);
                  })
                  .catch(err => console.log(err));
      }, [render, name, Navigate]);

      const findClass = (e) =>
      {
            clearTimeout(timer);

            timer = setTimeout(() =>
            {
                  setName(e.target.value);
                  setRender(!render);
            }, 1500);
      }

      return (
            <div className='w-100 h-100 d-flex flex-column'>
                  <div className='mt-2 ms-md-auto me-md-3 mx-auto'>
                        <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                        <input type='text' placeholder='Find class' className={ `ps-4` } onChange={ findClass }></input>
                  </div>
                  <div className={ `flex-grow-1 w-100 overflow-auto mt-3 px-md-2 hideBrowserScrollbar mb-3` }>
                        <table className="table table-hover table-info" style={ { borderCollapse: 'separate' } }>
                              <thead style={ { position: "sticky", top: "0"} }>
                                    <tr>
                                          <th scope="col" className='col-1 text-center'>#</th>
                                          <th scope="col" className='col-4 text-center'>Name</th>
                                          <th scope="col" className='col-1 text-center'>Students</th>
                                          <th scope="col" className='col-1 text-center'>Sessions</th>
                                          <th scope="col" className='col-2 text-center'>Start date</th>
                                          <th scope="col" className='col-2 text-center'>End date</th>
                                          <th scope="col" className='col-1 text-center'>Status</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    { tableContent }
                              </tbody>
                        </table>
                  </div >
            </div>
      )
}

export default ClassList;