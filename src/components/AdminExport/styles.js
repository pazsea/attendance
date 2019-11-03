import styled from "styled-components/macro";

export const SCInfoComponentContainer = styled.div`
  border: 2 px solid orange;
  display: flex;
  justify-content: center;
`;

export const SCCircle = styled.div`
  display: flex;
  margin-top: 8%;
  width: 25rem;
  height: 25rem;
  background: white;
  border-radius: 50%;
  border: 8px solid #3f51b5;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  /* h2 {
    text-align: center;
  } */
`;

export const SCTextBlock = styled.div`
  display: flex;
  width: 9rem;
  height: 9rem;
  background: #3f51b5;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  h2 {
    color: white;
    font-size: 0.7em;
    align-self: center;
    padding: 0 0.5rem 0 0.5rem;
    /* margin-bottom: 3.5rem; */
  }
`;

// align-items:  center = Vertikalt
// justify-content: = horizontellt.
