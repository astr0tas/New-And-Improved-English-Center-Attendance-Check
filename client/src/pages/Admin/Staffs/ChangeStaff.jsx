import '../../General/General.css';
import Noti from '../../General/Noti.jsx';
import React, { useState } from 'react';
import image from './img.png';
import axios from 'axios';

export default function ChangeStaff(props)
{
      const [staffClasses, setClasses] = useState("");
      const [showListClass, setShowListClass] = useState(false);
      const [showNoti, setShow] = useState(false);
      const [curr_option, setCurr] = useState("");
      var entity = props.entity;

      const [name, setName] = useState("");
      const [phone, setPhone] = useState("");
      const [email, setEmail] = useState("");
      const [birthday, setBirthday] = useState(null);
      const [birthplace, setBirthplace] = useState("");
      const [address, setAddress] = useState("");

      function handleConfirm(){
            console.log("hello");
            if (name !== "" && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]+/.test(name)){
                  setCurr({type: "wrong value", value: "name"});
                  setShow(true);
                  return;
            }

            if (phone !== "" && !(/^[0-9]+$/.test(phone))){
                  setCurr({type: "wrong value", value: "phone"});
                  setShow(true);
                  return;
            }

            axios.post("http://localhost:3030/admin/staff/updateInfo/" + entity.ID, {
                  id: entity.ID,
                  name: name,
                  phone: phone,
                  email: email,
                  birthday: birthday,
                  birthplace: birthplace,
                  address: address,
                  classes: staffClasses
            })
            .then(
                  () =>{
                        console.log(entity.ID);
                  }
            )
            .catch(
                  error => console.log(error)
            )

            setCurr("change");
            setShow(true);
      }

      function handleBack()
      {
            props.offChange()
      }

      return (
            <>
                  <div className='entity-box'>
                        {
                              showListClass && <ClassList entity={ entity } offClassList={ () => setShowListClass(false) } showNoti={ () => setShow(true) } changeClass={ (value) => setClasses(value) } />
                        }
                        {
                              showNoti && <Noti offNoti={ () => setShow(false) } option={curr_option} role = {entity.ID.includes("TEACHER")? "Teacher" : "Supervisor"}/>
                        }

                        <div className='avatar-container'>
                              <img src={ image } alt="" />
                        </div>

                        <>
                              <label for="file-input" class="img-btn">Add a picture</label>
                              <input type="file" id="file-input" accept="image/*" multiple style={ { display: 'none' } } />
                        </>

                        <div class="info-container">
                              <div class="input-group">
                                    <span class="input-group-text" id="basic-addon1" >Name</span>
                                    <input id='name' type="text" pattern = "[a-zA-ZÀ-ỹ ]+" class="form-control" aria-describedby="basic-addon1" maxlength="100" value={ name } onChange={ (event) => setName(event.target.value) } placeholder = {entity.name}/>
                              </div>
                        </div>

                        <div className='info-container'>
                              <div class="input-group" style={ { width: '40%' } }>
                                    <span class="input-group-text" id="basic-addon1" >Phone</span>
                                    <input id='phone' type="text" pattern="[0-9]+" class="form-control" aria-describedby="basic-addon1" maxlength = "10" value={ phone } onChange={ (event) => setPhone(event.target.value) } placeholder={ entity.phone } />
                              </div>

                              <div class="input-group" style={ { width: '55%' } }>
                                    <span class="input-group-text" id="basic-addon1" >Email</span>
                                    <input id='email' type="email" class="form-control" aria-describedby="basic-addon1" maxlength="50" value={ email } onChange={ (event) => setEmail(event.target.value) } placeholder={ entity.email } />
                              </div>
                        </div>

                        <div class="info-container">
                              <div class="input-group" style={ { width: '40%' } }>
                                    <span class="input-group-text" id="basic-addon1" >Birthday</span>
                                    <input id='birthday' type="date" class="form-control" aria-describedby="basic-addon1" style={ { display: 'flex', alignItems: 'center' } } value={ birthday } onChange={ (event) => setBirthday(event.target.value) }  placeholder={ entity.birthday } />
                              </div>

                              <div class="input-group" style={ { width: '55%' } }>
                                    <span class="input-group-text" id="basic-addon1" >Birthplace</span>
                                    <input id='birthplace' type="text" class="form-control" aria-describedby="basic-addon1" value={ birthplace } onChange={ (event) => setBirthplace(event.target.value) } placeholder={ entity.birthplace } />
                              </div>
                        </div>

                        <div class="info-container">
                              <div class="input-group">
                                    <span class="input-group-text" id="basic-addon1" >Address</span>
                                    <input id='address' type="text" class="form-control" aria-describedby="basic-addon1" value={ address } onChange={ (event) => setAddress(event.target.value) } placeholder={ entity.address } />
                              </div>
                        </div>

                        {/* <div class="info-container" style={ { background: '#BFBFBF' } }>
                              <div class="input-group">
                                    <span class="input-group-text" id="basic-addon1" style={ { borderTopRightRadius: '0px', borderBottomRightRadius: '0px' } }>Class</span>
                              </div>
                              <div style={ { position: 'absolute', left: '9.3%', height: '60%', top: '20%' } }>
                                    { staffClasses }
                              </div>

                              <button className="btn btn-primary add-btn" onClick={ () => setShowListClass(true) }>Change</button>
                        </div> */}

                        <div className='button-container' >
                              <button class="btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ handleBack }>BACK</button>
                              <button class="btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ handleConfirm }>CONFIRM</button>
                        </div>
                  </div>

            </>
      )
}


