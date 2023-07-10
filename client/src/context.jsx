import { createContext, useState } from "react"

export const context = createContext();

export const ContextProvider = (props) =>
{
      const [chosenRole, setChosenRole] = useState(0);
      const [staffType, setStaffType] = useState(0);
      const [classState, setClassState] = useState(1);
      const [studentList, setStudentList] = useState(true);

      return (
            <context.Provider value={ {
                  chosenRole, setChosenRole,
                  staffType, setStaffType,
                  classState, setClassState,
                  studentList, setStudentList
            } }>
                  { props.children }
            </context.Provider>
      );
}