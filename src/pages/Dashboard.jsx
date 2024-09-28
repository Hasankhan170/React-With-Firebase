import { useForm } from 'react-hook-form'
import '../pages/Dashboard.css'


const Dashboard = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const countWords = (str) => {
    return str.trim().split(/\s+/).filter(word => word !== "").length; // Filter out empty words
  };


  const userBlog = (data)=>{
    console.log(data);
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
      
      {/* Title input with validation */}
      <input
        {...register("title", {
          required: "Title is required",
          validate: (value) =>
            countWords(value) >= 20 && countWords(value) <= 25 || "Title must be between 20 and 25 words"
        })}
        className="dashboard-input"
        type="text"
        placeholder="Enter Title.."
      />
      {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
      
      <br />

      {/* Description textarea with validation */}
      <textarea
        {...register("description", {
          required: "Description is required",
          validate: (value) =>
            countWords(value) >= 30 && countWords(value) <= 40 || "Description must be between 30 and 40 words"
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
