import { useEffect, useRef, useState } from 'react';
import styles from './Profile.module.css';
import { Modal } from 'react-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import { GiCancel, GiConfirmed } from 'react-icons/gi';
import { isRefValid } from '../../../tools/refChecker';
import '../../../css/scroll.css';

const Profile = () =>
{
      const [editMode, setEditMode] = useState(false);

      const [name, setName] = useState("N/A");
      const [address, setAddress] = useState("N/A");
      const [birthday, setBirthday] = useState("N/A");
      const [birthplace, setBirthplace] = useState("N/A");
      const [email, setEmail] = useState("N/A");
      const [phone, setPhone] = useState("N/A");
      const [ssn, setSSN] = useState("N/A");
      const [image, setImage] = useState(null);

      const image_input = useRef(null);
      const formRef = useRef(null);
      const profileImg = useRef(null);


      useEffect(() =>
      {

      }, []);

      const triggerEdit = (val) =>
      {
            setEditMode(val);
      }

      const changeInfo = (e) =>
      {
            e.preventDefault();
      }

      return (
            <div className="w-100 h-100 d-flex overflow-auto">
                  <form className='mx-auto my-auto d-flex flex-column align-items-center w-100' onSubmit={ changeInfo }>
                        <img alt='profile' src={ require('../../../images/profile.png') } className={ `${ styles.img } mt-2 mt-md-4` } ref={ profileImg }></img>
                        {
                              editMode &&
                              <label className={ `btn btn-sm btn-light border border-dark mt-3 mx-auto` } ref={ image_input }>
                                    <input type='file' className='d-none' onChange={ e =>
                                    {
                                          if (e.target.files.length === 0)
                                          {
                                                setImage(null);
                                                if (isRefValid(profileImg))
                                                      profileImg.current.src = require('../../../images/profile.png');
                                          }
                                          else
                                          {
                                                setImage(e.target.files[0]);
                                                const file = e.target.files[0];
                                                const reader = new FileReader();
                                                reader.readAsArrayBuffer(file);
                                                reader.onload = () =>
                                                {
                                                      const blob = new Blob([reader.result], { type: file.type });
                                                      const url = URL.createObjectURL(blob);
                                                      if (isRefValid(profileImg))
                                                            profileImg.current.src = url;
                                                };
                                          }
                                    } } accept=".jpg,.jpeg,.png"></input>
                                    Choose file
                              </label>
                        }
                        <h2 className='mt-3'>{ name }</h2>
                        <div className={ `${ styles.container } d-flex flex-column h-100` }>
                              <div className={ `ms-auto me-3` }>
                                    {
                                          !editMode &&
                                          <BsPencilSquare className={ `${ styles.pencil } mt-1` } onClick={ () => triggerEdit(true) } />
                                    }
                                    {
                                          editMode &&
                                          <div className={ `align-items-center mt-1 d-flex` }>
                                                <GiCancel className={ `${ styles.pencil } ${ styles.cancel } me-1` } onClick={ () => triggerEdit(false) } />
                                                <button type='submit' className={ `border border-0 bg-transparent p-0 ms-1` } style={ { width: '25px' } }>
                                                      <GiConfirmed className={ `${ styles.pencil } ${ styles.confirm }` } />
                                                </button>
                                          </div>
                                    }
                              </div>
                              <div className={ `w-75 align-self-center ms-3 overflow-auto hideBrowserScrollbar` }>
                                    <div className='d-flex align-items-center mt-2 justify-content-center'>
                                          <strong>SSN:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0'>{ ssn }</p>
                                          }
                                          {
                                                editMode && <input className={ `${ styles.inputs }` } type='text' maxLength='12' pattern='[0-9]{12}'></input>
                                          }
                                    </div>
                                    <div className='d-flex align-items-center mt-2 justify-content-center'>
                                          <strong>Birthdate:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0'>{ birthday }</p>
                                          }
                                          {
                                                editMode && <input className={ `${ styles.inputs }` } type='date'></input>
                                          }
                                    </div>
                                    <div className='d-flex align-items-center mt-2 justify-content-center'>
                                          <strong>Birthplace:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0'>{ birthplace }</p>
                                          }
                                          {
                                                editMode && <input className={ `${ styles.inputs }` }></input>
                                          }
                                    </div>
                                    <div className='d-flex align-items-center mt-2 justify-content-center'>
                                          <strong>Email:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0'>{ email }</p>
                                          }
                                          {
                                                editMode && <input className={ `${ styles.inputs }` } type='email'></input>
                                          }
                                    </div>
                                    <div className='d-flex align-items-center mt-2 mb-2 justify-content-center'>
                                          <strong>Phone:&nbsp;&nbsp;</strong>
                                          {
                                                !editMode &&
                                                <p className='mb-0'>{ phone }</p>
                                          }
                                          {
                                                editMode && <input className={ `${ styles.inputs }` } type='text' maxLength='10' pattern='[0-9]{10}'></input>
                                          }
                                    </div>
                              </div>
                        </div>
                  </form>
            </div>
      )
}

export default Profile;