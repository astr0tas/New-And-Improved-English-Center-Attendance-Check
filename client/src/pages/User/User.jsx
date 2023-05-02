import '../General/General.css';
import './User.css';
import UserContext from '../General/UserContext.jsx';
import userImage from './image/image.png';

import { useContext, useState } from 'react';
import axios from 'axios';

export default function User()
{
    const { user, setUser } = useContext(UserContext);

    var f_user = user.user;
    var fbirthday = new Date(f_user.birthday).toLocaleDateString('en-GB');

    const [isEdit, setEdit] = useState(false);
    const [isSuccess, setSuccess] = useState(false);

    const [address, setAddress] = useState("");
    const [birthday, setBirthday] = useState(null);
    const [birthplace, setBirthplace] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    function handelYes()
    {
        axios.post("http://localhost:3030/" + user.position.toLowerCase() + "/user/" + f_user.ID, {
            ssn: f_user.SSN,
            address: address,
            birthday: birthday,
            birthplace: birthplace,
            email: email,
            phone: phone

        })
            .then(
                (res) =>
                {
                    console.log(res);
                    if (address !== "") f_user.address = address;
                    if (birthday !== null)
                    {
                        fbirthday = new Date(birthday).toLocaleDateString('en-GB');
                        f_user.birthday = birthday;
                    }
                    if (birthplace !== "") f_user.birthplace = birthplace;
                    if (email !== "") f_user.email = email;
                    if (phone !== "") f_user.phone = phone;

                    var position = user.position
                    axios.get('http://localhost:3030/' + position + '/user/' + f_user.ID)
                        .then(res =>
                        {
                            var user = res.data;
                            setUser({ user, position: position });
                        })
                        .catch(error => console.log(error));
                    setSuccess(true);
                }
            )
            .catch(
                error => console.log(error)
            );
    }

    return (
        <div className='main-container'>
            <div className='ssn-container'>
                { f_user.SSN }
            </div>
            <div className='img-container'>
                <img src={ userImage } alt="" />
            </div>
            <div className='name-container'>
                { f_user.name }
            </div>
            { isSuccess && <Successfull notEdit={ () => setEdit(false) } notSuccess={ () => setSuccess(false) } /> }
            <div className='details-container'>
                <h2 style={ { position: 'absolute', top: '2%', left: '2%' } }>User details</h2>
                {
                    isEdit ?
                        <div
                            style={ {
                                position: 'absolute',
                                display: 'flex',
                                flexDirection: 'row',
                                right: '2%'
                            } }
                        >
                            <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
                                style={ { cursor: 'pointer' } }
                                onClick={ handelYes }
                            >
                                <path d="M52 32C52 43.0457 43.0457 52 32 52C20.9543 52 12 43.0457 12 32C12 20.9543 20.9543 12 32 12C43.0457 12 52 20.9543 52 32Z" stroke="#1CDC24" stroke-width="2" />
                                <path d="M20 32L26.7311 38.7311V38.7311C27.4319 39.4319 28.5681 39.4319 29.2689 38.7311V38.7311L44 24" stroke="#1CDC24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
                                style={ { cursor: 'pointer' } }
                                onClick={ () => setEdit(false) }
                            >
                                <path d="M52 32C52 43.0457 43.0457 52 32 52C20.9543 52 12 43.0457 12 32C12 20.9543 20.9543 12 32 12C43.0457 12 52 20.9543 52 32Z" stroke="#EE1C1C" stroke-width="2" />
                                <path d="M24 24L40 40" stroke="#EE1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M40 24L24 40" stroke="#EE1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </div>
                        :
                        <div style={ { position: 'absolute', top: '2%', right: '2%', poiter: 'cursor', cursor: 'pointer' } } onClick={ () => setEdit(true) }>
                            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.1" d="M26 9.67395L7.58859 28.0592C6.98545 28.6614 6.16596 29 5.31129 29H2.61326C1.72228 29 1 28.2752 1 27.389V24.6821C1 23.8364 1.33688 23.0252 1.9369 22.4261L20.3892 4C20.4044 4.07426 20.4409 4.14506 20.4988 4.20266L25.9915 9.6657C25.9943 9.6685 25.9971 9.67125 26 9.67395Z" fill="#323232" />
                                <path d="M28.4938 7.83547L7.24228 28.436C6.86915 28.7977 6.36989 29 5.85023 29L2.61728 29H2.56775C1.70191 29 1 28.2981 1 27.4323V24.3596C1 23.8184 1.21935 23.3003 1.60795 22.9236L22.8333 2.34836C27.6852 -1.571 32.5371 3.91608 28.4938 7.83547Z" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M21 4L26 10" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                }
                <Detail field="Address" value={ f_user.address } edit={ isEdit } notEdit={ () => setEdit(false) } setValue={ (value) => setAddress(value) } />
                <Detail field="BirthDate" value={ fbirthday } edit={ isEdit } notEdit={ () => setEdit(false) } setValue={ (value) => setBirthday(value) } />
                <Detail field="BirthPlace" value={ f_user.birthplace } edit={ isEdit } notEdit={ () => setEdit(false) } setValue={ (value) => setBirthplace(value) } />
                <Detail field="Email" value={ f_user.email } edit={ isEdit } notEdit={ () => setEdit(false) } setValue={ (value) => setEmail(value) } />
                <Detail field="Phone" value={ f_user.phone } edit={ isEdit } notEdit={ () => setEdit(false) } setValue={ (value) => setPhone(value) } />
            </div>
        </div>
    )
}



function Detail(props)
{
    return (
        <div className="detail">
            <p style={ { position: 'absolute', right: '70%' } }>{ props.field } :</p>
            {
                props.edit ?
                    (
                        props.field !== "BirthDate" ? (
                            <div class="input-group mb-3" style={ { position: 'absolute', left: '40%', width: '60%', fontFamily: 'Inter' } }>
                                <input placeholder={ props.value } type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" onChange={ (event) => props.setValue(event.target.value) } />
                            </div>
                        )
                            :
                            (
                                <div class="md-form md-outline input-with-post-icon datepicker" id="prefill" style={ { position: 'absolute', left: '40%', width: '60%', fontFamily: 'Inter' } }>
                                    <input placeholder={ props.value } type="date" id="prefill-example" class="form-control" onChange={ (event) => props.setValue(event.target.value) } />
                                    <i class="fas fa-calendar input-prefix" />
                                </div>
                            )
                    )
                    :
                    (
                        <p style={ { position: 'absolute', left: '40%', textDecorationLine: props.field === 'Email' && 'underline' } }>{ props.value }</p>
                    )
            }
        </div>
    )
}

function Successfull(props)
{
    function handelOkay()
    {
        props.notSuccess();
        props.notEdit();
    }
    return (
        <div class="container flex-column"
            style={ {
                zIndex: 100,
                position: 'relative',
                top: '27%',
                width: '50%',
                height: '35%',
                backgroundColor: '#D9D9D9',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '30px',
                fontSize: '30px',
                paddingTop: '100px',
                fontWeight: 'bold',
                color: '#1CDC24'
            } }
        >
            Successful update
            <button class="cus-btn btn btn-primary" type="button" onClick={ handelOkay }
                style={ {
                    position: 'absolute',
                    width: '30%',
                    height: '25%',
                    top: '67%',
                    fontSize: '25px',
                    marginTop: '5px'
                } }
            >
                Okay
            </button>
        </div>
    )
}