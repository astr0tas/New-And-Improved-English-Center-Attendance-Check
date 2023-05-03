import { useEffect, useRef, useState } from "react";
import axios from "axios";
import $ from 'jquery';
import styles from './addClass.module.css';
import { AiOutlineClockCircle } from 'react-icons/ai';
import ReactDOM from 'react-dom/client';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const chosenTimetable = [{ dow: null, periodID: null }, { dow: null, periodID: null }];

const TimeTable = (props) =>
{

      const handleChange = (e) =>
      {
            e.preventDefault();
            const state = e.target.checked;
            const checkboxes = document.getElementsByClassName("timetablecheckbox");
            for (let i = 0; i < checkboxes.length; i++)
                  checkboxes[i].checked = false;
            e.target.checked = state;
            if (state)
            {
                  if (chosenTimetable[0].dow === props.dow)
                        chosenTimetable[0].periodID = props.id;
                  else
                        chosenTimetable[1].periodID = props.id;
            }
            else
            {
                  if (chosenTimetable[0].dow === props.dow)
                        chosenTimetable[0].periodID = null;
                  else
                        chosenTimetable[1].periodID = null;
            }
      }

      useEffect(() =>
      {
            if (chosenTimetable[0].dow === props.dow)
            {
                  if (chosenTimetable[0].periodID === null)
                  {
                        const checkboxes = document.getElementsByClassName("timetablecheckbox");
                        for (let i = 0; i < checkboxes.length; i++)
                              checkboxes[i].checked = false;
                  }
                  else
                        $("input[type='checkbox'][value='" + chosenTimetable[0].periodID + "']").prop("checked", true);
            }
            else if (chosenTimetable[1].dow === props.dow)
            {
                  if (chosenTimetable[1].periodID === null)
                  {
                        const checkboxes = document.getElementsByClassName("timetablecheckbox");
                        for (let i = 0; i < checkboxes.length; i++)
                              checkboxes[i].checked = false;
                  }
                  else
                        $("input[type='checkbox'][value='" + chosenTimetable[1].periodID + "']").prop("checked", true);
            }
      })

      return (
            <tr>
                  <th scope="row" className="col-1">{ props.i + 1 }</th>
                  <td className="col-4">{ props.start }</td>
                  <td className="col-4">{ props.end }</td>
                  <td><input type="checkbox" value={ props.id } style={ { width: '1.5rem', height: '1.5rem' } } className="timetablecheckbox" onChange={ handleChange }></input></td>
            </tr>
      );
}

const Teacher = (props) =>
{
      const handleChange = (e) =>
      {
            if (e.target.checked)
                  props.setTeachers(prev => [...prev, e.target.value]);
            else
                  props.setTeachers(props.teachers.filter((item) => item !== e.target.value));

      }

      return (
            <tr>
                  <th scope="row" className="col-1">{ props.i + 1 }</th>
                  <td className="col-6">{ props.name }</td>
                  <td><input type="checkbox" value={ props.id } style={ { width: '1.5rem', height: '1.5rem' } } onChange={ handleChange } className="teachercheckbox"></input></td>
            </tr>
      );
}

const Room = (props) =>
{
      const handleChange = (e) =>
      {
            const state = e.target.checked;
            const checkboxes = document.getElementsByClassName("roomcheckbox");
            for (let i = 0; i < checkboxes.length; i++)
                  checkboxes[i].checked = false;
            e.target.checked = state;
            if (state)
                  props.setRoom(e.target.value);
            else
                  props.setRoom(null);
      }

      return (
            <tr>
                  <th scope="row" className="col-1">{ props.i + 1 }</th>
                  <td className="col-6">{ props.id }</td>
                  <td>{ props.seats }</td>
                  <td><input type="checkbox" value={ props.id } style={ { width: '1.5rem', height: '1.5rem' } } onChange={ handleChange } className="roomcheckbox"></input></td>
            </tr>
      );
}

