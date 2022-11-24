import React, { useContext } from 'react'
import { useState } from 'react'
import { createContext } from 'react'

export const User = createContext(null)

function UserContext({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    docId: null
  });

  return (
    <User.Provider value={{ user, setUser, userData, setUserData }} >
      {children}
    </User.Provider>
  )
};

export const useAuthContext = () => useContext(User);

export default UserContext;