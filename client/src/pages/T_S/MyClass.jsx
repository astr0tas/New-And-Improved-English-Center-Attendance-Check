import axios from 'axios';
import $ from 'jquery';
import { useEffect, useRef } from 'react';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr'
import styles from "./MyClass.module.css";

const Card = (clasName, period, status, currentStudent, maxStudent) =>
{
      return (
            <div className="d-flex flex-column align-items-center h-75" style={ { width: '25%', backgroundColor: "#EDEDED", border: "2px solid black", borderRadius: "20px" } }>
                  <img className="w-100 h-25" src="https://img.freepik.com/free-vector/flat-design-english-school-illustration_23-2149491248.jpg" alt="image" style={ {
                        borderTopRightRadius: "20px",
                        borderTopLeftRadius: "20px"
                  } } />
                  <div className="d-flex flex-column align-items-center h-75">
                        <h1>{ clasName }</h1>
                        <p>Period: { period.start } - { period.end }</p>
                        <p>Status: { status }</p>
                        <p>Students:{ currentStudent }/{ maxStudent }</p>
                        <a href="#" className="btn btn-primary mt-auto mb-5">Class Detail</a>
                  </div>
            </div>
      );
}

export const MyClasses = () =>
{
      const render = useRef(false);
      useEffect(() =>
      {
            if (!render.current)
            {

                  render.current = true;
            }
      });

      return (
            <div className={ `h-100 ${ styles.page }` } style={ { marginLeft: '350px', width: 'calc(100% - 350px)' } }>
                  <div className="w-100 d-flex justify-content-around align-items-center" style={ { height: '90%' } }>
                        <div className="d-flex flex-column align-items-center h-75" style={ { width: '25%', backgroundColor: "#EDEDED", border: "2px solid black", borderRadius: "20px" } }>
                              <img className="w-100 h-25" src="https://img.freepik.com/free-vector/flat-design-english-school-illustration_23-2149491248.jpg" alt="" style={ {
                                    borderTopRightRadius: "20px",
                                    borderTopLeftRadius: "20px"
                              } } />
                              <div className="d-flex flex-column align-items-center h-75">
                                    <h1>CLASS NAME</h1>
                                    <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="./MyClasses/ClassDetail" className={ `mt-auto mb-5  ${ styles.detail }` }>Class Detail</a>
                              </div>
                        </div>
                        <div className="d-flex flex-column align-items-center h-75" style={ { width: '25%', backgroundColor: "#EDEDED", border: "2px solid black", borderRadius: "20px" } }>
                              <img className="w-100 h-25" src="https://img.freepik.com/free-vector/flat-design-english-school-illustration_23-2149491248.jpg" alt="" style={ {
                                    borderTopRightRadius: "20px",
                                    borderTopLeftRadius: "20px"
                              } } />
                              <div className="d-flex flex-column align-items-center h-75">
                                    <h1>CLASS NAME</h1>
                                    <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="./MyClasses/ClassDetail" className={ `mt-auto mb-5  ${ styles.detail }` }>Class Detail</a>
                              </div>
                        </div>
                        <div className="d-flex flex-column align-items-center h-75" style={ { width: '25%', backgroundColor: "#EDEDED", border: "2px solid black", borderRadius: "20px" } }>
                              <img className="w-100 h-25" src="https://img.freepik.com/free-vector/flat-design-english-school-illustration_23-2149491248.jpg" alt="" style={ {
                                    borderTopRightRadius: "20px",
                                    borderTopLeftRadius: "20px"
                              } } />
                              <div className="d-flex flex-column align-items-center h-75">
                                    <h1>CLASS NAME</h1>
                                    <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="./MyClasses/ClassDetail" className={ `mt-auto mb-5 ${ styles.detail }` }>Class Detail</a>
                              </div>
                        </div>
                        {/* <div className="card h-75" style={ { width: '20%', backgroundColor: "#EDEDED", border: "2px solid black", borderRadius: "20px" } }>
                              <img className="card-img-top" src="https://img.freepik.com/free-vector/flat-design-english-school-illustration_23-2149491248.jpg" alt="image" style={ {
                                    borderTopRightRadius: "20px",
                                    borderTopLeftRadius: "20px"
                              } } />
                              <div className="card-body">
                                    <h1 className="card-title">CLASS NAME</h1>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="#" className="btn btn-primary" style={ { marginTop: '75%' } }>Class Detail</a>
                              </div>
                        </div>
                        <div className="card h-75" style={ { width: '20%', backgroundColor: "#EDEDED", border: "2px solid black", borderRadius: "20px" } }>
                              <img className="card-img-top" src="https://img.freepik.com/free-vector/flat-design-english-school-illustration_23-2149491248.jpg" alt="image" style={ {
                                    borderTopRightRadius: "20px",
                                    borderTopLeftRadius: "20px"
                              } } />
                              <div className="card-body">
                                    <h1 className="card-title">CLASS NAME</h1>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="#" className="btn btn-primary" style={ { marginTop: '75%' } }>Class Detail</a>
                              </div>
                        </div>
                        <div className="card h-75" style={ { width: '20%', backgroundColor: "#EDEDED", border: "2px solid black", borderRadius: "20px" } }>
                              <img className="card-img-top" src="https://img.freepik.com/free-vector/flat-design-english-school-illustration_23-2149491248.jpg" alt="image" style={ {
                                    borderTopRightRadius: "20px",
                                    borderTopLeftRadius: "20px"
                              } } />
                              <div className="card-body">
                                    <h1 className="card-title">CLASS NAME</h1>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="#" className="btn btn-primary" style={ { marginTop: '75%' } }>Class Detail</a>
                              </div>
                        </div> */}
                  </div>
                  <div className="w-100 d-flex justify-content-center alig-items-center" style={ { height: '10%' } }>
                        <GrFormPrevious className={ `${ styles.page_button }` } />
                        <GrFormNext className={ `${ styles.page_button }` } />
                  </div>
            </div>
      );
}