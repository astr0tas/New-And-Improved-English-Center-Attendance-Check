import styles from './ClassCreate.module.css';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { domain } from "../../../../tools/domain";
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import '../../../../css/scroll.css';

const PeriodSelect = (props) =>
{
      const [periodList, setPeriodList] = useState([]);

      const toggle = (e, id) =>
      {
            if (e.target.checked && !props.period.find(element => element.dow === parseInt(props.dow.split(',')[0])))
                  props.setPeriod(prev => [...prev, { dow: parseInt(props.dow.split(',')[0]), id: id }]);
            else
                  props.setPeriod(props.period.filter(element => element.id !== id || element.dow !== parseInt(props.dow.split(',')[0])));
      }

      useEffect(() =>
      {
            if (props.addPeriodPopUp && props.dow)
            {
                  axios.get(`http://${ domain }/admin/getPeriods`)
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<tr key={ i }>
                                          <td className='text-center align-middle'>{ i + 1 }</td>
                                          <td className='text-center align-middle'>{ res.data[i].Start_hour } - { res.data[i].End_hour }</td>
                                          <td className='text-center align-middle'>
                                                <input type='checkbox' className={ `${ styles.hover }` }
                                                      style={ { width: '1.3rem', height: '1.3rem' } }
                                                      checked={ props.period.length && !!props.period.find(element => element.dow === parseInt(props.dow.split(',')[0]) && element.id === res.data[i].ID) }
                                                      onChange={ e => toggle(e, res.data[i].ID) }></input>
                                          </td>
                                    </tr>);
                              setPeriodList(temp);
                        })
                        .catch(err => console.log(err));
            }
            else
                  setPeriodList([]);
      }, [props.dow, props.period]);

      return (
            <Modal show={ props.addPeriodPopUp } onHide={ () => props.setAddPeriodPopUp(false) }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                  </Modal.Header>
                  <Modal.Body className='px-1' style={ { minHeight: props.dow ? '165px' : '100px' } }>
                        <div className={ `h-100 w-100` }>
                              <div className='w-100 d-flex justify-content-center mb-2'>
                                    <Dropdown onSelect={ eventKey => props.setDow(eventKey) }>
                                          <Dropdown.Toggle variant="primary" size='sm' style={ { maxWidth: '250px' } } className='text-wrap'>
                                                { !props.dow ? 'Choose' : props.dow.split(',')[1] }
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu style={ { maxHeight: '150px', overflow: 'auto' } }>
                                                <Dropdown.Item eventKey={ null }>Clear</Dropdown.Item>
                                                <Dropdown.Item eventKey={ [1, 'Monday'] }>Monday</Dropdown.Item>
                                                <Dropdown.Item eventKey={ [2, 'Tuesday'] }>Tuesday</Dropdown.Item>
                                                <Dropdown.Item eventKey={ [3, 'Wednesday'] }>Wednesday</Dropdown.Item>
                                                <Dropdown.Item eventKey={ [4, 'Thursday'] }>Thursday</Dropdown.Item>
                                                <Dropdown.Item eventKey={ [5, 'Friday'] }>Friday</Dropdown.Item>
                                                <Dropdown.Item eventKey={ [6, 'Saturday'] }>Saturday</Dropdown.Item>
                                          </Dropdown.Menu>
                                    </Dropdown>
                              </div>
                              <table className="table table-hover table-info">
                                    <thead>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-8 text-center align-middle'>Period</th>
                                                <th scope="col" className='col text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { periodList }
                                    </tbody>
                              </table>
                        </div >
                  </Modal.Body>
                  <Modal.Footer className='justify-content-center'>
                        <button className={ `btn btn-danger` } onClick={ () =>
                        {
                              if (props.dow)
                                    props.setPeriod([]);
                        } }>Clear</button>
                  </Modal.Footer>
            </Modal>
      )
}

