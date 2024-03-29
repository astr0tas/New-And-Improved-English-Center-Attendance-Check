import styles from './ClassList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { DMY } from '../../../../tools/dateFormat';
import { useNavigate, NavLink } from 'react-router-dom';
import { domain } from '../../../../tools/domain';
import { context } from '../../../../context';
import '../../../../css/scroll.css';
import request from '../../../../tools/request';
import ClassCreate from '../Create/ClassCreate';

const Class = (props) =>
{
      return (
            <tr onClick={ () => { props.setListType(0); props.Navigate(`./detail/${ props.name }`); } } className={ `${ styles.hover }` }>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.name }` } onClick={ () => props.setListType(0) }>
                              { props.i }
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.name }` } onClick={ () => props.setListType(0) }>
                              { props.name }
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.name }` } onClick={ () => props.setListType(0) }>
                              { props.currentStudents }/{ props.initialStudents }
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.name }` } onClick={ () => props.setListType(0) }>
                              { props.currentSessions }/{ props.initialSessions }
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.name }` } onClick={ () => props.setListType(0) }>
                              { props.start === null ? 'N/A' : DMY(props.start) }
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.name }` } onClick={ () => props.setListType(0) }>
                              { props.end === null ? 'N/A' : DMY(props.end) }
                        </NavLink>
                  </td>
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-decoration-none` } to={ `./detail/${ props.name }` }
                              onClick={ () => props.setListType(0) } style={ {
                                    color: props.status === 1 ? 'red' : (
                                          props.status === 2 ? '#128400' : 'gray')
                              } }>
                              { props.status === 1 ? 'Deactivated' : (
                                    props.status === 2 ? 'Active' : 'Finished'
                              ) }
                        </NavLink>
                  </td>
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

      const [createClassPopUp, setCreateClassPopUp] = useState(false);
      const containerRef = useRef(null);

      const [render, setRender] = useState(false);

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
                        if (res.status === 200)
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Class key={ i } i={ i + 1 } Navigate={ Navigate } setListType={ setListType }
                                          initialStudents={ res.data[i][0].maxStudent } initialSessions={ res.data[i][0].initialSession }
                                          name={ res.data[i][0].name } start={ res.data[i][0].startDate } end={ res.data[i][0].endDate }
                                          status={ res.data[i][0].classStatus } currentStudents={ res.data[i][0].currentStudents } currentSessions={ res.data[i][0].currentSessions } />);
                        setTableContent(temp);
                  })
                  .catch(err => console.log(err));

            // eslint-disable-next-line
      }, [name, Navigate, classState, render]);

      const findClass = (e) =>
      {
            clearTimeout(timer1);

            timer1 = setTimeout(() =>
            {
                  setName(e.target.value);
            }, 1500);
      }

      return (
            <div className='w-100 d-flex flex-column overflow-auto flex-grow-1 mt-2 mb-2 hideBrowserScrollbar align-items-center' ref={ containerRef }>
                  <div className='mt-4 mt-md-2 me-md-auto ms-md-3 mx-auto d-flex align-items-center flex-column flex-sm-row'>
                        <div className='mb-3 mb-sm-0 position-relative'>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input type='text' placeholder='Find class' className={ `ps-4` } onChange={ findClass }></input>
                        </div>
                        <div className='ms-md-3 ms-sm-2 d-flex align-items-center flex-column flex-sm-row'>
                              <strong>Status</strong>
                              <div className='d-flex align-items-center my-1 my-sm-0'>
                                    <input type="radio" id="active" name="status" className={ `ms-sm-2 ms-md-3 me-1 ${ styles.hover } ${ styles.radios }` } onChange={ () => setClassState(2) } checked={ classState === 2 } />
                                    <label htmlFor="active" style={ { color: '#128400' } }>Active</label>
                              </div>
                              <div className='d-flex align-items-center my-1 my-sm-0'>
                                    <input type="radio" id="deactivated" name="status" className={ `ms-sm-2 ms-md-3 me-1 ${ styles.hover } ${ styles.radios }` } onChange={ () => setClassState(1) } checked={ classState === 1 } />
                                    <label htmlFor="deactivated" style={ { color: 'red' } }>Deactivated</label>
                              </div>
                              <div className='d-flex align-items-center my-1 my-sm-0'>
                                    <input type="radio" id="finished" name="status" className={ `ms-sm-2 ms-md-3 me-1 ${ styles.hover } ${ styles.radios }` } onChange={ () => setClassState(0) } checked={ classState === 0 } />
                                    <label htmlFor="finished" style={ { color: 'gray' } }>Finished</label>
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
                        <button className="btn btn-primary" onClick={ () => setCreateClassPopUp(true) }>Add a class</button>
                  </div>
                  <ClassCreate Navigate={ Navigate } containerRef={ containerRef } createClassPopUp={ createClassPopUp }
                        setCreateClassPopUp={ setCreateClassPopUp } setRender={ setRender } render={ render } />
            </div>
      )
}

export default ClassList;