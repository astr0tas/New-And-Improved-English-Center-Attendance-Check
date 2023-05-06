import '../../pages/General/General.css';
import './Home.css';

import { useState } from 'react';
import Chart from 'react-apexcharts'

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
    const [missignList, setMissing] = useState([]);

    const [daily, setDaily] = useState([44, 55, 13]);
    const [weekly, setWeekly] = useState([44, 55, 13]);
    const [monthly, setMonthly] = useState([44, 55, 13]);

    var options = {
          chart: {
            width: 380,
            type: 'pie',
          },
          legend: {
            show: false
          },
          colors: [ '#00ff00', '#0000FF', '#ff0000'],
          labels: ['On class', 'Late', 'Absent'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        };
    
    return(
        <>
            <div className = "ouput-container"
                 style = {{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
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
                    height: "22%",
                    fontSize: "20px"
                 }}
            >
                <p>Lớp chuyên cần nhất:</p>
                <p>Lớp nhiều học sinh vắng nhất:</p>
                <p>Lớp nhiều học sinh trễ nhất:</p>
                <p>Học sinh trễ nhiều nhất:</p>
                <p>Học sinh vắng nhiều nhất:</p>
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