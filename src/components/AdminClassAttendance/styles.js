import styled from "styled-components/macro";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  ArrowDown
} from "styled-icons/feather";

export const SCArrowLeftIcon = styled(ArrowLeftCircle)`
  width: 40px;
  color: white;
`;

export const SCArrowRightIcon = styled(ArrowRightCircle)`
  width: 40px;
  color: white;
`;

export const SCArrowDownIcon = styled(ArrowDown)`
  width: 20px;
  color: white;
`;

export const SCAdminClassContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 2em auto auto auto;

  .adminClassInfo {
    display: flex;
    justify-content: space-between;
    background: #3f51b5;
    border-radius: 10px 10px 0 0;
    padding: 0.1em 1em;
    span {
      color: white;
      text-align: center;
    }
  }

  .adminClassNav {
    color: white;
    text-align: center;
    background: #3f51b5;
  }

  .adminClassStudents {
    background: lightgreen;
  }
`;
