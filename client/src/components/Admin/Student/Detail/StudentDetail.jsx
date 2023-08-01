import { useContext, useEffect, useState, useRef } from 'react';
import styles from './StudentDetail.module.css';
import request from '../../../../tools/request';
import { domain } from '../../../../tools/domain';
import { NavLink, useParams } from 'react-router-dom';
import { DMY } from '../../../../tools/dateFormat';
import { context } from '../../../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import StudentEdit from '../Edit/StudentEdit';
import Stats from '../Stats/Stats';

const Class = (props) =>
{
      const { setListType } = useContext(context);
      return (
            <tr>
                  <td className='text-center align-middle'>{ props.i }</td>
                  <td className='text-center align-middle'>{ props.name }</td>
                  <td className='text-center align-middle'>{ DMY(props.start) }</td>
                  <td className='text-center align-middle'>{ DMY(props.end) }</td>
                  <td className='text-center align-middle' style={ {
                        color: props.status === 1 ? 'red' : (
                              props.status === 2 ? '#128400' : (props.status === 0 ? 'gray' : 'black'))
                  } }>{ props.status === 1 ? 'Deactivated' : (
                        props.status === 2 ? 'Active' : (props.status === 0 ? 'Finished' : 'N/A')
                  ) }</td>
                  <td className='d-flex align-items-center justify-content-center flex-column flex-sm-row'>
                        <NavLink to={ `/class-list/detail/${ props.name }` }>
                              <button className='btn btn-sm btn-secondary mx-sm-2 my-2 my-sm-0' onClick={ () =>
                              {
                                    setListType(0);
                              } }>Detail</button>
                        </NavLink>
                        <button className='btn btn-sm btn-primary mx-sm-2 my-2 my-sm-0' onClick={ () =>
                        {
                              props.setChosenClassName(props.name);
                              props.setStatsPopUp(true);
                        } }>Stats</button>
                  </td>
            </tr>
      )
}

const StudentClass = (props) =>
{
      useEffect(() =>
      {
            request.post(`http://${ domain }/admin/getStudentClass`, { params: { id: props.id, className: props.searchClass } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        const temp = [];
                        if (res.status === 200)
                              for (let i = 0; i < res.data.length; i++)
                                    temp.push(<Class key={ i } i={ i + 1 } name={ res.data[i].name }
                                          start={ res.data[i].start_date } end={ res.data[i].end_date } status={ res.data[i].status }
                                          setStatsPopUp={ props.setStatsPopUp } setChosenClassName={ props.setChosenClassName } />);
                        props.setClasses(temp);
                  })
                  .catch(err => console.log(err));

            // eslint-disable-next-line
      }, [props.searchClass, props.id]);

      return (
            <>
                  { props.classes }
            </>
      )
}

const StudentDetail = () =>
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

      const [searchClass, setSearchClass] = useState('');
      const [classes, setClasses] = useState([]);
      let timer;

      const [render, setRender] = useState(false);
      const [editStudentPopUp, setEditStudentPopUp] = useState(false);
      const [statsPopUp, setStatsPopUp] = useState(false);
      const [chosenClassName, setChosenClassName] = useState(null);
      const containerRef = useRef(null);

      useEffect(() =>
      {
            request.post(`http://${ domain }/admin/studentInfo`, { params: { id: id } }, { headers: { 'Content-Type': 'application/json' } })
                  .then(res =>
                  {
                        document.title = `Student ${ res.data.name }`;

                        setName(res.data.name);
                        setSSN(res.data.SSN);
                        setPhone(res.data.phone);
                        setEmail(res.data.email);
                        setAddress(res.data.address);
                        setBirthday(res.data.birthday);
                        setBirthplace(res.data.birthplace);
                        setImage(res.data.image === null ? require('../../../../images/profile.png') : `http://${ domain }/image/student/${ res.data.image }`);
                  })
                  .catch(err => console.log(err));
      }, [id, render]);

      return (
            <div className="w-100 d-flex flex-column overflow-auto flex-grow-1 mt-2 mb-2 align-items-center" ref={ containerRef }>
                  <div className="d-flex justify-content-md-around flex-column flex-md-row mt-3 align-items-center w-100">
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
                  <div className='mt-3 ps-2 position-relative w-100'>
                        <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                        <input type='text' placeholder='Find class' className={ `ps-4` } onChange={ (e) =>
                        {
                              clearTimeout(timer);
                              timer = setTimeout(() => setSearchClass(e.target.value), 1000);
                        } }></input>
                  </div>
                  <div className='flex-grow-1 mb-3 mt-2 overflow-auto px-2 w-100' style={ { minHeight: classes.length !== 0 ? '200px' : '40px' } }>
                        <table className="table table-hover table-info mx-auto w-100">
                              <thead style={ { position: "sticky", top: "0" } }>
                                    <tr>
                                          <th scope="col" className='col-1 text-center align-middle'>#</th>
                                          <th scope="col" className='col-4 text-center align-middle'>Name</th>
                                          <th scope="col" className='col-2 text-center align-middle'>Start date</th>
                                          <th scope="col" className='col-2 text-center align-middle'>End date</th>
                                          <th scope="col" className='col-1 text-center align-middle'>Status</th>
                                          <th scope="col" className='col-2 text-center align-middle'>Action</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    <StudentClass id={ id } searchClass={ searchClass } classes={ classes } setClasses={ setClasses } setChosenClassName={ setChosenClassName } setStatsPopUp={ setStatsPopUp } />
                              </tbody>
                        </table>
                  </div>
                  <div className='d-flex align-items-center w-100 justify-content-center mb-3 w-100'>
                        <NavLink to={ '/student-list' }>
                              <button className='btn btn-secondary me-3 me-sm-4'>Back</button>
                        </NavLink>
                        <button className='btn btn-primary ms-3 ms-sm-4' onClick={ () => setEditStudentPopUp(true) }>Change info</button>
                  </div>
                  <StudentEdit showPopUp={ editStudentPopUp } setShowPopUp={ setEditStudentPopUp } render={ render } setRender={ setRender } containerRef={ containerRef } id={ id } />
                  <Stats containerRef={ containerRef } chosenClassName={ chosenClassName } showPopUp={ statsPopUp } setShowPopUp={ setStatsPopUp } id={ id } />
            </div>
      )
}

export default StudentDetail;