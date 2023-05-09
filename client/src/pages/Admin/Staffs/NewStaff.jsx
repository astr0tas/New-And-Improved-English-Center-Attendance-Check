import '../../General/General.css';
import Noti from '../../General/Noti.jsx';
import image from './img.png';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

var id = "";
var classAdd = [];

export default function NewStaff(props)
{   
    useEffect(()=>{
        axios.get("http://localhost:3030/admin/newID/" + props.role)
        .then(res =>
        {
            id = res.data["newID('" + props.role + "')"];
        })
        .catch(error => console.log(error));
    },[])
    
    
    const [staffClasses, setClasses] = useState("");
    const [showListClass, setShowListClass] = useState(false);
    const [showNoti, setShow] = useState(false);
    const [curr_option, setCurr] = useState("");

    function handleAdd()
    {
        classAdd = [];
        setShowListClass(true);
    }

    function handleBack()
    {
        props.offAdd();
    }

    function mofifiedAddClass(classes){ 
        if (props.role === "teacher"){
            setClasses(classAdd.join(","));
            return;
        }

        var list = [];
        classes.map((_class) => {
            list.push(_class.className + "(");

            _class.session.map(
                (session) => {
                    list.push(session);
                    list.push(",");
                }
            );
            list[list.length - 1] = ")";
            list.push("; ");
        });
        list.splice(list.length - 1, 2);
        setClasses(list);
    }

    const [name, setName] = useState("");
    const [ssn, setSSN] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [birthplace, setBirthplace] = useState("");
    const [address, setAddress] = useState("");

    function handleConfirm()
    {
        if (name === ""
            || ssn === ""
            || phone === ""
            || email === ""
            || birthday === ""
            || birthplace === ""
            || address === ""
        )
        {
                setCurr("missing data");
                setShow(true);
                return;
        }

        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]+/.test(name)){
            setCurr({type: "wrong value", value: "name"});
            setShow(true);
            return;
        }

        if (!(/^[0-9]+$/.test(ssn))){
            setCurr({type: "wrong value", value: "ssn"});
            setShow(true);
            return;
        }

        if (!(/^[0-9]+$/.test(phone))){
            setCurr({type: "wrong value", value: "phone"});
            setShow(true);
            return;
        }

        axios.post("http://localhost:3030/admin/new/staff", {
                name: name,
                ssn: ssn,
                phone: phone,
                email: email,
                birthday: birthday,
                birthplace: birthplace,
                address: address,
                classes: classAdd,
                role: props.role
        })
        .then(()=>{
            setName("");
            setSSN("");
            setPhone("");
            setEmail("");
            setBirthday("");
            setBirthplace("");
            setAddress("");
            setClasses("");
        })
        .catch(
            error => console.log(error)
        )

        setCurr("add");
        setShow(true);
    }

    return (
        <>
            <div className='entity-box'>
                {
                        showListClass && <ClassList role = {props.role} offClassList={ () => setShowListClass(false) } addClass={ (value) => mofifiedAddClass(value) } />
                }
                {
                        showNoti && <Noti offNoti={ () => setShow(false) } option={ curr_option } />
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
                            <input id='name' type="text" pattern = "[a-zA-ZÀ-ỹ ]+" class="form-control" aria-describedby="basic-addon1" maxlength="100" value={ name } onChange={ (event) => setName(event.target.value) } />
                        </div>
                </div>

                <div class="info-container" background='none'>
                        <div class="input-group">
                            <span class="input-group-text" id="basic-addon1" >SSN</span>
                            <input id='address' type="text" class="form-control" aria-describedby="basic-addon1" maxlength="12" value={ ssn } onChange={ (event) => setSSN(event.target.value) } />
                        </div>
                </div>

                <div className='info-container'>
                        <div class="input-group" style={ { width: '40%' } }>
                            <span class="input-group-text" id="basic-addon1" >Phone</span>
                            <input id='phone' type="text" pattern="[0-9]+" class="form-control" aria-describedby="basic-addon1" maxlength = "10" value={ phone } onChange={ (event) => setPhone(event.target.value) } />
                        </div>

                        <div class="input-group" style={ { width: '55%' } }>
                            <span class="input-group-text" id="basic-addon1" >Email</span>
                            <input id='email' type="text" class="form-control" aria-describedby="basic-addon1" maxlength="50" value={ email } onChange={ (event) => setEmail(event.target.value) } />
                        </div>
                </div>

                <div class="info-container">
                        <div class="input-group" style={ { width: '25%' } }>
                            <span class="input-group-text" id="basic-addon1" >Birthday</span>
                            <input id='birthday' type="date" class="form-control" aria-describedby="basic-addon1" style={ { display: 'flex', alignItems: 'center' } } value={ birthday } onChange={ (event) => setBirthday(event.target.value) } />
                        </div>

                        <div class="input-group" style={ { width: '70%' } }>
                            <span class="input-group-text" id="basic-addon1" >Birthplace</span>
                            <input id='birthplace' type="text" class="form-control" aria-describedby="basic-addon1" value={ birthplace } onChange={ (event) => setBirthplace(event.target.value) } />
                        </div>
                </div>

                <div class="info-container">
                        <div class="input-group">
                            <span class="input-group-text" id="basic-addon1" >Address</span>
                            <input id='address' type="text" class="form-control" aria-describedby="basic-addon1" value={ address } onChange={ (event) => setAddress(event.target.value) } />
                        </div>
                </div>

                {
                    props.role === 'teacher' && 
                    <div class="info-container" style={ { background: '#BFBFBF' } }>
                        <div class="input-group">
                            <span class="input-group-text" id="basic-addon1" style={ { borderTopRightRadius: '0px', borderBottomRightRadius: '0px' } }>Class</span>
                        </div>
                        <div style={ { position: 'absolute', left: '9.3%', height: '60%', top: '20%' } }>
                            { staffClasses }
                        </div>

                        <button className="btn btn-primary add-btn" onClick={ handleAdd }>Add</button>
                    </div>
                }
                

                <div className='button-container' style = {{width: "50%", left: "25%"}}>
                        <button class="btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ handleBack }>BACK</button>
                        <button class="btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ handleConfirm }>CONFIRM</button>
                </div>
            </div>

        </>
    )

}


