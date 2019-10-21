import styled from "styled-components";

export const SCMyAttendanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  margin: 2em auto auto auto;
  width: 85%;
  border: 1px solid lightgrey;
  padding: 2em;
  border-radius: 0.12em;

  @media (min-width: 768px) {
    width: 50%;
  }
`;
