import './General.css';

export default function Noti(props){
    var changeNoti = "Student info successfully changed"
        , addNoti = "Student successfully added", noti = ""
        , missingData = "Missing data";
    if (props.option === 'change') noti = changeNoti;
    if (props.option === 'add') noti = addNoti;
    if (props.option === 'missing data') noti = missingData;

    return(
        <div className = "noti-container">
                <p style = {{position: 'absolute', top: '35%'}}>{noti}</p>
                <button class="btn btn-primary cus-btn" type="button" style = {{position: 'absolute', top: '75%', fontSize: 20}} onClick = {() => props.offNoti()}>OKAY</button>
        </div>
    )
}