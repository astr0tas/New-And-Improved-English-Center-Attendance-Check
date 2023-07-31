import { useEffect, useState } from 'react';
import styles from './MyClassList.module.css';
import request from '../../../../tools/request';
import { domain } from '../../../../tools/domain';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { DMY } from '../../../../tools/dateFormat';
import { useOutletContext } from 'react-router-dom';

const Card = (props) =>
{
      return (
            <div className={ `col-${ 12 / props.limit } d-flex justify-content-center align-items-center` }>
                  <div className={ `card border border-dark` } style={ { width: '250px' } }>
                        <img className="card-img-top" src={ require('../../../../images/english-class.jpg') } alt=""></img>
                        <div className="align-items-center d-flex flex-column mb-2 mt-2">
                              <h5>Classname: { props.name }</h5>
                              <p>Period: { props.start ? DMY(props.start) : 'N/A' } - { props.end ? DMY(props.end) : 'N/A' }</p>
                              <p>Students: { props.currentStudent ? props.currentStudent : 'N/A' } / { props.maxStudent ? props.maxStudent : 'N/A' }</p>
                              <p>Sessions: { props.currentSession ? props.currentSession : 'N/A' } / { props.initialSession ? props.initialSession : 'N/A' }</p>
                              <NavLink to={ `./detail/${ props.name }` }>
                                    <button className="btn btn-primary btn-sm">Detail</button>
                              </NavLink>
                        </div>
                  </div>
            </div>
      )
}

const Active = (props) =>
{
      const [searchName, setSearchName] = useState('');
      const [classList, setClassList] = useState([]);
      const [offset, setOffset] = useState(0);
      const [disableNextButton, setDisableNextButton] = useState(false);
      const [counter, setCounter] = useState(-1);

      let timer;

      useEffect(() =>
      {
            if (props.limit !== -1)
            {
                  const localOffset = offset;
                  if (localOffset % props.limit !== 0)
                        setOffset(localOffset - localOffset % props.limit);
                  request.post(`http://${ domain }/staff/classList`, { params: { name: searchName, limit: props.limit, userType: props.userType, offset: localOffset, status: 2 } }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                        .then(res =>
                        {
                              if (res.status === 200)
                              {
                                    if (counter === -1)
                                          setCounter(res.data[0][0].counter)
                                    if (props.limit + offset >= counter)
                                          setDisableNextButton(true);
                                    else if (props.limit + offset < counter)
                                          setDisableNextButton(false);
                                    const temp = [];
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<Card key={ i } name={ res.data[i][0].name } start={ res.data[i][0].startDate } end={ res.data[i][0].endDate }
                                                maxStudent={ res.data[i][0].maxStudent } currentStudent={ res.data[i][0].currentStudents } limit={ props.limit }
                                                initialSession={ res.data[i][0].initialSession } currentSession={ res.data[i][0].currentSessions } />);
                                    setClassList(temp);
                              }
                              else
                                    setClassList([]);
                        })
                        .catch(err => console.error(err));
            }

            // eslint-disable-next-line
      }, [searchName, offset, props.limit, props.userType]);

      return (
            <div className='w-100 h-100 d-flex flex-column mt-5 mb-5' style={ { maxHeight: classList.length ? '450px' : '80px' } }>
                  <div className='ms-3 d-flex align-items-sm-center flex-column flex-sm-row'>
                        <h5 className='mb-0 me-sm-2' style={ { color: '#128400' } }>Currently</h5>
                        <div className='ms-sm-2 mt-2 mt-sm-0 position-relative'>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input placeholder='Find class' type='text' style={ { fontSize: '1rem', paddingLeft: '30px' } } onChange={ e =>
                              {
                                    clearTimeout(timer);
                                    timer = setTimeout(() =>
                                    {
                                          setSearchName(e.target.value);
                                    }, 1000);
                              } } className={ `${ styles.searchInput }` }></input>
                        </div>
                  </div>
                  <div className="flex-grow-1 w-100 d-flex align-items-center mt-2">
                        { classList }
                  </div>
                  <div className="mt-4 d-flex align-items-center justify-content-center">
                        {
                              classList.length !== 0 &&
                              <>
                                    <button className="btn btn-outline-secondary btn-sm me-2" disabled={ classList.length && offset === 0 } onClick={ () => setOffset(offset - props.limit) }>&lt;</button>
                                    <button className="btn btn-outline-secondary btn-sm ms-2" onClick={ () => setOffset(offset + props.limit) } disabled={ classList.length && disableNextButton }>&gt;</button>
                              </>
                        }
                  </div>
            </div>
      )
}

