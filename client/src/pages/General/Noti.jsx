import './General.css';

export default function Noti(props){
    var changeNoti = props.role + " info successfully changed"
        , addNoti = props.role + " successfully added", noti = ""
        , missingData = "Missing data"
        , wrongValue = "Wrong value";

    if (props.option === 'change') noti = changeNoti;
    if (props.option === 'add') noti = addNoti;
    if (props.option === 'missing data') noti = missingData;
    if (props.option.type === 'wrong value') noti = wrongValue + " at " + props.option.value;

    return(
        <div className = "noti-container">
                <p style = {{position: 'absolute', top: '35%'}}>{noti}</p>
                <button class="btn btn-primary cus-btn" type="button" style = {{position: 'absolute', top: '75%', fontSize: 20}} onClick = {() => props.offNoti()}>OKAY</button>
        </div>
    )
}