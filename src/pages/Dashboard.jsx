import { useForm } from 'react-hook-form'
import '../pages/Dashboard.css'
import { addDoc, collection,deleteDoc,doc,getDoc,getDocs, query, where } from 'firebase/firestore';
import { auth, db} from '../config/FirebaseConfig';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';


const Dashboard = () => {

  const [renderBlogs,setRenderBlogs] = useState([])
  const [profileGet,setProfileGet] = useState(null)
  const [loading,setLoading] = useState(false)


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  useEffect(()=>{
    const userProfileImg = async(user)=>{
      
      if(user){
        const docRef= doc(db,'users', user.uid)
         // 'getDoc' ke through hum database se user ka document fetch kar rahe hain
        const docSnap = await getDoc(docRef)
        console.log(docSnap);

        // Agar document exist karta hai toh
        if(docSnap.exists()){
           // User ki profile image URL ko 'profileGet' state mein store kar rahe hain
          setProfileGet(docSnap.data().profileImage)
        }
      }else{
        // Agar user logged out hai toh state ko null kar do
        setProfileGet(null)
      }
    }


    const unSubscribe = auth.onAuthStateChanged(async (user)=>{ // Auth state change listener
      await userProfileImg(user); // User profile ko fetch karo
    })
   
    return ()=> unSubscribe() // Cleanup function
  },[setProfileGet])
  
  //fetch user blogs
  useEffect(() => {
    const fecthBlogs = async (userId) => {
      try {
        const blogRef = collection(db, "blogs");
        const q = query(blogRef, where("userId", "==", userId));
        const blogSnapShot = await getDocs(q);
        const blogList = blogSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRenderBlogs(blogList);
      } catch (error) {
        console.log(error);
      }
    };
  
    // Listen to authentication state changes
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in:", user.uid);
        fecthBlogs(user.uid); // Fetch blogs when the user is logged in
      } else {
        console.log("User logged out");
        setRenderBlogs([]);
      }
    });
  
    return () => {
      console.log("Cleaning up the auth listener");
      unSubscribe(); 
    }
  }, []);

  const userBlog = async (data) =>{

    const {title,description} = data
    setLoading(true)
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
          description : description,
          timestamp : new Date(),
        })

        reset()
        const q = query(blogRef, where('userId', '==', user.uid));
        const blogSnapshot = await getDocs(q);
        const blogsList = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRenderBlogs(blogsList); 
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false)
      }
    }
  }

  const deleteBlog = async (index)=>{

    try {
      await deleteDoc(doc(db,"blogs",renderBlogs[index].id)) 
      setRenderBlogs(renderBlogs.filter((blog)=>blog.id !== renderBlogs[index].id))
      console.log("delete",index);
    } catch (error) {
      console.log(error); 
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

      {
       loading? <button className="publish-blog w-full bg-warning"><span className="loading loading-dots text-lg text-center"></span></button> : <button className="publish-blog w-full bg-warning">Publish Blog</button>
      }
    </form>
  </div>


  {/* my blogs section  */}
  <h2 className="dashboard-head">My Blogs</h2>

  {/* render all my blogs here  */}

  <div className="my-blogs-render">
  {
    renderBlogs.map((blog,index) => (
      <div key={blog.id} className="under-rendering ">
       <div className='flex justify-between flex-wrap h-auto'>
       <div  className="under-title flex">
        <img
  style={{
    width: '50px',
    height: '50px', 
    borderRadius: '50%', 
    objectFit: 'cover' 
  }}
  alt="User Avatar"
  src={profileGet} />
          <h3 className='px-5'>{blog.title}</h3>
        </div>
        <div>
        <p style={{fontSize:'12px'}}>{new Date(blog.timestamp.toDate()).toLocaleString()}</p>
        </div>
       </div>
        <div>
          
        </div>
        <div className="under-p">
          <p className="under">{blog.description}</p>
        </div>
        <div className='flex gap-5 mt-5 flex-wrap'>
          <button onClick={()=>deleteBlog(index)} className='btn btn-error'>Delete</button>
          <button className='btn btn-success'>Edit</button>
        </div>
      </div>
    ))
  }
</div>

 </>
  )
}

export default Dashboard
