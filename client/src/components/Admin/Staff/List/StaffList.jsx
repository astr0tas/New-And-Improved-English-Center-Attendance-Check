import styles from './StaffList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { domain } from '../../../../tools/domain';
import { DMY } from '../../../../tools/dateFormat';
import { AiOutlineUser } from 'react-icons/ai';
import { isRefValid } from '../../../../tools/refChecker';
import { context } from '../../../../context';

const Staff = (props) =>
{
      return (
            <tr className={ `${ styles.hover }` } onClick={ () => { props.Navigate(`./${ props.id }`); } }>
                  <td className='text-center'>{ props.i }</td>
                  <td className='text-center'>{ props.name }</td>
                  <td className='text-center'>{ props.ssn }</td>
                  <td className='text-center'>{ props.phone }</td>
                  <td className='text-center'>{ props.email }</td>
                  <td className='text-center'>{ DMY(props.birthdate) }</td>
                  <td className='text-center'>{ props.address }</td>
            </tr>
      )
}

const StaffList = () =>
{
      document.title = 'Staff List';

      const { staffType, setStaffType } = useContext(context);

      const [tableContent, setTableContent] = useState([]);
      const [render, setRender] = useState([]);
      const [name, setName] = useState("");
      const Navigate = useNavigate();

      const opt1 = useRef(null);
      const opt2 = useRef(null);

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
                  axios.post(`http://${ domain }/admin/staffList`, { params: { name: name, type: staffType } })
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
            <div className='w-100 h-100 d-flex flex-column'>
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
                              <div className='d-flex align-items-center justify-content-center justify-content-md-between mt-2'>
                                    <p className={ `ms-md-3 mb-0 ${ styles.back } me-3 me-md-0` } onClick={ () => setStaffType(0) }>Back</p>
                                    <div className='me-md-3'>
                                          <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                                          <input type='text' placeholder='Find staff' className={ `ps-4` } onChange={ findStaff }></input>
                                    </div>
                              </div>
                              <div className={ `flex-grow-1 w-100 overflow-auto mt-3 px-md-2 mb-3` }>
                                    <table className="table table-hover table-info" style={ { borderCollapse: 'separate' } }>
                                          <thead style={ { position: "sticky", top: "0" } }>
                                                <tr>
                                                      <th scope="col" className='col-1 text-center'>#</th>
                                                      <th scope="col" className='col-3 text-center'>Name</th>
                                                      <th scope="col" className='col-1 text-center'>SSN</th>
                                                      <th scope="col" className='col-1 text-center'>Phone</th>
                                                      <th scope="col" className='col-2 text-center'>Email</th>
                                                      <th scope="col" className='col-1 text-center'>Birthdate</th>
                                                      <th scope="col" className='col-3 text-center'>Address</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                { tableContent }
                                          </tbody>
                                    </table>
                              </div>
                        </>
                  }
            </div >
      )
}

export default StaffList;