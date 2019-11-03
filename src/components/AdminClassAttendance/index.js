import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context";
import {
  SCAdminClassContainer,
  SCArrowLeftIcon,
  SCArrowRightIcon,
  SCArrowDownIcon,
  SCSPanButton
} from "./styles";

import Loading from "../Loading";

import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import firebase from "../Firebase";
import moment from "moment";
import "moment/locale/sv";

const AdminClassAttendance = () => {
  const {
    classDetailsObject: [{ selectedClassUid, className }]
  } = useContext(Context);

  const [noLectureState, setNoLectureState] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [filteredAttendanceState, setFilterAttendanceState] = useState({
    currentSortingOption: "Sortera",
    studentsAttending: null,
    studentsAbscent: null
  });

  const [lectureIndex, setLectureIndex] = useState({
    noIndex: false,
    maxIndex: null,
    minIndex: 0,
    currentIndex: null,
    indexReached: {
      max: false,
      min: false
    }
  });

  const [allLectures, setAllLectures] = useState(null);

  const [navigationState, setNavigationState] = useState(false);

  useEffect(() => {
    console.log("---FIREBASE GETS LECTURES---");
    const unsubscribe = firebase
      .classDetails(selectedClassUid)
      .collection("attendance")
      .onSnapshot(snap => {
        if (snap.empty) {
          setNoLectureState(true);
        } else {
          //Sorterar docs till senaste föreläsning som uppdaterats

          let orderDocs = snap.docs.sort(function(a, b) {
            return Number(a.id) - Number(b.id);
          });

          //Fixar en ny array med flera objekt med reduce.
          //I students mappar jag ut true och false state med och sedan sorterar jag dem
          //så att tru states hamnar först i arrayen.

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
                  ? Object.keys(obj.data())
                      .map(name => ({
                        name: name,
                        attendance: obj.data()[name]
                      }))
                      .sort((objA, objB) => {
                        return objA.attendance - objB.attendance;
                      })
                      .reverse()
                  : null
              }
            ];
          }, []);

          setAllLectures(orderedDocsToState);
        }
      });

    return () => {
      unsubscribe();
      localStorage.removeItem("lectureIndex");
    };
  }, [selectedClassUid, className]);

  useEffect(() => {
    if (allLectures) {
      console.log("---SET NEWEST LECTURE IN SELECTED LECTURE STATE---");

      let maxIndex = Number(allLectures.length - 1);
      let storageLectureIndex = localStorage.getItem("lectureIndex");

      if (storageLectureIndex === maxIndex && maxIndex !== 0) {
        setLectureIndex({
          maxIndex: maxIndex,
          currentIndex: maxIndex,
          indexReached: {
            max: true,
            min: false
          }
        });
        setSelectedLecture(allLectures[maxIndex]);
      } else if (maxIndex === 0) {
        setLectureIndex(prevState => ({
          ...prevState,
          noIndex: true,
          currentIndex: maxIndex
        }));
        setSelectedLecture(allLectures[maxIndex]);
      } else if (storageLectureIndex && Number(storageLectureIndex) === 0) {
        setLectureIndex(prevState => ({
          ...prevState,
          currentIndex: storageLectureIndex,
          indexReached: {
            max: false,
            min: true
          }
        }));
        setSelectedLecture(allLectures[storageLectureIndex]);
      } else {
        setLectureIndex(prevState => ({
          ...prevState,
          maxIndex: maxIndex,
          currentIndex: storageLectureIndex || maxIndex
        }));
        setSelectedLecture(allLectures[storageLectureIndex || maxIndex]);
      }
    }
  }, [allLectures]);

  useEffect(() => {
    if (selectedLecture) {
      const studentsAttending = selectedLecture.students.filter(
        student => student.attendance
      );

      const studentsAbscent = selectedLecture.students.filter(
        student => !student.attendance
      );

      setFilterAttendanceState(prevState => ({
        ...prevState,
        currentSortingOption: prevState.currentSortingOption
          ? prevState.currentSortingOption
          : null,
        studentsAttending: studentsAttending,
        studentsAbscent: studentsAbscent
      }));
    }
  }, [selectedLecture]);

  useEffect(() => {
    console.log(" ---LECTURE INDEX CHANGE--- ");

    const {
      noIndex,
      maxIndex,
      currentIndex,
      minIndex,
      indexReached: { max, min }
    } = lectureIndex;

    if (!noIndex) {
      if (maxIndex === currentIndex && !max) {
        // console.log(" ---MAX INDEX TO TRUE--- " + maxIndex);
        setLectureIndex(prevState => ({
          ...prevState,
          indexReached: {
            max: true,
            min: false
          }
        }));
      } else if (currentIndex === 0 && !min) {
        // console.log(" ---MIN INDEX TO TRUE--- ");
        setLectureIndex(prevState => ({
          ...prevState,
          indexReached: {
            max: false,
            min: true
          }
        }));
      } else if (
        (max && currentIndex < maxIndex) ||
        (min && currentIndex > minIndex)
      ) {
        // console.log(" ---!!! ELSE !!!--- ");
        // console.log("CURRENT INDEX " + currentIndex);
        // console.log("MAX INDEX " + maxIndex);
        setLectureIndex(prevState => ({
          ...prevState,
          indexReached: {
            max: false,
            min: false
          }
        }));
      }
    }
  }, [lectureIndex]);

  // ------

  const changeLecture = value => {
    console.log(" ---Change Lecture--- ");

    const {
      currentIndex,
      indexReached: { max, min }
    } = lectureIndex;

    setFilterAttendanceState(prevState => ({
      ...prevState,
      currentSortingOption: showAll
    }));

    if (value === "increment" && !max) {
      let incNumber = Number(currentIndex) + 1;
      setLectureIndex(prevState => ({
        ...prevState,
        currentIndex: incNumber
      }));
      localStorage.setItem("lectureIndex", incNumber);
      setSelectedLecture(allLectures[incNumber]);
    } else if (value === "decrement" && !min) {
      let decrNumber = currentIndex - 1;
      setLectureIndex(prevState => ({
        ...prevState,
        currentIndex: decrNumber
      }));
      localStorage.setItem("lectureIndex", decrNumber);
      setSelectedLecture(allLectures[decrNumber]);
    }
  };

  const changeStudentAttendance = (studentName, studentAttendance) => {
    const { lectureTimeUid } = selectedLecture;

    let path = firebase
      .classDetails(selectedClassUid)
      .collection("attendance")
      .doc(lectureTimeUid);

    firebase.db.runTransaction(transaction => {
      return transaction.get(path).then(lectureDoc => {
        if (lectureDoc[studentName] === studentAttendance) {
          return;
        } else {
          transaction.update(path, {
            [studentName]: !studentAttendance
          });
        }
      });
    });
  };

  const filterStudents = value => {
    if (currentSortingOption === value) {
      setFilterAttendanceState(prevState => ({
        ...prevState,
        currentSortingOption: showAll
      }));
    } else if (value === showAttending) {
      setFilterAttendanceState(prevState => ({
        ...prevState,
        currentSortingOption: showAttending
      }));
    } else if (value === showAbscent) {
      setFilterAttendanceState(prevState => ({
        ...prevState,
        currentSortingOption: showAbscent
      }));
    }
  };

  const { currentSortingOption } = filteredAttendanceState;
  const {
    noIndex,
    indexReached: { min, max }
  } = lectureIndex;

  const showAll = "Sortera";
  const showAttending = "Närvarande";
  const showAbscent = "Frånvarande";

  return (
    <>
      {noLectureState ? (
        <div>Denna klass har ingen anmäld närvaro än...</div>
      ) : selectedLecture ? (
        <SCAdminClassContainer
          navigationState={navigationState}
          noIndex={noIndex}
        >
          <div className="adminClassInfo">
            <SCArrowLeftIcon
              onClick={() => changeLecture("decrement")}
              minIndex={min}
              noIndex={noIndex}
            ></SCArrowLeftIcon>
            <span>
              <h1>
                {moment(selectedLecture.date)
                  .format("ll")
                  .toUpperCase()}
              </h1>

              <p>{selectedLecture.className} närvarostatus</p>
            </span>
            <SCArrowRightIcon
              onClick={() => changeLecture("increment")}
              maxIndex={max}
              noIndex={noIndex}
            ></SCArrowRightIcon>
          </div>
          <div
            className="adminClassNav"
            onClick={() => setNavigationState(!navigationState)}
          >
            <p>
              {currentSortingOption}{" "}
              <SCArrowDownIcon
                navigationState={navigationState}
              ></SCArrowDownIcon>
            </p>
            <div className="sortingSelections">
              <button onClick={() => filterStudents(showAbscent)}>
                Frånvarande
              </button>
              <button onClick={() => filterStudents(showAttending)}>
                Närvarande
              </button>
            </div>
          </div>
          <div className="adminClassStudents">
            {currentSortingOption === showAll ? (
              selectedLecture.students.map((student, index) => (
                <SCSPanButton
                  key={student.name + "span" + index}
                  attending={student.attendance}
                >
                  <Button
                    key={student.name + index}
                    disableTouchRipple
                    className="submitButton"
                    variant="contained"
                    type="button"
                  >
                    {student.name}
                    <Switch
                      color="primary"
                      onChange={() =>
                        changeStudentAttendance(
                          student.name,
                          student.attendance
                        )
                      }
                      checked={student.attendance}
                    ></Switch>
                  </Button>
                </SCSPanButton>
              ))
            ) : currentSortingOption === showAttending ? (
              filteredAttendanceState.studentsAttending.map(
                (student, index) => (
                  <SCSPanButton
                    key={student.name + "span" + index}
                    attending={student.attendance}
                  >
                    <Button
                      key={student.name + index}
                      disableTouchRipple
                      className="submitButton"
                      variant="contained"
                      type="button"
                    >
                      {student.name}
                      <Switch
                        color="primary"
                        onChange={() =>
                          changeStudentAttendance(
                            student.name,
                            student.attendance
                          )
                        }
                        checked={student.attendance}
                      ></Switch>
                    </Button>
                  </SCSPanButton>
                )
              )
            ) : currentSortingOption === showAbscent ? (
              filteredAttendanceState.studentsAbscent.map((student, index) => (
                <SCSPanButton
                  key={student.name + "span" + index}
                  attending={student.attendance}
                >
                  <Button
                    key={student.name + index}
                    disableTouchRipple
                    className="submitButton"
                    variant="contained"
                    type="button"
                  >
                    {student.name}
                    <Switch
                      color="primary"
                      onChange={() =>
                        changeStudentAttendance(
                          student.name,
                          student.attendance
                        )
                      }
                      checked={student.attendance}
                    ></Switch>
                  </Button>
                </SCSPanButton>
              ))
            ) : (
              <div>Ingen sortering</div>
            )}
          </div>
        </SCAdminClassContainer>
      ) : (
        <Loading text="Hämtar föreläsningar..."></Loading>
      )}
    </>
  );
};

export default AdminClassAttendance;
