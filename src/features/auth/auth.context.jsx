import { Children, createContext, useState } from "react";

export const Authcontex = createContext()

export const AuthProvider = ({children}) =>{
 const [ User , setUser]  = useState(null);
 const  [loading , setLoading] = useState(false);

 return (
    <Authcontex.Provider value={{User , setUser , loading , setLoading}}>
        {children}

        </Authcontex.Provider>
 )
}