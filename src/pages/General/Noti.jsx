import './General.css';

export default function Noti(props){
    var changeNoti = "Student info successfully changed", addNoti = "Student successfully added", noti = "";
    if (props.option === 'change') noti = changeNoti;
    else noti = addNoti;
    return(
        <div className = "noti-container">
                <p style = {{position: 'absolute', top: '35%'}}>{noti}</p>
                <button class="btn btn-primary cus-btn" type="button" style = {{position: 'absolute', top: '75%', fontSize: 20}} onClick = {() => props.offNoti()}>OKAY</button>
        </div>
    )
}