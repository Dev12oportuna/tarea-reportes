import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth.js";
import Cookies from "js-cookie"


export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an authProvider")
    }
    return context;
}

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState (true)
    const [managerUser, setManagerUser] = useState(false)
    

    const signup = async (user) => {
        try {
            const res = await registerRequest(user)
            console.log("res", res.data);
            setUser(res.data)
            setIsAuthenticated(true)
        } catch (error) {
            //console.log(error)
            setErrors(error.response.data)
        }
    }

    const signin = async (user) => {
        try {
            const res = await loginRequest(user)
            const userData = res.data.user
            setIsAuthenticated(true)
            setUser(userData)
            localStorage.setItem('authToken', res.data.tokenData.token)
            
            if (userData.UserType === 'Uno') {
                setManagerUser(true)
            }
            console.log(managerUser)

        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data)
            }
            setErrors([error.response.data.message])
        }
    }

    const logout = () => {
        Cookies.remove("token")
        localStorage.removeItem('authToken')
        setIsAuthenticated(false)
        setUser(null)
    }

    useEffect(()=>{
        if (errors.length > 0) {
            const timer =setTimeout(()=>{
                setErrors([]);
            }, 5000)
            return () => clearTimeout(timer)
        }
    },[errors])

    useEffect(() => {
        async function checkLogin() {
            const storedToken = localStorage.getItem('authToken')

        
            if (!storedToken) {
                setIsAuthenticated(false)
                setLoading(false)
                return setUser(null)
            }
            try {
                const res = await verifyTokenRequest(storedToken)
                
                
                if (!res.data) {
                    setIsAuthenticated(false)
                    setLoading(false)
                    return
                }
                setIsAuthenticated(true)
                setUser(res.data)

                if (res.data.UserType === 'Uno') {
                    setManagerUser(true);
                    // Guardar el estado en localStorage
                    localStorage.setItem('managerUser', 'true');
                    }

                setLoading(false)
            } catch (error) {
                setIsAuthenticated(false)
                setUser(null)
                setLoading(false)
            }
            }
        
        checkLogin();
    },[])  

    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            loading,
            user,
            isAuthenticated,
            errors,
            logout, 
            managerUser
        }}>
            {children}
        </AuthContext.Provider>
        )
}