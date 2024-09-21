
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SinglePage from './pages/SinglePage.jsx'
import Profile from './pages/Profile.jsx'

const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
    children : [
      {
        path : '',
        element : <Home/>
      },
      {
        path : 'Dashboard',
        element : <Dashboard/>
      },
      {
        path : 'Login',
        element : <Login/>
      },
      {
        path : 'Register',
        element : <Register/>
      },
      {
        path : 'SinglePage',
        element : <SinglePage/>
      },
      {
        path : 'Profile',
        element : <Profile/>
      },
      {
        path : '*',
        element : <h1>Page Not Found</h1>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
     <App />
  </RouterProvider>
   
 
)
