import { useNavigate, useParams } from "react-router-dom";
import styles from './Attendace.module.css';
import ReactDOM from 'react-dom/client';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AiOutlineClockCircle } from 'react-icons/ai';
import { detailFormat } from "../../../tools/date_formatting";
import $ from 'jquery';

const students = [];
const StudentList = (props) =>
{

      const render = useRef(false);

      useEffect(() =>
      {
            if (!render.current)
            {
                  axios.get('http://localhost:3030/TS/attendance/studentAttendance', { params: { sessionNumber: props.sessionNumber, className: props.className, ID: props.id } })
                        .then(res =>
                        {
                              if (res.data.length !== 0)
                              {
                                    students[props.number - 1].status = res.data.Status;
                                    students[props.number - 1].note = (res.data.Note === null) ? "" : res.data.Note;

                                    $(`.attendance_note_${ props.id }`).val(res.data.Note);
                                    $(`.attendance_check_${ props.id }`).each(function ()
                                    {
                                          if (parseInt($(this).val()) === res.data.Status)
                                                $(this).prop("checked", true);
                                          else
                                                $(this).prop("checked", false);
                                    });
                              }
                        })
                        .catch(error => { console.log(error); })
                  render.current = true;
            }
      });

      return (
            <tr>
                  <th scope="row" className='col-1'>{ props.number }</th>
                  <td className='col-3'>{ props.name }</td>
                  <td className='col-1'></td>
                  <td className='col-1'><input disabled value="2" className={ `attendance_check_${ props.id } ${ styles.checkbox }` } type="checkbox" style={ { width: "30px", height: "30px" } }></input></td>
                  <td className='col-1'><input disabled value="1" className={ `attendance_check_${ props.id } ${ styles.checkbox }` } type="checkbox" style={ { width: "30px", height: "30px", marginLeft: "20px" } }></input></td>
                  <td className='col-1'><input disabled value="0" className={ `attendance_check_${ props.id } ${ styles.checkbox }` } type="checkbox" style={ { width: "30px", height: "30px", marginLeft: "20px" } }></input></td>
                  <td className='col-3'><input disabled type="text" style={ { width: "300px", marginLeft: "30px" } } className={ `attendance_note_${ props.id }` }></input></td>
            </tr>
      );
}

