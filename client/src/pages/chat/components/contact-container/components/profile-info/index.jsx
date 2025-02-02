import { useAppStore } from "@/store";
import React, { useState } from "react";
import HOST from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import axios from "axios";
import { Tooltip } from "react-tooltip";

function index() {
  const { userInfo ,setuserinfo} = useAppStore();
  const [openLogout, setopenLogout] = useState(false);
  const navigate = useNavigate()

const handleLogout = async() => {
     try {
        const response = await axios.post(`${HOST}/api/auth/logout`,{},{withCredentials:true})
        if(response.status === 200){
            navigate('/auth')
        }
        setuserinfo(null);
     } catch (error) {
        console.log(error)
     }
}
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-around w-full bg-[#2a2b33]">
      <div className="flex items-center justify-center">
        <div className="w-14 h-12 relative">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden">
            {userInfo.images ? (
              <img
                src={`${HOST}/${userInfo.images}`}
                alt="Profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-10 w-10 md:h-12 md:w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </div>
        </div>
        <div className="text-sm">
        {
            userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
        }
        </div>
      </div>
      <div className="flex gap-5">
        <CiEdit className="h-6 w-6 text-[#8417ff] cursor-pointer" onClick={()=>navigate('/profile')} data-tooltip-id="edit"/>
        <IoPowerSharp className="h-6 w-6 text-red-700 cursor-pointer" onClick={()=>setopenLogout(true)} data-tooltip-id="logout"/>
        <Tooltip id="edit" content="Edit Profile"/>
        <Tooltip id="logout" content="Logout"/>
        
        {
          openLogout === true ? <div className="fixed inset-0 bg-black opacity-75 z-40" onClick={()=>setopenLogout(false)}/>:null
        }

        <dialog open={openLogout} className="fixed z-50 bg-[#2a2b33] text-white p-5 rounded-md top-[40%] sm:left-[20%] md:left-[10%] lg:left-[5%] xl:left-[0%] text-center">
            <p className="text-white">Do you want to </p><p className="text-purple-500">Logout</p>
            <button className="mx-5 my-3 border-none bg-gray-700 px-4 py-2 rounded-lg" onClick={handleLogout}>Yes</button>
            <button className="mx-5 my-3 border-none bg-gray-700 px-4 py-2 rounded-lg" onClick={()=> setopenLogout(false)}>No</button>
        </dialog>
        
      </div>
    </div>
  );
}

export default index;