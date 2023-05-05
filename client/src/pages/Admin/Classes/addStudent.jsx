import { useNavigate, useParams } from 'react-router-dom';
import styles from './addStudent.module.css';
import $ from 'jquery';
import axios from 'axios';
import { useState } from 'react';
import { formatDate } from '../../../tools/date_formatting';

const AddStudent = () =>
{
      const className = useParams().name;

      const Navigate = useNavigate();

      const [ID, setID] = useState(null);

      let timerId;

      const searchName = (e) =>
      {
            clearTimeout(timerId);
            timerId = setTimeout(() =>
            {
                  axios.post("http://localhost:3030/admin/searchByName", { params: { name: e.target.value } })
                        .then(res =>
                        {
                              if (res.data.length === 1)
                              {
                                    $('#inputSSN').prop("disabled", true);
                                    $('#inputName').val(res.data[0].name);
                                    $('#inputSSN').val(res.data[0].SSN);
                                    $('#inputPhone').val(res.data[0].phone);
                                    $('#inputEmail').val(res.data[0].email);
                                    $('#inputBirthday').val(formatDate(res.data[0].birthday));
                                    $('#inputBirthplace').val(res.data[0].birthplace);
                                    $('#inputAddress').val(res.data[0].address);
                                    setID(res.data[0].ID);
                              }
                              else
                              {
                                    $('#inputSSN').prop("disabled", false);
                                    $('#inputSSN').val("");
                                    $('#inputPhone').val("");
                                    $('#inputEmail').val("");
                                    $('#inputBirthday').val("");
                                    $('#inputBirthplace').val("");
                                    $('#inputAddress').val("");
                                    setID(null);
                              }
                        })
                        .catch(err => { console.log(err); })
            }, 500);
      }

      const searchSSN = (e) =>
      {
            clearTimeout(timerId);
            timerId = setTimeout(() =>
            {
                  axios.post("http://localhost:3030/admin/searchBySSN", { params: { ssn: e.target.value } })
                        .then(res =>
                        {
                              if (res.data.length === 1)
                              {
                                    $('#inputName').val(res.data[0].name);
                                    $('#inputSSN').val(res.data[0].SSN);
                                    $('#inputPhone').val(res.data[0].phone);
                                    $('#inputEmail').val(res.data[0].email);
                                    $('#inputBirthday').val(formatDate(res.data[0].birthday));
                                    $('#inputBirthplace').val(res.data[0].birthplace);
                                    $('#inputAddress').val(res.data[0].address);
                                    setID(res.data[0].ID);
                              }
                              else
                              {
                                    $('#inputName').val("");
                                    $('#inputPhone').val("");
                                    $('#inputEmail').val("");
                                    $('#inputBirthday').val("");
                                    $('#inputBirthplace').val("");
                                    $('#inputAddress').val("");
                                    setID(null);
                              }
                        })
                        .catch(err => { console.log(err); })
            }, 500);
      }

      const addStudent = () =>
      {
            if (ID === null)
                  $(`.${ styles.empty }`).css("display", "flex");
            else
            {
                  axios.post("http://localhost:3030/admin/addStudentToClass", { params: { id: ID, name: className } })
                        .then(res =>
                        {
                              console.log(res);
                              Navigate(-1);
                        })
                        .catch(err => { console.log(err); })
            }
      }

      return (
            <div className={ `h-100 ${ styles.page } d-flex align-items-center justify-content-center` }>
                  <div className={ `${ styles.empty } flex-column align-items-center` }>
                        <h1 className='mt-5'>No student selected!</h1>
                        <button className={ `mt-auto mb-5 ${ styles.okay } mx-3` } onClick={ () => { $(`.${ styles.empty }`).css("display", "none"); } }>OKAY</button>
                  </div>
                  <div className={ `d-flex flex-column align-items-center ${ styles.board }` }>
                        <h1 className='mt-4'>Add a new student to class</h1>
                        <div className='flex-grow-1 w-100 d-flex flex-column align-items-center'>
                              <div className='row w-75 my-5'>
                                    <div className="col-2 d-flex align-items-center">
                                          <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Name:</p>
                                    </div>
                                    <div className="col-10 text-start">
                                          <input type='text' className={ `w-100 ${ styles.input }` } onChange={ searchName } id="inputName"></input>
                                    </div>
                              </div>
                              <div className='row w-75 my-5'>
                                    <div className="col-2 d-flex align-items-center">
                                          <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>SSN:</p>
                                    </div>
                                    <div className="col-10 text-start">
                                          <input type='text' className={ `w-100 ${ styles.input }` } id="inputSSN" onChange={ searchSSN }></input>
                                    </div>
                              </div>
                              <div className='row w-75 my-5'>
                                    <div className="col-6">
                                          <div className='row'>
                                                <div className='col-4 d-flex align-items-center'>
                                                      <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Phone:</p>
                                                </div>
                                                <div className='col-8 text-start'>
                                                      <input type='text' className={ `w-100 ${ styles.input }` } disabled id="inputPhone"></input>
                                                </div>
                                          </div>
                                    </div>
                                    <div className="col-6">
                                          <div className='row'>
                                                <div className='col-4 d-flex align-items-center justify-content-center'>
                                                      <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Email:</p>
                                                </div>
                                                <div className='col-8 text-start'>
                                                      <input type='text' className={ `w-100 ${ styles.input }` } disabled id="inputEmail"></input>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                              <div className='row w-75 my-5'>
                                    <div className="col-6">
                                          <div className='row'>
                                                <div className='col-4 d-flex align-items-center'>
                                                      <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Birthday:</p>
                                                </div>
                                                <div className='col-8 text-start'>
                                                      <input type='date' className={ `w-100 ${ styles.input }` } disabled id="inputBirthday"></input>
                                                </div>
                                          </div>
                                    </div>
                                    <div className="col-6">
                                          <div className='row'>
                                                <div className='col-4 d-flex align-items-center justify-content-center'>
                                                      <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Birthplace:</p>
                                                </div>
                                                <div className='col-8 text-start'>
                                                      <input type='text' className={ `w-100 ${ styles.input }` } disabled id="inputBirthplace"></input>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                              <div className='row w-75 my-5'>
                                    <div className="col-2 d-flex align-items-center">
                                          <p style={ { fontSize: '1.5rem', marginBottom: '0' } }>Address:</p>
                                    </div>
                                    <div className="col-10 text-start">
                                          <input type='text' className={ `w-100 ${ styles.input }` } disabled id="inputAddress"></input>
                                    </div>
                              </div>
                        </div>
                        <div className='mt-auto mb-4'>
                              <button className={ `mx-3 ${ styles.back }` } onClick={ () => { Navigate(-1); } }>Back</button>
                              <button className={ `mx-3 ${ styles.confirm }` } onClick={ addStudent }>Confirm</button>
                        </div>
                  </div>
            </div >
      );
}

export default AddStudent;