import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'

export const User = createContext(null)

function UserContext({children}) {
    const [user,setUser] = useState(null)
  return (
    <User.Provider value={{user,setUser}} >
        {children}
    </User.Provider>
  )
}

export default UserContext