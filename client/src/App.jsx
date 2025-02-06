import React, { children, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { Toaster } from "react-hot-toast";
import { useAppStore } from "./store";
import HOST from '@/utils/constants'
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthentication = !!userInfo;
  return isAuthentication ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthentication = !!userInfo;
  return isAuthentication ? <Navigate to="/chat" /> : children;
};

function App() {
  const {userInfo, setuserinfo} = useAppStore()
  const [loading , setloading] = useState(true);

  useEffect(()=>{
     const getuserdata = async()=>{
        try {
          const res = await axios.get(`${HOST}/api/auth/user-info`,{withCredentials:true})
          console.log(res)
          if(res.status === 200 && res.data.id){
            setuserinfo(res.data)
          }else{
            setuserinfo(undefined)
          }
        } catch (error) {
          setuserinfo(undefined)
           console.log(error)
        } finally {
          setloading(false)
        }
     }
     if(!userInfo){
      getuserdata()
     }else{
      setloading(false);
     }
    },[userInfo, setuserinfo])
    
    if(loading){
      return <div className="h-[100vh] w-[100vw] flex items-center justify-center text-3xl text-white bg-black">Loading........</div>
    }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