const Deactivated = (props) =>
{
      const [searchName, setSearchName] = useState('');
      const [classList, setClassList] = useState([]);
      const [offset, setOffset] = useState(0);
      const [disableNextButton, setDisableNextButton] = useState(false);
      const [counter, setCounter] = useState(-1);

      let timer;

      useEffect(() =>
      {
            if (props.limit !== -1)
            {
                  const localOffset = offset;
                  if (localOffset % props.limit !== 0)
                        setOffset(localOffset - localOffset % props.limit);
                  request.post(`http://${ domain }/staff/classList`, { params: { name: searchName, limit: props.limit, userType: props.userType, offset: localOffset, status: 1 } }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                        .then(res =>
                        {
                              if (res.status === 200)
                              {
                                    if (counter === -1)
                                          setCounter(res.data[0][0].counter)
                                    if (props.limit + offset >= counter)
                                          setDisableNextButton(true);
                                    else if (props.limit + offset < counter)
                                          setDisableNextButton(false);
                                    const temp = [];
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<Card key={ i } name={ res.data[i][0].name } start={ res.data[i][0].startDate } end={ res.data[i][0].endDate }
                                                maxStudent={ res.data[i][0].maxStudent } currentStudent={ res.data[i][0].currentStudents } limit={ props.limit }
                                                initialSession={ res.data[i][0].initialSession } currentSession={ res.data[i][0].currentSessions } />);
                                    setClassList(temp);
                              }
                              else
                                    setClassList([]);
                        })
                        .catch(err => console.error(err));
            }

            // eslint-disable-next-line
      }, [searchName, offset, props.limit, props.userType]);

      return (
            <div className='w-100 h-100 d-flex flex-column mt-5 mb-5' style={ { maxHeight: classList.length ? '450px' : '80px' } }>
                  <div className='ms-3 d-flex align-items-sm-center flex-column flex-sm-row'>
                        <h5 className='mb-0 me-sm-2' style={ { color: 'red' } }>Cancelled</h5>
                        <div className='ms-sm-2 mt-2 mt-sm-0 position-relative'>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input placeholder='Find class' type='text' style={ { fontSize: '1rem', paddingLeft: '30px' } } onChange={ e =>
                              {
                                    clearTimeout(timer);
                                    timer = setTimeout(() =>
                                    {
                                          setSearchName(e.target.value);
                                    }, 1000);
                              } } className={ `${ styles.searchInput }` }></input>
                        </div>
                  </div>
                  <div className="flex-grow-1 w-100 d-flex align-items-center mt-2">
                        { classList }
                  </div>
                  <div className="mt-4 d-flex align-items-center justify-content-center">
                        {
                              classList.length !== 0 &&
                              <>
                                    <button className="btn btn-outline-secondary btn-sm me-2" disabled={ classList.length && offset === 0 } onClick={ () => setOffset(offset - props.limit) }>&lt;</button>
                                    <button className="btn btn-outline-secondary btn-sm ms-2" onClick={ () => setOffset(offset + props.limit) } disabled={ classList.length && disableNextButton }>&gt;</button>
                              </>
                        }
                  </div>
            </div>
      )
}

