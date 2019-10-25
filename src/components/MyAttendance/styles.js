import styled from "styled-components/macro";
import { Check } from "styled-icons/boxicons-regular/Check";

export const SCMyAttendanceContainer = styled.div`
  /* Mobile first Bootstrap mediaqieries */
  display: flex;
  flex-direction: column;
  font-size: 16px;
  margin: 0 auto;
  width: 100%;
  height: 80vh;
  padding: 2em;
  border-radius: 0.12em;

  img {
    margin: 0 auto;
    width: 70%;

    @media (min-width: 768px) {
      width: 30%;
      margin: 0 auto 2em auto;
    }
  }

  @media (min-width: 576 px) {
    width: 50%;
    height: 70vh;
  }

  @media (min-width: 768px) {
    width: 50%;
    height: 80vh;
  }
`;

export const SCStudentNameContainer = styled.div`
  /* border: 1px solid blue; */
  /* display: flex; */
  flex-direction: column;
  align-self: center;
  flex-grow: 1;
  margin: 1em 0 1em 0;
  height: 20vh;
  width: 100%;
  overflow-y: auto;

  button {
    display: flex;
    flex-direction: row;
    width: 100%;
    background: darkorange;
    margin-top: 1em;
    color: white;
    padding: 0.5em 2em;
    :hover {
      background: mediumseagreen;
    }
  }
`;
export const CheckIcon = styled(Check)`
  color: white;
  width: 1.7em;
  position: absolute;
  right: 1em;
`;

export const SCAlreadyAttending = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 16px;
  width: 100% !important;
  margin: 0 auto auto auto;
  /* border: 1px solid lightgrey; */
  padding: 1em;
  border-radius: 0.12em;
  img {
    margin: 0 auto;
    width: 70%;

    @media (min-width: 768px) {
      width: 30%;
      margin: 0 auto 2em auto;
    }
  }

  button {
    display: flex;
    align-self: center;
    width: 80%;
    background: darkred;
    margin-top: 1em;
    color: white;
    padding: 0.5em 2em;
    :hover {
      background: mediumseagreen;
    }
    @media (min-width: 768px) {
      width: 40%;
    }
  }

  .studentStatusDiv {
    display: grid;
    flex-grow: 1;
  }
  @media (min-width: 576 px) {
    width: 50%;
    height: 70vh;
  }

  @media (min-width: 768px) {
    width: 60%;
    height: 70vh;
  }
`;
