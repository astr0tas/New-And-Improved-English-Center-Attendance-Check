import { useEffect, useRef, useState } from "react";
import axios from "axios";
import $ from 'jquery';
import styles from './addClass.module.css';
import { AiOutlineClockCircle } from 'react-icons/ai';
import ReactDOM from 'react-dom/client';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { getDate100DaysLater } from "../../../tools/time_checking";
import Noti from '../../General/Noti.jsx';

const chosenTimetable = [{ dow: 2, periodID: null, start: null, end: null },
{ dow: 3, periodID: null, start: null, end: null },
{ dow: 4, periodID: null, start: null, end: null },
{ dow: 5, periodID: null, start: null, end: null },
{ dow: 6, periodID: null, start: null, end: null },
{ dow: 7, periodID: null, start: null, end: null }];

let teachers = [];
const TimeTable = (props) =>
{

      const handleChange = (e) =>
      {
            const state = e.target.checked;
            const checkboxes = document.getElementsByClassName("timetablecheckbox");
            for (let i = 0; i < checkboxes.length; i++)
                  checkboxes[i].checked = false;
            e.target.checked = state;
            const index = chosenTimetable.findIndex(elem => elem.dow === props.dow);
            if (state)
            {
                  chosenTimetable[index].periodID = props.id;
                  chosenTimetable[index].start = props.start;
                  chosenTimetable[index].end = props.end;
            }
            else
            {
                  chosenTimetable[index].periodID = null;
                  chosenTimetable[index].start = null;
                  chosenTimetable[index].end = null;
            }
      }

      useEffect(() =>
      {
            if (chosenTimetable[props.dow - 2].periodID !== null)
            {
                  $("input[type='checkbox'][value='" + chosenTimetable[props.dow - 2].periodID + "']").prop("checked", true);
            }
            // if (chosenTimetable[0].dow === props.dow)
            // {
            //       if (chosenTimetable[0].periodID === null)
            //       {
            //             const checkboxes = document.getElementsByClassName("timetablecheckbox");
            //             for (let i = 0; i < checkboxes.length; i++)
            //                   checkboxes[i].checked = false;
            //       }
            //       else
            //             $("input[type='checkbox'][value='" + chosenTimetable[0].periodID + "']").prop("checked", true);
            // }
            // else if (chosenTimetable[1].dow === props.dow)
            // {
            //       if (chosenTimetable[1].periodID === null)
            //       {
            //             const checkboxes = document.getElementsByClassName("timetablecheckbox");
            //             for (let i = 0; i < checkboxes.length; i++)
            //                   checkboxes[i].checked = false;
            //       }
            //       else
            //             $("input[type='checkbox'][value='" + chosenTimetable[1].periodID + "']").prop("checked", true);
            // }
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
                  teachers.push({ id: e.target.value, name: props.name });
            else
            {
                  teachers = teachers.filter(item => item.id !== e.target.value);
            }

      }

      return (
            <tr>
                  <th scope="row" className="col-1">{ props.i + 1 }</th>
                  <td className="col-6">{ props.name }</td>
                  <td><input type="checkbox" value={ props.id } style={ { width: '1.5rem', height: '1.5rem' } } onChange={ handleChange } className="teachercheckbox"></input></td>
            </tr>
      );
}

const AddClass = (props) =>
{
      const render = useRef(false);

      const [room, setRoom] = useState(null);
      const [startDate, setStartDate] = useState(null);
      const [endDate, setEndDate] = useState(null);
      const [supervisor, setSupervisor] = useState(null);
      const [className, setClassName] = useState(null);

      const [emptyRoom, setEmptyRoom] = useState(false);
      const [emptyTeacher, setEmptyTeacher] = useState(false);
      const [incompleteTimeTable, setImcompleteTimeTable] = useState(false);
      const [emptyName, setEmptyName] = useState(false);
      const [emptyStart, setEmptyStart] = useState(false);
      const [emptySupervisor, setEmptySupervisor] = useState(false);

      const [showNoti, setShowNoti] = useState(false);

      useEffect(() =>
      {
            if (!render.current)
            {
                  axios.get("http://localhost:3030/admin/teachers").then(res =>
                  {
                        let temp = [];
                        var teacher = ReactDOM.createRoot(document.getElementById("teacherlist"));
                        for (let i = 0; i < res.data.length; i++)
                              temp.push(<Teacher name={ res.data[i].name } key={ i } id={ res.data[i].ID } i={ i } />);
                        teacher.render(<>{ temp }</>)
                  }).catch(error => { console.log(error); });
                  axios.get("http://localhost:3030/admin/rooms").then(res =>
                  {
                        for (let i = 0; i < res.data.length; i++)
                        {
                              $('#roomList').append(
                                    $("<li>").addClass("dropdown-item").text(`${ res.data[i].ID } - ${ res.data[i].Max_of_seat }`).on("click", function ()
                                    {
                                          setRoom(res.data[i].ID);
                                          setEmptyRoom(false);
                                    })
                              );
                        }
                  }).catch(error => { console.log(error); });
                  axios.get('http://localhost:3030/admin/supervisor').then(res =>
                  {
                        for (let i = 0; i < res.data.length; i++)
                        {
                              $('#supervisorList').append(
                                    $("<li>").addClass("dropdown-item").text(res.data[i].name).on("click", function ()
                                    {
                                          setSupervisor({
                                                name: res.data[i].name, id: res.data[i].ID
                                          });
                                    })
                              );
                        }
                  }).catch(err => { console.log(err); });
                  render.current = true;
            }
      });

      const addClass = (e) =>
      {
            e.preventDefault();
            let flag = true;
            if (supervisor === null)
            {
                  setEmptySupervisor(true);
                  flag = false;
            }
            if (startDate === null)
            {
                  setEmptyStart(true);
                  flag = false;
            }
            if (className === null)
            {
                  setEmptyName(true);
                  flag = false;
            }
            if (room === null)
            {
                  setEmptyRoom(true);
                  flag = false;
            }
            if (teachers.length === 0)
            {
                  setEmptyTeacher(true);
                  flag = false;
            }
            let counter = 0;
            for (let i = 0; i < 6; i++)
            {
                  if (chosenTimetable[i].periodID === null)
                  {
                        counter++;
                  }
            }
            if (counter >= 5)
            {
                  flag = false;
                  setImcompleteTimeTable(true);
            }
            if (flag)
            {
                  axios.post('http://localhost:3030/admin/addClass', { params: { name: className, startDate: startDate, endDate: endDate, timeTable: chosenTimetable, room: room, teachers: teachers.map(item => item.id), supervisor: supervisor.id } }).then(res =>
                  {
                        console.log(res);
                        setShowNoti(true);

                        setClassName(null);
                        setStartDate(null);
                        setEndDate(null);
                        setRoom(null);
                        teachers = [];
                        setSupervisor(null);
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
            getPeriod(dow);
      }

      const displayTimeTable = () =>
      {
            let flag = true;
            if (startDate === null)
            {
                  setEmptyStart(true);
                  flag = false;
            }
            if (room === null)
            {
                  setEmptyRoom(true);
                  flag = false;
            }
            if (flag)
                  $(`.${ styles.timeTable }`).css("display", "flex");
      }

      return (
            <div className="h-100 d-flex justify-content-center align-items-center" style={ {
                  backgroundColor: '#9CBFF5',
                  position: 'absolute',
                  right: '0',
                  width: '82%',
                  height: '100%'
            } }>
                  {
                        showNoti &&  <Noti role = "Class" option = "add" offNoti = {() => setShowNoti(false)}/>
                  }
                  <div className="d-flex align-items-center justify-content-center entity-box" >
                        <form onSubmit={ addClass } className='w-100 h-100 d-flex flex-column'>
                              <div className='w-100 h-100 d-flex flex-column'>
                                    <h1 className='mt-2'>ADD A NEW CLASS</h1>
                                    <div className="flex-grow-1 mt-5 d-flex flex-column" >
                                          <div className='d-flex flex-column align-items-center'style = {{width: '100%', left: '8%', position: "absolute"}}>
                                                <div className='row my-3 w-75' >
                                                      <div className="col-2 d-flex align-items-center">
                                                            <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Name:</p>
                                                      </div>
                                                      <div className="col-7 text-start" >
                                                            <input type="text" className={ `${ styles.inputs } ps-3` } onChange={ (e) =>
                                                            {
                                                                  if (e.target.value === "")
                                                                        setClassName(null);
                                                                  else
                                                                        setClassName(e.target.value);
                                                            } }></input>
                                                      </div>
                                                      <div className="col-3 d-flex align-items-center">
                                                            { emptyName && <div style={ { color: 'red', fontSize: '1.3rem' } }><AiOutlineCloseCircle /> Enter class's name!</div> }
                                                      </div>
                                                </div>
                                                <div className='row my-3 w-75'>
                                                      <div className="col-2 d-flex align-items-center">
                                                            <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Start date:</p>
                                                      </div>
                                                      <div className="col-2 text-start">
                                                            <input type="date" className={ `${ styles.inputs } ps-3` } onChange={ (e) =>
                                                            {
                                                                  if (e.target.value === "")
                                                                  {
                                                                        setStartDate(null);
                                                                        setEndDate(null);
                                                                  }
                                                                  else
                                                                  {
                                                                        setStartDate(e.target.value);
                                                                        setEndDate(getDate100DaysLater(e.target.value));
                                                                        setEmptyStart(false);
                                                                  }
                                                            } }></input>
                                                      </div>
                                                      <div className="col-3 d-flex align-items-center justify-content-end">
                                                            <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>End date:</p>
                                                      </div>
                                                      <div className="col-2 text-start">
                                                            <input type="date" className={ `${ styles.inputs } ps-3` } disabled value={ endDate === null ? "" : endDate }></input>
                                                      </div>
                                                      <div className="col-3 d-flex align-items-center">
                                                            { emptyStart && <div style={ { color: 'red', fontSize: '1.3rem' } }><AiOutlineCloseCircle /> Enter start date!</div> }
                                                      </div>
                                                </div>
                                                <div className='row my-3 w-75'>
                                                      <div className="col-2 d-flex align-items-center">
                                                            <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Room:</p>
                                                      </div>
                                                      <div className="col-7 text-start">
                                                            <div className="dropdown">
                                                                  <button className={ `${ styles.inputs } text-start` } type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        { room }
                                                                  </button>
                                                                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={ { maxHeight: "200px", overflowY: "auto" } } id="roomList">
                                                                  </ul>
                                                            </div>
                                                      </div>
                                                      <div className="col-3 d-flex align-items-center">
                                                            { emptyRoom && <div style={ { color: 'red', fontSize: '1.3rem' } }><AiOutlineCloseCircle /> Select a class room!</div> }
                                                      </div>
                                                </div>
                                                <div className='row my-3 w-75'>
                                                      <div className="col-2 d-flex align-items-center">
                                                            <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Timetable:</p>
                                                      </div>
                                                      <div className="col-7 text-start">
                                                            <div className={ `${ styles.box } d-flex align-items-center overflow-auto w-100` } onClick={ displayTimeTable }>
                                                                  <span id="chosenTimeTable" style={ { whiteSpace: 'nowrap' } }></span>
                                                                  <AiOutlineClockCircle className="ms-auto me-1" />
                                                            </div>
                                                      </div>
                                                      <div className="col-3 d-flex align-items-center">
                                                            { incompleteTimeTable && <div style={ { color: 'red', fontSize: '1.3rem' } }><AiOutlineCloseCircle /> Incomplete timetable!</div> }
                                                      </div>
                                                </div>
                                                <div className='row my-3 w-75'>
                                                      <div className="col-2 d-flex align-items-center">
                                                            <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Teachers:</p>
                                                      </div>
                                                      <div className="col-7 text-start">
                                                            <div className={ `${ styles.box } d-flex align-items-center overflow-auto w-100` } onClick={ () => { $(`.${ styles.teachers }`).css("display", "flex"); } }>
                                                                  <span id="chosenTeachers" style={ { whiteSpace: 'nowrap' } }></span>
                                                            </div>
                                                      </div>
                                                      <div className="col-3 d-flex align-items-center">
                                                            { emptyTeacher && <div style={ { color: 'red', fontSize: '1.3rem' } }><AiOutlineCloseCircle /> Need at least one teacher!</div> }
                                                      </div>
                                                </div>
                                                <div className='row my-3 w-75'>
                                                      <div className="col-2 d-flex align-items-center">
                                                            <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Supervisor:</p>
                                                      </div>
                                                      <div className="col-7 text-start">
                                                            <div className="dropdown">
                                                                  <button className={ `${ styles.inputs } text-start` } type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        { supervisor !== null && supervisor.name }
                                                                  </button>
                                                                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2" style={ { maxHeight: "200px", overflowY: "auto" } } id="supervisorList">
                                                                  </ul>
                                                            </div>
                                                      </div>
                                                      <div className="col-3 d-flex align-items-center">
                                                            { emptySupervisor && <div style={ { color: 'red', fontSize: '1.3rem' } }><AiOutlineCloseCircle /> Select a supervisor!</div> }
                                                      </div>
                                                </div>
                                          </div>
                                          <div className="button-container">
                                                <button class="cus-btn btn btn-primary cus-btn" type="button" onClick = {() => props.offAdd()}>BACK</button>
                                                <button class="cus-btn btn btn-primary cus-btn" type='submit'>ADD</button>
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
                              <div className="button-container">
                                    <button className="cus-btn btn btn-primary cus-btn" onClick={ () =>
                                    {
                                          $(`.${ styles.timeTable }`).css("display", "none");
                                          $(`.${ styles.dow }`).css('background-color', '#dbdbdbc0').css('color', 'black');
                                          $(`#timeTable`).empty();
                                          for (let i = 0; i < 6; i++)
                                                chosenTimetable[i].periodID = null;

                                    } }>CANCEL</button>
                                    <button className="btn btn-primary cus-btn" onClick={ () =>
                                    {
                                          $(`.${ styles.timeTable }`).css("display", "none");
                                          let str = "";
                                          for (let i = 0; i < 6; i++)
                                          {
                                                if (chosenTimetable[i].periodID !== null)
                                                {
                                                      let dow;
                                                      switch (chosenTimetable[i].dow)
                                                      {
                                                            case 2:
                                                                  dow = "Monday";
                                                                  break;
                                                            case 3:
                                                                  dow = "Tuesday";
                                                                  break;
                                                            case 4:
                                                                  dow = "Wednesday";
                                                                  break;
                                                            case 5:
                                                                  dow = "Thursday";
                                                                  break;
                                                            case 6:
                                                                  dow = "Friday";
                                                                  break;
                                                            case 7:
                                                                  dow = "Saturday";
                                                                  break;
                                                      }
                                                      str += `${ dow }: ${ chosenTimetable[i].start } - ${ chosenTimetable[i].end }, `;
                                                }
                                          }
                                          str = str.substring(0, str.length - 2);
                                          $('#chosenTimeTable').text(str);
                                    } }>CONFIRM</button>
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
                              <div className="button-container">
                                    <button className="cus-btn btn btn-primary cus-btn" onClick={ () =>
                                    {
                                          $(`.${ styles.teachers }`).css("display", "none");
                                          teachers.length = 0;
                                          const checkboxes = document.getElementsByClassName("teachercheckbox");
                                          for (let i = 0; i < checkboxes.length; i++)
                                          {
                                                checkboxes[i].checked = false;
                                          }
                                    } }>CANCEL</button>
                                    <button className="cus-btn btn btn-primary cus-btn" onClick={ () =>
                                    {
                                          $(`.${ styles.teachers }`).css("display", "none");
                                          let str = "";
                                          for (let i = 0; i < teachers.length; i++)
                                                str += teachers[i].name + ', ';
                                          str = str.substring(0, str.length - 2);
                                          $('#chosenTeachers').text(str);
                                    } }>CONFIRM</button>
                              </div>
                        </div>
                  </div>
            </div >
      );
}

export default AddClass;