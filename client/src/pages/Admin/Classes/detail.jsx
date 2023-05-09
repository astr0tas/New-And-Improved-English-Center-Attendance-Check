import styles from "./detail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import $ from 'jquery';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { format, detailFormat } from "../../../tools/date_formatting";

const ListStudentHeader = () =>
{
      return (
            <tr>
                  <th scope="col" className='col-1'>#</th>
                  <th scope="col" className='col-3'>Name</th>
                  <th scope="col" className='col-2'>Phone number</th>
                  <th scope="col" className='col-2'>Email</th>
                  <th scope="col" className='col-2'>Action</th>
            </tr>
      );
}

const ListStudent = (props) =>
{
      const deleteStudent = () =>
      {
            axios.post('http://localhost:3030/admin/deleteStudent', { params: { class: props.class, id: props.id } })
                  .then(res =>
                  {
                        console.log(res);
                        window.location.reload();
                  })
                  .catch(err => { console.log(err); });
      }

      return (
            <tr>
                  <th scope="row" className='col-1'>{ props.number }</th>
                  <td className='col-3'>{ props.name }</td>
                  <td className='col-2'>{ props.phone }</td>
                  <td className='col-2'>{ props.email }</td>
                  <td className='col-2'>
                        {/* <button className={ `${ styles.action }` }><a href="#">Detail</a></button> */ }
                        <button className={ `${ styles.delete } ms-3` } onClick={ deleteStudent }>Delete</button>
                  </td>
            </tr> 
      );
}

const ListSessionHeader = () =>
{
      return (
            <tr>
                  <th scope="col" className='col-1'>Sessions</th>
                  <th scope="col" className='col-3'>Time</th>
                  <th scope="col" className='col-2'>Room</th>
                  {/* <th scope="col" className='col-2'>Action</th> */}
            </tr>
      );
}

const ListSession = (props) =>
{
      const date = detailFormat(props.date);

      return (
            <tr>
                  <th scope="row" className='col-1'>Session { props.session }</th>
                  <td className='col-3'><AiOutlineClockCircle /> { date }: { props.start } - { props.end }</td>
                  <td className='col-2'>Room { props.room }</td>
                  {/* <td className='col-2'><button className={ `${ styles.action }` }><a href={ `./${ props.name }/${ props.session }` }>Detail</a></button></td> */}
            </tr>
      );
}