function ClassList(props)
{

    const [classList, setList] = useState([]);
    // var classList = [];
    useEffect(() =>{
        axios.get('http://localhost:3030/admin/availableClassForStaff',{
            role: props.role
        })
        .then((res) =>{
            setList(res.data);
        }
        )
        .catch(error => console.log(error));
    },[props.role]);

    function handleAdd(className)
    {
        if (props.role === "supervisor" && classAdd.findIndex(obj => obj.className === className) === -1) {
            classAdd.push({className: className, session: []});
        }
        else{
            classAdd.push(className);
            console.log(classAdd);
        }

        console.log(props.role);
    }

    const [addSession, setAddSession] = useState("none");
    const [sessionList, setSessionList] = useState([]);
    // var classList = [];
    useEffect(() =>{
        axios.get('http://localhost:3030/admin/availableSessionForStaff',{
            params:{
                role: props.role,
                className: addSession
            }
        })
        .then((res) =>{
            if (addSession !== "none") setSessionList(res.data);
        })
        .catch(error => console.log(error));
    },[props.role, addSession]);

    function handleAddSession(sessionNumber){
        const index = classAdd.findIndex(obj => obj.className === addSession);
        classAdd[index].session.push(sessionNumber);
        console.log(classAdd);
    }

    function handleDeleteSession(sessionNumber){
        const index = classAdd.findIndex(obj => obj.className === addSession);
        const wrongSession = classAdd[index].session.indexOf(sessionNumber);

        if(wrongSession !== -1)
            classAdd[index].session.splice(wrongSession, 1);
        console.log(classAdd);
    }

    function handleBack(){
        if (addSession === "none")
            props.offClassList();
        else{
            const index = classAdd.findIndex(obj => obj.className === addSession);
            if (classAdd[index].session === []) 
                classAdd.splice(index, 1);
            setAddSession("none");
        }
    }

    function handleConfirm()
    {
        console.log(addSession);

        if (addSession === "none"){
            props.offClassList();
            props.addClass(classAdd);
        }
        else{
            const index = classAdd.findIndex(obj => obj.className === addSession);
            if (classAdd[index].session === []) 
                classAdd.splice(index, 1);
            setAddSession("none");
        }
    }

    return (
        <div className="class-box" display = {addSession !== "none" && "none"}>
            <div className='search-container'>
                <input id='search' type='text' />
                {/*onclick={()=>document.getElementById("search").value = ""}*/ }
                <svg style={ { position: 'absolute', left: '83%', cursor: 'pointer' } } width="25" height="25" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1.5C4.13438 1.5 1 4.63438 1 8.5C1 12.3656 4.13438 15.5 8 15.5C11.8656 15.5 15 12.3656 15 8.5C15 4.63438 11.8656 1.5 8 1.5ZM10.5844 11.1594L9.55313 11.1547L8 9.30313L6.44844 11.1531L5.41563 11.1578C5.34688 11.1578 5.29063 11.1031 5.29063 11.0328C5.29063 11.0031 5.30156 10.975 5.32031 10.9516L7.35313 8.52969L5.32031 6.10938C5.30143 6.08647 5.29096 6.0578 5.29063 6.02812C5.29063 5.95937 5.34688 5.90312 5.41563 5.90312L6.44844 5.90781L8 7.75938L9.55156 5.90938L10.5828 5.90469C10.6516 5.90469 10.7078 5.95937 10.7078 6.02969C10.7078 6.05937 10.6969 6.0875 10.6781 6.11094L8.64844 8.53125L10.6797 10.9531C10.6984 10.9766 10.7094 11.0047 10.7094 11.0344C10.7094 11.1031 10.6531 11.1594 10.5844 11.1594Z" fill="black" fill-opacity="0.25" />
                </svg>
                <svg style={ { position: 'absolute', left: '91%', cursor: 'pointer' } } width="26" height="26" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.1022 13.6188L10.4647 8.98129C11.1844 8.05093 11.5737 6.91343 11.5737 5.71701C11.5737 4.28486 11.0147 2.94201 10.004 1.92951C8.9933 0.917006 7.64688 0.359863 6.21652 0.359863C4.78616 0.359863 3.43973 0.918792 2.42902 1.92951C1.41652 2.94022 0.859375 4.28486 0.859375 5.71701C0.859375 7.14736 1.4183 8.49379 2.42902 9.50451C3.43973 10.517 4.78438 11.0741 6.21652 11.0741C7.41295 11.0741 8.54866 10.6849 9.47902 9.96701L14.1165 14.6027C14.1301 14.6163 14.1463 14.6271 14.164 14.6345C14.1818 14.6418 14.2009 14.6456 14.2201 14.6456C14.2393 14.6456 14.2584 14.6418 14.2761 14.6345C14.2939 14.6271 14.3101 14.6163 14.3237 14.6027L15.1022 13.8259C15.1158 13.8123 15.1266 13.7962 15.134 13.7784C15.1414 13.7606 15.1452 13.7416 15.1452 13.7224C15.1452 13.7031 15.1414 13.6841 15.134 13.6663C15.1266 13.6485 15.1158 13.6324 15.1022 13.6188ZM9.04509 8.54558C8.28795 9.30094 7.28438 9.71701 6.21652 9.71701C5.14866 9.71701 4.14509 9.30094 3.38795 8.54558C2.63259 7.78844 2.21652 6.78486 2.21652 5.71701C2.21652 4.64915 2.63259 3.64379 3.38795 2.88843C4.14509 2.13308 5.14866 1.71701 6.21652 1.71701C7.28438 1.71701 8.28973 2.13129 9.04509 2.88843C9.80045 3.64558 10.2165 4.64915 10.2165 5.71701C10.2165 6.78486 9.80045 7.79022 9.04509 8.54558Z" fill="black" fill-opacity="0.45" />
                </svg>
            </div>

            <div className='entity-list-container'>
                {
                    addSession !== "none" && props.role === "supervisor"
                    ?
                        sessionList.map((session) => (
                            <SessionDetail session = {session} add = {() => handleAddSession(session.Session_number)} remove={ () => handleDeleteSession(session.Session_number) }/>
                        ))
                    :
                        classList.map((_class) => (
                            <ClassDetails 
                                role = {props.role}
                                class={ _class } 
                                add={ () => handleAdd(_class.Class_name) }  

                                addSession = {() => {setAddSession(_class.Class_name);
                                }}

                                remove = {() =>{
                                    classAdd.splice(classAdd.length - 1, 1);
                                    console.log(classAdd);
                                }}
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
    const [isActive, setActive] = useState(false);
    var lclass = props.class;
    function handleSelect(){
        if (props.role === 'teacher'){
            if (isActive) 
                props.remove();
            else
                props.add();
            setActive(!isActive);
            return;
        }

        setActive(!isActive);
        props.add();
        props.addSession();
    }
    return (
        <div className='entity-container'>
            <p>{ lclass.Class_name }</p>
            <p>{ lclass.Current_number_of_student } / {lclass.Max_number_of_students}</p>
            <button class="btn btn-primary" style={ { marginRight: '100px' } }>Details</button>
            <button class={ "btn btn-primary" + (isActive ? " active" : "") } onClick={ handleSelect }>{props.role === 'supervisor' ? "Select": "Add"}</button>
        </div>
    )
}

function SessionDetail(props){
    var session = props.session;

    const [isActive, setActive] = useState(false);
    function handleSelect(){
        if (isActive){
            props.remove();
        }
        else
            props.add();
        setActive(!isActive)
    }

    return(
        <div className='entity-container'>
            <p>{ session.Session_number }</p>
            <p>{ session.Session_date }</p>
            <button class="btn btn-primary" style={ { marginRight: '100px' } }>Details</button>
            <button class={ "btn btn-primary" + (isActive ? " active" : "") } onClick={ handleSelect }>Select</button>
        </div>
    )
}