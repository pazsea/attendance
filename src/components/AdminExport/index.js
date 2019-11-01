// import React from "react";

// const AdminExport = () => {
//   return <div>EXPORT NÄRVARO</div>;
// };

// export default AdminExport;

// ----  { Libraries } ----
import React from "react";
import { SCInfoComponentContainer } from "./styles";
import "./adminexport.scss";
import { makeStyles } from "@material-ui/core/styles";
// ----  { Routes, ActionTypes etc. Custom variables. } ----
// ----  { Styles } ----

// ----  { Backend } ----
// ----  { Render Components } -----

// const useStyles = makeStyles({
//   root: {
//     flexGrow: 1
//   }
// });

const AdminExport = ({ text }) => {
  // const classes = useStyles();
  return (
    <SCInfoComponentContainer>
      {/* <h3>Inga klasser hittades</h3> */}
      <h3>Inga föreläsningar hittdes för valt datum</h3>

      <p>{text}....</p>
    </SCInfoComponentContainer>
  );
};

export default AdminExport;

//Inga klasser finns registrerade.
// Inga föreläsningar finns registrerade
