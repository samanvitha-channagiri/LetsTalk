import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import CallPage from './pages/CallPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import toast,{Toaster} from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router'
import axios from 'axios'
import { axiosInstance } from './lib/axios.js'
const App = () => {
  const {data:authData,isLoading,error}=useQuery({
    queryKey:["authUser"],
    queryFn:async()=>{
      const res=await axiosInstance.get("/auth/me")
      
      return res.data
    },
    retry:false
  })
  const authUser=authData?.user
  
  console.log(authUser);
 
  


  
  return (
    <div data-theme='coffee' className=' h-screen '>
     
      <Routes>
        <Route path='/' element={authUser?<HomePage/>:<Navigate to='/'/>}/>
         <Route path='/signup' element={<SignUpPage/>}/>
         <Route path='/login' element={<LoginPage/>}/>
         <Route path='/notifications' element={authUser?<NotificationsPage/>:<Navigate to='/'/>}/>
         <Route path='/call' element={authUser?<CallPage/>:<Navigate to='/'/>}/>
         <Route path='/chat' element={authUser?<ChatPage/>:<Navigate to='/'/>}/>
         <Route path='/onboarding' element={authUser?<OnboardingPage/>:<Navigate to='/'/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
