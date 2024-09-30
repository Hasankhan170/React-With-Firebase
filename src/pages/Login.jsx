import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form"
import { auth } from "../config/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {


  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const loginUser = async (data)=>{
    const {email,password} = data;
    setLoading(true)
    
    try {
      const user = await signInWithEmailAndPassword(auth,email,password);
      console.log(user);

      reset()

      navigate('/Dashboard')
    } catch (error) {
      console.log(error);
      alert('please enter correct email and password')
    }finally{
      setLoading(false)
    }
  }


  return (
    <>
      <div className="flex justify-center mt-5 p-5">
        <form
          onSubmit={handleSubmit(loginUser)}
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
          className="p-8 w-full max-w-md bg-white rounded-lg"
        >
          <h1 className="text-lg font-bold p-2 mb-5">Login</h1>
  
          {/* Email Field */}
          <input
            type="email"
            placeholder="Enter Your Email"
            className="input input-bordered w-full mb-5"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-start mx-1">{errors.email.message}</p>}
          <br />
  
          {/* Password Field */}
          <input
            type="password"
            placeholder="Enter Your Password"
            className="input input-bordered w-full mb-5"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-start mx-1">{errors.password.message}</p>
          )}
          <br />
  
          {/* Submit Button */}
          {
  loading ? (
    <div className="flex justify-center items-center">
      <span className="loading loading-dots loading-lg text-center"></span>
    </div>
  ) : (
    <button className="btn btn-warning w-full text-lg text-white">
      Login
    </button>
  )
}
        </form>
      </div>
    </>
  );
  
  }
  
  export default Login