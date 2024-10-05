import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { auth } from "./config/FirebaseConfig";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
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