const AddClass = () =>
{
      const [room, setRoom] = useState(null);
      const [teachers, setTeachers] = useState([]);
      const [startDate, setStartDate] = useState(null);
      const [endDate, setEndDate] = useState(null);

      const [emptyRoom, setEmptyRoom] = useState(false);
      const [emptyTeacher, setEmptyTeacher] = useState(false);
      const [incompleteTimeTable, setImcompleteTimeTable] = useState(false);

      useEffect(() =>
      {
            axios.get("http://localhost:3030/admin/teachers").then(res =>
            {
                  let temp = [];
                  var teacher = ReactDOM.createRoot(document.getElementById("teacherlist"));
                  for (let i = 0; i < res.data.length; i++)
                        temp.push(<Teacher name={ res.data[i].name } key={ i } id={ res.data[i].ID } i={ i } setTeachers={ setTeachers } teachers={ teachers } />);
                  teacher.render(<>{ temp }</>)
            }).catch(error => { console.log(error); })
            axios.get("http://localhost:3030/admin/rooms").then(res =>
            {
                  let temp = [];
                  var room = ReactDOM.createRoot(document.getElementById("roomlist"));
                  for (let i = 0; i < res.data.length; i++)
                        temp.push(<Room id={ res.data[i].ID } key={ i } seats={ res.data[i].Max_of_seat } i={ i } setRoom={ setRoom } />);
                  room.render(<>{ temp }</>)
            }).catch(error => { console.log(error); })
      }, []);

      const addClass = (e) =>
      {
            e.preventDefault();
            if (room === null)
                  setEmptyRoom(true);
            else
                  setEmptyRoom(false);
            if (teachers.length === 0)
                  setEmptyTeacher(true);
            else
                  setEmptyTeacher(false);
            if (chosenTimetable[0].periodID === null || chosenTimetable[1].periodID === null)
                  setImcompleteTimeTable(true);
            else
                  setImcompleteTimeTable(false);
            if (!emptyRoom && !emptyTeacher && !incompleteTimeTable)
            {
                  axios.post('http://localhost:3030/admin/addClass', { params: { name: $('#class_name').val(), startDate: startDate, endDate: endDate, timeTable: chosenTimetable, room: room, teachers: teachers } }).then(res =>
                  {
                        console.log(res);
                  }).catch(err => { console.log(err); })
            }
      }

      const getPeriod = (dow) =>
      {
            axios.post('http://localhost:3030/admin/getPeriod', { params: { dow: dow, room: room, start: startDate, end: endDate } }).then(res =>
            {
                  const target = ReactDOM.createRoot(document.getElementById("timeTable"));
                  const temp = [];
                  for (let i = 0; i < res.data.length; i++)
                        temp.push(<TimeTable key={ i } i={ i } start={ res.data[i].Start_hour } end={ res.data[i].End_hour } id={ res.data[i].ID } dow={ dow } />);
                  target.render(<>{ temp }</>);
            }).catch(err => { console.log(err); })
      }

      const chooseDow = (e, dow) =>
      {
            $(`.${ styles.dow }`).css('background-color', '#dbdbdbc0').css('color', 'black');
            $(e.target).css('background-color', '#4274F4').css('color', 'white');
            if (chosenTimetable[0].dow === null || chosenTimetable[0].periodID === null)
                  chosenTimetable[0].dow = dow;
            else if (chosenTimetable[1].dow === null || chosenTimetable[1].periodID === null)
                  chosenTimetable[1].dow = dow;
            getPeriod(dow);
      }

      return (
            <div className="h-100 d-flex justify-content-center align-items-center" style={ {
                  backgroundColor: '#9CBFF5',
                  marginLeft: '250px',
                  width: 'calc(100% - 250px)'
            } }>
                  <div className="d-flex align-items-center justify-content-center" style={ { width: '95%', height: '95%', backgroundColor: '#EDEDED', border: '2px solid black', borderRadius: '20px' } }>
                        <form onSubmit={ addClass } className='w-100 h-100 d-flex flex-column'>
                              <div className='w-100 h-100 d-flex flex-column'>
                                    <h1 className='mt-2'>Add a new class</h1>
                                    <div className="flex-grow-1 mt-5 d-flex flex-column">
                                          <div className='d-flex flex-column'>
                                                <span className={ `${ styles.input } my-3` }>Name: &nbsp; <input type="text" required id="class_name"></input></span>
                                                <span className={ `${ styles.input } my-3` }>Period: &nbsp; Form: &nbsp;<input type="date" required onChange={ (e) =>
                                                {
                                                      setStartDate(e.target.value);
                                                } }></input> To: &nbsp;<input type="date" required onChange={ (e) =>
                                                {
                                                      setEndDate(e.target.value);
                                                } }></input></span>
                                                <span className={ `${ styles.input } my-3 d-flex align-items-center align-self-center` }>
                                                      Room: &nbsp;
                                                      <div className={ `${ styles.box } d-flex align-items-center overflow-auto` } onClick={ () => { $(`.${ styles.room }`).css("display", "flex"); } }>
                                                            <span id="chosenRoom"></span>
                                                      </div>
                                                      { emptyRoom && <div style={ { color: 'red', fontSize: '1.5rem' } }>&nbsp;&nbsp;<AiOutlineCloseCircle /> Select a class room!</div> }
                                                </span>
                                                <span className={ `${ styles.input } my-3 d-flex align-items-center align-self-center` }>
                                                      Timetable: &nbsp;
                                                      <div className={ `${ styles.box } d-flex align-items-center overflow-auto` } onClick={ () => { $(`.${ styles.timeTable }`).css("display", "flex"); } }>
                                                            <span></span>
                                                            <AiOutlineClockCircle className="ms-auto me-1" />
                                                      </div>
                                                      { incompleteTimeTable && <div style={ { color: 'red', fontSize: '1.5rem' } }>&nbsp;&nbsp;<AiOutlineCloseCircle /> Incomplete timetable!</div> }
                                                </span>
                                                <span className={ `${ styles.input } my-3 d-flex align-items-center align-self-center` }>
                                                      Teachers: &nbsp;
                                                      <div className={ `${ styles.box } d-flex align-items-center overflow-auto` } onClick={ () => { $(`.${ styles.teachers }`).css("display", "flex"); } }>
                                                            <span id="chosenTeachers"></span>
                                                      </div>
                                                      { emptyTeacher && <div style={ { color: 'red', fontSize: '1.5rem' } }>&nbsp;&nbsp;<AiOutlineCloseCircle /> Select at least one teacher!</div> }
                                                </span>
                                          </div>
                                          <div className="mt-auto mb-4">
                                                <button className={ `me-5 ${ styles.back }` } type="button">Back</button>
                                                <button className={ `ms-5 ${ styles.add }` } type='submit'>Add</button>
                                          </div>
                                    </div>
                              </div>
                        </form>
                        <div className={ `w-75 position-absolute ${ styles.timeTable } flex-column` } style={ { backgroundColor: '#BFBFBF', height: '80%', border: '2px solid black', borderRadius: '20px' } }>
                              <div className='d-flex align-items-center justify-content-center'>
                                    <h2 className='mt-2'>Choose time table</h2>
                              </div>
                              <div className='d-flex align-items-center justify-content-around mt-5'>
                                    <button className={ `${ styles.dow }` } onClick={ (e) =>
                                    {
                                          chooseDow(e, 2);
                                    } }>Monday</button>
                                    <button className={ `${ styles.dow }` } onClick={ (e) =>
                                    {
                                          chooseDow(e, 3);
                                    } }>Tuesday</button>
                                    <button className={ `${ styles.dow }` } onClick={ (e) =>
                                    {
                                          chooseDow(e, 4);
                                    } }>Wednesday</button>
                                    <button className={ `${ styles.dow }` } onClick={ (e) =>
                                    {
                                          chooseDow(e, 5);
                                    } }>Thursday</button>
                                    <button className={ `${ styles.dow }` } onClick={ (e) =>
                                    {
                                          chooseDow(e, 6);
                                    } }>Friday</button>
                                    <button className={ `${ styles.dow }` } onClick={ (e) =>
                                    {
                                          chooseDow(e, 7);
                                    } }>Saturday</button>
                              </div>
                              <div className="flex-grow-1 mt-4 overflow-auto">
                                    <table className="table table-hover">
                                          <thead style={ { borderBottom: '2px solid black' } }>
                                                <tr>
                                                      <th scope="col">#</th>
                                                      <th scope="col" className="col-4">Start time</th>
                                                      <th scope="col" className="col-4">End time</th>
                                                      <th scope="col">Add?</th>
                                                </tr>
                                          </thead>
                                          <tbody id="timeTable">
                                          </tbody>
                                    </table>
                              </div>
                              <div className="mt-auto mb-3">
                                    <button className={ `${ styles.backTime } me-5` } onClick={ () => { $(`.${ styles.timeTable }`).css("display", "none"); chosenTimetable[0] = { dow: null, periodID: null }; chosenTimetable[1] = { dow: null, periodID: null } } }>Cancel</button>
                                    <button className={ `${ styles.add } ms-5` } onClick={ () => { $(`.${ styles.timeTable }`).css("display", "none"); } }>Confirm</button>
                              </div>
                        </div>
                        <div className={ `w-75 position-absolute ${ styles.teachers } flex-column` } style={ { backgroundColor: '#BFBFBF', height: '80%', border: '2px solid black', borderRadius: '20px' } }>
                              <div className='d-flex align-items-center justify-content-center'>
                                    <h2 className='mt-2'>Choose teachers</h2>
                              </div>
                              <div className="flex-grow-1 mt-4 overflow-auto">
                                    <table className="table table-hover">
                                          <thead style={ { borderBottom: '2px solid black' } }>
                                                <tr>
                                                      <th scope="col">#</th>
                                                      <th scope="col" className="col-6">Name</th>
                                                      <th scope="col">Add?</th>
                                                </tr>
                                          </thead>
                                          <tbody id="teacherlist">
                                          </tbody>
                                    </table>
                              </div>
                              <div className="mt-auto mb-3">
                                    <button className={ `${ styles.backTime } me-5` } onClick={ () =>
                                    {
                                          $(`.${ styles.teachers }`).css("display", "none");
                                          setTeachers([]);
                                          const checkboxes = document.getElementsByClassName("teachercheckbox");
                                          for (let i = 0; i < checkboxes.length; i++)
                                          {
                                                checkboxes[i].checked = false;
                                          }
                                    } }>Cancel</button>
                                    <button className={ `${ styles.add } ms-5` } onClick={ () =>
                                    {
                                          $(`.${ styles.teachers }`).css("display", "none");
                                    } }>Confirm</button>
                              </div>
                        </div>
                        <div className={ `w-75 position-absolute ${ styles.room } flex-column` } style={ { backgroundColor: '#BFBFBF', height: '80%', border: '2px solid black', borderRadius: '20px' } }>
                              <div className='d-flex align-items-center justify-content-center'>
                                    <h2 className='mt-2'>Choose a room</h2>
                              </div>
                              <div className="flex-grow-1 mt-4 overflow-auto">
                                    <table className="table table-hover">
                                          <thead style={ { borderBottom: '2px solid black' } }>
                                                <tr>
                                                      <th scope="col">#</th>
                                                      <th scope="col" className="col-6">ID</th>
                                                      <th scope="col">Max seats</th>
                                                      <th scope="col">Add?</th>
                                                </tr>
                                          </thead>
                                          <tbody id="roomlist">
                                          </tbody>
                                    </table>
                              </div>
                              <div className="mt-auto mb-3">
                                    <button className={ `${ styles.backTime } me-5` } onClick={ () =>
                                    {
                                          $(`.${ styles.room }`).css("display", "none");
                                          setRoom(null);
                                          const checkboxes = document.getElementsByClassName("roomcheckbox");
                                          for (let i = 0; i < checkboxes.length; i++)
                                          {
                                                checkboxes[i].checked = false;
                                          }
                                    } }>Cancel</button>
                                    <button className={ `${ styles.add } ms-5` } onClick={ () =>
                                    {
                                          $(`.${ styles.room }`).css("display", "none");
                                    } }>Confirm</button>
                              </div>
                        </div>
                  </div >
            </div >
      );
}

export default AddClass;