
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
import ProtectRoutes from './components/ProtectRoutes.jsx'

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
        path : 'Login',
        element : <Login/>
      },
      {
        path : 'Dashboard',
        element : <ProtectRoutes component={<Dashboard/>}/>
      },
      {
        path : 'Register',
        element : <Register/>
      },
      {
        path : 'SinglePage',
        element : <ProtectRoutes component={<SinglePage/>}/>
      },
      {
        path : 'Profile',
        element : <ProtectRoutes component={<Profile/>}/>
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
