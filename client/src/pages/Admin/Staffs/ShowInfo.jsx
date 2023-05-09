import '../../General/General.css';
import ChangeStaff from './ChangeStaff.jsx';
import NewClassForStaff from './NewClassForStaff.jsx';
import ClassDetail from '../Classes/ClassDetail.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import image from './img.png';


export default function ShowInfo(props)
{
      const [changeStaff, setChangeStaff] = useState(false);
      const [newClass, setNewClass] = useState(false);
      const [classOfStaff, setClassOfStaff] = useState([]);
      const [curr_class, setCurr] = useState("");
      const [classDetail, setClassDetail] = useState(false);
      var entity = props.entity;

      useEffect(() =>
      {
            axios.get('http://localhost:3030/TS/myClasses', {
                  params: {
                        offset: 0,
                        id: entity.ID
                  }
            })
                  .then(
                        res =>
                        {
                              res.data.map((item) =>
                              {
                                    item.Start_date = new Date(item.Start_date).toLocaleDateString('en-GB')
                                    item.End_date = new Date(item.End_date).toLocaleDateString('en-GB')
                              }
                              )

                              setClassOfStaff(res.data);
                        }

                  )
                  .catch(error => console.log(error))
      }, [])

      return (
            <>
                  <div className='main-container'>
                        <div className='entity-box'>
                              <div className='detail-container'
                                    style={ {
                                          position: 'absolute',
                                          top: '2%',
                                          left: '10%',
                                          width: '60%',
                                          height: '30%',
                                          borderRight: '3px black solid',
                                    } }
                              >
                                    <Detail field="Name" value={ entity.name } />
                                    <Detail field="ID" value={ entity.ID } />
                                    <Detail field="Phone" value={ entity.phone } />
                                    <Detail field="Email" value={ entity.email } />
                                    <Detail field="Address" value={ entity.address } />
                                    <Detail field="BirthDate" value={ entity.birthday } />
                                    <Detail field="BirthPlace" value={ entity.birthplace } />
                              </div>

                              <div className='avatar-container' style={ { position: 'relative', left: '72.5%' } }>
                                    <img src={ image } alt="" />
                              </div>

                              <div className='entity-list-container'
                                    style={ { position: 'absolute', top: '40%', height: '45%' } }
                              >
                                    {
                                          classOfStaff.map((sClass) => (<ClassOfStaff sClass={ sClass } curClass={ () => setCurr(sClass.Name) } onDetail={ () => setClassDetail(true) } />))
                                    }
                              </div>

                              <div className='button-container'>
                                    {/* <div className='button-container' style = {{width: "70%", left: "15%"}}> */ }
                                    <button class="cus-btn btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ () => props.offShow() }>BACK</button>
                                    <button class="cus-btn btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ () => setChangeStaff(true) }>CHANGE INFO</button>
                                    {/* <button class="cus-btn btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={() => setNewClass(true)}>INSERT TO NEW CLASS</button> */ }
                              </div>
                        </div>
                        {
                              changeStaff && <ChangeStaff entity={ entity } offChange={ () => setChangeStaff(false) } />
                        }

                        {
                              newClass && <NewClassForStaff entity={ entity } offNewClass={ () => setNewClass(false) } />
                        }
                  </div>
                  {
                        classDetail && <ClassDetail offShow={ () => setClassDetail(false) } className={ curr_class } />
                  }
            </>
      )
}

function ClassOfStaff(props)
{
      function handleClick(className)
      {
            props.curClass(className);
            props.onDetail();
      }
      return (
            <div className='entity-container' style={ { height: '25%' } }>
                  <p>{ props.sClass.Name }</p>
                  <p>{ props.sClass.Current_number_of_student }/{ props.sClass.Max_number_of_students }</p>
                  <p>{ props.sClass.Start_date }</p>
                  <p>{ props.sClass.End_date }</p>
                  <p>{ props.sClass.Status === 1 ? "Active" : "Disactive" }</p>
                  <button class="btn btn-primary" onClick={ () => { window.location.href = `/Classes/${ props.sClass.Name }` } }>Details</button>
            </div>
      )
}

function Detail(props)
{
      return (
            <div className="detail" style={ { fontSize: '19px', top: '-3%' } }>
                  <p style={ { position: 'absolute', right: '70%' } }>{ props.field } :</p>
                  <p style={ { position: 'absolute', left: '40%' } }>{ props.value }</p>
            </div>
      )
}