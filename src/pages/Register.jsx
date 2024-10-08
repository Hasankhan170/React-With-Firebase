import { useForm } from "react-hook-form";
import { auth, db, storage } from "../config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const { updateProfileImage } = useOutletContext(); // Get updateProfileImage from context
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const registerUser = async (data) => {
    const { name, email, password, file } = data;
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const imageFile = file[0];
      const storageRef = ref(storage, `users/${user.uid}`);
      await uploadBytes(storageRef, imageFile);

      const downloadUrl = await getDownloadURL(storageRef);

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        profileImage: downloadUrl,
      });

      reset();
      alert('Successfully registered');

      // Call the function to update the profile image
      updateProfileImage(downloadUrl);

      navigate('/Login');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-5 p-5">
      <form
        onSubmit={handleSubmit(registerUser)}
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
        className="p-8 w-full max-w-md bg-white rounded-lg"
      >
        <h1 className="text-lg font-bold p-2 mb-5">Register</h1>

        {/* Name Field */}
        <input
          type="text"
          placeholder="Enter Your Name"
          className="input input-bordered w-full mb-5"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="text-red-500 text-start mx-1">{errors.name.message}</p>}

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
        {errors.password && <p className="text-red-500 text-start mx-1">{errors.password.message}</p>}

        {/* File Input Field */}
        <input
          type="file"
          className="file-input file-input-bordered file-input-warning w-full mb-5"
          {...register("file", { required: "File is required" })}
        />
        {errors.file && <p className="text-red-500 text-start mx-1">{errors.file.message}</p>}

        {/* Submit Button */}
        {
          loading ? (
            <button className="btn btn-warning w-full text-lg text-white">
              <span className="loading loading-dots loading-lg text-center"></span>
            </button>
          ) : (
            <button className="btn btn-warning w-full text-lg text-white">Register</button>
          )
        }
      </form>
    </div>
  );
};

export default Register;
