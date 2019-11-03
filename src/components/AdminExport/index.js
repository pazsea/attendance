// import React from "react";

// const AdminExport = () => {
//   return <div>EXPORT NÄRVARO</div>;
// };

// export default AdminExport;

// ----  { Libraries } ----
import React from "react";
import { SCInfoComponentContainer, SCCircle, SCTextBlock } from "./styles";
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

//Deconstructar text direkt.
const AdminExport = ({ text }) => {
  return (
    <SCInfoComponentContainer>
      <SCCircle>
        <SCTextBlock>
          <h2>{text}</h2>
        </SCTextBlock>
      </SCCircle>
    </SCInfoComponentContainer>
  );
};

export default AdminExport;

//Inga klasser finns registrerade.
// Inga föreläsningar finns registrerade
