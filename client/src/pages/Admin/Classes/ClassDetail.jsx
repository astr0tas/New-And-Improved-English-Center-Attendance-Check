import styles from "./ClassDetail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { format, detailFormat } from "../../../tools/date_formatting";
import $ from 'jquery';
import { AiOutlineClockCircle } from 'react-icons/ai';

import '../../General/General.css';


const ListStudentHeader = () =>
{
      return (
            <tr>
                  <th scope="col" className='col-1'>#</th>
                  <th scope="col" className='col-3'>Name</th>
                  <th scope="col" className='col-2'>Phone number</th>
                  <th scope="col" className='col-2'>Email</th>
                  {/* <th scope="col" className='col-2'>Action</th> */}
            </tr>
      );
}

const ListStudent = (props) =>
{
      return (
            <tr>
                  <th scope="row" className='col-1'>{ props.number }</th>
                  <td className='col-3'>{ props.name }</td>
                  <td className='col-2'>{ props.phone }</td>
                  <td className='col-2'>{ props.email }</td>
                  {/* <td className='col-2'><button className={ `${ styles.action }` }><a href="#">Detail</a></button></td> */}
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
                  <th scope="col" className='col-2'>Action</th>
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
                  <td className='col-2'><button className={ `${ styles.action }` }><a href={ `./${ props.name }/${ props.session }` }>Check attendance</a></button></td>
            </tr>
      );
}

const ClassDetail = (props) =>
{
      const Navigate = useNavigate();

      const className = props.className;

      const render = useRef(false);
      const [flag, setFlag] = useState(true);
      const [period, setPeriod] = useState({});
      const [students, setStudents] = useState({});
      const [status, setStatus] = useState({});
      const [sessions, setSessions] = useState();
      const [defaultSessions, setDefaultSessions] = useState();

      useEffect(() =>
      {
            if (localStorage.getItem('userType') === null || localStorage.getItem('id')===null)
                  Navigate("/");
            if (!render.current)
            {
                  async function fetchData()
                  {
                        axios.get('http://localhost:3030/TS/myClasses/detail', { params: { className: className } })
                              .then(res =>
                              {
                                    // console.log(res);
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
                                                setStatus(
                                                      {
                                                            status_str: "Inactive",
                                                            style: "#FF0000"
                                                      }
                                                )
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
                                    // console.log(res);
                                    let temp = [];
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<ListStudent key={ i } number={ i + 1 } name={ res.data[i].name } phone={ res.data[i].phone } email={ res.data[i].email } />);
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

      return (
            <div className={ `h-100 ${ styles.page } d-flex align-items-center justify-content-center` }>
                  <div className={ `d-flex flex-column align-items-center ${ styles.board }` }>
                        <div className="mt-3">
                              <h1>{ className }</h1>
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
                              </table>``
                        </div>
                        <div className = 'button-container' 
                              style = {{
                                    position: 'absolute',
                                    height: '5%',
                                    width: '20%',
                                    top: '88%',
                                    left: '40%',
                                    fontSize: '22px'
                              }}
                        >
                              <button class="btn btn-primary cus-btn" onClick={ ()=>{ props.offShow() } }
                                    style = {{
                                          position:'relative',
                                          height: '100%',
                                          width: '100%'
                                    }}
                              >BACK</button>
                        </div>
                  </div>
            </div>
      );
}

export default ClassDetail;