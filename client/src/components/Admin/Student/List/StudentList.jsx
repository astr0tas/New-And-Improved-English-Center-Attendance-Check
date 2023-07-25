import styles from './StudentList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { domain } from '../../../../tools/domain';
import { DMY } from '../../../../tools/dateFormat';
import '../../../../css/scroll.css';
import StudentCreate from '../Create/StudentCreate';

const Student = (props) =>
{
      return (
            <tr className={ `${ styles.hover }` } onClick={ () => { props.Navigate(`./detail/${ props.id }`); } }>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.id }` }>
                              { props.i }
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.id }` }>
                              { props.name }
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.id }` }>
                              { props.ssn }
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.id }` }>
                              { props.phone }
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.id }` }>
                              { props.email }
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.id }` }>
                              { DMY(props.birthdate) }
                        </NavLink>
                  </td>
            </tr>
      )
}

const StudentList = () =>
{
      document.title = 'Student List';

      const [tableContent, setTableContent] = useState([]);
      const [render, setRender] = useState([]);
      const [name, setName] = useState("");
      const Navigate = useNavigate();

      const [addStudentPopUp, setAddStudentPopUp] = useState(false);
      const container = useRef(null);

      let timer;

      const findStudent = (e) =>
      {
            clearTimeout(timer);

            timer = setTimeout(() =>
            {
                  setName(e.target.value);
                  setRender(!render);
            }, 1500);
      }

      useEffect(() =>
      {
            axios.post(`http://${ domain }/admin/studentList`, { params: { name: name } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        const temp = [];
                        for (let i = 0; i < res.data.length; i++)
                              temp.push(<Student key={ i } i={ i + 1 } id={ res.data[i].id }
                                    name={ res.data[i].name } phone={ res.data[i].phone } birthdate={ res.data[i].birthday }
                                    email={ res.data[i].email } ssn={ res.data[i].ssn } Navigate={ Navigate } />);
                        setTableContent(temp);
                  })
                  .catch(err => console.log(err));
      }, [render, name, Navigate])

      return (
            <div className='w-100 d-flex flex-column overflow-auto flex-grow-1 mt-2 mb-2 hideBrowserScrollbar align-items-center' ref={ container }>
                  <div className='mt-2 ms-md-auto me-md-3 mx-auto position-relative'>
                        <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                        <input type='text' placeholder='Find student' className={ `ps-4` } onChange={ findStudent }></input>
                  </div>
                  <div className={ `flex-grow-1 w-100 overflow-auto mt-3 px-1 mb-3` } style={ { minHeight: tableContent.length ? '200px' : '65px' } }>
                        <table className="table table-hover table-info">
                              <thead style={ { position: "sticky", top: "0" } }>
                                    <tr>
                                          <th scope="col" className='col-1 text-center align-middle'>#</th>
                                          <th scope="col" className='col-3 text-center align-middle'>Name</th>
                                          <th scope="col" className='col-2 text-center align-middle'>SSN</th>
                                          <th scope="col" className='col-1 text-center align-middle'>Phone number</th>
                                          <th scope="col" className='col-3 text-center align-middle'>Email</th>
                                          <th scope="col" className='col-1 text-center align-middle'>Birthdate</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    { tableContent }
                              </tbody>
                        </table>
                  </div >
                  <div className="w-100 d-flex align-items-center justify-content-center mb-3">
                        <button className='btn btn-primary' onClick={ () => setAddStudentPopUp(true) }>Add a student</button>
                  </div>

                  <StudentCreate showPopUp={ addStudentPopUp } setShowPopUp={ setAddStudentPopUp } containerRef={ container } />
            </div>
      )
}

export default StudentList;