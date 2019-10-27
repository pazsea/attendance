import React, { useContext } from "react";
import { Context } from "../../context";

const AdminClassAttendance = () => {
  const {
    classDetailsObject: [globalClassDetails]
  } = useContext(Context);

  return <div>ADMIN KLASS NÄRVARO {JSON.stringify(globalClassDetails)} </div>;
};

export default AdminClassAttendance;
