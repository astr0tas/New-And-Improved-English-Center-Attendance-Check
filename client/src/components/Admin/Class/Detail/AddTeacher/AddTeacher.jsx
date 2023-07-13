import styles from './AddTeacher.module.css';
import { useState, useEffect } from "react";
import axios from 'axios';
import { domain } from "../../../../../tools/domain";
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const AddTeacher = (props) =>
{
      const [teacherListContent, setTeacherListContent] = useState([]);
      const [searchTeacher, setSearcherTeacher] = useState("");
      const [confirmPopUp, setConfirmPopUp] = useState(false);
      const [teacherAdded, setTeacherAdded] = useState([]);
      const [isEmpty, setIsEmpty] = useState(false);

      let timer;

      const configList = (e, id) =>
      {
            if (e.target.checked)
                  setTeacherAdded(prev => [...prev, id]);
            else
                  setTeacherAdded(prevState => prevState.filter(item => item !== id));
      }

      useEffect(() =>
      {
            if (props.teacherPopUp)
            {
                  axios.post(`http://${ domain }/admin/getTeacherNotInClass`, { params: { name: searchTeacher, className: props.name } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<tr key={ i }>
                                          <td className='align-middle text-center'>{ i + 1 }</td>
                                          <td className='align-middle text-center'>{ res.data[i].name }</td>
                                          <td className='align-middle text-center'>{ res.data[i].phone }</td>
                                          <td className='align-middle text-center'>{ res.data[i].email }</td>
                                          <td className='align-middle text-center'>
                                                <div className='d-flex align-items-center justify-content-center'>
                                                      <input type='checkbox' style={ { width: '1.2rem', height: '1.2rem' } } onChange={ e => configList(e, res.data[i].id) } className={ `${ styles.hover } me-2` }></input>
                                                      <button className='btn btn-sm btn-primary' onClick={ () => props.Navigate(`/staff-list/detail/${ res.data[i].id }`) }>Detail</button>
                                                </div>
                                          </td>
                                    </tr >);
                              setTeacherListContent(temp);
                        })
                        .catch(err => console.error(err));
            }
      }, [searchTeacher, props]);

      return (
            <>
                  <Modal show={ props.teacherPopUp } enforceFocus={ true }
                        dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                        className={ `reAdjustModel ${ styles.customModal } hideBrowserScrollbar` } container={ props.containerRef.current }>
                        <Modal.Header>
                              <div>
                                    <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                                    <input type='text' style={ { fontSize: '1rem', paddingLeft: '30px', maxWidth: '200px' } } onChange={ e =>
                                    {
                                          clearTimeout(timer);

                                          timer = setTimeout(() =>
                                          {
                                                setSearcherTeacher(e.target.value);
                                          }, 1000);
                                    } }></input>
                              </div>
                        </Modal.Header>
                        <Modal.Body className='px-1 py-0' style={ { minHeight: !teacherListContent.length ? '65px' : '150px' } }>
                              <div className={ `h-100 w-100` }>
                                    <table className="table table-hover table-info">
                                          <thead style={ { position: "sticky", top: "0" } }>
                                                <tr>
                                                      <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                      <th scope="col" className='col-4 text-center align-middle'>Name</th>
                                                      <th scope="col" className='col-2 text-center align-middle'>Phone number</th>
                                                      <th scope="col" className='col-3 text-center align-middle'>Email</th>
                                                      <th scope="col" className='col-2 text-center align-middle'>Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                { teacherListContent }
                                          </tbody>
                                    </table>
                              </div >
                        </Modal.Body>
                        <Modal.Footer className='flex-column justify-content-center'>
                              {
                                    isEmpty &&
                                    <div className='d-flex align-items-center'>
                                          <strong style={ { color: 'red' } }>
                                                No teacher selected!
                                          </strong>
                                    </div>
                              }
                              <div className='d-flex align-items-center'>
                                    <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                                    {
                                          props.setTeacherPopUp(false);
                                          setIsEmpty(false);
                                    } }>Cancel</button>
                                    <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                                    {
                                          if (teacherAdded.length)
                                          {
                                                setConfirmPopUp(true);
                                                setIsEmpty(false);
                                          }
                                          else
                                                setIsEmpty(true);
                                    } }>Confirm</button>
                              </div>
                        </Modal.Footer>
                  </Modal>
                  <Modal show={ confirmPopUp } onHide={ () => { setConfirmPopUp(false); } } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ props.containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to add the selected teacher(s)?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                              } }>NO</button>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                                    props.setTeacherPopUp(false);
                                    axios.post(`http://${ domain }/admin/addTeacherToClass`, { params: { name: props.name, teachers: teacherAdded } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res =>
                                          {
                                                setTeacherAdded([]);
                                                props.setRender(!props.render);
                                          })
                                          .catch(err => console.error(err));
                              } }>YES</button>
                        </Modal.Footer>
                  </Modal>
            </>
      )
}

export default AddTeacher;