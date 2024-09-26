import { createUserWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { auth, db } from "../config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
// 

const Register = () => {


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const registerUser = async (data) => {
    const {name,email,password} = data
    console.log(data);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;
      

      await setDoc(doc(db,"users",user.uid),{
        name : name,
        email :email,
      })

      console.log(user);
    } catch (error) {
      console.log(error);
      
    }
    
    
  }

    return (
      <>
     <div className="flex  justify-center mt-5 text-center p-5 rounded-box ">
      <form
        onSubmit={handleSubmit(registerUser)}
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
        className="p-5 "
      >
        <h1 className="text-lg font-bold p-2 mb-2">Register</h1>

        {/* Name Field */}
        <input
          type="text"
          placeholder="Enter Your Name"
          className="input input-bordered w-full max-w-xs mb-5"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="text-red-500 text-start mx-1">{errors.name.message}</p>}
        <br />

        {/* Email Field */}
        <input
          type="email"
          placeholder="Enter Your Email"
          className="input input-bordered w-full max-w-xs mb-5"
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
          className="input input-bordered w-full max-w-xs mb-5"
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

        {/* File Input Field */}
        <input
          type="file"
          className="file-input file-input-bordered file-input-warning w-full mb-5 max-w-xs"
          {...register("file", { required: "File is required" })}
        />
        {errors.file && <p className="text-red-500 text-start mx-1">{errors.file.message}</p>}
        <br />

        {/* Submit Button */}
        <button className="btn btn-warning w-full text-lg text-white">
          Register
        </button>
      </form>
    </div>
      </>
    )
  }
  
  export default Register