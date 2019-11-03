// ----  { Libraries } ----
import React from "react";
import styled from "styled-components/macro";
import { Info } from "styled-icons/typicons/Info";

//Deconstructar text direkt.
const InfoComponent = ({ text, noMargin }) => {
  return (
    <SCInfoComponentContainer>
      <SCCircle noMargin={noMargin}>
        <SCTextBlock>
          <SICheckIcon />
          <h2>{text}</h2>
        </SCTextBlock>
      </SCCircle>
    </SCInfoComponentContainer>
  );
};

export const SCInfoComponentContainer = styled.div`
  border: 2 px solid orange;
  display: flex;
  justify-content: center;
`;

export const SCCircle = styled.div`
  display: flex;
  margin-top: ${({ noMargin }) => (noMargin ? "0" : "8%")};
  width: 20rem;
  height: 20rem;
  background: white;
  border-radius: 50%;
  border: 8px solid #3f51b5;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.87);

  /* h2 {
    text-align: center;
  } */
`;

export const SCTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 9rem;
  height: 8rem;
  background: #3f51b5;
  border-radius: 10px;
  text-align: center;
  align-items: center;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.87);

  h2 {
    color: white;
    font-size: 0.7em;
    /* align-self: center; */
    padding: 0 0.5rem 0 0.5rem;
    /* margin-top: 1em; */
  }
`;

export const SICheckIcon = styled(Info)`
  color: white;
  width: 3em;
  margin: 0 auto;
`;

export default InfoComponent;
