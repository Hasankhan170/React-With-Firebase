import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db, storage } from "../config/FirebaseConfig"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useForm } from "react-hook-form"
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth"
import { useOutletContext } from "react-router-dom"


function Profile() {
  const { updateProfileImage } = useOutletContext();
  const [profileGet,setProfileGet] = useState(null)
  const [file,setFile] = useState(null)
  const [loading,setLoading] = useState(false)
  const [passwordLoading,setPasswordLoading] = useState(false)
  const {
     register,
     handleSubmit,
     reset,
    formState: { errors } } = useForm();
  // const [showError, setShowError] = useState(false);

  useEffect(()=>{
    const fetchProfile = async(user)=>{
      if(user){
        const userRef = doc(db,"users",user.uid)
        const userDoc = await getDoc(userRef)

        if(userDoc.exists()){
          setProfileGet(userDoc.data().profileImage)
        }
      }else{
        setProfileGet(null)
      }
    }
    const unSubscribe = auth.onAuthStateChanged(async (user)=>{
      await fetchProfile(user);
    })

    return ()=> unSubscribe()
  },[setProfileGet])

  const FileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file
  };
  const updateProfile = async (e)=>{
    e.preventDefault()
    if(!file) return;
    setLoading(true)

    try {
      const user = auth.currentUser;
      if(!user) return

      const storageRef = ref(storage,`users/${user.uid}`)
      await uploadBytes(storageRef,file)
      const downloadUrl = await getDownloadURL(storageRef)
      console.log(downloadUrl);
      

      const userDoc = doc(db,"users", user.uid)
      await updateDoc(userDoc,{
        profileImage : downloadUrl
      })

      setProfileGet(downloadUrl)
      updateProfileImage(downloadUrl); 
      setFile(null)
      alert('Profile updated successfully!')
      console.log("Profile updated successfully!");
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  }


  const passwordUpdate = async (data)=>{
    const {oldPassword,newPassword} = data;
    

    const user = auth.currentUser
    if(user){
      const  credential = EmailAuthProvider.credential(
        user.email,
        oldPassword
      )
      setPasswordLoading(true)

      try {
         // Re-authenticate the user
        await reauthenticateWithCredential(user, credential)

         // Update the password
         await updatePassword(user, newPassword)
         alert("Password updated successfully!");
      } catch (error) {
        console.log(error);
        alert("please enter your correct password");
      }finally{
        setPasswordLoading(false)
      }
    }else{
      console.log("User not signed in");
      alert("You need to be signed in to update your profile.");
    }

    reset()
    
  }

  return (
    <>
    <h1 className="m-5 mx-10 text-4xl font-bold">Profile</h1>
    <div style={{margin: '0 auto',borderRadius:'10px', boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",marginTop:'25px'}} className="container p-5 mt-40 max-h-max border-black">
     <form onSubmit={updateProfile} style={{width:"225px",flexDirection:'column',border:'1px solid gray',borderRadius:'10px'}} className="flex text-center justify-center p-3">
     <div 
  style={{
    width: '200px',            
    height: '200px',           
    borderRadius: '10px',
    overflow: 'hidden',        
    position: 'relative',  
  }}
>
  <img 
    style={{
      width: '100%',
      height: 'auto',
      position: 'absolute',
      top: '50%',
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      objectFit: 'cover', 
    }} 
    src={profileGet} 
    alt="Profile" 
  />
</div>

     <div>
      <input type="file" id="fileInput" onChange={FileChange} style={{ display: 'none' }} />
      <label htmlFor="fileInput" className="custom-file-upload ">
        <i className="fa fa-upload"></i> Upload File
      </label>
    </div>
    <button type="submit" style={{ width: '100%', textAlign: 'start' }} className="btn btn-warning px-2 mt-2" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
     </form>

     <form className="mt-5" onSubmit={handleSubmit(passwordUpdate)}>
          <h3 className="font-bold p-2 mb-3">Password</h3>
          <input
            type="password"
            placeholder="Enter Your Old Password"
            className="input input-bordered w-full mb-5"
            {...register("oldPassword", {
              required: "Old Password is required",
              minLength: {
                value: 6,
                message: "Old Password must be at least 6 characters",
              },
            })}
          />
          {errors.oldPassword && <p className="text-red-500 mb-5">{errors.oldPassword.message}</p>}

          <input
            type="password"
            placeholder="Enter Your New Password"
            className="input input-bordered w-full mb-5"
            {...register("newPassword", {
              required: "New Password is required",
              minLength: {
                value: 6,
                message: "New Password must be at least 6 characters",
              },
            })}
          />
          {errors.newPassword && <p className="text-red-500 mb-5">{errors.newPassword.message}</p>}

          {
           passwordLoading? <button className="btn btn-warning w-full text-lg text-white"><span className="loading loading-dots loading-lg text-center"></span></button> : <button className="btn btn-warning w-full text-lg text-white">Update</button>
        }
        </form>
    </div>
    </>
  )
}

export default Profile
