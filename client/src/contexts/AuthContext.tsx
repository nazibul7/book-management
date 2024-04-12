import axios from "axios";
import { createContext, useEffect, useState } from "react";
type AuthType = {
    isLoggedIn: boolean,
    username: string
}
export const AuthContext = createContext<AuthType>({ isLoggedIn: false, username: "" })

export const AuthContextProvider = ({ children }: any) => {
    const [authStatus, setAuthStatus] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    useEffect(() => {
        const vaidateToken = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/v1/validate-token", { withCredentials: true })
                if (response.status >= 200 && response.status < 300) {
                    setAuthStatus(!authStatus)
                    setName(response.data.name)
                }
            } catch (error) {
                console.log(error);
            }
        }
        vaidateToken()
    }, [])
    return (
        <AuthContext.Provider value={{ isLoggedIn: authStatus, username: name }}>
            {children}
        </AuthContext.Provider>
    )
}
