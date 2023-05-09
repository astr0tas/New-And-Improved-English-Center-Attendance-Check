import '../../General/General.css';
import ChangeStudent from './ChangeStudent.jsx';
import NewClassForStudent from './NewClassForStudent.jsx';
import { useState, useEffect} from 'react';
import axios from 'axios';
import image from './img.png';


export default function ShowInfo(props)
{
      const [changeStudent, setChangeStudent] = useState(false);
      const [newClass, setNewClass] = useState(false);
      const [classOfStudent, setClassOfStudent] = useState([]);
      const [curr_class, setCurr] = useState("");
      const [classDetail, setClassDetail] = useState(false);
      var entity = props.entity;
      var url = "http://localhost:3030/admin/" + entity.ID + "/classes"
      useEffect(() => {
            axios.get(url)
            .then(
                  res =>
                  {
                        setClassOfStudent(res.data);
                  }
            )
            .catch(error => console.log(error))
      },[])
      

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
                                          classOfStudent.map((sClass) => (<ClassOfStudent ID = {entity.ID} sClass={ sClass } curClass={ () => setCurr(sClass.Name) } onDetail={ () => setClassDetail(true) } />))
                                    }
                              </div>

                              <div className='button-container' style={ { width: "70%", left: "15%" } }>
                                    <button class="cus-btn btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ () => props.offShow() }>BACK</button>
                                    <button class="cus-btn btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ () => setChangeStudent(true) }>CHANGE INFO</button>
                                    <button class="cus-btn btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ () => setNewClass(true) }>INSERT TO NEW CLASS</button>
                              </div>
                        </div>
                        {
                              changeStudent && <ChangeStudent entity={ entity } offChange={ () => setChangeStudent(false) } />
                        }
                        {
                              newClass && <NewClassForStudent entity={ entity } offNewClass={ () => setNewClass(false) } />
                        }
                  </div>
                  {/* {
                        classDetail && <ClassDetail offShow = {()=>setClassDetail(false)} className={curr_class}/>
                  } */}
            </>
      )
}

function ClassOfStudent(props)
{
      // function handleClick(className)
      // {
      //       props.curClass(className);
      //       props.onDetail();
      // }
      const [value, setValue] = useState({absent: 0, late: 0, onClass: 0});

      useEffect(()=>{
            axios.get('http://localhost:3030/admin/student/stats/' + props.ID + '/' + props.sClass.Name)
            .then(
                  res =>{
                        setValue({
                              absent: res.data[0]["count"],
                              late: res.data[1]["count"],
                              onClass: res.data[2]["count"]
                            });                            
                  }
            )
            .catch(
                  error => console.log(error)
            )
      },[])

      return (
            <div className='entity-container' style={ { height: '25%' } }>
                  <p>{ props.sClass.Name }</p>
                  <p>{ props.sClass.Current_number_of_student }/{ props.sClass.Max_number_of_students }</p>
                  <p>{ props.sClass.Start_date }</p>
                  <p>{ props.sClass.End_date }</p>
                  <div
                        style = {{
                              position: 'absolute',
                              top: "-10%",
                              left: "68%",
                              height: "85%",
                              width: "10%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "left",
                              zIndex: "100px"
                        }}
                  >
                        <p style = {{fontSize: '16px', fontWeight: "700", color: 'red', width: '100%', textAlign: "left"}}>Absent: { value.absent}</p>
                        <p style = {{fontSize: '16px', fontWeight: "700", width: '100%', textAlign: "left"}}>Late: { value.late }</p>
                        <p style = {{fontSize: '16px', fontWeight: "700", width: '100%', textAlign: "left"}}>On Class: { value.onClass }</p>
                  </div>
                  <button class="btn btn-primary" onClick={ () => { window.location.href = `/Classes/${ props.sClass.Name }`; } }>Details</button>
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