const teacherAttendace = { status: null };
const Supervisor = (props) =>
{
      const render = useRef(false);

      const [room, setRoom] = useState();
      const [time, setTime] = useState({});
      const [status, setStatus] = useState({});
      const [makeup, setMakeup] = useState(null);
      const [teacher, setTeacher] = useState({});
      const [supervisor, setSupervisor] = useState({});

      const addStudent = (id) =>
      {
            students.push({ id: id, status: null, note: "" });
      };

      useEffect(() =>
      {
            if (!render.current)
            {
                  async function Foo()
                  {
                        let teacherID;
                        axios.get('http://localhost:3030/TS/attendance/session', {
                              params: {
                                    sessionNumber: props.sessionNumber,
                                    className: props.className
                              }
                        })
                              .then(res =>
                              {
                                    setRoom(res.data.Classroom_ID);
                                    setTime({ date: detailFormat(res.data.Session_date), start: res.data.Start_hour, end: res.data.End_hour });
                                    if (res.data.Status === 2)
                                          setStatus({ status: "On going", color: "#0B8700" });
                                    else if (res.data.Status === 1)
                                          setStatus({ status: "Finished", color: "#7E7E7E" });
                                    else
                                          setStatus({ status: "Cancelled", color: "#FF0000" });
                                    setMakeup(res.data.Session_number_make_up_for);
                              })
                              .catch(error => console.log(error));
                        await axios.get('http://localhost:3030/TS/attendance/teacher', {
                              params: {
                                    sessionNumber: props.sessionNumber,
                                    className: props.className
                              }
                        })
                              .then(res =>
                              {
                                    setTeacher({ id: res.data.ID, name: res.data.name });
                                    teacherID = res.data.ID;
                              })
                              .catch(error => console.log(error));
                        axios.get('http://localhost:3030/TS/attendance/supervisor', {
                              params: {
                                    sessionNumber: props.sessionNumber,
                                    className: props.className
                              }
                        })
                              .then(res =>
                              {
                                    setSupervisor({ id: res.data.ID, name: res.data.name });
                              })
                              .catch(error => console.log(error));
                        axios.get('http://localhost:3030/TS/attendance/teacherAttendance', { params: { sessionNumber: props.sessionNumber, className: props.className, ID: teacherID } })
                              .then(res =>
                              {
                                    if (res.data.length !== 0)
                                    {
                                          teacherAttendace.status = res.data.Status;
                                          $('.teacher_attendace_note').val((res.data.Note === null) ? "" : res.data.Note);

                                          $(`.teacher_attendace_check`).each(function ()
                                          {
                                                if (parseInt($(this).val()) === teacherAttendace.status)
                                                {
                                                      $(this).prop("checked", true);
                                                }
                                                else
                                                {
                                                      $(this).prop("checked", false);
                                                }
                                          });
                                    }
                              })
                              .catch(error => { console.log(error); })
                        axios.get('http://localhost:3030/TS/attendance/classNote', { params: { sessionNumber: props.sessionNumber, className: props.className } })
                              .then(res =>
                              {
                                    if (res.data.length !== 0)
                                    {
                                          $('.note_for_class').val(res.data.Note_for_class);
                                    }
                              })
                              .catch(error => { console.log(error); })
                        axios.get('http://localhost:3030/TS/attendance/students', {
                              params: {
                                    className: props.className
                              }
                        })
                              .then(res =>
                              {
                                    let temp = [];
                                    for (let i = 0; i < res.data.length; i++)
                                    {
                                          addStudent(res.data[i].Student_ID);
                                          temp.push(<StudentList key={ i } number={ i + 1 } name={ res.data[i].name } id={ res.data[i].Student_ID } sessionNumber={ props.sessionNumber } className={ props.className } />);
                                    }
                                    const root = ReactDOM.createRoot(document.getElementById('student_list'));
                                    root.render(<>{ temp }</>);
                              })
                              .catch(error => console.log(error));
                        axios.post('http://localhost:3030/admin/getClassTeachers', { params: { name: props.className } }).then(res =>
                        {
                              for (let i = 0; i < res.data.length; i++)
                              {
                                    $('#teacherList').append(
                                          $("<li>").addClass("dropdown-item").text(res.data[i].name).on("click", function ()
                                          {
                                                setTeacher({ name: res.data[i].name, id: res.data[i].Teacher_ID });
                                                axios.post("http://localhost:3030/admin/replaceTeacher", {
                                                      params: {
                                                            session: props.sessionNumber,
                                                            name: props.className,
                                                            id: res.data[i].Teacher_ID
                                                      }
                                                })
                                                      .then(res =>
                                                      {
                                                            console.log(res);
                                                      })
                                                      .catch(err => { console.log(err); })
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
                                                setSupervisor({ id: res.data[i].ID, name: res.data[i].name });
                                                axios.post("http://localhost:3030/admin/replaceSupervisor", {
                                                      params: {
                                                            session: props.sessionNumber,
                                                            name: props.className,
                                                            id: res.data[i].ID
                                                      }
                                                })
                                                      .then(res =>
                                                      {
                                                            console.log(res);
                                                      })
                                                      .catch(err => { console.log(err); })
                                          })
                                    );
                              }
                        }).catch(err => { console.log(err); })
                  }
                  Foo();
                  render.current = true;
            }
      });

      const cancelSession = () =>
      {
            axios.post('http://localhost:3030/admin/cancelSession', {
                  params: {
                        sessionNumber: props.sessionNumber,
                        className: props.className
                  }
            })
                  .then(res => { console.log(res); window.location.reload(); })
                  .catch(err => { console.log(err); });
      }

      const activateSession = () =>
      {
            axios.post('http://localhost:3030/admin/activateSession', {
                  params: {
                        sessionNumber: props.sessionNumber,
                        className: props.className
                  }
            })
                  .then(res => { console.log(res); window.location.reload(); })
                  .catch(err => { console.log(err); });
      }

      return (
            <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                  <div className={ `w-100 d-flex` } style={ { height: '40%' } }>
                        <div className="h-100 d-flex flex-column justify-content-center align-items-center" style={ { width: '25%' } }>
                              <h1>Session { props.sessionNumber }</h1>
                              <p className="d-flex align-items-center"><AiOutlineClockCircle />{ time.date }: { time.start } - { time.end }</p>
                              <p>Room: { room }</p>
                              <div className="d-flex align-items-center" style={ {
                                    marginBottom: '16px'
                              } }>
                                    <p style={ {
                                          marginBottom: '0'
                                    } }>Status: <span style={ { color: status.color } }>{ status.status }</span></p>
                                    { status.status === "On going" && <button className="ms-3" style={ {
                                          border: "1px solid black",
                                          borderRadius: "10px",
                                          color: "white",
                                          backgroundColor: "red"
                                    } } onClick={ cancelSession }>Cancel</button> }
                                    { status.status === "Cancelled" && <button className="ms-3" style={ {
                                          border: "1px solid black",
                                          borderRadius: "10px",
                                          color: "white",
                                          backgroundColor: "#4E7EF8"
                                    } } onClick={ activateSession }>Activate</button> }
                              </div>
                              { makeup && <p>Make up for session { makeup }</p> }
                              {
                                    status.status === "On going" &&
                                    <div className="d-flex align-items-center" style={ {
                                          marginBottom: '16px'
                                    } }>
                                          <p style={ { marginBottom: '0' } }>Change teacher?</p>
                                          <div className="dropdown ms-3">
                                                <button className={ `${ styles.inputs }` } type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                      { teacher.name }
                                                </button>
                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={ { maxHeight: "100px", overflowY: "auto" } } id="teacherList">
                                                </ul>
                                          </div>
                                    </div>
                              }
                              {
                                    status.status === "On going" &&
                                    <div className="d-flex align-items-center" style={ {
                                          marginBottom: '16px'
                                    } }>
                                          <p style={ { marginBottom: '0' } }>Change supervisor?</p>
                                          <div className="dropdown ms-3">
                                                <button className={ `${ styles.inputs }` } type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                      { supervisor.name }
                                                </button>
                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={ { maxHeight: "200px", overflowY: "auto" } } id="supervisorList">
                                                </ul>
                                          </div>
                                    </div>
                              }
                        </div>
                        <div className="h-100 d-flex flex-column justify-content-center align-items-center" style={ { width: '27.5%' } }>
                              <h3 className="mb-3">Teacher: { teacher.name }</h3>
                              <img alt="avatar" src="https://cdn3.iconfinder.com/data/icons/avatar-91/130/avatar__girl__teacher__female__women-512.png" style={ { height: '70%', width: '70%' } }></img>
                              <button className={ `mt-3 ${ styles.detail }` }>Detail</button>
                        </div >
                        <div className="h-100 d-flex flex-column justify-content-center align-items-center" style={ { width: '20%' } }>
                              <div className="d-flex justify-content-around align-items-center w-100">
                                    <div>
                                          <h4>On class</h4>
                                          <input disabled type="checkbox" style={ { width: "30px", height: "30px" } } value="2" className={ `teacher_attendace_check ${ styles.checkbox }` }></input>
                                    </div>
                                    <div>
                                          <h4>Late</h4>
                                          <input disabled type="checkbox" style={ { width: "30px", height: "30px" } } value="1" className={ `teacher_attendace_check ${ styles.checkbox }` }></input>
                                    </div>
                                    <div>
                                          <h4>Absent</h4>
                                          <input disabled type="checkbox" style={ { width: "30px", height: "30px" } } value="0" className={ `teacher_attendace_check ${ styles.checkbox }` }></input>
                                    </div>
                              </div>
                              <div className="d-flex justify-content-center align-items-center mt-5">
                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                          <h4>Note</h4>
                                          <textarea disabled style={ { width: '250px', minHeight: '60px', resize: 'none' } } className="teacher_attendace_note"></textarea>
                                    </div>
                              </div>
                        </div >
                        <div className="h-100 d-flex flex-column justify-content-center align-items-center" style={ { width: '27.5%' } }>
                              <h3 className="mb-3">Supervisor: { supervisor.name }</h3>
                              <img alt="avatar" src="https://www.shareicon.net/data/512x512/2016/07/26/801997_user_512x512.png" style={ { height: '70%', width: '70%' } }></img>
                              <button className={ `mt-3 ${ styles.detail }` }>Detail</button>
                        </div>
                  </div>
                  <div className={ `w-100` } style={ { height: '50%' } } >
                        <table className="table table-hover m-0 w-100">
                              <thead style={ { borderBottom: "2px solid black" } }>
                                    <tr>
                                          <th scope="col" className='col-1'>#</th>
                                          <th scope="col" className='col-3'>Name</th>
                                          <th scope="col" className='col-1'></th>
                                          <th scope="col" className='col-1'>On class</th>
                                          <th scope="col" className='col-1'>Late</th>
                                          <th scope="col" className='col-1'>Absent</th>
                                          <th scope="col" className='col-3'>Note</th>
                                    </tr>
                              </thead>
                        </table>
                        <div className="overflow-auto w-100" style={ { height: '75%', boxSizing: "border-box" } }>
                              <table className="table table-hover m-0 w-100">
                                    <tbody id="student_list">
                                    </tbody>
                              </table>
                        </div>
                        <div className="d-flex align-items-center justify-content-center mt-4">
                              <p className="m-0">Class note:</p>
                              <textarea disabled className={ `mx-3 note_for_class` } style={ { width: '400px', minHeight: '50px', resize: 'none' } }></textarea>
                        </div>
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-auto mb-3">
                        <button type="button" className={ `${ styles.back } mx-3` } onClick={ () => { window.location.href = "/Classes/" + props.className; } }>Back</button>
                  </div>
            </div>
      );
}

const AdminAttendance = () =>
{
      const className = useParams().name;
      const session = useParams().session;

      const render = useRef(false);

      const Navigate = useNavigate();

      useEffect(() =>
      {
            if (localStorage.getItem('userType') === null || localStorage.getItem('id') === null)
                  Navigate("/");
            if (!render.current)
            {
                  const target = ReactDOM.createRoot(document.getElementById('attendance'));
                  target.render(<Supervisor className={ className } sessionNumber={ session } />);
                  render.current = true;
            }
      })

      return (
            <div className={ `h-100 ${ styles.page } d-flex align-items-center justify-content-center` }>
                  <div className={ `d-flex flex-column align-items-center ${ styles.board }` } id="attendance">
                  </div>
            </div>
      );
}

export default AdminAttendance;