// ----  { Libraries } ----
import React from "react";
import { NavLink } from "react-router-dom";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../../constants/routes";

// ----  { Styles } ----
import { SCBottomNavContainer } from "./styles.js";
import { More } from "styled-icons/remix-line";
import { Export } from "styled-icons/typicons";
import { Home } from "styled-icons/material";
import { ListCheck } from "styled-icons/boxicons-regular";

// ----  { Backend } ----
// ----  { Render Components } -----

const BottomNav = () => {
  return (
    <SCBottomNavContainer>
      <NavLink
        to={ROUTES.HOME}
        activeStyle={{
          color: "white"
        }}
      >
        <Home></Home> Hem
      </NavLink>
      <NavLink
        // to={ROUTES.HOME}
        activeStyle={{
          color: "white"
        }}
      >
        <ListCheck></ListCheck>
        Närvaro
      </NavLink>
      <NavLink
        // to={ROUTES.HOME}
        activeStyle={{
          color: "white"
        }}
      >
        <Export></Export>
        Export
      </NavLink>
      <NavLink
        // to={ROUTES.HOME}
        activeStyle={{
          color: "white"
        }}
      >
        <More></More>
        Mer
      </NavLink>
    </SCBottomNavContainer>
  );
};

export default BottomNav;
