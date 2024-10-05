import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { auth, db } from "./config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore"; 

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged( async(user) => {
      if (user) {
        const userDoc = await getDoc(doc(db,'users',user.uid))
        if(userDoc.exists()){
          const userData = userDoc.data();
          setProfileImage(userData.profileImage);
        }
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
        setProfileImage(null); // Clear profile image on logout
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProfileImage = (imageUrl) => {
    setProfileImage(imageUrl);
  };

  return (
    <>
       <Navbar 
        profileImage={profileImage} 
        isUserLoggedIn={isUserLoggedIn} 
        setIsUserLoggedIn={setIsUserLoggedIn} 
        setProfileImage={setProfileImage}
      />
      <Outlet context={{ updateProfileImage }} />
    </>
  );
}

export default App;

