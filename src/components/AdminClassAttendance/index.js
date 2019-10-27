import React, { useContext } from "react";
import { Context } from "../../context";
import {
  SCAdminClassContainer,
  SCArrowLeftIcon,
  SCArrowRightIcon,
  SCArrowDownIcon
} from "./styles";

const AdminClassAttendance = () => {
  const {
    classDetailsObject: [globalClassDetails]
  } = useContext(Context);

  return (
    <SCAdminClassContainer>
      <div className="adminClassInfo">
        <SCArrowLeftIcon></SCArrowLeftIcon>
        <span>
          <h1>26 MAJ 2019</h1>
          <p>FE16 närvarostatus</p>
        </span>
        <SCArrowRightIcon></SCArrowRightIcon>
      </div>
      <div className="adminClassNav">
        <p>
          Nurvarande sortering <SCArrowDownIcon></SCArrowDownIcon>
        </p>
        <div className="sortingSelections">
          <button>Allas närvaro</button>
          <button>Frånvarande</button>
          <button>Närvarande</button>
        </div>
      </div>
      <div className="adminClassStudents">asd</div>
    </SCAdminClassContainer>
  );
};

export default AdminClassAttendance;
