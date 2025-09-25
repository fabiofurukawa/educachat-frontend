// src/context/UserContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../firebase";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setCurrentUser(fbUser || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
