import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Homepage from './components/Homepage.jsx'
import Playground from './components/Playground.jsx'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter , RouterProvider} from "react-router-dom"


const router= createBrowserRouter([
{  path:"/",
  element: <App/>,
  children:[{
    path:"/",
    element: <Homepage/>
  },

  {
    path:"/playground",
    element:<Playground/>
  }

]
 }

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={router}/>
  </StrictMode>,
)
