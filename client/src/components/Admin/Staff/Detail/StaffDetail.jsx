import styles from './StaffDetail.module.css';
import axios from 'axios';
import { domain } from '../../../../tools/domain';
import { useNavigate, useParams } from 'react-router-dom';
import { DMY } from '../../../../tools/dateFormat';
import { useEffect, useState } from 'react';

const Class = (props) =>
{
      return (
            <tr>
                  <td className='text-center'>{ props.i }</td>
                  <td className='text-center'>{ props.name }</td>
                  <td className='text-center'>{ DMY(props.start) }</td>
                  <td className='text-center'>{ DMY(props.end) }</td>
                  <td className='text-center' style={ { color: props.status === 0 ? 'red' : '#128400' } }>{ props.status === 0 ? 'Deactivated' : 'Active' }</td>
                  <td className='text-center'>
                        <button className='btn btn-sm btn-primary' onClick={ () => props.Navigate(`/class-list/${ props.name }`) }>Detail</button>
                  </td>
            </tr>
      )
}

const StaffDetail = () =>
{
      const [name, setName] = useState("N/A");
      const [ssn, setSSN] = useState("N/A");
      const [phone, setPhone] = useState("N/A");
      const [email, setEmail] = useState("N/A");
      const [address, setAddress] = useState("N/A");
      const [birthday, setBirthday] = useState("N/A");
      const [birthplace, setBirthplace] = useState("N/A");
      const [image, setImage] = useState("");

      const id = useParams().id;

      const [classes, setClasses] = useState([]);

      const Navigate = useNavigate();

      useEffect(() =>
      {
            axios.post(`http://${ domain }/admin/staffInfo`, { params: { id: id } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        document.title = `${ res.data.type === 1 ? 'Teacher' : 'Supervisor' } ${ res.data.name }`;

                        setName(res.data.name);
                        setSSN(res.data.ssn);
                        setPhone(res.data.phone);
                        setEmail(res.data.email);
                        setAddress(res.data.address);
                        setBirthday(res.data.birthday);
                        setBirthplace(res.data.birthplace);
                        setImage(res.data.image === null ? require('../../../../images/profile.png') : `http://${ domain }/image/employee/${ res.data.image }`);

                        if (res.data.type === 1)
                        {
                              axios.post(`http://${ domain }/admin/getTeacherClass`, { params: { id: id } }, { headers: { 'Content-Type': 'application/json' } })
                                    .then(res =>
                                    {
                                          const temp = [];
                                          for (let i = 0; i < res.data.length; i++)
                                                temp.push(<Class key={ i } i={ i + 1 } Navigate={ Navigate } name={ res.data[i].name }
                                                      start={ res.data[i].start_date } end={ res.data[i].end_date } status={ res.data[i].Status } />);
                                          setClasses(temp);
                                    })
                                    .catch(err => console.log(err));
                        }
                        else
                        {
                              axios.post(`http://${ domain }/admin/getSupervisorClass`, { params: { id: id } }, { headers: { 'Content-Type': 'application/json' } })
                                    .then(res =>
                                    {
                                          const temp = [];
                                          for (let i = 0; i < res.data.length; i++)
                                                temp.push(<Class key={ i } i={ i + 1 } Navigate={ Navigate } name={ res.data[i].name }
                                                      start={ res.data[i].start_date } end={ res.data[i].end_date } status={ res.data[i].Status } />);
                                          setClasses(temp);
                                    })
                                    .catch(err => console.log(err));
                        }
                  })
                  .catch(err => console.log(err));
      }, [Navigate, id]);

      return (
            <div className="w-100 d-flex flex-column overflow-auto flex-grow-1 mt-2 mb-2">
                  <div className="d-flex justify-content-md-around flex-column flex-md-row mt-3 align-items-center">
                        <div className="d-flex flex-column mb-3 mt-2">
                              <img src={ image } alt='' className={ `${ styles.image }` }></img>
                        </div>
                        <div className="d-flex flex-column">
                              <div className="d-flex align-items-center my-md-2 my-1 justify-content-center justify-content-md-start">
                                    <strong>Name:&nbsp;</strong>
                                    <p className='mb-0'>{ name }</p>
                              </div>
                              <div className="d-flex align-items-center my-md-2 my-1 justify-content-center justify-content-md-start">
                                    <strong>SSN:&nbsp;</strong>
                                    <p className='mb-0'>{ ssn }</p>
                              </div>
                              <div className="d-flex align-items-center my-md-2 my-1 justify-content-center justify-content-md-start">
                                    <strong>Phone:&nbsp;</strong>
                                    <p className='mb-0'>{ phone }</p>
                              </div>
                              <div className="d-flex align-items-center my-md-2 my-1 justify-content-center justify-content-md-start">
                                    <strong>Email:&nbsp;</strong>
                                    <p className='mb-0'>{ email }</p>
                              </div>
                              <div className="d-flex align-items-center my-md-2 my-1 justify-content-center justify-content-md-start">
                                    <strong>Birthday:&nbsp;</strong>
                                    <p className='mb-0'>{ DMY(birthday) }</p>
                              </div>
                              <div className="d-flex align-items-center my-md-2 my-1 justify-content-center justify-content-md-start">
                                    <strong>Birthplace:&nbsp;</strong>
                                    <p className='mb-0'>{ birthplace }</p>
                              </div>
                              <div className="d-flex align-items-center my-md-2 my-1 justify-content-center justify-content-md-start">
                                    <strong>Address:&nbsp;</strong>
                                    <p className='mb-0'>{ address }</p>
                              </div>
                        </div>
                  </div>
                  <div className='flex-grow-1 mb-3 mt-2 overflow-auto' style={ { minHeight: classes.length !== 0 ? '200px' : 'unset' } }>
                        <table className="table table-hover table-info mx-auto" style={ { width: '95%' } }>
                              <thead style={ { position: "sticky", top: "0" } }>
                                    <tr>
                                          <th scope="col" className='col-1 text-center'>#</th>
                                          <th scope="col" className='col-4 text-center'>Name</th>
                                          <th scope="col" className='col-2 text-center'>Start date</th>
                                          <th scope="col" className='col-2 text-center'>End date</th>
                                          <th scope="col" className='col-1 text-center'>Status</th>
                                          <th scope="col" className='col-2 text-center'>Action</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    { classes }
                              </tbody>
                        </table>
                  </div>
                  <div className='d-flex align-items-center w-100 justify-content-center mb-3'>
                        <button className='btn btn-secondary me-3 me-sm-4' onClick={ () => Navigate('/staff-list') }>Back</button>
                        <button className='btn btn-primary ms-3 ms-sm-4' onClick={ () => Navigate('./edit') }>Change info</button>
                  </div>
            </div>
      )
}

export default StaffDetail;