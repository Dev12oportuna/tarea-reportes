import React from "react"
import { useAuth } from "./context/authContext.jsx"
import { Navigate, Outlet } from "react-router-dom"

function ProtectedRoute() {

    const {loading, isAuthenticated, managerUser} = useAuth()

    if(loading) return <div>Loading...</div>
    if (!loading && !isAuthenticated) {
        return <Navigate to="/" replace/>
    }

    return (
            <Outlet/>
    )
}

export default ProtectedRoute