import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import HOST, { UPDATE_PROFILE_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setuserinfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const fileinput = useRef(null);

  useEffect(() => {
    if (userInfo.profilesetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color ?? 0);
    }
    if(userInfo.image){
      const imageURL = `${HOST}/${userInfo.image}`
      setImage(imageURL)
    }
  }, [userInfo]);

  const validateprofile = () => {
    if (!firstName) {
      toast.error("First Name is Required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is Required");
      return false;
    }
    return true;
  };
  const saveChanges = async () => {
    if (validateprofile()) {
      try {
        const response = await axios.post(
          `${HOST}/${UPDATE_PROFILE_ROUTE}`,
          { firstName, lastName, color :selectedColor},
          { withCredentials: true }
        );

        if (response.status === 200 && response.data) {
          setuserinfo(response.data);
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlenavigate = () => {
    if (userInfo.profilesetup) {
      navigate("/chat");
    } else {
      toast.error("Please Setup Profile");
    }
  };

  const handlefileinputclick = () => {
    fileinput.current.click();
  };

  const handleimagechange = async (e) => {
    try {
    const file = e.target.files[0];
    console.log({file});
    if (file) {
      const formdata = new FormData();
      formdata.append("profile-image", file);
      const response = await axios.post(
        `${HOST}/api/auth/add-profile-image`,
        formdata,
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.image) {
        setuserinfo({ ...userInfo, image: response.data.image });
        toast.success("Image Updated Successfully");
      }
    }
      
    } catch (error) {
      console.log(error); 
    }
  };

  const handledeleteimage = async () => {
    try {
      const response = await axios.delete(`${HOST}/api/auth/remove-profile-image`,{withCredentials:true})
      if(response.status === 200 && response.data.message){
        setuserinfo({...userInfo, image:null})
        toast.success(response.data.message)
        setImage(null);
    }
   } catch (error) {
     console.log(error);  
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[100vw] md:w-max sm:ml-44 md:ml-0">
        <div onClick={handlenavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2 sm:flex sm:gap-20">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </div>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full sm:my-[90px] md:my-0 "
                onClick={image ? handledeleteimage : handlefileinputclick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl" />
                ) : (
                  <FaPlus className="text-white text-3xl" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileinput}
              className="hidden"
              onChange={handleimagechange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-48 md:min-w-68 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full rounded-lg">
              <input
                placeholder="Email"
                type="email"
                value={userInfo.email}
                disabled
                className="rounded-lg p-6 bg-[#2c2e3b] border-none cursor-pointer"
              />
            </div>
            <div className="w-full rounded-lg">
              <input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none cursor-pointer"
              />
            </div>
            <div className="w-full rounded-lg">
              <input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none cursor-pointer"
              />
            </div>
            <div className="w-full flex gap-5 ">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 cursor-pointer transition-all duration-100 rounded-full ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-2"
                      : ""
                  }`}
                  key={index}
                  onClick={() => {
                    setSelectedColor(index);
                    console.log(index);
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full md:flex items-center justify-center">
          <button
            className="h-12 rounded-3xl bg-purple-700 w-full hover:bg-purple-900 text-white transition-all duration-100 sm:w-[60vh]"
            onClick={saveChanges}
          >
            Sava Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
