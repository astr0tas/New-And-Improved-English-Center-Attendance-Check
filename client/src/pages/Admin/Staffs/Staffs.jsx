import '../../General/General.css';
import './Staffs.css';
import NewStaff from './NewStaff';
import ShowInfo from './ShowInfo';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Staffs()
{
    const [staff, setStaff] = useState("");

    return (
        <>
            <div className="main-container" display={ staff !== "" && "none" }>
                <div className='entity-box' style={ { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' } }>
                    <div className="circle-type" style={ { marginRight: '50px', color: "#0083FD" } } onClick={ () => setStaff("teacher") }>
                        <svg width="500" height="500" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M60.7907 55.0477C59.6316 52.2865 57.9496 49.7785 55.8382 47.6632C53.7333 45.5418 51.2398 43.8505 48.4954 42.6825C48.4709 42.6702 48.4463 42.664 48.4217 42.6516C52.2498 39.8709 54.7383 35.3413 54.7383 30.2309C54.7383 21.765 47.9178 14.9058 39.4998 14.9058C31.0817 14.9058 24.2612 21.765 24.2612 30.2309C24.2612 35.3413 26.7498 39.8709 30.5778 42.6578C30.5533 42.6702 30.5287 42.6764 30.5041 42.6887C27.7513 43.8566 25.2812 45.5313 23.1613 47.6694C21.052 49.7863 19.3702 52.2939 18.2088 55.0539C17.0679 57.7559 16.4526 60.6527 16.3961 63.5877C16.3945 63.6537 16.406 63.7193 16.43 63.7807C16.4539 63.8421 16.4899 63.8981 16.5357 63.9453C16.5815 63.9925 16.6363 64.03 16.6967 64.0557C16.7572 64.0813 16.8221 64.0945 16.8877 64.0944H20.5745C20.8448 64.0944 21.0599 63.8782 21.066 63.6124C21.1889 58.8419 23.0937 54.3741 26.461 50.9878C29.9449 47.484 34.5718 45.556 39.4998 45.556C44.4277 45.556 49.0546 47.484 52.5386 50.9878C55.9058 54.3741 57.8106 58.8419 57.9335 63.6124C57.9397 63.8843 58.1547 64.0944 58.4251 64.0944H62.1118C62.1774 64.0945 62.2424 64.0813 62.3028 64.0557C62.3633 64.03 62.418 63.9925 62.4638 63.9453C62.5096 63.8981 62.5456 63.8421 62.5696 63.7807C62.5935 63.7193 62.605 63.6537 62.6034 63.5877C62.5419 60.6339 61.9336 57.7605 60.7907 55.0477ZM39.4998 40.8596C36.6794 40.8596 34.0249 39.7535 32.028 37.7451C30.031 35.7368 28.9311 33.0673 28.9311 30.2309C28.9311 27.3945 30.031 24.725 32.028 22.7166C34.0249 20.7083 36.6794 19.6022 39.4998 19.6022C42.3201 19.6022 44.9746 20.7083 46.9716 22.7166C48.9686 24.725 50.0684 27.3945 50.0684 30.2309C50.0684 33.0673 48.9686 35.7368 46.9716 37.7451C44.9746 39.7535 42.3201 40.8596 39.4998 40.8596Z" fill="#0083FD" />
                        </svg>
                        Teachers
                    </div>

                    <div className="circle-type" onClick={ () => setStaff("supervisor") }>
                        <svg width="500" height="500" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M60.7907 55.0477C59.6316 52.2865 57.9496 49.7785 55.8382 47.6632C53.7333 45.5418 51.2398 43.8505 48.4954 42.6825C48.4709 42.6702 48.4463 42.664 48.4217 42.6516C52.2498 39.8709 54.7383 35.3413 54.7383 30.2309C54.7383 21.765 47.9178 14.9058 39.4998 14.9058C31.0817 14.9058 24.2612 21.765 24.2612 30.2309C24.2612 35.3413 26.7498 39.8709 30.5778 42.6578C30.5533 42.6702 30.5287 42.6764 30.5041 42.6887C27.7513 43.8566 25.2812 45.5313 23.1613 47.6694C21.052 49.7863 19.3702 52.2939 18.2088 55.0539C17.0679 57.7559 16.4526 60.6527 16.3961 63.5877C16.3945 63.6537 16.406 63.7193 16.43 63.7807C16.4539 63.8421 16.4899 63.8981 16.5357 63.9453C16.5815 63.9925 16.6363 64.03 16.6967 64.0557C16.7572 64.0813 16.8221 64.0945 16.8877 64.0944H20.5745C20.8448 64.0944 21.0599 63.8782 21.066 63.6124C21.1889 58.8419 23.0937 54.3741 26.461 50.9878C29.9449 47.484 34.5718 45.556 39.4998 45.556C44.4277 45.556 49.0546 47.484 52.5386 50.9878C55.9058 54.3741 57.8106 58.8419 57.9335 63.6124C57.9397 63.8843 58.1547 64.0944 58.4251 64.0944H62.1118C62.1774 64.0945 62.2424 64.0813 62.3028 64.0557C62.3633 64.03 62.418 63.9925 62.4638 63.9453C62.5096 63.8981 62.5456 63.8421 62.5696 63.7807C62.5935 63.7193 62.605 63.6537 62.6034 63.5877C62.5419 60.6339 61.9336 57.7605 60.7907 55.0477ZM39.4998 40.8596C36.6794 40.8596 34.0249 39.7535 32.028 37.7451C30.031 35.7368 28.9311 33.0673 28.9311 30.2309C28.9311 27.3945 30.031 24.725 32.028 22.7166C34.0249 20.7083 36.6794 19.6022 39.4998 19.6022C42.3201 19.6022 44.9746 20.7083 46.9716 22.7166C48.9686 24.725 50.0684 27.3945 50.0684 30.2309C50.0684 33.0673 48.9686 35.7368 46.9716 37.7451C44.9746 39.7535 42.3201 40.8596 39.4998 40.8596Z" fill="black" />
                        </svg>
                        Supervisors
                    </div>
                </div>
            </div>

            {
                staff !== "" && <StaffsList role={ staff } back={ () => setStaff("") } />
            }
        </>
    )
}


function StaffsList({ role, back })
{
    const [newStaff, setNewStaff] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [staffList, setStaffList] = useState([]);

    useEffect(() =>
    {
        axios.get("http://localhost:3030/admin/" + role.toLowerCase() + "s")
            .then(
                (res) => { setStaffList(res.data); }
            )
            .catch(
                (error) => { console.log(error); }
            )

    });

    const [curr_staff, setCurr] = useState(staffList[0]);
    function handleShowInfo(staff)
    {
        setShowInfo(true);
        setCurr(staff);
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
                    >{ "There is no " + role.toLowerCase() }</p>

                    <div className='entity-list-container'>
                        {
                            staffList.filter(
                                (staff) =>
                                {
                                    return staff.name.toLowerCase().match(searchInput.toLowerCase());
                                }
                            ).map((i_staff, index) => (
                                <StaffDetails
                                    key={ index }
                                    staff={ i_staff }
                                    onInfo={ () => handleShowInfo(i_staff) }
                                />
                            ))
                        }
                    </div>



                    <div className='button-container' style={ { width: "50%", left: "25%" } }>
                        <Link to={ '/Staffs' } class="cus-btn btn btn-primary cus-btn" type="button" style={ { display: 'flex', fontSize: 20, alignItems: 'center', justifyContent: 'center' } } onClick={ () => back() }>
                            BACK
                        </Link>
                        <button class="cus-btn btn btn-primary cus-btn" type="button" style={ { fontSize: 20 } } onClick={ () => setNewStaff(true) }>{ "ADD A " + role.toUpperCase() }</button>
                    </div>
                </div>
                {
                    newStaff && <NewStaff role={ role } offAdd={ () => setNewStaff(false) } />
                }
            </div>
            {
                showInfo && <ShowInfo role={ role } entity={ curr_staff } offShow={ () => setShowInfo(false) } />
            }
        </>

    )
}

function StaffDetails(props)
{
    return (
        <div className='entity-container'>
            <p>{ props.staff.ID }</p>
            <p style={ { width: '400px' } }>{ props.staff.name }</p>
            <p>{ props.staff.email }</p>
            <p style={ { marginLeft: '50px' } }>{ props.staff.phone }</p>
            <button class="btn btn-primary" onClick={ () => props.onInfo(true) }>Details</button>
        </div>
    )
}
