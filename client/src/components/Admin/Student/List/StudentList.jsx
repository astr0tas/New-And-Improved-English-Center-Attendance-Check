import styles from './StudentList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { domain } from '../../../../tools/domain';
import { DMY } from '../../../../tools/dateFormat';
import '../../../../css/scroll.css';

const Student = (props) =>
{
      return (
            <tr className={ `${ styles.hover }` } onClick={ () => { props.Navigate(`./${ props.id }`); } }>
                  <td className='text-center'>{ props.i }</td>
                  <td className='text-center'>{ props.name }</td>
                  <td className='text-center'>{ props.ssn }</td>
                  <td className='text-center'>{ props.phone }</td>
                  <td className='text-center'>{ props.email }</td>
                  <td className='text-center'>{ DMY(props.birthdate) }</td>
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
            <div className='w-100 d-flex flex-column overflow-auto flex-grow-1 mt-2 mb-2 hideBrowserScrollbar'>
                  <div className='mt-2 ms-md-auto me-md-3 mx-auto position-relative'>
                        <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                        <input type='text' placeholder='Find student' className={ `ps-4` } onChange={ findStudent }></input>
                  </div>
                  <div className={ `flex-grow-1 w-100 overflow-auto mt-3 px-md-2 mb-3` } style={ { minHeight: tableContent.length ? '200px' : '40px' } }>
                        <table className="table table-hover table-info">
                              <thead style={ { position: "sticky", top: "0" } }>
                                    <tr>
                                          <th scope="col" className='col-1 text-center'>#</th>
                                          <th scope="col" className='col-3 text-center'>Name</th>
                                          <th scope="col" className='col-2 text-center'>SSN</th>
                                          <th scope="col" className='col-1 text-center'>Phone</th>
                                          <th scope="col" className='col-3 text-center'>Email</th>
                                          <th scope="col" className='col-1 text-center'>Birthdate</th>
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

export default StudentList;