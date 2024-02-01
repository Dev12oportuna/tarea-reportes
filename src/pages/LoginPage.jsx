import {useForm} from "react-hook-form"
import { useAuth } from "../context/authContext";
import {Link, useNavigate} from "react-router-dom"
import { useEffect } from "react";
import jwt_decode from "jwt-decode"


function LoginPage() {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const {signin, errors: loginErrors, isAuthenticated} = useAuth()
    
    const navigate = useNavigate()
    const onSubmit= handleSubmit(async data => {
        //console.log(data)
        signin(data)
    })

    const handleCallBackResponse = (response) => {
        const userObject = jwt_decode(response.credential)
        console.log("user ", userObject)
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/reportes")
        }
    },[isAuthenticated])

    
    useEffect(() => {
        google.accounts.id.initialize({
            client_id: "",
            callback: handleCallBackResponse
            
        });
    
        google.accounts.id.renderButton(
            document.getElementById("singInDiv"),
            {theme: "outline", size: "large"}
        )
    },[]) 

    
    return (
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
            <div className="bg-emerald-500 max-w-md w-full rounded-md p-10 shadow-2xl">
            {loginErrors.map((error, i) =>(
                <div className="bg-red-500 p-2 text-white text-center my-2" key={i}>
                    {error}
                </div>
            ))
            }
            <form onSubmit={onSubmit}> 
                <h1 className="text-2xl text-white font-bold">Login</h1>
                <input type="email"  placeholder="Email"{...register("email", {required: true})} className="w-full bg-emerald-600 text-white px-4 py-2 my-2 rounded-md"
                />
                {errors.email && (<p className="text-red-500">Email is required</p>)}

                <input type="password" placeholder="Password"{...register("password", {required: true})} className="w-full bg-emerald-600 text-white px-4 py-2 my-2 rounded-md"
                />
                {errors.password && (<p className="text-red-500">Password is required</p>)}
                <button className="bg-emerald-800 text-white px-4 py-1 rounded-sm" type="submit">Login</button>

                
            </form>

            <p className="flex gap-x-2 justify-center">
                Don't have an account?<Link className="text-emerald-900" to="/register">Sign up here.</Link>
            </p>
            <div id="singInDiv" className="items-center justify-center"></div>
            </div>
        </div>
    ) 
    
   /*  const {user, loginWithRedirect} = useAuth0()
    
            console.log(user)
    return (
        <div >
            <button onClick={() => loginWithRedirect()}>login</button>
        </div>
    ) */

}

export default LoginPage;






