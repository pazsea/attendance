import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context";
import {
  SCAdminClassContainer,
  SCArrowLeftIcon,
  SCArrowRightIcon,
  SCArrowDownIcon
} from "./styles";

import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import firebase from "../Firebase";

const AdminClassAttendance = () => {
  const {
    classDetailsObject: [{ selectedClass }]
  } = useContext(Context);

  const [navigationState, setNavigationState] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase
      .classDetails(selectedClass)
      .collection("attendance")
      // .orderBy("timestamp")
      .onSnapshot(snap => {
        let orderDocs = snap.docs.sort(function(a, b) {
          return Number(a.id) - Number(b.id);
        });
        let result = orderDocs.reduce((acc, doc) => {
          return [
            ...acc,
            {
              timeStamp: doc.id,
              date: [Date.now(doc.id)],
              students: doc.data()
            }
          ];
        }, []);
        // let result = snap.docs.map(doc => doc);
        console.log(result);
      });

    return () => {
      unsubscribe();
    };
  }, [selectedClass]);

  return (
    <SCAdminClassContainer navigationState={navigationState}>
      <div className="adminClassInfo">
        <SCArrowLeftIcon></SCArrowLeftIcon>
        <span>
          <h1>26 MAJ 2019</h1>
          <p>FE16 närvarostatus</p>
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
        <Button
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
        </Button>
      </div>
    </SCAdminClassContainer>
  );
};

export default AdminClassAttendance;
