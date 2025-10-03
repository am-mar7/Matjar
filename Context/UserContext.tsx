import React, { useEffect, useState , createContext} from 'react'

type UserContextType = {
    userName: string | null;
    setUserName: React.Dispatch<React.SetStateAction<string | null>>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserContextProvider({children}:{children:React.ReactNode}) {
    const [userName , setUserName] = useState<string | null> (null)
    useEffect(() => {
        const savedUser = localStorage.getItem("userName");
        if (savedUser) {
          setUserName(savedUser);
        }
      }, []);

    return (
        <UserContext.Provider value={{userName , setUserName}}>
            {children}
        </UserContext.Provider>    
    )
}
