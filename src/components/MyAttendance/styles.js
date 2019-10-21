import styled from "styled-components";

export const SCMyAttendanceContainer = styled.form`
  display: grid;
  font-size: 16px;
  row-gap: 1em;
  margin: 2em auto auto auto;
  width: 85%;
  border: 1px solid lightgrey;
  padding: 2em;
  border-radius: 0.12em;

  img {
    margin: 0 auto;
    width: 200px;
  }

  @media (min-width: 768px) {
    width: 50%;
  }
`;
