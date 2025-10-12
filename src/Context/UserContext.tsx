import React, { useEffect, useState , createContext} from 'react'
type UserContextType = {
    userName: string | null;
    setUserName: React.Dispatch<React.SetStateAction<string | null>>;
    role:string | null
    setRole: React.Dispatch<React.SetStateAction<string | null>>;
    loading:boolean;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserContextProvider({children}:{children:React.ReactNode}) {
    const [userName , setUserName] = useState<string | null> (null)
    const [role , setRole] = useState<string | null> (null)
    const [loading, setLoading] = useState(true);
    useEffect(() => {  
        const savedUser = localStorage.getItem("userName");
        const savedRole = localStorage.getItem("role");
        if (savedUser) setUserName(savedUser);
        if(savedRole)setRole(savedRole)
        setLoading(false);            
      }, []);

    return (
        <UserContext.Provider value={{userName , setUserName , role , setRole , loading}}>
            {children}
        </UserContext.Provider>    
    )
}
