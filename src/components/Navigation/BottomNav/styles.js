import styled from "styled-components";

export const SCBottomNavContainer = styled.div`
  display: grid;
  font-size: 18px;
  grid-template-columns: repeat(4, 1fr);
  font-weight: 600;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 4.5em;
  color: rgba(0, 0, 0, 0.54);

  @media (min-width: 992px) {
    display: none;
  }

  a {
    display: flex;
    color: inherit;
    text-decoration: none;
    flex-direction: column;
    justify-content: center;
    background: #3f51b5;
  }
  svg {
    align-self: center;
    width: 2em;
  }
`;
