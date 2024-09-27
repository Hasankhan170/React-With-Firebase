import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";


const Navbar = () => {

  const [profileGet,setProfileGet] = useState(null)

  useEffect(()=>{
    const fetchUserProfile = async (user)=>{
      if(user){
        const docRef= doc(db,'users', user.uid)
         // 'getDoc' ke through hum database se user ka document fetch kar rahe hain
        const docSnap = await getDoc(docRef)
        console.log(docSnap);

        // Agar document exist karta hai toh
        if(docSnap.exists()){
           // User ki profile image URL ko 'profileGet' state mein store kar rahe hain
          setProfileGet(docSnap.data().profileImage)
        }else{
          console.log("No such document!");
        }
      }else{
        // Agar user logged out hai toh state ko null kar do
        setProfileGet(null)
      }
    }


    const unSubscribe = auth.onAuthStateChanged(async (user)=>{ // Auth state change listener
      await fetchUserProfile(user); // User profile ko fetch karo
    })
   
    return ()=> unSubscribe() // Cleanup function
  },[])

    return (
        <>
          <div className="navbar bg-base-100 px-5 bg-warning ">
            <div className="flex-1">
              <a className="btn btn-ghost text-xl text-white">Blogging App</a>
            </div>
            <div className="flex justify-center flex-1">
            </div>
            <div className="flex-none gap-2">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="User Avatar"
                      src={profileGet}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                  <li><Link to= "">Home</Link></li>
                  <li><Link to= "Login">Login</Link></li>
                  <li><Link to= "Register">Register</Link></li>
                  <li><Link to= "Profile" className="justify-between">Profile</Link></li>
                  <li><Link to= "Dashboard">DashBoard</Link></li>
                  <li><Link to= "SinglePage">SinglePage</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </>
      );
      
}

export default Navbar
