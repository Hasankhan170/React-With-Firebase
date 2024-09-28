import '../pages/Dashboard.css'


const Dashboard = () => {
  return (
    <>
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
    <form className="dashboard-form">
      <input
        required=""
        className="dashboard-input"
        type="text"
        placeholder="Enter Title.."
      />
      <br />
      <textarea
        required=""
        className="dashboard-textarea"
        placeholder="Text.."
        rows=""
        cols={180}
        defaultValue={""}
      />
      <button className="publish-blog bg-warning">Publish Blog</button>
    </form>
  </div>
  {/* my blogs section  */}
  <h2 className="dashboard-head">My Blogs</h2>
  {/* render all my blogs here  */}
  <div className="my-blogs-render"></div>
</>

    </>
  )
}

export default Dashboard
