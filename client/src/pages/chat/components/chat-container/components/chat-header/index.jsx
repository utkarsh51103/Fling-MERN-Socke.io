import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { getColor } from "@/lib/utils";
import {useAppStore} from "@/store";

const chatheader = () => {
  const {closeChat ,selectedChatData, selectedChatType} = useAppStore();
  
  return (
    <div className="h-[13vh] w-full border-b-2 border-[#2f303b] px-5">
      <div className="flex gap-5 items-center my-3 justify-between">
        <div className="flex gap-3 items-center bg-[#2a2b33] px-4  py-2 sm:w-[40vw] md:w-[35vw] lg:w-[30vw] xl:w-[25vw] rounded-lg mb-3">
        <div className="w-14 h-12 relative">
         {
          selectedChatType === 'contact' ?  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden">
          {selectedChatData.images ? (
            <img
              src={`${HOST}/${selectedChatData.images}`}
              alt="Profile"
              className="object-cover w-full h-full bg-black"
            />
          ) : (
            <div
              className={`uppercase h-10 w-10 md:h-12 md:w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                selectedChatData.color
              )}`}
            >
              {selectedChatData.firstName
                ? selectedChatData.firstName.split("").shift()
                : selectedChatData.email.split("").shift()}
            </div>
          )}
        </div> : <div className="bg-[#ffffff22] h-10 w-10 flex items-center rounded-full justify-center">
        #
      </div>
         }
        </div>
        <div>
        {selectedChatType === 'channel' && selectedChatData.name}
         {selectedChatType === "contact" && selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email}
        </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={()=>closeChat()}>
             <RiCloseFill className="text-3xl"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default chatheader;
