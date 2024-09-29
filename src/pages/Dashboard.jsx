import { useForm } from 'react-hook-form'
import '../pages/Dashboard.css'
import { addDoc, collection,doc,getDocs } from 'firebase/firestore';
import { auth, db } from '../config/FirebaseConfig';
import { useEffect, useState } from 'react';


const Dashboard = () => {

  const [renderBlogs,setRenderBlogs] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  useEffect(()=>{

    const fecthBlogs = async ()=>{
      try {
        const blogRef = collection(db,"blogs");
        const blogSnapShot = await getDocs(blogRef);
        const blogList = blogSnapShot.docs.map((doc)=>({
          id: doc.id,
         ...doc.data()
        }))
        setRenderBlogs(blogList)
      } catch (error) {
        console.log(error);
        
      }
    }
    fecthBlogs()
  },[])

  const userBlog = async (data) =>{

    const {title,description} = data
    console.log(data);

    const user = auth.currentUser;
    console.log(user);
    

    if(user){
      try {
        const blogRef = collection(db, "blogs")// Reference to Firestore 'blogs' collection

        // Add the blog to Firestore with user's ID
        await addDoc(blogRef,{
          userId : user.uid,
          title: title,
          description : description
        })

        reset()

        const blogSnapshot = await getDocs(blogRef);
        const blogsList = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRenderBlogs(blogsList); 
      } catch (error) {
        console.log(error);
        
      }
    }
  }

  

  return (
    <>
  {/* header section  */}
  <header className="header-main">
    <div className="blog-heading">
    </div>
  </header>
  {/* dashboard section  */}
  <h1 className="dashboard-head">Dashboard</h1>
  {/* dashboard form  */}
  <div className="dashboard-main">
  <form onSubmit={handleSubmit(userBlog)} className="dashboard-form">
      
      {/* Title input with "required" validation */}
      <input
        {...register("title", {
          required: "This field is required"
        })}
        className="dashboard-input"
        type="text"
        placeholder="Enter Title.."
      />
      {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
      
      <br />

      {/* Description textarea with "required" validation */}
      <textarea
        {...register("description", {
          required: "This field is required"
        })}
        className="dashboard-textarea"
        placeholder="Enter Description.."
        rows="5"
        cols="180"
      />
      {errors.description && <p style={{ color: 'red' }}>{errors.description.message}</p>}

      <button className="publish-blog bg-warning">Publish Blog</button>
    </form>
  </div>
  {/* my blogs section  */}
  <h2 className="dashboard-head">My Blogs</h2>
  {/* render all my blogs here  */}
  <div className="my-blogs-render"></div>
 </>
  )
}

export default Dashboard
