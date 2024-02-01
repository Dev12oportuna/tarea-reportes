import {useForm} from "react-hook-form"
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


function RegisterPage() {

    const {register, handleSubmit, formState:{errors} } = useForm();
    const {signup, isAuthenticated, errors: registerErrors} = useAuth();
    const navigate = useNavigate() 

    useEffect(() => {
        if(isAuthenticated){
            navigate("/tasks")
        }

    },[isAuthenticated])

    const onSubmit = handleSubmit(async values => {
        signup(values)
        }
        
        )

    return (

        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
            <div className="bg-emerald-500 max-w-md w-full rounded-md p-10 shadow-2xl">
            <h1 className="text-2xl text-white font-bold">Register</h1>
                {registerErrors.map((error, i) =>(
                    <div className="bg-red-500 p-2 text-white text-center my-2" key={i}>
                        {error}
                    </div>
                ))
                }
                <form onSubmit={onSubmit}> 
                    
                    <input type="text" placeholder="Username"
                    {...register("username", {required: true})} className="w-full bg-emerald-600 text-white px-4 py-2 my-2 rounded-md"
                    /><br/><br/>
                    {errors.username && (<p className="text-red-500 ">Username is required</p>)}
                    
                    <input type="email"  placeholder="Email"{...register("email", {required: true})} className="w-full bg-emerald-600 text-white px-4 py-2 my-2 rounded-md"
                    /><br /><br />
                    {errors.email && (<p className="text-red-500">Email is required</p>)}

                    <input type="password" placeholder="Password"{...register("password", {required: true})} className="w-full bg-emerald-600 text-white px-4 py-2 my-2 rounded-md"
                    /><br /><br />
                    {errors.password && (<p className="text-red-500">Password is required</p>)}
                    <button className="bg-emerald-800 px-4 py-1 rounded-sm" type="submit">Register</button>

                    
                </form>
                <p className="flex gap-x-2 justify-center">
                    Already have an account?<Link className="text-emerald-900" to="/login">Sign in here.</Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage;