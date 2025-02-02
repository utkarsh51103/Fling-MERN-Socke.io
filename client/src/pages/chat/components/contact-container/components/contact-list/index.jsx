import { useAppStore } from "@/store";
import React from "react";
import HOST from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({ contact, isChannel = false }) => {
  const {
    selectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  return (
    <div className="mt-5">
      {contact.map((con) => (
        <div
          key={con._id}
          className={`flex items-center gap-5 pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === con._id
              ? "bg-[#8417ff] hover:bg-[#7417ff] rounded-md"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(con)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <div className="h-10 w-10 rounded-full">
                {con.images ? (
                  <img
                    src={`${HOST}/${con.images}`}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                ) : (
                  <div
                    className={`uppercase h-10 w-10 md:h-12 md:w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${selectedChatData && (selectedChatData._id === con._id) ? "bg-black/45" :getColor(
                      con.color
                    )}`}
                  >
                    {con.firstName
                      ? con.firstName.split("").shift()
                      : con.email.split("").shift()}
                  </div>
                )}
                
              </div>
            )}
          </div>
          {isChannel && (
            <div className="bg-[#ffffff22] h-10 w-10 flex items-center rounded-full justify-center">
              #
            </div>
          )}
          {isChannel ? (
            <span>{con.name}</span>
          ) : (
            <span className="text-lg">{`${con.firstName} ${con.lastName}`}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default ContactList;