const AdminClassDetail = () =>
{
      const Navigate = useNavigate();

      const className = useParams().name;

      const render = useRef(false);
      const [flag, setFlag] = useState(true);
      const [period, setPeriod] = useState({});
      const [students, setStudents] = useState({});
      const [status, setStatus] = useState({});
      const [sessions, setSessions] = useState();
      const [defaultSessions, setDefaultSessions] = useState();

      useEffect(() =>
      {
            if (localStorage.getItem('userType') === null || localStorage.getItem('id') === null)
                  Navigate("/");
            if (!render.current)
            {
                  async function fetchData()
                  {
                        axios.get('http://localhost:3030/TS/myClasses/detail', { params: { className: className } })
                              .then(res =>
                              {
                                    async function asignData()
                                    {
                                          setPeriod({
                                                start: format(res.data.Start_date),
                                                end: format(res.data.End_date)
                                          });
                                          if (res.data.Status === 1)
                                                setStatus(
                                                      {
                                                            status_str: "Active",
                                                            style: "#0B8700"
                                                      }
                                                )
                                          else
                                          {
                                                setStatus(
                                                      {
                                                            status_str: "Inactive",
                                                            style: "#FF0000"
                                                      }
                                                )
                                                $('#addAStudent').prop("disabled", true);
                                                $('#addASession').prop("disabled", true);
                                                $('#changeClassInfo').prop("disabled", true);
                                          }
                                          setDefaultSessions(res.data.Initial_number_of_sessions);
                                          await axios.get('http://localhost:3030/TS/myClasses/getCurrentStudent', {
                                                params: {
                                                      className: className
                                                },
                                          })
                                                .then(res1 =>
                                                {
                                                      setStudents(
                                                            {
                                                                  current: res1.data.Current_stu,
                                                                  max: res.data.Max_number_of_students
                                                            }
                                                      );
                                                })
                                                .catch(error => console.log(error));
                                          await axios.get('http://localhost:3030/TS/myClasses/getSessions', {
                                                params: {
                                                      className: className
                                                },
                                          })
                                                .then(res1 =>
                                                {
                                                      setSessions(res1.data.session);
                                                })
                                                .catch(error => console.log(error));
                                    }
                                    asignData();
                              })
                              .catch(error => console.log(error));
                  }
                  fetchData();
                  if (flag)
                  {
                        $("#table_head").empty();
                        $("#table_body").empty();
                        $(".sessionList").css("background-color", "#a2a1a1");
                        $(".sessionList").css("color", "black");
                        $(".studentList").css("background-color", "#4E7EF8");
                        $(".studentList").css("color", "white");
                        let target = ReactDOM.createRoot(document.getElementById('table_head'));
                        target.render(<ListStudentHeader />);
                        axios.get('http://localhost:3030/TS/myClasses/getStudentList', {
                              params: {
                                    className: className
                              },
                        })
                              .then(res =>
                              {
                                    let temp = [];
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<ListStudent key={ i } number={ i + 1 } name={ res.data[i].name } phone={ res.data[i].phone } email={ res.data[i].email } id={ res.data[i].ID } class={ className } />);
                                    target = ReactDOM.createRoot(document.getElementById('table_body'));
                                    target.render(<>{ temp }</>);
                              })
                              .catch(error => console.log(error));
                  }
                  else
                  {
                        $("#table_head").empty();
                        $("#table_body").empty();
                        $(".studentList").css("background-color", "#a2a1a1");
                        $(".studentList").css("color", "black");
                        $(".sessionList").css("background-color", "#4E7EF8");
                        $(".sessionList").css("color", "white");
                        let target = ReactDOM.createRoot(document.getElementById('table_head'));
                        target.render(<ListSessionHeader />);
                        axios.get('http://localhost:3030/TS/myClasses/getSessionList', {
                              params: {
                                    className: className
                              },
                        })
                              .then(res =>
                              {
                                    // console.log(res);
                                    let temp = [];
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<ListSession key={ i } name={ className } session={ res.data[i].Session_number } date={ res.data[i].Session_date } room={ res.data[i].Classroom_ID } start={ res.data[i].Start_hour } end={ res.data[i].End_hour } />);
                                    target = ReactDOM.createRoot(document.getElementById('table_body'));
                                    target.render(<>{ temp }</>);
                              })
                              .catch(error => console.log(error));
                  }
                  render.current = true;
            }
      }, [flag]);

      const deactivateClass = () =>
      {
            axios.post('http://localhost:3030/admin/deactivateClass', { params: { name: className } })
                  .then(res => { console.log(res); window.location.reload(); })
                  .catch(err => { console.log(err); });
      }

      const activateClass = () =>
      {
            axios.post('http://localhost:3030/admin/activateClass', { params: { name: className } })
                  .then(res => { console.log(res); window.location.reload(); })
                  .catch(err => { console.log(err); });
      }

      const addStudent = () =>
      {
            if (students.current === students.max)
                  $(`.${ styles.addStudent }`).css("display", "flex");
            else
                  Navigate(`./addStudent`);
      }

      return (
            <div className={ `h-100 ${ styles.page } d-flex align-items-center justify-content-center` }>
                  <div className={ `d-flex flex-column align-items-center ${ styles.board }` }>
                        <div className="mt-3">
                              <div className="d-flex align-items-center">
                                    <h1>{ className }</h1>
                                    { status.status_str === "Active" && <button className={ `ms-3` } style={ {
                                          border: "1px solid black", borderRadius: "10px", backgroundColor: "red", color: "white"
                                    } } onClick={ () => { $(`.${ styles.deactivateclass }`).css("display", "flex"); } }>Deactivate</button> }
                                    { status.status_str === "Inactive" && <button className={ `ms-3` } style={ {
                                          border: "1px solid black", borderRadius: "10px", backgroundColor: "#4E7EF8", color: "white"
                                    } } onClick={ activateClass }>Activate</button> }
                              </div>
                              <p>Period: { period.start } - { period.end }</p>
                              <p>Status: <span style={ { color: status.style } }>{ status.status_str }</span></p>
                              <p>Number of student: { students.current }/{ students.max }</p>
                              <p>Number of sessions: { sessions }/{ defaultSessions }</p>
                        </div>
                        <div className="w-25 d-flex justify-content-around align-items-center">
                              <button className={ `${ styles.button } mx-3 studentList` } onClick={ () => { render.current = false; setFlag(true); } }>Students</button>
                              <button className={ `${ styles.button } mx-3 sessionList` } onClick={ () => { render.current = false; setFlag(false); } }>Sessions</button>
                        </div>
                        <table className="table table-hover mb-1 mt-3" style={ { width: '80%' } }>
                              <thead style={ { borderBottom: "2px solid black" } } id="table_head">
                              </thead>
                        </table>
                        <div className={ `overflow-auto` } style={ { width: '80%', height: '55%' } }>
                              <table className="table table-hover w-100">
                                    <tbody id="table_body">
                                    </tbody>
                              </table>
                        </div>
                        <div className="mt-auto mb-4">
                              <button className={ ` ${ styles.back } mx-3` } onClick={ () => { Navigate("/Classes"); } }>Back</button>
                              { flag && <button className={ ` ${ styles.back } mx-3` } id="addAStudent" onClick={ addStudent }>Add a student</button> }
                              { !flag && <button className={ ` ${ styles.back } mx-3` } id="addASession" onClick={ () => { window.location.href = `./${ className }/addSession`; } }>Add a session</button> }
                        </div>
                  </div>
                  <div className={ `${ styles.addStudent } flex-column align-items-center` }>
                        <h1 className='mt-5'>The class is full!</h1>
                        <button className={ `mt-auto mb-5 ${ styles.okay }` } onClick={ () => { $(`.${ styles.addStudent }`).css("display", "none"); } }>OKAY</button>
                  </div>
                  <div className={ `${ styles.deactivateclass } flex-column align-items-center` }>
                        <h1 className='mt-5'>Are you sure you want to deactivate this class?</h1>
                        <div className="mt-auto mb-5">
                              <button className={ `${ styles.okay } mx-3` } onClick={ () => { $(`.${ styles.deactivateclass }`).css("display", "none"); } }>NO</button>
                              <button className={ `${ styles.deactivate } mx-3` } onClick={ () => { $(`.${ styles.deactivateclass }`).css("display", "none"); deactivateClass(); } }>YES</button>
                        </div>
                  </div>
            </div>
      );
}

export default AdminClassDetail;