import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db, storage } from "../config/FirebaseConfig"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"


function Profile() {

  const [profileGet,setProfileGet] = useState(null)
  const [file,setFile] = useState(null)
  const [loading,setLoading] = useState(false)

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
      setFile(null)
      alert('Profile updated successfully!')
      console.log("Profile updated successfully!");
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
    <h1 className="m-5 mx-10 text-4xl font-bold">Profile</h1>
    <div style={{margin: '0 auto',borderRadius:'10px', boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",marginTop:'25px'}} className="container p-5 mt-40 max-h-max border-black">
     <form onSubmit={updateProfile} style={{width:"200px",flexDirection:'column',border:'1px solid gray',borderRadius:'10px'}} className="flex text-center justify-center p-3">
     <img 
  style={{
    width: '200px', 
    height: '100px', 
    borderRadius: '10px', 
    objectFit: 'cover',
  }} 
  className="mb-3" 
  src={profileGet} 
  alt="" 
/>
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

   <form className="mt-5">
    <h3 className="font-bold p-2 mb-3">Password</h3>
      <input type="text" placeholder="Old Password" className="input input-bordered input-outline-warning w-full mb-3" /><br />
      <input type="text" placeholder="New Password" className="input input-bordered w-full mb-3" /><br />
      <button className="btn btn-warning">Update</button>
   </form>
    </div>
    </>
  )
}

export default Profile
