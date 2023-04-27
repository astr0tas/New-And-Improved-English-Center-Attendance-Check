import '../../General/General.css';
import ChangeStudent from './ChangeStudent.jsx';
import {useState} from 'react';
import axios from 'axios';
import image from './img.png';


export default function ShowInfo(props){
    const [changeStudent, setChangeStudent] = useState(false);
    const [classOfStudent, setClassOfStudent] = useState([]);
    var entity = props.entity;
    var  url = "http://localhost:3030/admin/"+ entity.ID +"/classes"
    axios.get(url)
    .then(
        res =>{
            setClassOfStudent(res.data);
        }
    )
    .catch(error => console.log(error))

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
                    <Detail field = "ID" value = {entity.ID}/>
                    <Detail field = "Phone" value = {entity.phone}/>
                    <Detail field = "Email" value = {entity.email}/>
                    <Detail field = "Address" value = {entity.address}/>
                    <Detail field = "BirthDate" value = {entity.birthday}/>
                    <Detail field = "BirthPlace" value = {entity.birthplace}/>
                </div>

                <div className = 'avatar-container' style = {{position: 'relative', left: '72.5%'}}>
                    <img src = {image} alt = ""/>
                </div>

                <div className = 'entity-list-container'
                    style = {{position: 'absolute', top:'40%', height: '45%'}}
                >
                    {
                        classOfStudent.map((sClass)=>(<ClassOfStudent sClass = {sClass}/>))
                    }
                </div>

                <div className = 'button-container'>
                        <button class="cus-btn btn btn-primary cus-btn" type="button" style = {{fontSize: 20}} onClick = {()=>props.offShow()}>BACK</button>
                        <button class="cus-btn btn btn-primary cus-btn" type="button" style = {{fontSize: 20}} onClick = {()=>setChangeStudent(true)}>CHANGE INFO</button>
                </div>
            </div>
            {
                changeStudent && <ChangeStudent entity = {entity} offChange = {()=>setChangeStudent(false)}/>
            }
        </>
    )
}

function ClassOfStudent({sClass}){
    return (
        <div className = 'entity-container' style = {{height: '25%'}}>
            <p>{sClass.Class_name}</p>
            <p style = {{top: 0}}>{sClass.Start_date} {sClass.End_date}</p>
            <p>{sClass.Status === 1 ? "Active" : "Disactive"}</p>
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