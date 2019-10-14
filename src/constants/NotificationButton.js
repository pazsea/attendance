import React from "react";
import styled from "styled-components/macro";
import Button from "@material-ui/core/Button";

const QuantitySpan = styled.span`
  position: absolute;
  right: 2em;
  border: 1px solid white;
  border-radius: 50%;
  background: ${props => (props.quantity === 0 ? "none" : "goldenrod")};
  padding: 0 0.5em;
`;

const NotificationButton = ({ text, quantity, onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      type="button"
      size="large"
      margin="normal"
      onClick={onClick}
    >
      {text} <QuantitySpan quantity={quantity}>{quantity}</QuantitySpan>
    </Button>
  );
};

export default NotificationButton;
