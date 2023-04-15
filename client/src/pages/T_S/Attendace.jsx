import { useNavigate, useParams } from "react-router-dom";
import styles from './Attendace.module.css';
import ReactDOM from 'react-dom/client';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { cookieExists, getCookieValue } from "../../tools/cookies";
import { AiOutlineClockCircle } from 'react-icons/ai';
import { detailFormat } from "../../tools/date_formatting";

const StudentList = () =>
{
      return (
            <tr>

            </tr>
      );
}

const Teacher = (props) =>
{
      const render = useRef(false);

      const [room, setRoom] = useState();
      const [time, setTime] = useState({});
      const [status, setStatus] = useState({});
      const [makeup, setMakeup] = useState(null);
      const [teacher, setTeacher] = useState({});
      const [supervisor, setSupervisor] = useState({});

      useEffect(() =>
      {
            if (!render.current)
            {
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
                  axios.get('http://localhost:3030/TS/attendance/teacher', {
                        params: {
                              sessionNumber: props.sessionNumber,
                              className: props.className
                        }
                  })
                        .then(res =>
                        {
                              // console.log(res);
                              setTeacher({ id: res.data.ID, name: res.data.name });
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
                              // console.log(res);
                              setSupervisor({ id: res.data.ID, name: res.data.name });
                        })
                        .catch(error => console.log(error));
                  render.current = true;
            }
      });


      return (
            <>
                  <div className={ `w-100 d-flex` } style={ { height: '40%' } }>
                        <div className="h-100 d-flex flex-column justify-content-center align-items-center" style={ { width: '33%' } }>
                              <h1>Session { props.sessionNumber }</h1>
                              <p className="d-flex align-items-center"><AiOutlineClockCircle />{ time.date }: { time.start } - { time.end }</p>
                              <p>Room: { room }</p>
                              <p>Status: <span style={ { color: status.color } }>{ status.status }</span></p>
                              { makeup && <p>Make up for session { makeup }</p> }
                        </div>
                        <div className="h-100 d-flex flex-column justify-content-center align-items-center" style={ { width: '33%' } }>
                              <h3 className="mb-3">Teacher: { teacher.name }</h3>
                              <img alt="avatar" src="https://cdn3.iconfinder.com/data/icons/avatar-91/130/avatar__girl__teacher__female__women-512.png" style={ { height: '70%', width: '70%' } }></img>
                              <button className={ `mt-3 ${ styles.detail }` }>Detail</button>
                        </div >
                        <div className="h-100 d-flex flex-column justify-content-center align-items-center" style={ { width: '33%' } }>
                              <h3 className="mb-3">Supervisor: { supervisor.name }</h3>
                              <img alt="avatar" src="https://www.shareicon.net/data/512x512/2016/07/26/801997_user_512x512.png" style={ { height: '70%', width: '70%' } }></img>
                              <button className={ `mt-3 ${ styles.detail }` }>Detail</button>
                        </div>
                  </div>
                  <div className={ `w-100` } style={ { height: '50%' } } >
                        <table className="table table-hover m-0">
                              <thead>
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
                        <table className="table table-hover m-0 overflow-auto" style={ { height: '80%' } }>
                              <tbody id="student_list">
                              </tbody>
                        </table>
                        <div className="d-flex align-items-center justify-content-center">
                              <p className="m-0">Class note:</p>
                              <textarea className="mx-3" style={ { width: '400px', minHeight: '60px', resize: 'none' } }></textarea>
                        </div>
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-4">
                        <button className={ `${ styles.back } mx-3` } onClick={ () => { window.location.href = "/MyClasses/" + props.className; } }>Back</button>
                        <button className={ `${ styles.confirm } mx-3` }>Confirm</button>
                  </div>
            </>
      );
}

const Supervisor = (props) =>
{
      const render = useRef(false);

      useEffect(() =>
      {
            if (!render.current)
            {
                  // axios.get()
                  //       .then(res =>
                  //       {

                  //       })
                  //       .catch(error => console.log(error));
                  render.current = true;
            }
      });

      return (
            <>
                  <div className={ `w-100` } style={ { height: '40%' } }>

                  </div>
                  <div className={ `w-100` } style={ { height: '50%' } }>

                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-4">
                        <button className={ `${ styles.back } mx-3` } onClick={ () => { window.location.href = "/MyClasses/" + props.className; } }>Back</button>
                        <button className={ `${ styles.confirm } mx-3` }>Confirm</button>
                  </div>
            </>
      );
}

const Attendance = () =>
{
      const className = useParams().name;
      const session = useParams().session;

      const render = useRef(false);

      const Navigate = useNavigate();

      useEffect(() =>
      {
            if (!cookieExists('userType') || !cookieExists('id'))
                  Navigate("/");
            if (!render.current)
            {
                  const target = ReactDOM.createRoot(document.getElementById('attendance'));
                  if (getCookieValue("id").includes("TEACHER"))
                        target.render(<Teacher className={ className } sessionNumber={ session } />);
                  else
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

export default Attendance;