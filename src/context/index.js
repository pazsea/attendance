import React, { useState, createContext, useEffect } from "react";

export const Context = createContext();

export const ContextProvider = props => {
  const [userDetails, setUserDetails] = useState([]);
  const [globalClassDetails, setGlobalClassDetails] = useState({
    selectedClassUid: null,
    className: null
  });

  // useEffect(() => {
  //   console.log("KLASS " + globalClassDetails.selectedClass);
  // }, [globalClassDetails.selectedClass]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const globalClassData = localStorage.getItem("globalClassDetails");

    if (userData) {
      setUserDetails(JSON.parse(userData));
    }
    if (globalClassData) {
      setGlobalClassDetails(JSON.parse(globalClassData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "globalClassDetails",
      JSON.stringify(globalClassDetails)
    );
  });

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
