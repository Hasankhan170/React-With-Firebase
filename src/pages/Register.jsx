
const Register = () => {
    return (
      <>
     <div className="flex justify-center mt-5 text-center p-5 rounded-box ">
      <form style= {{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px"}}  className="p-5 ">
      <h1 className="text-lg font-bold p-2 mb-2">Register</h1>
      <input type="text" placeholder="Enter Your Name" className="input input-bordered w-full max-w-xs" />
        <br />
        <br />
        <input type="email" placeholder="Enter Your Email" className="input input-bordered w-full max-w-xs" />
        <br />
        <br />
        <input type="password" placeholder="Enter Your Password" className="input input-bordered w-full max-w-xs" />
        <br />
        <br />
        <input type="file"className="file-input file-input-bordered file-input-warning w-full max-w-xs" />
        <br />
        <br />
        <button className="btn btn-warning w-full text-lg text-white">Register</button>
      </form>
     </div>
      </>
    )
  }
  
  export default Register