import { useNavigate, useParams } from 'react-router-dom';
import styles from './addSession.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const AddSession = () =>
{
      const Navigate = useNavigate();

      const render = useRef(false);

      const [chosenRoom, setChosenRoom] = useState(null);
      const [chosenSession, setChosenSession] = useState(null);
      const [chosenTeacher, setChosenTeacher] = useState(null);
      const [chosenSupervisor, setChosenSupervisor] = useState(null);
      const [chosenDate, setChosenDate] = useState(null);
      const [chosenTimeTable, setChosenTimeTable] = useState(null);

      const [emptyRoom, setEmptyRoom] = useState(false);
      const [emptySession, setEmptySession] = useState(false);
      const [emptyTeacher, setEmptyTeacher] = useState(false);
      const [emptySupervisor, setEmptySupervisor] = useState(false);
      const [emptyDate, setEmptyDate] = useState(false);
      const [emptyTimetable, setEmptyTimetable] = useState(false);


      const [newSession, setNewSession] = useState("N/A");

      const [room, setRoom] = useState("Choose room");
      const [session, setSession] = useState("Choose session");
      const [teacher, setTeacher] = useState("Choose teacher");
      const [supervisor, setSupervisor] = useState("Choose supervisor");
      const [time, setTime] = useState("Choose time");

      const className = useParams().name;

      useEffect(() =>
      {
            if (!render.current)
            {
                  axios.post('http://localhost:3030/admin/getClassTeachers', { params: { name: className } }).then(res =>
                  {
                        for (let i = 0; i < res.data.length; i++)
                        {
                              $('#teacherList').append(
                                    $("<li>").addClass("dropdown-item").text(res.data[i].name).on("click", function ()
                                    {
                                          setTeacher(res.data[i].name);
                                          setChosenTeacher(res.data[i].Teacher_ID);
                                    })
                              );
                        }
                  }).catch(err => { console.log(err); })
                  axios.post('http://localhost:3030/admin/getRooms', { params: { name: className } }).then(res =>
                  {
                        for (let i = 0; i < res.data.length; i++)
                        {
                              $('#roomList').append(
                                    $("<li>").addClass("dropdown-item").text(`${ res.data[i].ID } - ${ res.data[i].Max_of_seat }`).on("click", function ()
                                    {
                                          setRoom(res.data[i].ID);
                                          setChosenRoom(res.data[i].ID);
                                    })
                              );
                        }
                  }).catch(err => { console.log(err); })
                  axios.post('http://localhost:3030/admin/countSession', { params: { name: className } }).then(res =>
                  {
                        setNewSession(`Session ${ res.data[0].count + 1 }`);
                  }).catch(err => { console.log(err); })
                  axios.post('http://localhost:3030/admin/getSessions', { params: { name: className } }).then(res =>
                  {
                        for (let i = 0; i < res.data.length; i++)
                        {
                              $('#sessionList').append(
                                    $("<li>").addClass("dropdown-item").text(`Session ${ res.data[i].Session_number }`).on("click", function ()
                                    {
                                          setSession(`Session ${ res.data[i].Session_number }`);
                                          setChosenSession(res.data[i].Session_number);
                                    })
                              );
                        }
                  }).catch(err => { console.log(err); })
                  axios.get('http://localhost:3030/admin/supervisor').then(res =>
                  {
                        for (let i = 0; i < res.data.length; i++)
                        {
                              $('#supervisorList').append(
                                    $("<li>").addClass("dropdown-item").text(res.data[i].name).on("click", function ()
                                    {
                                          setSupervisor(res.data[i].name);
                                          setChosenSupervisor(res.data[i].ID);
                                    })
                              );
                        }
                  }).catch(err => { console.log(err); })
                  render.current = true;
            }
      });

      const addSession = () =>
      {
            let flag = true;
            if (!chosenRoom)
            {
                  flag = false;
                  setEmptyRoom(true);
            }
            if (!chosenDate)
            {
                  flag = false;
                  setEmptyDate(true);
            }
            if (!chosenTimeTable)
            {
                  flag = false;
                  setEmptyTimetable(true);
            }
            if (!chosenSession)
            {
                  flag = false;
                  setEmptySession(true);
            }
            if (!chosenTeacher)
            {
                  flag = false;
                  setEmptyTeacher(true);
            }
            if (!chosenSupervisor)
            {
                  flag = false;
                  setEmptySupervisor(true);
            }
            if (flag)
            {
                  axios.post("http://localhost:3030/admin/createNewSession", { params: { name: className, newSession: parseInt(newSession.replace("Session ", "")), room: chosenRoom, date: chosenDate, time: chosenTimeTable, session: chosenSession, teacher: chosenTeacher, supervisor: chosenSupervisor } })
                        .then(res => { console.log(res); })
                        .catch(err => { console.log(err); });
            }
      }

      const getTimes = () =>
      {
            axios.post('http://localhost:3030/admin/times', { params: { room: chosenRoom, date: chosenDate } }).then(res =>
            {
                  for (let i = 0; i < res.data.length; i++)
                  {
                        $('#timeList').append(
                              $("<li>").addClass("dropdown-item").text(`${ res.data[i].Start_hour } - ${ res.data[i].End_hour }`).on("click", function ()
                              {
                                    setTime(`${ res.data[i].Start_hour } - ${ res.data[i].End_hour }`);
                                    setChosenTimeTable(res.data[i].ID);
                              })
                        );
                  }
            }).catch(err => { console.log(err); })
      }

      return (
            <div className={ `h-100 ${ styles.page } d-flex align-items-center justify-content-center` }>
                  <div className={ `d-flex flex-column align-items-center ${ styles.board }` }>
                        <h1 className="mt-3">Add a new session</h1>
                        <div className="d-flex flex-column mt-5 justify-content-around h-50">
                              <div>
                                    <label className={ `me-5 ${ styles.font }` }>Session number: </label>
                                    <input disabled className={ `${ styles.inputs } ps-3` } value={ newSession }></input>
                              </div>
                              <div className={ `d-flex align-items-center` }>
                                    <label className={ `me-5 ${ styles.font }` }>Room: </label>
                                    <div className="dropdown">
                                          <button className={ `${ styles.inputs } ` } type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                { room }
                                          </button>
                                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={ { maxHeight: "200px", overflowY: "auto" } } id="roomList">
                                          </ul>
                                    </div>
                                    { emptyRoom && <div style={ { color: 'red', fontSize: '1.5rem' } }>&nbsp;&nbsp;<AiOutlineCloseCircle /> Select a class room!</div> }
                              </div>
                              <div className={ `d-flex align-items-center` }>
                                    <label className={ `me-5 ${ styles.font }` }>Date: </label>
                                    <input type='date' className={ `${ styles.inputs } ps-3` } onChange={ (e) => { setChosenDate(e.target.value); } }></input>
                                    { emptyDate && <div style={ { color: 'red', fontSize: '1.5rem' } }>&nbsp;&nbsp;<AiOutlineCloseCircle /> Select date!</div> }
                              </div>
                              <div className={ `d-flex align-items-center` }>
                                    <label className={ `me-5 ${ styles.font }` }>Time period: </label>
                                    <div className="dropdown">
                                          <button className={ `${ styles.inputs }` } type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" onClick={ getTimes }>
                                                { time }
                                          </button>
                                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={ { maxHeight: "200px", overflowY: "auto" } } id="timeList">
                                          </ul>
                                    </div>
                                    { emptyTimetable && <div style={ { color: 'red', fontSize: '1.5rem' } }>&nbsp;&nbsp;<AiOutlineCloseCircle /> Select time!</div> }
                              </div>
                              <div className={ `d-flex align-items-center` }>
                                    <label className={ `me-5 ${ styles.font }` }>Make up for session: </label>
                                    <div className="dropdown">
                                          <button className={ `${ styles.inputs }` } type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                { session }
                                          </button>
                                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={ { maxHeight: "200px", overflowY: "auto" } } id="sessionList">
                                          </ul>
                                    </div>
                                    { emptySession && <div style={ { color: 'red', fontSize: '1.5rem' } }>&nbsp;&nbsp;<AiOutlineCloseCircle /> Select a session!</div> }
                              </div>
                              <div className={ `d-flex align-items-center` }>
                                    <label className={ `me-5 ${ styles.font }` }>Teacher: </label>
                                    <div className="dropdown">
                                          <button className={ `${ styles.inputs }` } type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                { teacher }
                                          </button>
                                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={ { maxHeight: "200px", overflowY: "auto" } } id="teacherList">
                                          </ul>
                                    </div>
                                    { emptyTeacher && <div style={ { color: 'red', fontSize: '1.5rem' } }>&nbsp;&nbsp;<AiOutlineCloseCircle /> Select a teacher!</div> }
                              </div>
                              <div className={ `d-flex align-items-center` }>
                                    <label className={ `me-5 ${ styles.font }` }>Supervisor: </label>
                                    <div className="dropdown">
                                          <button className={ `${ styles.inputs }` } type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                { supervisor }
                                          </button>
                                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={ { maxHeight: "200px", overflowY: "auto" } } id="supervisorList">
                                          </ul>
                                    </div>
                                    { emptySupervisor && <div style={ { color: 'red', fontSize: '1.5rem' } }>&nbsp;&nbsp;<AiOutlineCloseCircle /> Select a supervisor!</div> }
                              </div>
                        </div>
                        <div className='mb-5 mt-auto'>
                              <button onClick={ () => { Navigate(-1); } } className={ `me-5 ${ styles.back }` }>Back</button>
                              <button className={ `ms-5 ${ styles.confirm }` } onClick={ addSession }>Confirm</button>
                        </div>
                  </div>
            </div>
      );
}

export default AddSession;