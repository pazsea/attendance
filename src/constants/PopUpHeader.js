import React from "react";
import { CloseO } from "styled-icons/evil/CloseO";
import styled from "styled-components";

const Head = styled.div`
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  width: 100%;
  background: ${props => props.color};
  display: flex;
  height: 12vh;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.3em;

  .header_closeIcon {
    color: white;
    position: absolute;
    display: flex;
    border: none;
    top: 1%;
    right: 1%;
    background: none;
    cursor: pointer;
  }
`;

export const CloseIcon = styled(CloseO)`
  margin-top: 1px;
  width: 30px;
`;

const PopUpHeader = ({ headerTitle, color, close }) => {
  return (
    <Head color={color}>
      {headerTitle}
      <button className="header_closeIcon" onClick={close}>
        <CloseIcon></CloseIcon>
      </button>
    </Head>
  );
};

export default PopUpHeader;
