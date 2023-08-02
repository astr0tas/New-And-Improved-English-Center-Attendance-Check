import styles from './Stats.module.css';
import { Modal } from 'react-bootstrap';
import { domain } from '../../../../tools/domain';
import request from '../../../../tools/request';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Scatter } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, PointElement, LineElement, zoomPlugin, ChartDataLabels);

const scatterOptions = {
      scales: {
            x: {
                  display: false, // Hide the X-axis
                  type: 'linear', // Use 'linear' scale for the X-axis
                  min: 0, // Set the minimum value of the X-axis
                  max: 50, // Set the maximum value of the X-axis
                  ticks: {
                        stepSize: 1 // Set the maximum number of ticks displayed on the X-axis
                  },
            },
            y: {
                  type: 'linear', // Use 'linear' scale for the X-axis
                  min: 0, // Set the minimum value of the Y-axis
                  beginAtZero: true,
                  ticks: {
                        stepSize: 1 // Set the maximum number of ticks displayed on the Y-axis
                  },
            },
      },
      plugins: {
            datalabels: {
                  anchor: 'start',
                  align: 'start',
            },
            legend: {
                  display: false, // Hide the legend
            },
            tooltip: {
                  enabled: true,
                  callbacks: {
                        // Customize the tooltip to show the label for each point
                        label: (context) =>
                        {
                              const label = `${ context.raw.label }`;
                              return label;
                        },
                  },
            },
            zoom: {
                  pan: {
                        enabled: true,
                        mode: 'x',
                  },
                  zoom: {
                        wheel: {
                              enabled: true,
                              modifierKey: 'shift'
                        },
                        pinch: {
                              enabled: true
                        },
                        mode: 'x',
                  }
            }
      }
};

const pieOption = {
      plugins: {
            datalabels: {
                  display: false,
            },
      },
};

