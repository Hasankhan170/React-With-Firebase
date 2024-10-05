import { useForm } from 'react-hook-form'
import '../pages/Dashboard.css'
import { addDoc, collection,deleteDoc,doc,getDoc,getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, db} from '../config/FirebaseConfig';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';


const Dashboard = () => {

  const [renderBlogs,setRenderBlogs] = useState([])
  const [profileGet,setProfileGet] = useState(null)
  const [loading,setLoading] = useState(false)
  const [openModal,setOpenModal] = useState(false)
  const [deleteModal,setDeleteModal] = useState("")
  const [blogToDelete, setBlogToDelete] = useState(null);



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

  const deleteBlog = (index)=>{
    setBlogToDelete(index)
    setDeleteModal("Are you sure you want to delete this blog?")
    setOpenModal(true)
  }

  const confirmDelete = async ()=>{

    if(blogToDelete !== null){
      try {
        await deleteDoc(doc(db,"blogs",renderBlogs[blogToDelete].id))
        setRenderBlogs(renderBlogs.filter((blog)=>blog.id !== renderBlogs[blogToDelete].id))
      } catch (error) {
        console.log(error);
      }finally{
        closeModal()
      }
    }
  }



  const closeModal = ()=>{
    setOpenModal(false)
    setDeleteModal("")
    setBlogToDelete(null)
  }


 //edit work
  const editBlog = async(index)=>{
    const editTitle = prompt('enter your new title')
    const editDescripition = prompt('enter your new description')
    if(editTitle && editDescripition){
      try {
       const blogRef = doc(db,"blogs",renderBlogs[index].id)
       await updateDoc(blogRef,{
         title : editTitle,
         description : editDescripition,
         timestamp : new Date(),
       })

       setRenderBlogs(renderBlogs.map((blog,i)=>{
         if(i === index){
           return {...blog, title: editTitle, description: editDescripition}
         }
         return blog
       }))
        
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

      {
       loading? <button className="publish-blog w-full bg-warning"><span className="loading loading-dots text-lg text-center"></span></button> : <button className="publish-blog w-full bg-warning">Publish Blog</button>
      }
    </form>
  </div>


  {/* my blogs section  */}
  <h2 className="dashboard-head">My Blogs</h2>

  {/* render all my blogs here  */}

  <div className="my-blogs-render mb-4">
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
          <button onClick={()=>editBlog(index)} className='btn btn-success'>Edit</button>
        </div>
      </div>
    ))
  }
</div>



  {/* Success Modal */}
  {openModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 sm:mx-auto border border-gray-300">
      <h2 className="text-lg font-bold text-center text-green-600 mb-4">
        Success!
      </h2>
      <p className="text-center text-gray-800 mb-4 font-semibold">{deleteModal}</p>
      <div className="flex justify-between">
        <button
          onClick={closeModal}
          className="btn btn-gray bg-gray-300 text-white px-4 py-2 rounded-lg transition duration-200 ease-in-out transform hover:bg-gray-300 hover:scale-105"
        >
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          className="btn btn-error text-white px-4 py-2 rounded-lg transition duration-200 ease-in-out transform bg-red-600 hover:bg-red-700 hover:scale-105"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}



 </>
  )
}

export default Dashboard
