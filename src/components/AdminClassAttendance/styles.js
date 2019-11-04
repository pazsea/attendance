import styled from "styled-components/macro";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  ArrowDown
} from "styled-icons/feather";

export const SCArrowLeftIcon = styled(ArrowLeftCircle)`
  display: ${({ noIndex }) => (noIndex ? "none" : "block")};
  width: 3em;
  color: ${({ minIndex }) => (minIndex ? "darkred" : "white")};
  opacity: ${({ minIndex }) => (minIndex ? 0.3 : "none")};
  cursor: pointer;
`;

export const SCArrowRightIcon = styled(ArrowRightCircle)`
  display: ${({ noIndex }) => (noIndex ? "none" : "block")};
  width: 3em;
  color: ${({ maxIndex }) => (maxIndex ? "darkred" : "white")};
  opacity: ${({ maxIndex }) => (maxIndex ? 0.3 : "none")};
  cursor: pointer;
`;

export const SCArrowDownIcon = styled(ArrowDown)`
  width: 20px;
  color: white;
`;

export const SCAdminClassContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 2em auto auto auto;

  @media (min-width: 768px) {
    width: 50%;
  }

  .adminClassInfo {
    display: flex;
    justify-content: ${({ noIndex }) => (noIndex ? "center" : "space-between")};
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
    }
  }

  .adminClassStudents {
    display: grid;
    row-gap: 0.3em;
  }
`;

export const SCSPanButton = styled.span`
  button {
    background: ${props => (props.attending ? "forestgreen" : "darkred")};
    width: 100%;
    color: white;
    /* background: forestgreen; */
    justify-content: space-between;
    padding: 0.5em 2em;
    :hover {
      background: ${props => (props.attending ? "forestgreen" : "darkred")};
    }
  }
`;

// Extra small devices (phones, less than 768px): No media query since this is the default in Bootstrap

// Indianred Small devices (tablets, 768px and up): @media (min-width: @screen-sm-min) { ... }

// Medium devices (desktops, 992px and up): @media (min-width: @screen-md-min) { ... }

// Large devices (large desktops, 1200px and up): @media (min-width: @screen-lg-min) { ... }
