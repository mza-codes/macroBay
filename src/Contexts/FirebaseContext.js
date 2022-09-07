import { createContext } from "react"
import firebase from './firebaseConfig'

export const FirebaseContext = createContext(null)

function RootFirebase({children}) {
    return(
        <FirebaseContext.Provider value={{firebase}} >
            {children}
        </FirebaseContext.Provider>
    )
}

export default RootFirebase ;