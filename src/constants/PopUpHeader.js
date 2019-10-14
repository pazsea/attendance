import React from "react";
import { ReactComponent as CloseIcon } from "../images/logos/closeIcon.svg";
import styled from "styled-components";

const Head = styled.div`
  font-family: "Josefin Sans", sans-serif;
  width: 100%;
  background: ${props => props.color};
  display: flex;
  height: 12vh;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.3em;
  .header_closeIcon {
    color: black;
    position: absolute;
    display: flex;
    border: none;
    top: 1%;
    right: 1%;
    background: none;
    cursor: pointer;
    :hover {
      color: #f50057;
    }
    svg {
      margin-top: 2px;
      width: 30px;
    }
  }
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