const TeacherSelect = (props) =>
{
      const [searchTeacher, setSearchTeacher] = useState("");
      const [teacherListContent, setTeacherListContent] = useState([]);
      const [render, setRender] = useState(false);

      let timer;

      const addTeacher = () =>
      {
            props.setTeacher();
            props.setTeacherName();
      }

      useEffect(() =>
      {
            if (props.addTeacherPopUp && props.date !== null && props.timetable !== null)
            {
                  // axios.post(`http://${ domain }/admin/classTeacher`, { params: { name: props.name, teacherName: searchTeacher, date: props.date, timetable: props.timetable.split(',')[1].split(' - ') } }, { headers: { 'Content-Type': 'application/json' } })
                  //       .then(res =>
                  //       {
                  //             const temp = [];
                  //             for (let i = 0; i < res.data.length; i++)
                  //                   temp.push(<tr key={ i }>
                  //                         <td className='text-center align-middle'>{ i + 1 }</td>
                  //                         <td className='text-center align-middle'>{ res.data[i].name }</td>
                  //                         <td className='text-center align-middle'>{ res.data[i].phone }</td>
                  //                         <td className='text-center align-middle'>{ res.data[i].email }</td>
                  //                         <td className='text-center align-middle'>
                  //                               <div className='d-flex flex-column flex-sm-row align-items-center justify-content-center'>
                  //                                     <input className={ `me-sm-2 mb-1 mb-sm-0 ${ styles.hover }` } type='checkbox' style={ { width: '1.3rem', height: '1.3rem' } }
                  //                                           onChange={ () => addTeacher }
                  //                                           checked={ res.data[i].id === props.teacher }></input>
                  //                                     <button className='btn btn-sm btn-primary ms-sm-2' onClick={ () => props.Navigate(`/staff-list/detail/${ res.data[i].id }`) }>Detail</button>
                  //                               </div>
                  //                         </td>
                  //                   </tr>);
                  //             setTeacherListContent(temp);
                  //       })
                  //       .catch(err => console.error(err));
            }
            else if (!props.addTeacherPopUp)
                  setSearchTeacher('');

            // eslint-disable-next-line
      }, [props, render]);

      return (
            <Modal show={ props.addTeacherPopUp } onHide={ () => props.setAddTeacherPopUp(false) }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <div>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input value={ searchTeacher } type='text' style={ { fontSize: '1rem', paddingLeft: '30px', maxWidth: '200px' } } onChange={ e =>
                              {
                                    setSearchTeacher(e.target.value);
                                    clearTimeout(timer);
                                    timer = setTimeout(() =>
                                    {
                                          setRender(!render);
                                    }, 1000);
                              } }></input>
                        </div>
                  </Modal.Header>
                  <Modal.Body className='px-1 py-0' style={ { minHeight: teacherListContent.length ? '150px' : '65px' } }>
                        <div className={ `h-100 w-100` }>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-4 text-center align-middle'>Name</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Phone number</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Email</th>
                                                <th scope="col" className='col-3 text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { teacherListContent }
                                    </tbody>
                              </table>
                        </div >
                  </Modal.Body>
                  <Modal.Footer className='justify-content-center'>
                        <button className={ `btn btn-danger` } onClick={ () =>
                        {
                              props.setTeacherName(null);
                              props.setTeacher(null);
                              setSearchTeacher('');
                              setRender(!render);
                        } }>Clear</button>
                  </Modal.Footer>
            </Modal>
      )
}

const SupervisorSelect = (props) =>
{
      const [searchSupervisor, setSearchSupervisor] = useState("");
      const [supervisorListContent, setSupervisorListContent] = useState([]);
      const [render, setRender] = useState(false);

      let timer;

      useEffect(() =>
      {
            if (props.addSupervisorPopUp)
            {
                  axios.post(`http://${ domain }/admin/staffList`, { params: { name: searchSupervisor, type: 2 } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              const temp = [];
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<tr key={ i }>
                                          <td className='text-center align-middle'>{ i + 1 }</td>
                                          <td className='text-center align-middle'>{ res.data[i].name }</td>
                                          <td className='text-center align-middle'>{ res.data[i].phone }</td>
                                          <td className='text-center align-middle'>{ res.data[i].email }</td>
                                          <td className='text-center align-middle'>
                                                <div className='d-flex flex-column flex-sm-row align-items-center justify-content-center'>
                                                      <input className={ `me-sm-2 mb-1 mb-sm-0 ${ styles.hover }` } type='radio' style={ { width: '1.3rem', height: '1.3rem' } }
                                                            name='supervisorSelector' onChange={ () => { props.setSupervisor(res.data[i].id); props.setSupervisorName(res.data[i].name); } }
                                                            checked={ res.data[i].id === props.supervisor }></input>
                                                      <button className='btn btn-sm btn-primary ms-sm-2' onClick={ () => props.Navigate(`/staff-list/detail/${ res.data[i].id }`) }>Detail</button>
                                                </div>
                                          </td>
                                    </tr>);
                              setSupervisorListContent(temp);
                        })
                        .catch(err => console.error(err));
            }
            else
                  setSearchSupervisor('');

            // eslint-disable-next-line
      }, [props, render]);

      return (
            <Modal show={ props.addSupervisorPopUp } onHide={ () => { props.setAddSupervisorPopUp(false); setSearchSupervisor(''); } }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal2 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <div>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input value={ searchSupervisor } type='text' style={ { fontSize: '1rem', paddingLeft: '30px', maxWidth: '200px' } } onChange={ e =>
                              {
                                    setSearchSupervisor(e.target.value);
                                    clearTimeout(timer);
                                    timer = setTimeout(() =>
                                    {
                                          setRender(!render);
                                    }, 1000);
                              } }></input>
                        </div>
                  </Modal.Header>
                  <Modal.Body className='px-1 py-0' style={ { minHeight: supervisorListContent.length ? '150px' : '65px' } }>
                        <div className={ `h-100 w-100` }>
                              <table className="table table-hover table-info">
                                    <thead style={ { position: "sticky", top: "0" } }>
                                          <tr>
                                                <th scope="col" className='col-1 text-center align-middle'>#</th>
                                                <th scope="col" className='col-4 text-center align-middle'>Name</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Phone number</th>
                                                <th scope="col" className='col-2 text-center align-middle'>Email</th>
                                                <th scope="col" className='col-3 text-center align-middle'>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          { supervisorListContent }
                                    </tbody>
                              </table>
                        </div >
                  </Modal.Body>
                  <Modal.Footer className='justify-content-center'>
                        <button className={ `btn btn-danger` } onClick={ () =>
                        {
                              props.setSupervisorName(null);
                              props.setSupervisor(null);
                              setSearchSupervisor('');
                              setRender(!render);
                        } }>Clear</button>
                  </Modal.Footer>
            </Modal>
      )
}