function ClassList(props)
{
      const [classes, setClasses] = useState([]);

      const [searchInput, setSearchInput] = useState("");
      function handleSearch(event)
      {
            event.preventDefault();
            setSearchInput(event.target.value);
      };

      axios.get('http://localhost:3030/TS/myClasses', {
                  params: {
                        offset: 0,
                        id: props.entity.ID
                  }
            })
            .then(
                  res => {
                        res.data.map((item) =>{
                                    item.Start_date = new Date(item.Start_date).toLocaleDateString('en-GB')
                                    item.End_date = new Date(item.End_date).toLocaleDateString('en-GB')
                              }
                        )

                        setClasses(res.data);
                  }

            )
            .catch(error => console.log(error))

      const [notClasses, setNotClasses] = useState([]);
      axios.get("http://localhost:3030/admin/" + props.entity.ID + "/notclasses")
      .then(
            res => setNotClasses(res.data)
      )
      .catch(
            error => console.log(error)
      )

      const [changeClass, showChangeClass] = useState(false);
      const [curr_class, setCurrClass] = useState(false);

      function handleBack()
      {
            if (!changeClass) props.offClassList();
            else showChangeClass(!changeClass);
      }

      function handleConfirm()
      {
            props.offClassList();
            props.showNoti();
      }


      function handleReplace(newClass)
      {
            axios.post("http://localhost:3030/admin/" + props.entity.ID + "/classes", {
                  id: props.entity.ID,
                  old: curr_class.Name,
                  new: newClass.Name
            })
                  .then(
                        res => setNotClasses(res.data)
                  )
                  .catch(
                        error => console.log(error)
                  )

            showChangeClass(false)
      }

      function handleChange(className)
      {
            showChangeClass(true);
            setCurrClass(className);
      }

      return (
            <div className="class-box">
                  {
                        !changeClass &&
                        <>
                              <p style={ { position: 'absolute', fontSize: '24px', fontWeight: '700', left: '50px', top: '2%' } }>
                                    Class in charge
                              </p>
                        </>
                  }
                  <div className='search-container'>
                        <input id='search' type='text' onChange={ handleSearch } value={ searchInput } />
                        {/*onclick={()=>document.getElementById("search").value = ""}*/ }
                        <svg style={ { position: 'absolute', left: '83%', cursor: 'pointer' } } width="25" height="25" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 1.5C4.13438 1.5 1 4.63438 1 8.5C1 12.3656 4.13438 15.5 8 15.5C11.8656 15.5 15 12.3656 15 8.5C15 4.63438 11.8656 1.5 8 1.5ZM10.5844 11.1594L9.55313 11.1547L8 9.30313L6.44844 11.1531L5.41563 11.1578C5.34688 11.1578 5.29063 11.1031 5.29063 11.0328C5.29063 11.0031 5.30156 10.975 5.32031 10.9516L7.35313 8.52969L5.32031 6.10938C5.30143 6.08647 5.29096 6.0578 5.29063 6.02812C5.29063 5.95937 5.34688 5.90312 5.41563 5.90312L6.44844 5.90781L8 7.75938L9.55156 5.90938L10.5828 5.90469C10.6516 5.90469 10.7078 5.95937 10.7078 6.02969C10.7078 6.05937 10.6969 6.0875 10.6781 6.11094L8.64844 8.53125L10.6797 10.9531C10.6984 10.9766 10.7094 11.0047 10.7094 11.0344C10.7094 11.1031 10.6531 11.1594 10.5844 11.1594Z" fill="black" fill-opacity="0.25" />
                        </svg>
                        <svg style={ { position: 'absolute', left: '91%', cursor: 'pointer' } } width="26" height="26" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15.1022 13.6188L10.4647 8.98129C11.1844 8.05093 11.5737 6.91343 11.5737 5.71701C11.5737 4.28486 11.0147 2.94201 10.004 1.92951C8.9933 0.917006 7.64688 0.359863 6.21652 0.359863C4.78616 0.359863 3.43973 0.918792 2.42902 1.92951C1.41652 2.94022 0.859375 4.28486 0.859375 5.71701C0.859375 7.14736 1.4183 8.49379 2.42902 9.50451C3.43973 10.517 4.78438 11.0741 6.21652 11.0741C7.41295 11.0741 8.54866 10.6849 9.47902 9.96701L14.1165 14.6027C14.1301 14.6163 14.1463 14.6271 14.164 14.6345C14.1818 14.6418 14.2009 14.6456 14.2201 14.6456C14.2393 14.6456 14.2584 14.6418 14.2761 14.6345C14.2939 14.6271 14.3101 14.6163 14.3237 14.6027L15.1022 13.8259C15.1158 13.8123 15.1266 13.7962 15.134 13.7784C15.1414 13.7606 15.1452 13.7416 15.1452 13.7224C15.1452 13.7031 15.1414 13.6841 15.134 13.6663C15.1266 13.6485 15.1158 13.6324 15.1022 13.6188ZM9.04509 8.54558C8.28795 9.30094 7.28438 9.71701 6.21652 9.71701C5.14866 9.71701 4.14509 9.30094 3.38795 8.54558C2.63259 7.78844 2.21652 6.78486 2.21652 5.71701C2.21652 4.64915 2.63259 3.64379 3.38795 2.88843C4.14509 2.13308 5.14866 1.71701 6.21652 1.71701C7.28438 1.71701 8.28973 2.13129 9.04509 2.88843C9.80045 3.64558 10.2165 4.64915 10.2165 5.71701C10.2165 6.78486 9.80045 7.79022 9.04509 8.54558Z" fill="black" fill-opacity="0.45" />
                        </svg>
                  </div>


                  <div className='entity-list-container'>
                        <p style={ { position: 'absolute', fontSize: '30px', width: '40%', left: '30%' } }>There is no class</p>
                        {
                              changeClass
                                    ?
                                    notClasses.filter((_class) =>
                                    {
                                          return _class.Name.toLowerCase().match(searchInput.toLowerCase());
                                    }).map((i_class, index) => (
                                          <ClassDetails
                                                key={ index }
                                                class={ i_class }
                                                option="full"
                                                showChange={ (newClass) => handleReplace(i_class, newClass) }
                                          />
                                    ))

                                    :
                                    classes.filter((_class) =>
                                    {
                                          return _class.Name.toLowerCase().match(searchInput.toLowerCase());
                                    })
                                          .map((i_class, index) => (
                                                <ClassDetails
                                                      class={ i_class }
                                                      showChange={ () => handleChange(i_class) }
                                                      oldClass={ () => setCurrClass(i_class) }
                                                />
                                          ))
                        }
                  </div>

                  <div className='button-container' >
                        <button class="btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ handleBack }>BACK</button>
                        <button class="btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ handleConfirm }>CONFIRM</button>
                  </div>

            </div>
      )
}

function ClassDetails(props)
{
      var lclass = props.class;
      function handleActive()
      {
            if (props.option === "full")
            {
                  props.showChange(lclass);
                  return
            }

            props.oldClass();
            props.showChange();
      }
      return (
            <div className='entity-container'>
                  <p>{ lclass.Name }</p>
                  {
                        props.option === "full" &&
                        <>
                              <p>{ lclass.Current_number_of_staff }</p>
                              <p>{ lclass.Max_number_of_staffs }</p>
                        </>
                  }
                  <button class="btn btn-primary" style={ { marginRight: '120px' } }>Details</button>
                  <button class={ "btn btn-primary" } onClick={ handleActive }>{ props.option === "full" ? "Replace" : "Select" }</button>
            </div>
      )
}