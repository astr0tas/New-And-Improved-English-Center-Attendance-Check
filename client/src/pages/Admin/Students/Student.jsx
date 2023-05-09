import '../../General/General.css';
import './Student.css';

import axios from 'axios';
import NewStudent from './NewStudent';
import ShowInfo from './ShowInfo';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';



export default function Students()
{
    const [newStudent, setNewStudent] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [studentList, setStudentList] = useState([]);

    useEffect(() =>
    {
        axios.get(`http://localhost:3030/admin/Students`)
            .then(res =>
            {
                setStudentList(res.data);
            })
            .catch(error => console.log(error));
    });

    const [curr_student, setCurr] = useState(studentList[0]);
    function handleShowInfo(student)
    {
        setShowInfo(true);
        setCurr(student);
    }

    const [searchInput, setSearchInput] = useState("");
    function handleSearch(event)
    {
        event.preventDefault();
        setSearchInput(event.target.value);
    };

    return (
        <>
            <div className='main-container'>
                <div className='entity-box'>
                    <div className='search-container'>
                        <input id='search' type='text' onChange={ handleSearch } value={ searchInput } />
                        {/*onclick={()=>document.getElementById("search").value = ""}*/ }
                        <svg style={ { position: 'absolute', left: '83%', cursor: 'pointer' } } width="25" height="25" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 1.5C4.13438 1.5 1 4.63438 1 8.5C1 12.3656 4.13438 15.5 8 15.5C11.8656 15.5 15 12.3656 15 8.5C15 4.63438 11.8656 1.5 8 1.5ZM10.5844 11.1594L9.55313 11.1547L8 9.30313L6.44844 11.1531L5.41563 11.1578C5.34688 11.1578 5.29063 11.1031 5.29063 11.0328C5.29063 11.0031 5.30156 10.975 5.32031 10.9516L7.35313 8.52969L5.32031 6.10938C5.30143 6.08647 5.29096 6.0578 5.29063 6.02812C5.29063 5.95937 5.34688 5.90312 5.41563 5.90312L6.44844 5.90781L8 7.75938L9.55156 5.90938L10.5828 5.90469C10.6516 5.90469 10.7078 5.95937 10.7078 6.02969C10.7078 6.05937 10.6969 6.0875 10.6781 6.11094L8.64844 8.53125L10.6797 10.9531C10.6984 10.9766 10.7094 11.0047 10.7094 11.0344C10.7094 11.1031 10.6531 11.1594 10.5844 11.1594Z" fill="black" fill-opacity="0.25" />
                        </svg>
                        <svg style={ { position: 'absolute', left: '91%', cursor: 'pointer' } } width="26" height="26" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.1022 13.6188L10.4647 8.98129C11.1844 8.05093 11.5737 6.91343 11.5737 5.71701C11.5737 4.28486 11.0147 2.94201 10.004 1.92951C8.9933 0.917006 7.64688 0.359863 6.21652 0.359863C4.78616 0.359863 3.43973 0.918792 2.42902 1.92951C1.41652 2.94022 0.859375 4.28486 0.859375 5.71701C0.859375 7.14736 1.4183 8.49379 2.42902 9.50451C3.43973 10.517 4.78438 11.0741 6.21652 11.0741C7.41295 11.0741 8.54866 10.6849 9.47902 9.96701L14.1165 14.6027C14.1301 14.6163 14.1463 14.6271 14.164 14.6345C14.1818 14.6418 14.2009 14.6456 14.2201 14.6456C14.2393 14.6456 14.2584 14.6418 14.2761 14.6345C14.2939 14.6271 14.3101 14.6163 14.3237 14.6027L15.1022 13.8259C15.1158 13.8123 15.1266 13.7962 15.134 13.7784C15.1414 13.7606 15.1452 13.7416 15.1452 13.7224C15.1452 13.7031 15.1414 13.6841 15.134 13.6663C15.1266 13.6485 15.1158 13.6324 15.1022 13.6188ZM9.04509 8.54558C8.28795 9.30094 7.28438 9.71701 6.21652 9.71701C5.14866 9.71701 4.14509 9.30094 3.38795 8.54558C2.63259 7.78844 2.21652 6.78486 2.21652 5.71701C2.21652 4.64915 2.63259 3.64379 3.38795 2.88843C4.14509 2.13308 5.14866 1.71701 6.21652 1.71701C7.28438 1.71701 8.28973 2.13129 9.04509 2.88843C9.80045 3.64558 10.2165 4.64915 10.2165 5.71701C10.2165 6.78486 9.80045 7.79022 9.04509 8.54558Z" fill="black" fill-opacity="0.45" />
                        </svg>
                    </div>

                    <p
                        style={ {
                            position: "absolute",
                            width: '50%',
                            top: '10%',
                            left: '25%',
                            fontSize: '45px'
                        } }
                    >There is no student</p>

                    <div className='entity-list-container'>
                        {
                            studentList.filter((student) =>
                            {
                                const idMatch = student.ID.toLowerCase().match(searchInput.toLowerCase());
                                const nameMatch = student.name.toLowerCase().match(searchInput.toLowerCase());
                                return nameMatch || idMatch;
                            }).map((i_student, index) => (
                                <StudentDetails
                                    key={ index }
                                    student={ i_student }
                                    onInfo={ () => handleShowInfo(i_student) }
                                />
                            ))
                        }
                    </div>



                    <div className='button-container' style={ { width: "50%", left: "25%" } }>
                        <Link to={ '/Home' } class="cus-btn btn btn-primary cus-btn" type="button" style={ { display: 'flex', fontSize: 20, alignItems: 'center', justifyContent: 'center' } }>
                            BACK
                        </Link>
                        <button class="cus-btn btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ () => setNewStudent(true) }>ADD A STUDENT</button>
                    </div>
                </div>
                {
                    newStudent && <NewStudent offAdd={ () => setNewStudent(false) } />
                }
            </div>
            {
                showInfo && <ShowInfo entity={ curr_student } offShow={ () => setShowInfo(false) } />
            }
        </>
    )
}

function StudentDetails(props)
{
    return (
        <div className='entity-container'>
            <p>{ props.student.ID }</p>
            <p style={ { width: '400px' } }>{ props.student.name }</p>
            <p>{ props.student.email }</p>
            <p style={ { marginLeft: '50px' } }>{ props.student.phone }</p>
            <button class="btn btn-primary" onClick={ () => props.onInfo() }>Details</button>
        </div>
    )
}



