import { useEffect, useState } from "react"
import { collection, getDocs } from 'firebase/firestore';
import { db} from '../config/FirebaseConfig';


function Home() {

  const [allBlogs,setAllBlogs] = useState([])

  const fetchAllBlogs = async ()=>{
   try {
    const querrySnapShot = await getDocs(collection(db,('blogs')));
    const blogData = []
    querrySnapShot.forEach((doc)=>{
      blogData.push({id:doc.id,...doc.data()})
    })
    setAllBlogs(blogData)
   } catch (error) {
    console.log(error);
   }
  }

  useEffect(()=>{
    fetchAllBlogs() 
  },[])
  return (
    <>
   <div className="container mx-auto p-4">
  <h1 className="text-3xl font-bold mb-4">All Blogs</h1>
  {allBlogs.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allBlogs.map((blog) => (
        <div key={blog.id} className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{blog.title}</h2>
            <p>{blog.description}</p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No blogs available.</p>
  )}
</div>

    </>
  )
}

export default Home
