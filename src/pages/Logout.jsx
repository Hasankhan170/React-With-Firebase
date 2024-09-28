import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/FirebaseConfig";


const Logout = () => {

    const naviate = useNavigate()

      const user = signOut(auth).then(() => {
        console.log(user);
        naviate('/')
     }).catch((error) => { 
    console.log(error);
    
});
  return (
    <>
    <h1>Logout</h1>
    </>
  )
}

export default Logout
