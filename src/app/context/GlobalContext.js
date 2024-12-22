'use client'

import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [studentId, setStudentId] = useState(null);

  return (
    <GlobalContext.Provider value={{ studentId, setStudentId }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
