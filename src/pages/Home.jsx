import { useEffect, useState } from "react"
import { collection,doc,getDoc,getDocs } from 'firebase/firestore';
import { db} from '../config/FirebaseConfig';


function Home() {

  const [allBlogs,setAllBlogs] = useState([])

  //Yeh code blogs ke sath users ki profile images ko Firestore se fetch karke state mein save karta hai,
  // aur jab component render hota hai to yeh sab data automatically load ho jata hai.
  const fetchAllBlogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogs'));
      const blogData = [];

      for (const blogDoc of querySnapshot.docs) {
        const blog = { id: blogDoc.id, ...blogDoc.data() };

        // Fetch the user profile based on userId
        const userDocRef = doc(db, 'users', blog.userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          blog.profileImage = userDocSnap.data().profileImage; // Add profile image to blog
        } else {
          blog.profileImage = null; 
        }

        blogData.push(blog);
      }

      setAllBlogs(blogData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);
  return (
    <>
   <div className="container mx-auto p-4">
  <h1 className="text-3xl font-bold mb-4">All Blogs</h1>
  {allBlogs.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allBlogs.map((blog) => (
        <div key={blog.id} className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
           {blog.profileImage && (
                  <img
                    src={blog.profileImage}
                    alt="User Profile"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                )}
            <h2 className="card-title">{blog.title}</h2>
            <p>{blog.description}</p> 
            {blog.timestamp && (
              <p className="text-gray-500 text-sm">
               Posted on: {new Date(blog.timestamp.toDate()).toLocaleString()}
              </p>
            )}   
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
