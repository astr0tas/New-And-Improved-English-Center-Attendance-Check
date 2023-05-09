import './SignIn.css';
import SignInFrame from './image/SignInFrame.jpg';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export function SignInAs()
{
    const Navigate = useNavigate();

    useEffect(() =>
    {
        if (localStorage.getItem("id") !== null && localStorage.getItem("userType") !== null)
            Navigate("/Home");
    })

    function halderSignIn(event)
    {
        if (event.target.innerHTML === "Admin")
            localStorage.setItem("userType", "Admin");

        else
            localStorage.setItem("userType", "TS");

    }

    return (
        <div>
            <img alt="" className="position-absolute" src={ SignInFrame } style={ { top: 0, left: 0, width: '100%', height: '100%', zIdex: 0 } } />
            <div className="container" id="box">
                <h1 className="card-title" style={ { top: '10%', position: 'relative', fontSize: 60 } }>Sign in as</h1>
                <div className="button-con container flex-column">
                    <Link className="cus-btn btn btn-primary" to='/SignIn' onClick={ halderSignIn } style={ { fontSize: 30, alignItems: 'center', justifyContent: 'center', display: 'flex' } }>
                        Admin
                    </Link>
                    <Link className="cus-btn btn btn-primary" to='/SignIn' onClick={ halderSignIn } style={ { fontSize: 30, alignItems: 'center', justifyContent: 'center', display: 'flex' } }>
                        Teacher
                    </Link>
                    <Link className="cus-btn btn btn-primary" to='/SignIn' onClick={ halderSignIn } style={ { fontSize: 30, alignItems: 'center', justifyContent: 'center', display: 'flex' } }>
                        Supervisor
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function SignIn({setUser})
{
    const [isWrong, setWrong] = useState(false);
    const navigate = useNavigate();

    useEffect(() =>
    {
        if (localStorage.getItem('userType') !== null && localStorage.getItem('id') !== null)
            navigate("/Home");
        else if (localStorage.getItem('userType') !== null && localStorage.getItem('id') === null)
            ;
        else
            navigate("/");
    });

    function handleSignIn()
    {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === "" || password === "")
        {
            setWrong(true);
            return;
        }
        

        if (localStorage.getItem('userType') === "Admin")
        {
            if (username.includes("TEACHER") || username.includes("SUPERVISOR")){
                setWrong(true);
                return;
            }

            axios.post('http://localhost:3030/admin/user',{
                username : username,
                password : password
            })
                .then(res =>
                {
                    if (res.data === "False")
                    {
                        setWrong(true);
                    }
                    else
                    {
                        localStorage.setItem("id", username);
                        navigate('/Home');
                    }
                })
                .catch(error => console.log(error));
        }
        else
        {
            if (username.includes("ADMIN")){
                setWrong(true);
                return;
            }

            axios.post('http://localhost:3030/TS/login', { params: { account: username, password: password } })
                .then(res =>
                {
                    if (!res.data.length)
                        setWrong(true);
                    else
                    {
                        localStorage.setItem("id", res.data[0].ID);
                        navigate('/Home');
                    }
                })
                .catch(error => console.log(error));
        }

        
    }

    return (
        <div>
            <img alt="" className="position-absolute" src={ SignInFrame } style={ { top: 0, left: 0, width: '100%', height: '100%', zIdex: 0 } } />
            <div className="container flex-column" id='box'>
                <h1 className="card-title" style={ { top: '10%', position: 'relative', fontSize: 60 } }>Sign in</h1>
                {
                    isWrong &&
                    <p
                        style={ {
                            top: '20%',
                            left: '20%',
                            color: 'red',
                            width: '60%',
                            textAlign: 'center'
                        } }
                    >
                        The username and/or password are not correct
                    </p>
                }
                <div className='container flex-column' style={ { top: '25%', position: 'relative', width: '60%' } }>
                    <p style={ { left: '-40%' } }>Username</p>
                    <div className="input-group input-group-lg cus-input">
                        <input id="username" type="text" className="form-control" placeholder="Username" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" />
                        {
                            isWrong &&
                            <span>
                                <svg width="45" height="45" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M52 32C52 43.0457 43.0457 52 32 52C20.9543 52 12 43.0457 12 32C12 20.9543 20.9543 12 32 12C43.0457 12 52 20.9543 52 32Z" stroke="#EE1C1C" strokeWidth="2" />
                                    <path d="M24 24L40 40" stroke="#EE1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M40 24L24 40" stroke="#EE1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        }
                    </div>
                    <p style={ { left: '-40%', marginTop: '50px' } }>Password</p>
                    <div className="input-group input-group-lg cus-input">
                        <input id="password" type="password" className="form-control " placeholder="Password" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" />
                        {
                            isWrong &&
                            <span>
                                <svg width="45" height="45" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M52 32C52 43.0457 43.0457 52 32 52C20.9543 52 12 43.0457 12 32C12 20.9543 20.9543 12 32 12C43.0457 12 52 20.9543 52 32Z" stroke="#EE1C1C" strokeWidth="2" />
                                    <path d="M24 24L40 40" stroke="#EE1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M40 24L24 40" stroke="#EE1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        }
                    </div>
                </div>

                <button className="cus-btn btn btn-primary" type="button"
                    style={ { top: '35%', position: 'relative', fontSize: 30 } }
                    onClick={ handleSignIn }
                >
                    Sign in
                </button>
                {/* <p style={ { top: '30%', left: '30%', position: 'relative', fontSize: 30, cursor: 'pointer', width: '40%' } }>Forgot password?</p> */}
            </div>
        </div>
    )
}