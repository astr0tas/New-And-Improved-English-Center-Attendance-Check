import styles from './Stats.module.css';
import { Modal } from 'react-bootstrap';
import { domain } from '../../../../tools/domain';
import request from '../../../../tools/request';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { DMY } from '../../../../tools/dateFormat';

ChartJS.register(ArcElement, Tooltip, Legend);

const Stats = (props) =>
{
      const [totalSession, setTotalSession] = useState(null);
      const [currentSession, setCurrentSession] = useState(null);
      const [teacherData1, setTeacherData1] = useState(null);
      const [teacherData2, setTeacherData2] = useState(null);
      const [teacherData3, setTeacherData3] = useState(null);
      const [teacherData0, setTeacherData0] = useState(null);
      const [studentData1, setStudentData1] = useState(null);
      const [studentData2, setStudentData2] = useState(null);
      const [studentData3, setStudentData3] = useState(null);
      const [studentData0, setStudentData0] = useState(null);

      const clearOut = () =>
      {
            setTotalSession(null);
            setCurrentSession(null);
            setTeacherData0(null);
            setTeacherData1(null);
            setTeacherData2(null);
            setTeacherData3(null);
            setStudentData0(null);
            setStudentData1(null);
            setStudentData2(null);
            setStudentData3(null);
      }

      useEffect(() =>
      {
            if (props.showPopUp)
            {
                  request.post(`http://${ domain }/admin/classStats`, { params: { name: props.name } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              console.log(res);
                              // setTotalSession(res.data[1][0].total);
                              // setCurrentSession(res.data[2][0].current);
                              // setData({
                              //       labels: ['On class', 'Late', 'Absent', 'Unchecked'],
                              //       datasets: [
                              //             {
                              //                   label: '# of current sessions',
                              //                   data: [res.data[3][0].onClass, res.data[4][0].late, res.data[5][0].absent, res.data[6][0].uncheck],
                              //                   backgroundColor: [
                              //                         'rgba(18, 132, 0, 0.2)',
                              //                         'rgba(255, 165, 0, 0.2)',
                              //                         'rgba(255, 0, 0, 0.2)',
                              //                         'rgba(192,192,192,0.2)'
                              //                   ],
                              //                   borderColor: [
                              //                         'rgba(18, 132, 0, 1)',
                              //                         'rgba(255, 165, 0, 1)',
                              //                         'rgba(255, 0, 0, 1)',
                              //                         'rgba(192,192,192,1)'
                              //                   ],
                              //                   borderWidth: 1,
                              //             },
                              //       ],
                              // });
                        })
                        .catch(error => console.error(error));
            }
      }, [props.id, props.name, props.showPopUp]);

      return (
            <Modal show={ props.showPopUp } onHide={ () => { clearOut(); props.setShowPopUp(false); } }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <h4 className='mb-0'>Class { props.chosenClassName }</h4>
                  </Modal.Header>
                  <Modal.Body className='d-flex flex-column align-items-center'>
                        <h5 className='my-3'>Total study sessions: { totalSession ? totalSession : 'N/A' }</h5>
                        <h5 className='my-3'>Current attended sessions: { currentSession ? currentSession : 'N/A' }</h5>
                        <h3 className='my-3'>Teachers</h3>
                        <div className='w-100 d-flex flex-column align-items-center'>
                              <div className='d-flex align-items-center'>
                                    <p>Status:&nbsp;</p>
                                    <p style={ { color: '#128400' } }>On going</p>
                              </div>
                              { teacherData1 &&
                                    <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                          <Pie data={ teacherData1 } />
                                    </div>
                              }
                              <div className='d-flex align-items-center'>
                                    <p>Status:&nbsp;</p>
                                    <p style={ { color: 'orange' } }>Late</p>
                              </div>
                              { teacherData2 &&
                                    <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                          <Pie data={ teacherData2 } />
                                    </div>
                              }
                              <div className='d-flex align-items-center'>
                                    <p>Status:&nbsp;</p>
                                    <p style={ { color: 'red' } }>Absent</p>
                              </div>
                              { teacherData3 &&
                                    <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                          <Pie data={ teacherData3 } />
                                    </div>
                              }
                              <div className='d-flex align-items-center'>
                                    <p>Status:&nbsp;</p>
                                    <p style={ { color: 'gray' } }>Unchecked</p>
                              </div>
                              { teacherData0 &&
                                    <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                          <Pie data={ teacherData0 } />
                                    </div>
                              }
                        </div>
                        <h3 className='my-3'>Students</h3>
                        <div className='w-100 d-flex flex-column align-items-center'>
                              <div className='d-flex align-items-center'>
                                    <p>Status:&nbsp;</p>
                                    <p style={ { color: '#128400' } }>On going</p>
                              </div>
                              { studentData1 &&
                                    <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                          <Pie data={ studentData1 } />
                                    </div>
                              }
                              <div className='d-flex align-items-center'>
                                    <p>Status:&nbsp;</p>
                                    <p style={ { color: 'orange' } }>Late</p>
                              </div>
                              { studentData2 &&
                                    <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                          <Pie data={ studentData2 } />
                                    </div>
                              }
                              <div className='d-flex align-items-center'>
                                    <p>Status:&nbsp;</p>
                                    <p style={ { color: 'red' } }>Absent</p>
                              </div>
                              { studentData3 &&
                                    <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                          <Pie data={ studentData3 } />
                                    </div>
                              }
                              <div className='d-flex align-items-center'>
                                    <p>Status:&nbsp;</p>
                                    <p style={ { color: 'gray' } }>Unchecked</p>
                              </div>
                              { studentData0 &&
                                    <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                          <Pie data={ studentData0 } />
                                    </div>
                              }
                        </div>
                  </Modal.Body>
                  <Modal.Footer className='justify-content-center'>
                        <button className='btn btn-secondary' onClick={ () =>
                        {
                              clearOut();
                              props.setShowPopUp(false);
                        } }>Close</button>
                  </Modal.Footer>
            </Modal>
      )
}

export default Stats;