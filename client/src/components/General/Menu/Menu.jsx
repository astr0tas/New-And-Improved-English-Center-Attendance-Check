import styles from './Menu.module.css';
import { VscAccount } from "react-icons/vsc";
import { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { MdOutlineClass } from 'react-icons/md';
import { AiOutlineHome, AiOutlinePoweroff } from 'react-icons/ai';
import { isRefValid } from '../../../tools/refChecker';
import { domain } from '../../../tools/domain';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { BsListColumnsReverse } from 'react-icons/bs';
import '../../../css/scroll.css';
import { context } from '../../../context';

const Menu = () =>
{
      const navbar = useRef(null);
      const tabs = useRef(null);
      const navToggler = useRef(null);
      const Navigate = useNavigate();

      const [showSidebar, setShowSidebar] = useState(true);
      const [render, setRender] = useState(false);

      const [userType, setUserType] = useState(0);

      const [activeTab, setActiveTab] = useState("");

      const { chosenRole, setChosenRole } = useContext(context);
      const { setStaffType } = useContext(context);
      const { setClassState } = useContext(context);

      const handleToggleSidebar = () =>
      {
            // Show or collapse the side menu
            if (showSidebar)
            {
                  if (isRefValid(navbar))
                        navbar.current.style.width = '0';
                  if (isRefValid(tabs))
                        tabs.current.style.opacity = '0';
            }
            else
            {
                  if (isRefValid(navbar))
                        navbar.current.style.width = '160px';
                  if (isRefValid(tabs))
                        tabs.current.style.opacity = '1';
            }
            setShowSidebar(!showSidebar);
      };

      const logOut = () =>
      {
            setChosenRole(chosenRole - chosenRole); // this is dumb but it it used for getting rid of the warning of not using `chosenRole`
            axios.get(`http://${ domain }/logout`, {
                  withCredentials: true
            })
                  .then(res =>
                  {
                        Navigate("/");
                  }).catch(err => { console.log(err); });
      }

      const trackWidth = () =>
      {
            // This function is use to ensure the collapsed side menu will be expanded when the browser's width > 768px.
            if (window.innerWidth >= 768)
            {
                  if (isRefValid(navbar))
                        navbar.current.style.width = '160px';
                  if (isRefValid(tabs))
                        tabs.current.style.opacity = '1';
                  setShowSidebar(true);
            }
      }

      useEffect(() =>
      {
            axios.get(`http://${ domain }/isLoggedIn`, {
                  withCredentials: true
            })
                  .then(res =>
                  {
                        if (!res.data.message[0])
                              Navigate("/");
                        else
                        {
                              setUserType(res.data.message[1]);
                              if (res.data.message[1] === 1)
                              {
                                    if (!window.location.pathname.includes('/profile')
                                          && !window.location.pathname.includes('/home')
                                          && !window.location.pathname.includes('/class-list')
                                          && !window.location.pathname.includes('/student-list')
                                          && !window.location.pathname.includes('/staff-list'))
                                          Navigate('not-found');
                              }
                              else
                              {
                                    if (!window.location.pathname.includes('/profile')
                                          && !window.location.pathname.includes('/home')
                                          && !window.location.pathname.includes('/my-class-list'))
                                          Navigate('not-found');
                              }
                              setActiveTab(window.location.pathname);
                        }
                  })
                  .catch(error => console.log(error));


            trackWidth();

            document.addEventListener('mousedown', function (event)
            {
                  // This event listener is used to close the side menu when the user clicked something outside of it.

                  // Check if clicked element is inside the side menu or the toggle button
                  if (isRefValid(navbar) && isRefValid(tabs) && isRefValid(navToggler)
                        && !navbar.current.contains(event.target) && !navToggler.current.contains(event.target))
                  {
                        if (showSidebar && window.innerWidth < 768)
                        {
                              navbar.current.style.width = '0';
                              tabs.current.style.opacity = '0';
                              setShowSidebar(!showSidebar);
                        }
                  }
            });

            window.addEventListener('resize', trackWidth);

            return () =>
            {
                  window.removeEventListener('resize', trackWidth);
            };

            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [Navigate, render]);

      return (
            <div className='w-100 h-100' style={ { backgroundColor: '#A8C5DA' } }>
                  { userType !== 0 &&
                        <>
                              <button className={ `${ styles.navToggler } position-fixed` } onClick={ handleToggleSidebar } ref={ navToggler }><FontAwesomeIcon icon={ faBars } style={ { color: "#000000", fontSize: '1.5rem' } } /></button>
                              <div className={ `h-100 d-flex flex-column position-fixed ${ styles.navbar }` } style={ { backgroundColor: '#E6E6E6' } } ref={ navbar }>
                                    <div className={ `w-100 ${ styles.dummy }` } style={ { minHeight: '50px' } }></div>
                                    <div className={ `flex-grow-1 d-flex flex-column overflow-auto ${ styles.tabs } mt-md-3 hideBrowserScrollbar` } ref={ tabs }>
                                          <NavLink to={ "/profile" } className={ `${ activeTab.includes('/profile') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center justify-content-center` } onClick={ () => setRender(!render) }>
                                                <div>
                                                      <span className={ `d-flex align-items-center justify-content-center p-0` } style={ { fontSize: '3.5rem', whiteSpace: 'nowrap', color: 'black' } }><VscAccount /></span>
                                                </div>
                                          </NavLink>
                                          <NavLink to={ "/home" } className={ `${ activeTab.includes('/home') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center` } onClick={ () => setRender(!render) }>
                                                <div>
                                                      <span className={ `d-flex align-items-center p-0 ms-2` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><AiOutlineHome className={ `me-1` } />Home</span>
                                                </div>
                                          </NavLink>
                                          {
                                                userType !== 1 &&
                                                <NavLink to={ "/my-class-list" } className={ `${ activeTab.includes('/my-class-list') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center` } onClick={ () => setRender(!render) }>
                                                      <div>
                                                            <span className={ `d-flex align-items-center p-0 ms-2` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><MdOutlineClass className={ `me-1` } />My classes</span>
                                                      </div>
                                                </NavLink>
                                          }
                                          {
                                                userType === 1 &&
                                                <>
                                                      <NavLink to={ "/class-list" } className={ `${ activeTab.includes('/class-list') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center` } onClick={ () => setRender(!render) }>
                                                            <div onClick={ () => setClassState(2) }>
                                                                  <span className={ `d-flex align-items-center p-0 ms-2` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><BsListColumnsReverse className={ `me-1` } />Classes</span>
                                                            </div>
                                                      </NavLink>
                                                      <NavLink to={ "/staff-list" } className={ `${ activeTab.includes('/staff-list') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center` } onClick={ () => setRender(!render) }>
                                                            <div onClick={ () => setStaffType(0) }>
                                                                  <span className={ `d-flex align-items-center p-0 ms-2` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><BsListColumnsReverse className={ `me-1` } />Staffs</span>
                                                            </div>
                                                      </NavLink>
                                                      <NavLink to={ "/student-list" } className={ `${ activeTab.includes('/student-list') ? styles.activeTab : styles.hover } text-decoration-none mb-3 d-flex align-items-center` } onClick={ () => setRender(!render) }>
                                                            <div>
                                                                  <span className={ `d-flex align-items-center p-0 ms-2` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'black' } }><BsListColumnsReverse className={ `me-1` } />Students</span>
                                                            </div>
                                                      </NavLink>
                                                </>
                                          }
                                          <div className={ `${ styles.hover } mt-auto d-flex align-items-center` } onClick={ () =>
                                          {
                                                logOut();
                                          } } >
                                                <span className={ `d-flex align-items-center p-0 ms-2` } style={ { fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'red' } }><AiOutlinePoweroff className={ `me-1` } />Log out</span>
                                          </div>
                                    </div>
                              </div>

                              <div className={ `${ styles.page } d-flex align-items-center justify-content-center` }>
                                    <div style={ {
                                          height: '98%',
                                          width: '98%',
                                          backgroundColor: '#E6E6E6',
                                          border: '2px solid black',
                                          borderRadius: '20px'
                                    } } className='d-flex flex-column'>
                                          <Outlet context={ userType } />
                                    </div>
                              </div>
                        </>
                  }
            </div >
      );
}

export default Menu;