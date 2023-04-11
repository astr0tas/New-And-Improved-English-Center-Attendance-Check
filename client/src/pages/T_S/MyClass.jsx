import $ from 'jquery';
import { useEffect, useRef, useState } from 'react';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr'
import styles from "./MyClass.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Card = (className, start_date, end_date, status, currentStudent, maxStudent) =>
{

      const start = new Date(start_date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
      });
      const end = new Date(end_date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
      });

      let status_str, style;

      if (status === 2)
      {
            status_str = "Active";
            style = "#0B8700";
      }
      else if (status === 1)
      {
            status_str = "No session available";
            style = "#A8A8A8";
      }
      else
      {
            status_str = "Inactive";
            style = "#FF0000";
      }

      return $("<div>")
            .addClass("d-flex")
            .addClass("flex-column")
            .addClass("align-items-center")
            .addClass("h-75")
            .css("width", "20%")
            .css("background-color", "#EDEDED")
            .css("border", "2px solid black")
            .css("border-radius", "20px")
            .append(
                  $("<img>")
                        .addClass("w-100")
                        .addClass("h-25")
                        .attr("src", "https://img.freepik.com/free-vector/flat-design-english-school-illustration_23-2149491248.jpg")
                        .attr("alt", "image")
                        .css("border-top-right-radius", "20px")
                        .css("border-top-left-radius", "20px")
            )
            .append(
                  $("<div>")
                        .addClass("d-flex")
                        .addClass("flex-column")
                        .addClass("align-items-center")
                        .addClass("h-75")
                        .append($("<h1>").text(className))
                        .append($("<h5>").text("Period: " + start + " - " + end))
                        .append($("<h5>").text("Status: ").append($("<span>").text(status_str).css("color", style)))
                        .append($("<h5>").text("Students: " + currentStudent + "/" + maxStudent))
                        .append($("<a>").addClass("btn").addClass("btn-primary").addClass("mt-auto").addClass("mb-5").attr("href", "./MyClasses/" + className).text("Class Detail"))
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
                              if (res.data.length !== 0)
                              {
                                    setFlag(false);
                                    $("#class_list").append(Card(res.data[0].Name, res.data[0].Start_date, res.data[0].End_date, res.data[0].Status, res.data[0].Current_stu, res.data[0].Max_stu));
                                    $("#class_list").append(Card(res.data[1].Name, res.data[1].Start_date, res.data[1].End_date, res.data[1].Status, res.data[1].Current_stu, res.data[1].Max_stu));
                                    $("#class_list").append(Card(res.data[2].Name, res.data[2].Start_date, res.data[2].End_date, res.data[2].Status, res.data[2].Current_stu, res.data[2].Max_stu));
                              }
                              else setFlag(true);
                        })
                        .catch(error => console.log(error));
                  render.current = true;
            }
      }, [offset]);

      return (
            <div className={ `h-100 ${ styles.page }` } style={ { marginLeft: '300px', width: 'calc(100% - 300px)' } }>
                  <div className="w-100 d-flex justify-content-around align-items-center" id="class_list" style={ { height: '90%' } }>
                  </div>
                  <div className="w-100 d-flex justify-content-center alig-items-center" style={ { height: '10%' } }>
                        <GrFormPrevious className={ `${ styles.page_button }` } onClick={ () => { if (offset !== 0) { setOffset(offset - 3); render.current = false; $("#class_list").empty(); } } } />
                        <GrFormNext className={ `${ styles.page_button }` } onClick={ () => { if (!flag) { setOffset(offset + 3); render.current = false; $("#class_list").empty(); } } } />
                  </div>
            </div>
      );
}