const Finished = (props) =>
{
      const [searchName, setSearchName] = useState('');
      const [classList, setClassList] = useState([]);
      const [offset, setOffset] = useState(0);
      const [disableNextButton, setDisableNextButton] = useState(false);
      const [counter, setCounter] = useState(-1);

      let timer;

      useEffect(() =>
      {
            if (props.limit !== -1)
            {
                  const localOffset = offset;
                  if (localOffset % props.limit !== 0)
                        setOffset(localOffset - localOffset % props.limit);
                  request.post(`http://${ domain }/staff/classList`, { params: { name: searchName, limit: props.limit, userType: props.userType, offset: localOffset, status: 0 } }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                        .then(res =>
                        {
                              if (res.status === 200)
                              {
                                    if (counter === -1)
                                          setCounter(res.data[0][0].counter)
                                    if (props.limit + offset >= counter)
                                          setDisableNextButton(true);
                                    else if (props.limit + offset < counter)
                                          setDisableNextButton(false);
                                    const temp = [];
                                    for (let i = 0; i < res.data.length; i++)
                                          temp.push(<Card key={ i } name={ res.data[i][0].name } start={ res.data[i][0].startDate } end={ res.data[i][0].endDate }
                                                maxStudent={ res.data[i][0].maxStudent } currentStudent={ res.data[i][0].currentStudents } limit={ props.limit }
                                                initialSession={ res.data[i][0].initialSession } currentSession={ res.data[i][0].currentSessions } />);
                                    setClassList(temp);
                              }
                              else
                                    setClassList([]);
                        })
                        .catch(err => console.error(err));
            }

            // eslint-disable-next-line
      }, [searchName, offset, props.limit, props.userType]);

      return (
            <div className='w-100 h-100 d-flex flex-column mt-5' style={ { maxHeight: classList.length ? '450px' : '80px' } }>
                  <div className='ms-3 d-flex align-items-sm-center flex-column flex-sm-row'>
                        <h5 className='mb-0 me-sm-2' style={ { color: 'gray' } }>Finished</h5>
                        <div className='ms-sm-2 mt-2 mt-sm-0 position-relative'>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input placeholder='Find class' type='text' style={ { fontSize: '1rem', paddingLeft: '30px' } } onChange={ e =>
                              {
                                    clearTimeout(timer);
                                    timer = setTimeout(() =>
                                    {
                                          setSearchName(e.target.value);
                                    }, 1000);
                              } } className={ `${ styles.searchInput }` }></input>
                        </div>
                  </div>
                  <div className="flex-grow-1 w-100 d-flex align-items-center mt-2">
                        { classList }
                  </div>
                  <div className="mt-4 d-flex align-items-center justify-content-center mb-4">
                        {
                              classList.length !== 0 &&
                              <>
                                    <button className="btn btn-outline-secondary btn-sm me-2" disabled={ classList.length && offset === 0 } onClick={ () => setOffset(offset - props.limit) }>&lt;</button>
                                    <button className="btn btn-outline-secondary btn-sm ms-2" onClick={ () => setOffset(offset + props.limit) } disabled={ classList.length && disableNextButton }>&gt;</button>
                              </>
                        }
                  </div>
            </div>
      )
}

const MyClassList = () =>
{
      document.title = 'My Class';

      const [limit, setLimit] = useState(-1);
      const userType = useOutletContext();

      useEffect(() =>
      {
            const handleResize = () =>
            {
                  if (window.innerWidth < 576 && limit !== 1)
                        setLimit(1);
                  else if (window.innerWidth < 992 && window.innerWidth >= 576 && limit !== 2)
                        setLimit(2);
                  else if (window.innerWidth < 1600 && window.innerWidth >= 992 && limit !== 3)
                        setLimit(3);
                  else if (window.innerWidth >= 1600 && limit !== 4)
                        setLimit(4);
            }

            window.addEventListener('resize', handleResize);

            handleResize();

            return () =>
            {
                  window.removeEventListener('resize', handleResize);
            }
      }, [limit]);

      return (
            <div className='w-100 h-100 overflow-auto'>
                  <Active userType={ userType } limit={ limit } />
                  <Deactivated userType={ userType } limit={ limit } />
                  <Finished userType={ userType } limit={ limit } />
            </div>
      )
}

export default MyClassList;