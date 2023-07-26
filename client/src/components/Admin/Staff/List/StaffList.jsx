import styles from './StaffList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { domain } from '../../../../tools/domain';
import { DMY } from '../../../../tools/dateFormat';
import { AiOutlineUser } from 'react-icons/ai';
import { isRefValid } from '../../../../tools/refChecker';
import { context } from '../../../../context';
import '../../../../css/scroll.css';
import StaffCreate from '../Create/StaffCreate';

const Staff = (props) =>
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
                  <td className='text-center align-middle'>
                        <NavLink className={ `d-block ${ styles.hover } text-dark text-decoration-none` } to={ `./detail/${ props.id }` }>
                              { props.address }
                        </NavLink>
                  </td>
            </tr>
      )
}

const StaffList = () =>
{
      const { staffType, setStaffType } = useContext(context);

      const [tableContent, setTableContent] = useState([]);
      const [render, setRender] = useState([]);
      const [name, setName] = useState("");
      const Navigate = useNavigate();

      const opt1 = useRef(null);
      const opt2 = useRef(null);

      const container = useRef(null);
      const [addTeacherPopUp, setAddTeacherPopUp] = useState(false);

      let timer;

      const findStaff = (e) =>
      {
            clearTimeout(timer);

            timer = setTimeout(() =>
            {
                  setName(e.target.value);
                  setRender(!render);
            }, 1500);
      }

      const chooseStaffType = (e) =>
      {
            if (isRefValid(opt1) && (e.target.id === opt1.current.childNodes[0].id || e.target === opt1.current.childNodes[0].childNodes[0] || e.target === opt1.current.childNodes[1]))
                  setStaffType(1);
            else if (isRefValid(opt2) && (e.target.id === opt2.current.childNodes[0].id || e.target === opt2.current.childNodes[0].childNodes[0] || e.target === opt2.current.childNodes[1]))
                  setStaffType(2);
      }

      useEffect(() =>
      {
            document.title = staffType === 0 ? 'Staff List' : staffType === 1 ? 'Teacher List' : 'Supervisor List';

            let opt1Inst, opt2Inst;
            if (isRefValid(opt1))
            {
                  opt1.current.addEventListener('click', chooseStaffType);
                  opt1Inst = opt1.current;
            }

            if (isRefValid(opt2))
            {
                  opt2.current.addEventListener('click', chooseStaffType)
                  opt2Inst = opt2.current;
            }

            if (staffType !== 0)
                  axios.post(`http://${ domain }/admin/staffList`, { params: { name: name, type: staffType } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Staff key={ i } i={ i + 1 } id={ res.data[i].id }
                                          name={ res.data[i].name } phone={ res.data[i].phone } birthdate={ res.data[i].birthday }
                                          email={ res.data[i].email } ssn={ res.data[i].ssn } address={ res.data[i].address } Navigate={ Navigate } />);
                              setTableContent(temp);
                        })
                        .catch(err => console.log(err));

            return () =>
            {
                  if (isRefValid(opt1) && opt1Inst)
                        opt1Inst.removeEventListener('click', chooseStaffType);
                  if (isRefValid(opt2) && opt2Inst)
                        opt2Inst.removeEventListener('click', chooseStaffType);
            };

            // eslint-disable-next-line
      }, [render, name, Navigate, staffType, setStaffType])

      return (
            <div className='w-100 d-flex flex-column overflow-auto flex-grow-1 mt-2 mb-2 hideBrowserScrollbar align-items-center' ref={ container }>
                  { staffType === 0 &&
                        <div className='w-100 h-100 d-flex flex-column flex-md-row overflow-auto align-items-center justify-content-md-around'>
                              <div className={ `d-flex flex-column my-auto align-items-center ${ styles.choose } justify-content-center mb-4 mb-md-0 mt-4 mt-md-0` } ref={ opt1 }>
                                    <AiOutlineUser id='teacherIcon' className={ `${ styles.icon_choose }` } />
                                    <h4>Teacher</h4>
                              </div>
                              <div className={ `d-flex flex-column my-auto align-items-center ${ styles.choose } justify-content-center mt-4 mt-md-0 mb-4 mb-md-0` } ref={ opt2 }>
                                    <AiOutlineUser id='supervisorIcon' className={ `${ styles.icon_choose }` } />
                                    <h4>Supervisor</h4>
                              </div>
                        </div>
                  }
                  { staffType !== 0 &&
                        <>
                              <div className='d-flex align-items-center justify-content-center justify-content-md-between mt-2 w-100 flex-column flex-sm-row'>
                                    <strong className={ `ms-md-3 mb-0 ${ styles.back } me-sm-3 me-md-0 mb-2 mb-sm-0` } onClick={ () => setStaffType(0) }>Back</strong>
                                    <div className='me-md-3 position-relative'>
                                          <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                                          <input type='text' placeholder='Find staff' className={ `ps-4` } onChange={ findStaff }></input>
                                    </div>
                              </div>
                              <div className={ `flex-grow-1 w-100 overflow-auto mt-3 px-1 mb-3` } style={ { minHeight: tableContent.length ? '200px' : '65px' } }>
                                    <table className="table table-hover table-info">
                                          <thead style={ { position: "sticky", top: "0" } }>
                                                <tr>
                                                      <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                      <th scope="col" className='col-3 text-center align-middle'>Name</th>
                                                      <th scope="col" className='col-1 text-center align-middle'>SSN</th>
                                                      <th scope="col" className='col-1 text-center align-middle'>Phone number</th>
                                                      <th scope="col" className='col-2 text-center align-middle'>Email</th>
                                                      <th scope="col" className='col-1 text-center align-middle'>Birthdate</th>
                                                      <th scope="col" className='col-3 text-center align-middle'>Address</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                { tableContent }
                                          </tbody>
                                    </table>
                              </div>
                              <div className="w-100 d-flex align-items-center justify-content-center mb-3">
                              <button className='btn btn-primary' onClick={ () => setAddTeacherPopUp(true) }>Add a { staffType === 1 ? 'teacher' : 'supervisor' }</button>
                              </div>
                        </>
                  }
                  <StaffCreate showPopUp={ addTeacherPopUp } setShowPopUp={ setAddTeacherPopUp } containerRef={ container } render={ render } setRender={ setRender } staffType={ staffType } />
            </div >
      )
}

export default StaffList;