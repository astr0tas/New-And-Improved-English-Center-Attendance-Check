import $ from 'jquery';
import { useEffect, useRef, useState } from 'react';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr'
import styles from "./MyClass.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { format } from '../../tools/date_formatting';


// className, start_date, end_date, status, currentStudent, maxStudent
const Card = (props) =>
{

      const start = format(props.start_date);
      const end = format(props.end_date);

      let status_str, style;

      if (props.status === 1)
      {
            status_str = "Active";
            style = "#0B8700";
      }
      else
      {
            status_str = "Inactive";
            style = "#FF0000";
      }

      // return $("<div>")
      //       .addClass("d-flex")
      //       .addClass("flex-column")
      //       .addClass("align-items-center")
      //       .addClass("h-75")
      //       .css("width", "20%")
      //       .css("background-color", "#EDEDED")
      //       .css("border", "2px solid black")
      //       .css("border-radius", "20px")
      //       .append(
      //             $("<img>")
      //                   .addClass("w-100")
      //                   .addClass("h-25")
      //                   .attr("src", "https://img.freepik.com/free-vector/flat-design-english-school-illustration_23-2149491248.jpg")
      //                   .attr("alt", "image")
      //                   .css("border-top-right-radius", "20px")
      //                   .css("border-top-left-radius", "20px")
      //       )
      //       .append(
      //             $("<div>")
      //                   .addClass("d-flex")
      //                   .addClass("flex-column")
      //                   .addClass("align-items-center")
      //                   .addClass("h-75")
      //                   .append($("<h1>").text(className))
      //                   .append($("<h5>").text("Period: " + start + " - " + end))
      //                   .append($("<h5>").text("Status: ").append($("<span>").text(status_str).css("color", style)))
      //                   .append($("<h5>").text("Students: " + currentStudent + "/" + maxStudent))
      //                   .append($("<a>").addClass("btn").addClass("btn-primary").addClass("mt-auto").addClass("mb-5").attr("href", "./MyClasses/" + className).text("Class Detail"))
      //       );

      return (
            <div className="d-flex flex-column align-items-center h-75" style={ { width: '20%', backgroundColor: "#EDEDED", border: "2px solid black", borderRadius: "20px" } }>
                  <img className="w-100 h-25" src="https://img.freepik.com/free-vector/flat-design-english-school-illustration_23-2149491248.jpg" alt="image" style={ {
                        borderTopRightRadius: "20px",
                        borderTopLeftRadius: "20px"
                  } } />
                  <div className="d-flex flex-column align-items-center h-75">
                        <h1>{ props.class_name }</h1>
                        <p>Period: { start } - { end }</p>
                        <p>Status:  <span style={ { color: style } }>{ status_str }</span> </p>
                        <p>Students: { props.currentStudent }/{ props.maxStudent }</p>
                        <a href={ `./MyClasses/${ props.class_name }` } className="btn btn-primary mt-auto mb-5">Class Detail</a>
                  </div>
            </div >
      );
}

export const MyClasses = () =>
{
      const render = useRef(false);
      const [offset, setOffset] = useState(0);
      const [flag, setFlag] = useState(false);
      const Navigate = useNavigate();

      function cookieExists(cookieName)
      {
            const cookies = document.cookie.split('; ');
            for (let i = 0; i < cookies.length; i++)
            {
                  const cookie = cookies[i].split('=');
                  if (cookie[0] === cookieName)
                  {
                        return true;
                  }
            }
            return false;
      }

      useEffect(() =>
      {
            if (!cookieExists('userType') || !cookieExists('id'))
                  Navigate("/");
            if (!render.current)
            {
                  console.log(offset);
                  console.log(flag);
                  $('[name="my_classes"]').css("fill", "#0083FD");
                  $('[name="my_classes"]').css("color", "#0083FD");
                  $('[name="my_classes"]').css("background-color", "#c7edff");
                  axios.get('http://localhost:3030/TS/myClasses', {
                        withCredentials: true,
                        params: {
                              offset: offset
                        },
                  })
                        .then(res =>
                        {
                              console.log(res);
                              if (res.data.length !== 0)
                              {
                                    async function createCard()
                                    {
                                          setFlag(false);
                                          let temp = [];
                                          // className, start_date, end_date, status, currentStudent, maxStudent
                                          for (let i = 0; i < res.data.length; i++)
                                          {
                                                await axios.get('http://localhost:3030/TS/myClasses/getCurrentStudent', {
                                                      params: {
                                                            className: res.data[i].Name
                                                      },
                                                })
                                                      .then(res1 =>
                                                      {
                                                            temp.push(<Card key={ i } class_name={ res.data[i].Name } start_date={ res.data[i].Start_date } end_date={ res.data[i].End_date } status={ res.data[i].Status } currentStudent={ res1.data.Current_stu } maxStudent={ res.data[i].Max_number_of_students } />);
                                                      })
                                                      .catch(error => console.log(error));
                                          }
                                          const target = ReactDOM.createRoot(document.getElementById('class_list'));
                                          target.render(<>{ temp }</>);
                                    }
                                    createCard();
                              }
                              else setFlag(true);
                        })
                        .catch(error => console.log(error));
                  render.current = true;
            }
      }, [offset]);

      return (
            <div className={ `h-100 ${ styles.page }` }>
                  <div className="w-100 d-flex justify-content-around align-items-center" id="class_list" style={ { height: '90%' } }>
                  </div>
                  <div className="w-100 d-flex justify-content-center alig-items-center" style={ { height: '10%' } }>
                        <GrFormPrevious className={ `${ styles.page_button }` } onClick={ () => { if (offset !== 0) { setOffset(offset - 3); render.current = false; $("#class_list").empty(); } } } />
                        <GrFormNext className={ `${ styles.page_button }` } onClick={ () => { if (!flag) { setOffset(offset + 3); render.current = false; $("#class_list").empty(); } } } />
                  </div>
            </div>
      );
}