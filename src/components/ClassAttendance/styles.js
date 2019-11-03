import styled from "styled-components/macro";
import { Check } from "styled-icons/boxicons-regular/Check";
import { RightArrow } from "styled-icons/boxicons-regular/RightArrow";

export const SCArrowDownIcon = styled(RightArrow)`
  width: 12px;
  color: white;
  transition: transform 300ms ease-in-out;
  transform: ${({ navigationState }) =>
    navigationState ? `rotate(90deg)` : ""};
`;

export const SCClassAttendanceContainer = styled.div`
  /* Mobile first Bootstrap mediaqieries */
  display: flex;
  flex-direction: column;
  font-size: 16px;
  margin: 0 auto;
  width: 100%;
  height: 80vh;
  padding: 2em;
  border-radius: 0.12em;

  .adminClassInfo {
    display: flex;
    justify-content: center;
    background: #3f51b5;
    border-radius: 10px 10px 0 0;
    padding: 0.1em 1em;

    span {
      color: white;
      text-align: center;
      h1 {
        font-size: 1.3em;
      }
      p {
        font-size: 0.8em;
      }
    }
    @media (min-width: 768px) {
      h1 {
        font-size: 2em;
      }
      p {
        font-size: 1em;
      }
    }
  }

  .adminClassNav {
    color: white;
    text-align: center;
    background: #3f51b5;
    cursor: pointer;
    margin-bottom: 0.5em;
    font-size: 0.8em;
    @media (min-width: 768px) {
      font-size: 1em;
    }
  }

  .sortingSelections {
    display: ${({ navigationState }) => (navigationState ? "flex" : "none")};
    flex-direction: column;
    button {
      border: none;
      background: none;
      color: white;
      padding: 0.5em 0;
      cursor: pointer;
    }
    #abscent {
      text-decoration: ${({ abscentFiltered }) =>
        abscentFiltered ? "underline" : "none"};
      /* text-decoration: underline;  */
    }
    #present {
      text-decoration: ${({ presentFiltered }) =>
        presentFiltered ? "underline" : "none"};
      /* text-decoration: underline;  */
    }
  }

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
    /* display: flex;
    flex-direction: row; */
    width: 100%;
    margin-top: 1em;
    padding: 0.5em 2em;
  }
`;

export const SCButton = styled.button`
  /* Taget från .MuiButton-root */

  color: white;
  width: 100%;
  background: ${({ attending }) => (attending ? "forestgreen" : "darkred")};
  padding: 6px 16px;
  font-size: 0.875rem;
  min-width: 64px;
  box-sizing: border-box;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 500;
  line-height: 1.75;
  border-radius: 4px;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  border: 0;
  cursor: pointer;
  display: inline-flex;
  outline: 0;
  position: relative;
  align-items: center;
  user-select: none;
  border-radius: 0;
  vertical-align: middle;
  /* -moz-appearance: none; */
  justify-content: center;
  text-decoration: none;
  /* background-color: transparent; */
  /* -webkit-tap-highlight-color: transparent; */
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
