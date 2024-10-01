import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "../config/FirebaseConfig"


function Profile() {

  const [profileGet,setProfileGet] = useState(null)

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
  return (
    <>
    <h1 className="m-5">Profile</h1>
    <div style={{margin: '0 auto',borderRadius:'10px', boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",marginTop:'25px'}} className="container p-5 mt-40 max-h-max border-black">
     <form style={{}} className="bg-warning">
     <img width={150} className="mb-3" src={profileGet} alt="" />
     <div>
      {/* Hidden File Input */}
      <input type="file" id="fileInput" style={{ display: 'none' }} />

      {/* Custom Button with Font Icon */}
      <label htmlFor="fileInput" className="custom-file-upload">
        <i className="fa fa-upload"></i> Upload File
      </label>
    </div>
      <br />
      <button type="submit" className="btn btn-warning">click</button>
     </form>
      <h3 className="mb-3">hasan khan</h3>
      <p className="mb-3">password</p>
      <input  type="text" placeholder="Type here" className="input input-bordered input-outline-warning w-full mb-3" /><br />
      <input type="text" placeholder="Type here" className="input input-bordered w-full mb-3" /><br />
      <input type="text" placeholder="Type here" className="input input-bordered w-full mb-3" /><br />
      <button className="btn btn-warning">Update</button>
    </div>
    </>
  )
}

export default Profile
