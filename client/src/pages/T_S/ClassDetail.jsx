import styles from "./ClassDetail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import $ from 'jquery';

const ListStudent = () =>
{
      return (
            <>
            </>
      );
}

const ListSession = () =>
{
      return (
            <>
            </>
      );
}

const ClassDetail = () =>
{
      const Navigate = useNavigate();

      const className = useParams().name;

      const render = useRef(false);
      const [flag, setFlag] = useState(true);
      const [period, setPeriod] = useState({});
      const [students, setStudents] = useState({});
      const [status, setStatus] = useState({});
      const [sessions, setSessions] = useState({});

      useEffect(() =>
      {
            if (!render.current)
            {
                  axios.get('http://localhost:3030/TS/myClasses/detail', { params: { className: className } })
                        .then(res =>
                        {
                              console.log(res.data);
                              setPeriod({
                                    start: new Date(res.data.Start_date).toLocaleDateString('en-GB', {
                                          day: 'numeric',
                                          month: 'numeric',
                                          year: 'numeric',
                                    }), end: new Date(res.data.End_date).toLocaleDateString('en-GB', {
                                          day: 'numeric',
                                          month: 'numeric',
                                          year: 'numeric',
                                    })
                              });
                              setStudents(
                                    {
                                          current: res.data.Current_stu,
                                          max: res.data.Max_stu
                                    }
                              );
                              if (res.data.Status === 2)
                                    setStatus(
                                          {
                                                status_str: "Active",
                                                style: "#0B8700"
                                          }
                                    )
                              else if (res.data.Status === 1)
                                    setStatus(
                                          {
                                                status_str: "No session available",
                                                style: "#A8A8A8"
                                          }
                                    )
                              else
                                    setStatus(
                                          {
                                                status_str: "Inactive",
                                                style: "#FF0000"
                                          }
                                    )
                        })
                        .catch(error => console.log(error));
                  if (flag)
                  {
                        $(".sessionList").css("background-color", "#a2a1a1");
                        $(".sessionList").css("color", "black");
                        $(".studentList").css("background-color", "#4E7EF8");
                        $(".studentList").css("color", "white");
                  }
                  else
                  {
                        $(".studentList").css("background-color", "#a2a1a1");
                        $(".studentList").css("color", "black");
                        $(".sessionList").css("background-color", "#4E7EF8");
                        $(".sessionList").css("color", "white");
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
                              <p>Number of sessions: { null }/24</p>
                        </div>
                        <div className="w-25 d-flex justify-content-around align-items-center">
                              <button className={ `${ styles.button } mx-3 studentList` } onClick={ () => { render.current = false; setFlag(true); } }>Students</button>
                              <button className={ `${ styles.button } mx-3 sessionList` } onClick={ () => { render.current = false; setFlag(false); } }>Sessions</button>
                        </div>
                        <div className={ `overflow-auto mt-2 SSList` }>

                        </div>
                        <button className={ `mt-auto mb-3 ${ styles.back }` } onClick={ () => { Navigate(-1); } }>Back</button>
                  </div>
            </div>
      );
}

export default ClassDetail;