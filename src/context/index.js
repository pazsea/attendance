import React, { useState, createContext, useEffect } from "react";

export const Context = createContext();

export const ContextProvider = props => {
  const [userDetails, setUserDetails] = useState([]);
  const [globalClassDetails, setGlobalClassDetails] = useState({
    selectedClass: null
  });

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUserDetails(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(userDetails));
  });

  const store = {
    userDetailsObject: [userDetails, setUserDetails],
    classDetailsObject: [globalClassDetails, setGlobalClassDetails]
  };

  return <Context.Provider value={store}>{props.children}</Context.Provider>;
};

export default ContextProvider;
