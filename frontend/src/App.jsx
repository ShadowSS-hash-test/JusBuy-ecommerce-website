
import './App.css'
import { Routes, Route,Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'
import {Toaster} from "react-hot-toast"
import { useUserStore } from './stores/useUserStore'
import { useEffect } from 'react'
import Spinner from "./components/Spinner"
import AdminPage from './pages/AdminPage'
import CategoryPage from './pages/CategoryPage'
import UserCartPage from './pages/UserCartPage'
import { useCartStore } from './stores/useCartStore'

function App() {

 const {user,checkAuth,checkingAuth} = useUserStore();
 const {getCartItems}  = useCartStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  
    useEffect(()=>{ 
      if(!user)
      return;

    getCartItems()

  },[user])


  
  if(checkingAuth){
        return <Spinner></Spinner>
      }

  

  return (
  

    <div className='min-h-screen bg-gray-50 text-black relative overflow-hidden'>
 
    <Navbar></Navbar>
     <Routes>
      <Route path = '/' element={<HomePage></HomePage>}></Route>
      <Route path='/signup' element={!user ?  <SignupPage></SignupPage> : <Navigate to = '/'/>}></Route>
      <Route path='/login' element={!user ?  <LoginPage></LoginPage>: <Navigate to = '/'/>}></Route>
      <Route path='/secret-dashboard' element={user?.role === "admin" ?  <AdminPage></AdminPage> : <Navigate to = '/'/> }></Route>
       <Route path='/category/:category' element={<CategoryPage></CategoryPage>}></Route>
       <Route path='/cart' element={user ?  <UserCartPage></UserCartPage> : <Navigate to = '/login'></Navigate>}></Route>
     </Routes>

     <Toaster />
      
    </div>
  )
}

export default App
