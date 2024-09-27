import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/FirebaseConfig'


const ProtectRoutes = ({component}) => {

    const [isUser, setUser] = useState(false)

    const navigate = useNavigate()

    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setUser(true);
            }else{
                navigate('/Register')
            }
        })
    },[navigate])
    
  return (
     setUser ? component : <h1>Loading...</h1>
  )
}

export default ProtectRoutes
