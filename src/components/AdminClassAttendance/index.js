import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context";
import {
  SCAdminClassContainer,
  SCArrowLeftIcon,
  SCArrowRightIcon,
  SCArrowDownIcon
} from "./styles";

import Loading from "../Loading";

import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import firebase from "../Firebase";

// Måste göra ett case om firebase inte hitta några lectures
// Måste göra knapparna höger och vänster.

const AdminClassAttendance = () => {
  const {
    classDetailsObject: [{ selectedClassUid, className }]
  } = useContext(Context);

  const [noLectureState, setNoLectureState] = useState(false);

  const [lectureState, setLectureState] = useState({
    // selectedLecture: {
    //   className: null,
    //   students: null,
    //   date: null,
    //   lectureTimeUid: null
    // },
    selectedLectureIndex: null,
    allLectures: null
  });

  const [navigationState, setNavigationState] = useState(false);

  useEffect(() => {
    if (!lectureState.selectedLectureIndex && lectureState.allLectures) {
      console.log("LOOOP");

      setLectureState(prevState => ({
        ...prevState,
        selectedLectureIndex: prevState.allLectures.length - 1
      }));
    }
  }, [lectureState]);

  useEffect(() => {
    console.log("startar");
    const unsubscribe = firebase
      .classDetails(selectedClassUid)
      .collection("attendance")
      .onSnapshot(snap => {
        if (snap.empty) {
          setNoLectureState(true);
        } else {
          let orderDocs = snap.docs.sort(function(a, b) {
            return Number(a.id) - Number(b.id);
          });

          let orderedDocsToState = orderDocs.reduce((acc, obj) => {
            return [
              ...acc,
              {
                className: className,
                lectureTimeUid: obj.id,
                date: new Date(Number(obj.id) + 10000000)
                  .toISOString()
                  .slice(0, 10),
                students: obj.data()
                  ? Object.keys(obj.data()).map(name => ({
                      name: name,
                      attendance: obj.data()[name]
                    }))
                  : null
              }
            ];
          }, []);
          setLectureState(prevState => ({
            ...prevState,
            allLectures: orderedDocsToState
          }));
        }

        // let result = snap.docs.map(doc => doc);
      });

    return () => {
      unsubscribe();
    };
  }, [selectedClassUid, className]);

  const { selectedLectureIndex, allLectures } = lectureState;
  return (
    <>
      {noLectureState ? (
        <div>Denna klass har ingen anmäld närvaro än...</div>
      ) : allLectures && selectedLectureIndex ? (
        <SCAdminClassContainer navigationState={navigationState}>
          <div className="adminClassInfo">
            <SCArrowLeftIcon></SCArrowLeftIcon>
            <span>
              <h1>{allLectures[selectedLectureIndex].date}</h1>
              <p>{allLectures[selectedLectureIndex].className} närvarostatus</p>
            </span>
            <SCArrowRightIcon></SCArrowRightIcon>
          </div>
          <div
            className="adminClassNav"
            onClick={() => setNavigationState(!navigationState)}
          >
            <p>
              Nurvarande sortering <SCArrowDownIcon></SCArrowDownIcon>
            </p>
            <div className="sortingSelections">
              <button>Allas närvaro</button>
              <button>Frånvarande</button>
              <button>Närvarande</button>
            </div>
          </div>
          <div className="adminClassStudents">
            {allLectures[selectedLectureIndex].students.map(
              (student, index) => (
                <Button
                  key={student.name + index}
                  className="submitButton"
                  variant="contained"
                  color="primary"
                  type="button"
                >
                  {student.name}
                  <Switch></Switch>
                </Button>
              )
            )}
            {/* <Button
              className="submitButton"
              variant="contained"
              color="primary"
              type="button"
            >
              Patrick Anders
              <Switch size="small"></Switch>
            </Button>
            <Button
              className="submitButton"
              variant="contained"
              color="primary"
              type="button"
            >
              hello
              <Switch></Switch>
            </Button> */}
          </div>
        </SCAdminClassContainer>
      ) : (
        <Loading text="Hämtar föreläsningar..."></Loading>
      )}
    </>
  );
};

export default AdminClassAttendance;
