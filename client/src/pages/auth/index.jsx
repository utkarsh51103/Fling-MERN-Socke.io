import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import "./style.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import HOST from "@/utils/constants";
import { useAppStore } from "@/store";
import axios from "axios";

function auth() {
  const [action, setaction] = useState("SignUp");
  const {setuserinfo} = useAppStore()
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");

  const navigate = useNavigate();

  const validatesignup = () =>{
    
      if(!email.length){
      toast.error("Email is Requiered");
      return false;
     }
     if(!password.length){
        toast.error("Password is Requiered");
        return false;
     }
     if(password!==confirmpassword){
        toast.error("Password and Confirm Password do not match");
        return false;
     }
     return true;
  }
  const validatelogin = () =>{
    
    if(!email.length){
    toast.error("Email is Requiered");
    return false;
   }
   if(!password.length){
      toast.error("Password is Requiered");
      return false;
   }
   return true;
}

  const handlelogin = async(e) => {
    e.preventDefault();
    if(validatelogin()){
      const response = await axios.post(`${HOST}/api/auth/login`,{email,password},{withCredentials:true})
      if(response.data.user.id){
        console.log(response.data)
        setuserinfo(response.data.user)
        if(response.data.user.profilesetup) navigate("/chat")
          else navigate("/profile")
      }
      toast.success("Login Successful");
    } 
  }
  const handlesignup = async(e) => {
    e.preventDefault();
    if (validatesignup()) {
    const response = await axios.post(`${HOST}/api/auth/signup`,{email,password},{withCredentials:true})
    if(response.status===201){
      setuserinfo(response.data.user)
      navigate("/profile")
    }
    toast.success("Signup Successful");
  }   
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1b1c24]">
    <div className="flex flex-col m-auto my-28 w-[600px]  bg-[#2c2e3b] pb-8 rounded-xl">
      <div className="flex flex-col items-center gap-2 container mt-8 text-white text-5xl font-medium ">
        <div>{action}</div>
        <div className="w-20 h-1.5 bg-white rounded-2xl"></div>
      </div>
      <form onSubmit={action==="SignUp"?handlesignup:handlelogin}>
        <div className="flex flex-col h-60 mt-12 gap-6">
          {action === "Login" ? (
            <div></div>
          ) : (
            <div className="flex items-center m-auto w-96 h-20 bg-slate-200 rounded-xl ">
              <CgProfile className="mx-3" size={25} color="gray" />
              <input
                className="h-12 w-96 bg-transparent border-none outline-none bg-slate-200 text-xl"
                type="text"
                placeholder="Name"
              />
            </div>
          )}
          <div className="flex items-center m-auto w-96 h-20 bg-slate-200 rounded-xl ">
            <MdEmail size={25} className="mx-3" color="gray" />
            <input
              className="h-12 w-96 bg-transparent border-none outline-none bg-slate-200 text-xl"
              type="email"
              placeholder="Email Id"
              name="email"
              value={email}
              onChange={(e)=>setemail(e.target.value)}
            />
          </div>
          <div className="flex items-center m-auto w-96 h-20 bg-slate-200 rounded-xl ">
            <RiLockPasswordFill size={25} className="mx-3" color="gray" />
            <input
              className="h-12 w-96 bg-transparent border-none outline-none bg-slate-200 text-xl"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setpassword(e.target.value)}
            />
          </div>
          {action==="SignUp"?<div className="flex items-center m-auto w-96 h-20 bg-slate-200 rounded-xl ">
            <RiLockPasswordFill size={25} className="mx-3" color="gray" />
            <input
              className="h-12 w-96 bg-transparent border-none outline-none bg-slate-200 text-xl"
              type="text"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChange={(e)=>setconfirmpassword(e.target.value)}
            />
          </div>:<div></div>}
          <div className="flex justify-center items-center bg-violet-700 mx-48 py-2 rounded-xl text-white font-bold text-xl  ">
            <button type="submit">Submit</button>
          </div>
        </div>
      </form>
      {action === "Login" ? (
        <div className="pl-28 mt-7 text-slate-400 text-xl">
          Lost Password?
          <span className="text-violet-700 cursor-pointer pl-3">
            Click Here
          </span>
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex gap-7 mx-16 my-36">
        <div
          className={action === "Login" ? "submit" : "submit gray"}
          onClick={() => {
            setaction("SignUp");
          }}
        >
          SignUp
        </div>
        <div
          className={action === "SignUp" ? "submit" : "submit gray"}
          onClick={() => setaction("Login")}
        >
          Login
        </div>
      </div>
    </div>
    </div>
  );
}

export default auth;
