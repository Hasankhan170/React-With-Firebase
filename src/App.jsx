// import React from 'react'

import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element = {<Home />}></Route>
      <Route path="/Signup" element = {<Signup />}></Route>
      <Route path="/Signin" element = {<Signin />}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
