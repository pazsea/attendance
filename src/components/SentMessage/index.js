import React from "react";
import styled from "styled-components";

import { CheckCircle } from "styled-icons/fa-regular/CheckCircle";

const SentMessageDiv = styled.div`
font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  text-align: center;
  margin: 0 auto;
  padding: 2em;
  font-size: 1.4em;
  border: 1px solid lightgrey;
  height: fit-content;
  width: fit-content;
  border-radius: 5px;
  background: white;
  align-self: center;
`;

const CustomCheckCircle = styled(CheckCircle)`
  color: green;
  width: 1em;
`;

const SentMessage = ({ text }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: "100",
          position: "absolute"
        }}
      >
        <SentMessageDiv>
          {text} <CustomCheckCircle></CustomCheckCircle>
        </SentMessageDiv>
      </div>
    </>
  );
};

export default SentMessage;