function generateColors(n)
{
      const colorArray = [];
      const borderArray = [];
      while (colorArray.length < n)
      {
            const red = Math.floor(Math.random() * 256);
            const green = Math.floor(Math.random() * 256);
            const blue = Math.floor(Math.random() * 256);
            const rgbaColor = `rgba(${ red }, ${ green }, ${ blue }, 0.2)`;
            const borderColor = `rgba(${ red }, ${ green }, ${ blue }, 1)`;

            if (!colorArray.includes(rgbaColor))
            {
                  colorArray.push(rgbaColor);
                  borderArray.push(borderColor);
            }
      }

      return { color: colorArray, border: borderArray };
}

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
                              setTotalSession(res.data[0][0].total);
                              setCurrentSession(res.data[1][0].current);

                              let temp = generateColors(res.data[2].length);
                              const teachers = [], data1 = [], data2 = [], data3 = [], data0 = [];
                              for (let i = 0; i < res.data[2].length; i++)
                              {
                                    teachers.push({ name: res.data[2][i].name, id: res.data[2][i].id });
                                    data1.push(null);
                                    data2.push(null);
                                    data3.push(null);
                                    data0.push(null);
                              }

                              for (let i = 0; i < res.data[3].length; i++)
                              {
                                    const idx = teachers.findIndex(elem => elem.id === res.data[3][i].id);
                                    if (idx !== -1)
                                          data1[idx] = res.data[3][i].teacherOnClass;
                              }
                              setTeacherData1(data1.find(elem => elem !== null) !== undefined ? {
                                    labels: teachers.map(elem => elem.name),
                                    datasets: [
                                          {
                                                label: '# of on class sessions',
                                                data: data1,
                                                backgroundColor: temp.color,
                                                borderColor: temp.border,
                                                borderWidth: 1,
                                          },
                                    ],
                              } : null);

                              for (let i = 0; i < res.data[4].length; i++)
                              {
                                    const idx = teachers.findIndex(elem => elem.id === res.data[4][i].id);
                                    if (idx !== -1)
                                          data2[idx] = res.data[4][i].teacherLate;
                              }
                              setTeacherData2(data2.find(elem => elem !== null) !== undefined ? {
                                    labels: teachers.map(elem => elem.name),
                                    datasets: [
                                          {
                                                label: '# of late sessions',
                                                data: data2,
                                                backgroundColor: temp.color,
                                                borderColor: temp.border,
                                                borderWidth: 1,
                                          },
                                    ],
                              } : null);

                              for (let i = 0; i < res.data[5].length; i++)
                              {
                                    const idx = teachers.findIndex(elem => elem.id === res.data[5][i].id);
                                    if (idx !== -1)
                                          data3[idx] = res.data[5][i].teacherAbsent;
                              }
                              setTeacherData3(data3.find(elem => elem !== null) !== undefined ? {
                                    labels: teachers.map(elem => elem.name),
                                    datasets: [
                                          {
                                                label: '# of absent sessions',
                                                data: data3,
                                                backgroundColor: temp.color,
                                                borderColor: temp.border,
                                                borderWidth: 1,
                                          },
                                    ],
                              } : null);

                              for (let i = 0; i < res.data[6].length; i++)
                              {
                                    const idx = teachers.findIndex(elem => elem.id === res.data[6][i].id);
                                    if (idx !== -1)
                                          data0[idx] = res.data[6][i].teacherUncheck;
                              }
                              setTeacherData0(data0.find(elem => elem !== null) !== undefined ? {
                                    labels: teachers.map(elem => elem.name),
                                    datasets: [
                                          {
                                                label: '# of absent sessions',
                                                data: data0,
                                                backgroundColor: temp.color,
                                                borderColor: temp.border,
                                                borderWidth: 1,
                                          },
                                    ],
                              } : null);

                              temp = generateColors(res.data[7].length);
                              const students = [], studentData1 = [], studentData2 = [], studentData3 = [], studentData0 = [];
                              for (let i = 0; i < res.data[7].length; i++)
                              {
                                    students.push({ name: res.data[7][i].name, id: res.data[7][i].id });
                                    studentData1.push({ x: null, y: null });
                                    studentData2.push({ x: null, y: null });
                                    studentData3.push({ x: null, y: null });
                                    studentData0.push({ x: null, y: null });
                              }

                              for (let i = 0; i < res.data[8].length; i++)
                              {
                                    const idx = students.findIndex(elem => elem.id === res.data[8][i].id);
                                    if (idx !== -1)
                                          studentData1[idx] = { x: (i + 1) * 5, y: res.data[8][i].studentOnClass, label: res.data[8][i].name };
                              }
                              setStudentData1(studentData1.find(elem => elem.y !== null) !== undefined ? {
                                    datasets: [
                                          {
                                                data: studentData1,
                                                backgroundColor: temp.border,
                                                pointRadius: 10,
                                                hoverRadius: 10,
                                                pointBorderWidth: 1
                                          },
                                    ],
                              } : null);

                              for (let i = 0; i < res.data[9].length; i++)
                              {
                                    const idx = students.findIndex(elem => elem.id === res.data[9][i].id);
                                    if (idx !== -1)
                                          studentData2[idx] = { x: (i + 1) * 5, y: res.data[9][i].studentLate, label: res.data[9][i].name };
                              }
                              setStudentData2(studentData2.find(elem => elem.y !== null) !== undefined ? {
                                    datasets: [
                                          {
                                                data: studentData2,
                                                backgroundColor: temp.border,
                                                pointRadius: 10,
                                                hoverRadius: 10,
                                                pointBorderWidth: 1
                                          },
                                    ],
                              } : null);

                              for (let i = 0; i < res.data[10].length; i++)
                              {
                                    const idx = students.findIndex(elem => elem.id === res.data[10][i].id);
                                    if (idx !== -1)
                                          studentData3[idx] = { x: (i + 1) * 5, y: res.data[10][i].studentAbsent, label: res.data[10][i].name };
                              }
                              setStudentData3(studentData3.find(elem => elem.y !== null) !== undefined ? {
                                    datasets: [
                                          {
                                                data: studentData3,
                                                backgroundColor: temp.border,
                                                pointRadius: 10,
                                                hoverRadius: 10,
                                                pointBorderWidth: 1
                                          },
                                    ],
                              } : null);

                              for (let i = 0; i < res.data[11].length; i++)
                              {
                                    const idx = students.findIndex(elem => elem.id === res.data[11][i].id);
                                    if (idx !== -1)
                                          studentData0[idx] = { x: (i + 1) * 5, y: res.data[11][i].studentUncheck, label: res.data[11][i].name };
                              }
                              setStudentData0(studentData0.find(elem => elem.y !== null) !== undefined ? {
                                    datasets: [
                                          {
                                                data: studentData0,
                                                backgroundColor: temp.border,
                                                pointRadius: 10,
                                                hoverRadius: 10,
                                                pointBorderWidth: 1
                                          },
                                    ],
                              } : null);
                        })
                        .catch(error => console.error(error));
            }
      }, [props.id, props.name, props.showPopUp]);

      return (
            <Modal show={ props.showPopUp } onHide={ () => { clearOut(); props.setShowPopUp(false); } }
                  dialogClassName={ `${ styles.dialog } modal-dialog-scrollable` } contentClassName={ `w-100 h-100` }
                  className={ `reAdjustModel ${ styles.customModal } hideBrowserScrollbar` } container={ props.containerRef.current }>
                  <Modal.Header closeButton>
                        <h4 className='mb-0'>Statistics</h4>
                  </Modal.Header>
                  <Modal.Body className='d-flex flex-column align-items-center'>
                        <h5 className='my-3'>Total study sessions: { totalSession ? totalSession : 'N/A' }</h5>
                        <h5 className='my-3'>Current attended sessions: { currentSession ? currentSession : 'N/A' }</h5>
                        <h3 className='my-3'>Teachers</h3>
                        <div className='w-100 d-flex flex-column align-items-center'>
                              { teacherData1 &&
                                    <>
                                          <div className='d-flex align-items-center'>
                                                <p>Status:&nbsp;</p>
                                                <p style={ { color: '#128400' } }>On going</p>
                                          </div>
                                          <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                                <Pie data={ teacherData1 } options={ pieOption } />
                                          </div>
                                    </>
                              }
                              { teacherData2 &&
                                    <>
                                          <div className='d-flex align-items-center mt-5'>
                                                <p>Status:&nbsp;</p>
                                                <p style={ { color: 'orange' } }>Late</p>
                                          </div>
                                          <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                                <Pie data={ teacherData2 } options={ pieOption } />
                                          </div>
                                    </>
                              }
                              { teacherData3 &&
                                    <>
                                          <div className='d-flex align-items-center mt-5'>
                                                <p>Status:&nbsp;</p>
                                                <p style={ { color: 'red' } }>Absent</p>
                                          </div>
                                          <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                                <Pie data={ teacherData3 } options={ pieOption } />
                                          </div>
                                    </>
                              }
                              { teacherData0 &&
                                    <>
                                          <div className='d-flex align-items-center mt-5'>
                                                <p>Status:&nbsp;</p>
                                                <p style={ { color: 'gray' } }>Unchecked</p>
                                          </div>
                                          <div className='w-100 h-100 d-flex justify-content-center' style={ { maxHeight: '500px', maxWidth: '500px', minHeight: '200px', minWidth: '200px' } }>
                                                <Pie data={ teacherData0 } options={ pieOption } />
                                          </div>
                                    </>
                              }
                        </div>
                        <h3 className='my-5'>Students</h3>
                        <div className='w-100 d-flex flex-column align-items-center'>
                              { studentData1 &&
                                    <>
                                          <div className='d-flex align-items-center'>
                                                <p>Status:&nbsp;</p>
                                                <p style={ { color: '#128400' } }>On going</p>
                                          </div>
                                          <div className={ `border border-secondary p-2 ${ styles.div }` }>
                                                <Scatter data={ studentData1 } options={ scatterOptions } />
                                          </div>
                                    </>
                              }
                              { studentData2 &&
                                    <>
                                          <div className='d-flex align-items-center mt-5'>
                                                <p>Status:&nbsp;</p>
                                                <p style={ { color: 'orange' } }>Late</p>
                                          </div>
                                          <div className={ `border border-secondary p-2 ${ styles.div }` }>
                                                <Scatter data={ studentData2 } options={ scatterOptions } />
                                          </div>
                                    </>
                              }
                              { studentData3 &&
                                    <>
                                          <div className='d-flex align-items-center mt-5'>
                                                <p>Status:&nbsp;</p>
                                                <p style={ { color: 'red' } }>Absent</p>
                                          </div>
                                          <div className={ `border border-secondary p-2 ${ styles.div }` }>
                                                <Scatter data={ studentData3 } options={ scatterOptions } />
                                          </div>
                                    </>
                              }
                              { studentData0 &&
                                    <>
                                          <div className='d-flex align-items-center mt-5'>
                                                <p>Status:&nbsp;</p>
                                                <p style={ { color: 'gray' } }>Unchecked</p>
                                          </div>
                                          <div className={ `border border-secondary p-2 ${ styles.div }` }>
                                                <Scatter data={ studentData0 } options={ scatterOptions } />
                                          </div>
                                    </>
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