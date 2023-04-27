import './SignIn.css';
import SignInFrame from './image/SignInFrame.jpg';
import UserContext from '../General/UserContext';

import {useState, useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';


export function SignInAs(props) {
    const { user } = useContext(UserContext);
    function halderSignIn(event){
        user.position = event.target.innerHTML;
    }
    return ( 
        <div>
            <img alt = "" className = "position-absolute"src = {SignInFrame} style = {{top: 0, left: 0, width: '100%', height: '100%', zIdex: 0}}/>
            <div className = "container" id = "box">
                <h1 class="card-title" style = {{top: '10%', position: 'relative', fontSize: 60}}>Sign in as</h1>
                <div className = "button-con container flex-column">
                    <Link class="cus-btn btn btn-primary" to = '/SignIn' onClick = {halderSignIn} style = {{fontSize: 30, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                         Admin
                    </Link>
                    <Link class="cus-btn btn btn-primary" to = '/SignIn' onClick = {halderSignIn} style = {{fontSize: 30, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                        Teacher
                    </Link>
                    <Link class="cus-btn btn btn-primary" to = '/SignIn' onClick = {halderSignIn} style = {{fontSize: 30, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                        Supervisor
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function SignIn(props){
    const [isWrong, setWrong] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    var f_position = user.position;
    
    function handleSignIn() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === "" || password === "") {
            setWrong(true);
            return;
        }

        axios.get('http://localhost:3030/' + f_position.toLowerCase() + '/user/' + username)
        .then(res => {
            var user = res.data;
            console.log(user);
            if (!user || user.password !== password) {
                setWrong(true);
                return;
            }
            else{
                localStorage.setItem('user', JSON.stringify({user, position: f_position}));
                setUser({user, position: f_position});
                
                props.onNavBar();
                navigate('/' + f_position + '/Home');
            }
        })
        .catch(error => console.log(error));
    }

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
                        <input id = "username" type="text" class="form-control" placeholder="Username" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"/>
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
                        <input id = "password" type="password" class="form-control " placeholder="Password" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"/>
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

                <button class="cus-btn btn btn-primary" type="button" 
                        style = {{top: '35%', position: 'relative', fontSize: 30}}
                        onClick = {handleSignIn}
                >
                    Sign in
                </button>
                <p style = {{top: '30%', left: '30%', position: 'relative', fontSize: 30, cursor: 'pointer', width: '40%'}}>Forgot password?</p>
            </div>
        </div>
    )
}