const ClassCreate = (props) =>
{
      const [confirmPopUp, setConfirmPopUp] = useState(false);

      const [isStartDatePast, setIsStartDatePast] = useState(false);
      const [isPeriodEmpty, setIsPeriodEmpty] = useState(false);
      const [isEmptyTeacher, setIsEmptyTeacher] = useState(false);
      const [isEmptySupervisor, setIsEmptySupervisor] = useState(false);

      const [name, setName] = useState(null);
      const [startDate, setStartDate] = useState(null);
      const [length, setLength] = useState(null);
      const [period, setPeriod] = useState([]);
      const [teacher, setTeacher] = useState(null);
      const [supervisor, setSupervisor] = useState(null);
      const [teacherName, setTeacherName] = useState(null);
      const [supervisorName, setSupervisorName] = useState(null);
      const [dow, setDow] = useState(null);

      const [addTeacherPopUp, setAddTeacherPopUp] = useState(false);
      const [addSupervisorPopUp, setAddSupervisorPopUp] = useState(false);
      const [addPeriodPopUp, setAddPeriodPopUp] = useState(false);

      useEffect(() =>
      {
            // axios.get(`http://${ domain }/admin/getRoom`)
            //       .then(res =>
            //       {

            //       })
            //       .catch(err => console.log(err));
      }, []);

      const handleData = (e) =>
      {
            e.preventDefault();
            if (new Date(startDate) <= new Date())
                  setIsStartDatePast(true);
      }

      return (
            <>
                  <Modal show={ props.createClassPopUp } onHide={ () => props.setCreateClassPopUp(false) }
                        dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                        className={ `reAdjustModel ${ styles.customModal1 } hideBrowserScrollbar` } container={ props.containerRef.current }>
                        <form className='w-100 h-100 d-flex flex-column' onSubmit={ handleData }>
                              <Modal.Header closeButton>
                              </Modal.Header>
                              <Modal.Body>
                                    <div className='row mb-5 mt-2'>
                                          <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                                <strong>Class name</strong>
                                          </div>
                                          <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                                <input value={ name ? name : '' } className={ `${ styles.inputs } w-100` } onChange={ e => setName(e.target.value) } type="text" required></input>
                                          </div>
                                    </div>
                                    <div className='row mt-5'>
                                          <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                                <strong>Start date</strong>
                                          </div>
                                          <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                                <input required value={ startDate ? startDate : '' } className={ `${ styles.inputs } w-100` } type="date" onChange={ e => setStartDate(e.target.value) }></input>
                                          </div>
                                    </div>
                                    {
                                          isStartDatePast
                                          &&
                                          <div className="d-flex align-items-center justify-content-center mt-3">
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                                <p className={ `${ styles.p }` }>
                                                      Start date invalid!
                                                </p>
                                          </div>
                                    }
                                    <div className={ `row ${ isStartDatePast ? 'mt-1' : 'mt-5' }` }>
                                          <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                                <strong className='text-center'>Course length (months)</strong>
                                          </div>
                                          <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                                <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                                      <input value={ length ? length : '' } className={ `${ styles.inputs } w-100` } type="number" min={ 1 } max={ 24 } onChange={ e => setLength(e.target.value) } required></input>
                                                </div>
                                          </div>
                                    </div>
                                    <div className='row mt-5'>
                                          <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                                <strong className='text-center'>Period</strong>
                                          </div>
                                          <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                                <p className={ `${ styles.inputs } ${ styles.hover } w-100 mb-0 ps-2 pt-1` } onClick={ () => setAddPeriodPopUp(true) }></p>
                                          </div>
                                    </div>
                                    <div className='row mt-5'>
                                          <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                                <strong>End date</strong>
                                          </div>
                                          <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                                <input value={ startDate && length && period.length ? '' : '' } className={ `${ styles.inputs } w-100` } type="date" disabled></input>
                                          </div>
                                    </div>
                                    {
                                          isPeriodEmpty
                                          &&
                                          <div className="d-flex align-items-center justify-content-center mt-3">
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                                <p className={ `${ styles.p }` }>
                                                      Period field is empty!
                                                </p>
                                          </div>
                                    }
                                    <div className={ `row ${ isPeriodEmpty ? 'mt-1' : 'mt-5' }` }>
                                          <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                                <strong>Teacher</strong>
                                          </div>
                                          <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                                <p className={ `${ styles.inputs } ${ styles.hover } w-100 mb-0 ps-2 pt-1 hideBrowserScrollbar` } onClick={ () => setAddTeacherPopUp(true) }>{ teacherName }</p>
                                          </div>
                                    </div>
                                    {
                                          isEmptyTeacher
                                          &&
                                          <div className="d-flex align-items-center justify-content-center mt-3">
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                                <p className={ `${ styles.p }` }>
                                                      Teacher field is empty!
                                                </p>
                                          </div>
                                    }
                                    <div className={ `row ${ isEmptyTeacher ? 'mt-1' : 'mt-5' }` }>
                                          <div className='col-sm-4 d-flex align-items-center justify-content-center col-12'>
                                                <strong>Supervisor</strong>
                                          </div>
                                          <div className='col d-flex align-items-center justify-content-center justify-content-sm-start'>
                                                <p className={ `${ styles.inputs } ${ styles.hover } w-100 mb-0 ps-2 pt-1 hideBrowserScrollbar` } onClick={ () => setAddSupervisorPopUp(true) }>{ supervisorName }</p>
                                          </div>
                                    </div>
                                    {
                                          isEmptySupervisor
                                          &&
                                          <div className="d-flex align-items-center justify-content-center mt-3">
                                                <AiOutlineCloseCircle style={ {
                                                      marginRight: '5px',
                                                      marginBottom: '16px'
                                                } } className={ `${ styles.p }` } />
                                                <p className={ `${ styles.p }` }>
                                                      Supervisor field is empty!
                                                </p>
                                          </div>
                                    }
                              </Modal.Body>
                              <Modal.Footer className='justify-content-center'>
                                    <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                                    {
                                          props.setCreateClassPopUp(false);
                                          setName(null);
                                          setStartDate(null);
                                          setLength(null);
                                          setPeriod([]);
                                          setTeacher(null);
                                          setSupervisor(null);
                                          setDow(null);
                                    } } type='button'>Cancel</button>
                                    <button type='submit' className={ `btn btn-primary ms-2 ms-md-4` }>Confirm</button>
                              </Modal.Footer>
                        </form>
                  </Modal >
                  <Modal show={ confirmPopUp } onHide={ () => { setConfirmPopUp(false); } } className={ `reAdjustModel hideBrowserScrollbar ${ styles.confirmModal }` } container={ props.containerRef.current }>
                        <Modal.Header className='border border-0' closeButton>
                        </Modal.Header>
                        <Modal.Body className='border border-0 d-flex justify-content-center'>
                              <h4 className='text-center'>Are you sure you want to add this class?</h4>
                        </Modal.Body>
                        <Modal.Footer className='justify-content-center border border-0'>
                              <button className={ `btn btn-danger ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                              } }>NO</button>
                              <button className={ `btn btn-primary ms-2 ms-md-4` } onClick={ () =>
                              {
                                    setConfirmPopUp(false);
                                    props.setCreateClassPopUp(false);
                              } }>YES</button>
                        </Modal.Footer>
                  </Modal>
                  <TeacherSelect addTeacherPopUp={ addTeacherPopUp } setAddTeacherPopUp={ setAddTeacherPopUp } name={ props.name }
                        containerRef={ props.containerRef } teacher={ teacher } setTeacher={ setTeacher } teacherName={ teacherName }
                        setTeacherName={ setTeacherName } Navigate={ props.Navigate } />
                  <SupervisorSelect addSupervisorPopUp={ addSupervisorPopUp } setAddSupervisorPopUp={ setAddSupervisorPopUp } name={ props.name }
                        containerRef={ props.containerRef } supervisor={ supervisor } setSupervisor={ setSupervisor }
                        supervisorName={ supervisorName } setSupervisorName={ setSupervisorName } Navigate={ props.Navigate } />
                  <PeriodSelect addPeriodPopUp={ addPeriodPopUp } setAddPeriodPopUp={ setAddPeriodPopUp } Navigate={ props.Navigate }
                        containerRef={ props.containerRef } period={ period } setPeriod={ setPeriod } dow={ dow } setDow={ setDow } />
            </>
      )
}

export default ClassCreate;