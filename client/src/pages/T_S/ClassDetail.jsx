import styles from "./ClassDetail.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListStudent = () =>
{
      return (
            <>
            </>
      );
}

const ListSession = () =>
{
      return (
            <>
            </>
      );
}

const ClassDetail = () =>
{
      const Navigate = useNavigate();

      return (
            <div className={ `h-100 ${ styles.page } d-flex align-items-center justify-content-center` } style={ { marginLeft: '350px', width: 'calc(100% - 350px)' } }>
                  <div className={ `d-flex flex-column align-items-center ${ styles.board }` }>
                        <div className="mt-5">
                              <h1>Class Name</h1>
                              <p>Period</p>
                              <p>Status</p>
                              <p>Number of student</p>
                              <p>Number of sessions</p>
                        </div>
                        <div className="w-25 d-flex justify-content-around align-items-center mt-5">
                              <button className={ `${ styles.button }` }>Students</button>
                              <button className={ `${ styles.button }` }>Sessions</button>
                        </div>
                        <button className={ `mt-auto mb-5 ${ styles.back }` } onClick={ () => { Navigate(-1); } }>Back</button>
                  </div>
            </div>
      );
}

export default ClassDetail;