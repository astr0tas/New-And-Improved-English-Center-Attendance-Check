import './SignIn.css';
import SignInFrame from './image/SignInFrame.jpg';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import { width } from '@mui/system';


export function SignInAs() {
    const [isPosition, setIsPosition] = useState("");
    function halderSignIn(event){
        setIsPosition(event.target.innerHTML);
        console.log(event.target.innerHTML);
    }
    return ( 
        <div>
            <img alt = "" className = "position-absolute"src = {SignInFrame} style = {{top: 0, left: 0, width: '100%', height: '100%', zIdex: 0}}/>
            <div className = "container" id = "box">
                <h1 class="card-title" style = {{top: '10%', position: 'relative', fontSize: 60}}>Sign in as</h1>
                <div className = "button-con container flex-column">
                    <button class="cus-btn btn btn-primary" type="button" style = {{fontSize: 30}} onClick = {halderSignIn}>
                        <Link to = '/SignIn'>Admin</Link>
                    </button>
                    <button class="cus-btn btn btn-primary" type="button" style = {{fontSize: 30}} onClick = {halderSignIn}>
                        <Link to = '/SignIn'>Teacher</Link>
                    </button>
                    <button class="cus-btn btn btn-primary" type="button" style = {{fontSize: 30}} onClick = {halderSignIn}>
                        <Link to = '/SignIn'>Supervisor</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export function SignIn(){
    const [isWrong, setWrong] = useState(false);

    return (
        <div>
            <img alt = "" className = "position-absolute"src = {SignInFrame} style = {{top: 0, left: 0, width: '100%', height: '100%', zIdex: 0}}/>
            <div className = "container flex-column" id = 'box'>
                <h1 class="card-title" style = {{top: '10%', position: 'relative', fontSize: 60}}>Sign in</h1>
                {
                    isWrong && 
                    <p
                        style = {{
                            top: '20%',
                            left: '20%',
                            color: 'red',
                            width: '60%',
                            textAlign: 'center'
                        }}
                    >
                        The username and/or password are not correct
                    </p>
                }
                <div className='container flex-column' style = {{top: '25%', position: 'relative', width: '60%'}}>
                    <p style = {{left: '-40%'}}>Username</p>
                    <div class="input-group input-group-lg cus-input">
                        <input type="text" class="form-control " placeholder="Username" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"/>
                        {
                            isWrong &&
                            <span>
                                <svg width="45" height="45" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M52 32C52 43.0457 43.0457 52 32 52C20.9543 52 12 43.0457 12 32C12 20.9543 20.9543 12 32 12C43.0457 12 52 20.9543 52 32Z" stroke="#EE1C1C" stroke-width="2"/>
                                    <path d="M24 24L40 40" stroke="#EE1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M40 24L24 40" stroke="#EE1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                        }
                    </div>
                    <p style = {{left: '-40%', marginTop: '50px'}}>Password</p>
                    <div class="input-group input-group-lg cus-input">
                        <input type="password" class="form-control " placeholder="Password" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"/>
                        {
                            isWrong &&
                            <span>
                                <svg width="45" height="45" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M52 32C52 43.0457 43.0457 52 32 52C20.9543 52 12 43.0457 12 32C12 20.9543 20.9543 12 32 12C43.0457 12 52 20.9543 52 32Z" stroke="#EE1C1C" stroke-width="2"/>
                                    <path d="M24 24L40 40" stroke="#EE1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M40 24L24 40" stroke="#EE1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                        }
                    </div>
                </div>
                <button class="cus-btn btn btn-primary" type="button" style = {{top: '35%', position: 'relative', fontSize: 30}}>Sign in</button>
                <p style = {{top: '30%', left: '30%', position: 'relative', fontSize: 30, cursor: 'pointer', width: '40%'}}>Forgot password?</p>
            </div>
        </div>
    )
}