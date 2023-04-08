import './General.css';
import Noti from './Noti.jsx';
import ChangeEntity from './ChangeEntity.jsx';
import {useState} from 'react';

export default function ShowInfo(props){
    const [changeEntity, setChangeEntity] = useState(false);
    var entity = props.entity;
    var birthday = new Date(entity.birthday).toLocaleDateString('en-GB');

    return (
        <>
            <div className='entity-box'>
                <div className = 'detail-container' 
                    style = {{
                        position: 'absolute',
                        top: '2%',
                        left: '10%',
                        width:'60%',
                        height:'30%',
                        borderRight: '3px black solid',
                    }}
                > 
                    <Detail field = "Name" value = {entity.name}/>
                    <Detail field = "SSN" value = {entity.ssn}/>
                    <Detail field = "Phone" value = {entity.phone}/>
                    <Detail field = "Email" value = {entity.email}/>
                    <Detail field = "Address" value = {entity.address}/>
                    <Detail field = "BirthDate" value = {birthday}/>
                    <Detail field = "BirthPlace" value = {entity.birthplace}/>
                </div>

                <div className = 'avatar-container' style = {{position: 'relative', left: '72.5%'}}>

                </div>

                <div className = 'entity-list-container'
                    style = {{position: 'absolute', top:'40%', height: '45%'}}
                >
                        <ClassOfStudent/>
                        <ClassOfStudent/>
                        <ClassOfStudent/>
                        <ClassOfStudent/>
                        <ClassOfStudent/>
                </div>

                <div className = 'button-container'>
                        <button class="cus-btn btn btn-primary cus-btn" type="button" style = {{fontSize: 20}} onClick = {()=>props.offShow()}>BACK</button>
                        <button class="cus-btn btn btn-primary cus-btn" type="button" style = {{fontSize: 20}} onClick = {()=>setChangeEntity(true)}>CHANGE INFO</button>
                </div>
            </div>
            {
                changeEntity && <ChangeEntity offChange = {()=>setChangeEntity(false)}/>
            }
        </>
    )
}

function ClassOfStudent(){
    return (
        <div className = 'entity-container' style = {{height: '25%'}}>
            <p>Class</p>
            <p>Period</p>
            <p>Status</p>
            <button class = "btn btn-primary">Details</button>
        </div>
    )
}

function Detail(props){
    return(
        <div className="detail" style = {{fontSize: '19px', top: '-3%'}}>
            <p style = {{position: 'absolute', right: '70%'}}>{props.field} :</p>
            <p style = {{position: 'absolute', left: '40%'}}>{props.value}</p>
        </div>
    )
}