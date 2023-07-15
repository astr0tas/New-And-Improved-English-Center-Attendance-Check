import { useState, useEffect } from "react";
import axios from 'axios';
import { domain } from "../../../../../tools/domain";
import { Modal } from 'react-bootstrap';
import styles from './AddStudent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const AddStudent = (props) =>
{
      const [studentListContent, setStudentListContent] = useState([]);
      const [searchStudent, setSearchStudent] = useState("");
      const [studentAdded, setStudentAdded] = useState([]);
      const [confirmPopUp, setConfirmPopUp] = useState(false);
      const [isEmpty, setIsEmpty] = useState(false);

      let timer;

      const configList = (e, id) =>
      {
            if (e.target.checked)
            {
                  if (props.currentStudent + studentAdded.length < props.maxStudent)
                  {
                        setStudentAdded(prevStudentAdded =>
                        {
                              if (props.currentStudent + prevStudentAdded.length < props.maxStudent)
                                    return [...prevStudentAdded, id];
                              else
                              {
                                    e.target.checked = false;
                                    return prevStudentAdded;
                              }
                        });
                  }
                  else
                        e.target.checked = false;
            }
            else
                  setStudentAdded(prevState => prevState.filter(item => item !== id));
      }

      useEffect(() =>
      {
            if (props.addPopUp)
            {
                  axios.post(`http://${ domain }/admin/getStudentNotFromClass`, { params: { className: props.name, studentName: searchStudent } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(
                                          <tr key={ i }>
                                                <td className='text-center align-middle'>{ i + 1 }</td>
                                                <td className='text-center align-middle'>{ res.data[i].name }</td>
                                                <td className='text-center align-middle'>{ res.data[i].ssn }</td>
                                                <td className='text-center align-middle'>{ res.data[i].phone }</td>
                                                <td className='text-center align-middle'>{ res.data[i].email }</td>
                                                <td className='text-center align-middle'>
                                                      <div className="d-flex align-items-center justify-content-center">
                                                            <input type='checkbox' onChange={ e => configList(e, res.data[i].id) } style={ { width: '1.2rem', height: '1.2rem' } } className={ `${ styles.hover } me-2` }></input>
                                                            <button className="ms-2 btn-sm btn btn-primary" onClick={ () => props.Navigate(`/student-list/detail/${ res.data[i].id }`) }>Detail</button>
                                                      </div>
                                                </td>
                                          </tr >
                                    );
                              setStudentListContent(temp);
                        })
                        .catch(err => console.error(err));
            }

            // eslint-disable-next-line
      }, [searchStudent, props.name, props.addPopUp])

      return (
            <>
                  <Modal show={ props.addPopUp } enforceFocus={ true }
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
                                                setSearchStudent(e.target.value);
                                          }, 1000);
                                    } }></input>
                              </div>
                        </Modal.Header>
                        <Modal.Body className='px-1 py-0' style={ { minHeight: !studentListContent.length ? '65px' : '150px' } }>
                              <div className={ `h-100 w-100` }>
                                    <table className="table table-hover table-info">
                                          <thead style={ { position: "sticky", top: "0" } }>
                                                <tr>
                                                      <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                      <th scope="col" className='col-3 text-center align-middle'>Name</th>
                                                      <th scope="col" className='col-2 text-center align-middle'>SSN</th>
                                                      <th scope="col" className='col-2 text-center align-middle'>Phone number</th>
                                                      <th scope="col" className='col-2 text-center align-middle'>Email</th>
                                                      <th scope="col" className='col-2 text-center align-middle'>Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                { studentListContent }
                                          </tbody>
                                    </table>
                              </div >
                        </Modal.Body>
                        <Modal.Footer className='flex-column justify-content-center'>
                              <div className='d-flex align-items-center'>
                                    <strong>Total students:&nbsp;&nbsp;</strong>
                                    <strong style={ {
                                          color: props.currentStudent + studentAdded.length === props.maxStudent ? 'red' : (props.currentStudent + studentAdded.length === props.currentStudent ? 'black' : '#128400')
                                    } }>{ props.currentStudent + studentAdded.length } / { props.maxStudent }</strong>
                              </div>
                              {
                                    props.currentStudent + studentAdded.length === props.maxStudent
                                    &&
                                    <div className='d-flex align-items-center'>
                                          <strong style={ { color: 'red' } }>
                                                Maximum number of students reached!
                                          </strong>
                                    </div>
                              }
                              {
                                    isEmpty &&
                                    <div className='d-flex align-items-center'>
                                          <strong style={ { color: 'red' } }>
                                                No student selected!
                                          </strong>
                                    </div>
                              }
                              <div className='d-flex align-items-center'>
                                    <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                                    {
                                          props.setAddPopUp(false);
                                          setStudentAdded([]);
                                          setIsEmpty(false);
                                    } }>Cancel</button>
                                    <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                                    {
                                          if (studentAdded.length)
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
                              <h4 className='text-center'>Are you sure you want to add the selected student(s)?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                              } }>NO</button>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                                    props.setAddPopUp(false);

                                    axios.post(`http://${ domain }/admin/addStudentToClass`, { params: { name: props.name, students: studentAdded } }, { headers: { 'Content-Type': 'application/json' } })
                                          .then(res =>
                                          {
                                                setStudentAdded([]);
                                                props.setRender(!props.render);
                                          })
                                          .catch(err => console.error(err));
                              } }>YES</button>
                        </Modal.Footer>
                  </Modal>
            </>
      )
}

export default AddStudent;