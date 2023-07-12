import styles from './AddTeacher.module.css';

const AddTeacher = (props) =>
{
      // const [teacherListContent, setTeacherListContent] = useState([]);
      // const [searchTeacher, setSearcherTeacher] = useState("");
      // const [confirmPopUp, setConfirmPopUp] = useState(false);

      // let timer;

      return (
            <>
                  {/* <Modal show={ props.addPopUp } enforceFocus={ true }
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
                        <Modal.Body className='px-1 py-0'>
                              <div className={ `h-100 w-100` }>
                                    <table className="table table-hover table-info">
                                          <thead style={ { position: "sticky", top: "0" } }>
                                                <tr>
                                                      <th scope="col" className='col-1 text-center'>#</th>
                                                      <th scope="col" className='col-4 text-center'>Name</th>
                                                      <th scope="col" className='col-2 text-center'>SSN</th>
                                                      <th scope="col" className='col-2 text-center'>Phone number</th>
                                                      <th scope="col" className='col-2 text-center'>Email</th>
                                                      <th scope="col" className='col-1 text-center'>Action</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                { teacherListContent }
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
                                          <p className={ `${ styles.p } mb-0` }>
                                                Maximum number of students reached!
                                          </p>
                                    </div>
                              }
                              <div className='d-flex align-items-center'>
                                    <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                                    {
                                          props.setAddPopUp(false);
                                          setStudentAdded([]);
                                    } }>Cancel</button>
                                    <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                                    {
                                          setConfirmPopUp(true);
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
                  </Modal> */}
            </>
      )
}

export default AddTeacher;