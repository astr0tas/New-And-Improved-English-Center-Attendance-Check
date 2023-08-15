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
      const [start, setStart] = useState(null);
      const [end, setEnd] = useState(null);
      const [totalSession, setTotalSession] = useState(null);
      const [currentSession, setCurrentSession] = useState(null);
      const [data, setData] = useState(null);

      const clearOut = () =>
      {
            setStart(null);
            setEnd(null);
            setTotalSession(null);
            setCurrentSession(null);
            setData(null);
      }

      useEffect(() =>
      {
            if (props.showPopUp)
            {
                  request.post(`http://${ domain }/admin/studentStats`, { params: { id: props.id, name: props.chosenClassName } }, { headers: { 'Content-Type': 'application/json' } })
                        .then(res =>
                        {
                              setStart(res.data[0][0].start_date ? res.data[0][0].start_date : null);
                              setEnd(res.data[0][0].end_date ? res.data[0][0].end_date : null);
                              setTotalSession(res.data[1][0].total);
                              setCurrentSession(res.data[2][0].current);
                              if (res.data[3][0].onClass !== 0 || res.data[4][0].late !== 0 || res.data[5][0].absent !== 0 || res.data[6][0].uncheck !== 0)
                                    setData({
                                          labels: ['On class', 'Late', 'Absent', 'Unchecked'],
                                          datasets: [
                                                {
                                                      label: '# of current sessions',
                                                      data: [res.data[3][0].onClass, res.data[4][0].late, res.data[5][0].absent, res.data[6][0].uncheck],
                                                      backgroundColor: [
                                                            'rgba(18, 132, 0, 0.2)',
                                                            'rgba(255, 165, 0, 0.2)',
                                                            'rgba(255, 0, 0, 0.2)',
                                                            'rgba(192,192,192,0.2)'
                                                      ],
                                                      borderColor: [
                                                            'rgba(18, 132, 0, 1)',
                                                            'rgba(255, 165, 0, 1)',
                                                            'rgba(255, 0, 0, 1)',
                                                            'rgba(192,192,192,1)'
                                                      ],
                                                      borderWidth: 1,
                                                },
                                          ],
                                    });
                        })
                        .catch(error => console.error(error));
            }
      }, [props.id, props.chosenClassName, props.showPopUp])

      return (
            <Modal show={ props.showPopUp } onHide={ () => { clearOut(); props.setShowPopUp(false); } }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <h4 className='mb-0'>Class { props.chosenClassName }</h4>
                  </Modal.Header>
                  <Modal.Body className='d-flex flex-column align-items-center'>
                        <h5 className='my-3'>Start date: { start ? DMY(start) : 'N/A' }</h5>
                        <h5 className='my-3'>End date: { end ? DMY(end) : 'N/A' }</h5>
                        <h5 className='my-3'>Total study sessions: { totalSession ? totalSession : 'N/A' }</h5>
                        <h5 className='my-3'>Current attended sessions: { currentSession ? currentSession : 'N/A' }</h5>
                        { data &&
                              <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                    <Pie data={ data } />
                              </div>
                        }
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