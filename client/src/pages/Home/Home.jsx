import '../../pages/General/General.css';
import './Home.css';

import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import axios from 'axios';


export default function Home(){
    
    return(
        <div className = "main-container">
            {
                localStorage.getItem('userType') === "Admin" 
                ?
                    <AdminHome/>
                :
                    <StaffHome/>
            }
        </div>
    )
}


function AdminHome(){
    var options = {
        chart: {
        width: 350,
        type: 'pie',
        },
        legend: {
        show: false
        },
        colors: [ '#8884d8', '#ffc658', '#82ca9d'],
        labels: ['Absent', 'Late', 'On class'],
        responsive: [{
        breakpoint: 480,
        options: {
            chart: {
            width: 250
            },
            legend: {
            position: 'bottom'
            }
        }
        }]
    };

    const [daily, setDaily] = useState([]);
    const [weekly, setWeekly] = useState([]);
    const [monthly, setMonthly] = useState([]);

    useEffect( () =>{
        axios.get("http://localhost:3030/admin/pieChart")
        .then(
            res => {
                setDaily(res.data["daily"]);
                setWeekly(res.data["weekly"]);
                setMonthly(res.data["monthly"]);
            }
        )
        .catch(
            error => console.log(error)
        )
    }
    , [])
    
    const [lineData, setData] = useState([]);
    
    const [frequencyCountChart, setFrequencyCountChart] = useState('Daily');
    useEffect(()=>{
        axios.get("http://localhost:3030/admin/barChart")
        .then(
            res => {
                if (frequencyCountChart === "Daily")
                    setData(res.data["daily"]);
                else if (frequencyCountChart === "Weekly")
                    setData(res.data["weekly"]);
                else
                    setData(res.data["monthly"]);
            }
        )
        .catch(
            error => console.log(error)
        )
    }
    , [frequencyCountChart])

    function handleFrequency(event){
        var frequent = event.target.innerHTML
        setFrequencyCountChart(frequent)
        return;
    }


    const [best, setBest] = useState([]);
    const [worst, setWorst] = useState([]);
    const [late, setLate] = useState([]);
    const [absentS, setAbsentS] = useState([]);
    const [lateS, setLateS] = useState([]);

    useEffect(()=>{
        axios.get("http://localhost:3030/admin/stats")
        .then(
            res => {
                setBest(res.data["bestClass"]);
                setWorst(res.data["worstClass"]);
                setLate(res.data["lateClass"]);
                setAbsentS(res.data["absentStudent"]);
                setLateS(res.data["lateStudent"]);
            }
        )
        .catch(
            error => console.log(error)
        )
    },[])

    return(
        <>
            <div className = "ouput-container"
                 style = {{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '35%'
                 }}
            >
                <div className='chart'>
                    <Chart options={options} series={daily} type="pie" width={380} />
                    <p>Daily</p>
                </div>

                <div className='chart'>
                    <Chart options={options} series={weekly} type="pie" width={380} />
                    <p>Weekly</p>
                </div>

                <div className='chart'>
                    <Chart options={options} series={monthly} type="pie" width={380} />
                    <p>Monthly</p>
                </div>
            </div>

            <div 
                id  = 'stats'
                className='ouput-container'
                style = {{
                    display: 'flex',
                    flexDirection: 'column',
                    height: "35%",
                    fontSize: "20px"
                 }}
            >
                <div id = "lineChart" className = 'chart'>
                    <div className = 'frequent_container'>
                        <button 
                            className={frequencyCountChart === 'Daily' ? 'chart_name active' : 'chart_name'}
                            onClick={(event) => handleFrequency(event)}
                        >
                            Daily
                        </button>
                        <button 
                            className={frequencyCountChart === 'Weekly' ? 'chart_name active' : 'chart_name'}
                            onClick={(event) => handleFrequency(event)}
                        >
                            Weekly
                        </button>
                        <button 
                            className={frequencyCountChart === 'Monthly' ? 'chart_name active' : 'chart_name'}
                            onClick={(event) => handleFrequency(event)}
                        >
                            Monthly
                        </button>
                    </div>

                    <div className='chart'
                        style = {{
                            height: "71%",
                            width: "98%",
                            left: '-1%',
                            position: "relative",
                            marginTop: "0"
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                width={500}
                                height={300}
                                data={lineData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                  }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Name" interval={0} angle={0} textAnchor="end"/>
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Absent" strokeWidth={2} stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="Late" strokeWidth={2} stroke="#ffc658" />
                                <Line type="monotone" dataKey="On class" strokeWidth={2} stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                        {/* <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                            width={500}
                            height={300}
                            data={lineData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Absent" stackId="a" fill="#8884d8" />
                            <Bar dataKey="Late" stackId="a" fill="#ffc658" />
                            <Bar dataKey="On class" stackId="a" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer> */}
                    </div>
                    {/* <ResponsiveContainer width= "97%" height="80%">
                        <LineChart data={lineData} margin={{top: 5, right: 24, bottom: 2 }}>
                        <Legend verticalAlign="top" height={36}/>
                        <XAxis dataKey="Class_name" />
                        <YAxis />
                        <Line name = "Previous" type="monotone" dataKey="Class_name" stroke="#A8C5DA" strokeWidth={3} activeDot={{ r: 8 }} />
                        <Line name = "Current" type="monotone" dataKey="count" stroke="#1C1C1C"  strokeWidth={3} />
                        <CartesianGrid strokeDasharray="1 1" />
                        <Tooltip />
                        </LineChart>
                    </ResponsiveContainer> */}
                </div>
            </div>

            <div 
                id  = 'stats'
                className='ouput-container'
                style = {{
                    display: 'flex',
                    flexDirection: 'column',
                    height: "25%",
                    fontSize: "20px"
                 }}
            >

                <div className = "p-container">
                    <p id = "field">The class with the most students coming to school on time: </p>
                    <p>{best}</p>
                </div>

                <div className = "p-container">
                    <p id = "field">The class with the most students absent: </p>
                    <p>{worst}</p>
                </div>
                
                <div className = "p-container">
                    <p id = "field">The class with the most students late: </p>
                    <p>{late === "" ? "No class with late students" : late}</p>
                </div>

                <div className = "p-container">
                    <p id = "field">Students are late for more than 10 sessions: </p>
                    <p>{absentS === "" ? "No students" : absentS}</p>
                </div>
                
                <div className = "p-container">
                    <p id = "field">Students are absent for more than 5 sessions: </p>
                    <p>{lateS === "" ? "No students" : lateS}</p>
                </div>
                
            </div>

            {/* <div className='ouput-container'
                 style = {{
                    height: "35%"
                 }}
            >
                <p>Missing attendace</p>
                <div className='entity-list-container'
                    style = {{
                        position: 'relative',
                        background: 'rgba(243, 246, 254, 0.89)',
                        top: '-2%'
                    }}
                >
                    {
                        missignList.map(
                            (missing)=>{
                                <Miss infor = {missing}/>
                            }
                        )
                    }
                </div>
            </div> */}
        </>
    )
}

function StaffHome(){
    const [attendanceList, setAttendance] = useState([]);
    const [missignList, setMissing] = useState([]);

    return(
        <>
            <div className='ouput-container'
                 style = {{
                    height: "57%"
                 }}
            >
                <p>Today's class</p>
                <div className='entity-list-container'
                    style = {{
                        position: 'relative',
                        background: 'rgba(243, 246, 254, 0.89)',
                        top: '-2%'
                    }}
                >
                    {
                        attendanceList.map(
                            (_class)=>{
                                <Attendace infor = {_class}/>
                            }
                        )
                    }
                </div>
            </div>

            <div className='ouput-container'
                 style = {{
                    height: "35%"
                 }}
            >
                <p>Missing attendace</p>
                <div className='entity-list-container'
                    style = {{
                        position: 'relative',
                        background: 'rgba(243, 246, 254, 0.89)',
                        top: '-2%'
                    }}
                >
                    {
                        missignList.map(
                            (missing)=>{
                                <Miss infor = {missing}/>
                            }
                        )
                    }
                </div>
            </div>
        </>
    )
}

function Attendace(props){
    return(
        <div>
            attendace detail
        </div>
    )
}

function Miss(props){
    return(
        <div>
            missing detail
        </div>
    )
}