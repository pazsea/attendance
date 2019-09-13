import React, { useState, createContext, useEffect } from "react";


export const Context = createContext();

export const ContextProvider = props => {
  // const [state, setState] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUserDetails(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(userDetails));
  });

  return (
    <Context.Provider value={[userDetails, setUserDetails]}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
