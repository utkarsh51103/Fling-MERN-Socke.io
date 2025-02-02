import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import HOST from "@/utils/constants";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
const messagebar = () => {
  const emojiref = useRef();
  const fileref = useRef();
  const socket = useSocket()
  const [message, setmessage] = useState("");
  const [showemoji, setshowemoji] = useState(false);
  const {selectedChatType ,selectedChatData, userInfo,
    setisUploading,
    setuploadingPercentage} = useAppStore()

  const handleaddemoji = (emoji) => {
    setmessage((message) => message+ emoji.emoji);
  };

  const handlesendmsg = async () => {
     if(selectedChatType === "contact" && message && message.length > 0){
      socket.emit("sendMessage",{
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileURL: undefined
      })
      setmessage("")
     }else if(selectedChatType === "channel"){
      socket.emit("send-channel-message",{
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileURL: undefined,
        channelId:selectedChatData._id
      })
     }
     setmessage("");
  };

  const handleAttachment = () =>{
    if(fileref.current){
      fileref.current.click()
    }
  }

  const handleAttachmentChange = async(e)=>{
    try {
      const file = e.target.files[0];
      if(file){
        const formData = new FormData();
        formData.append("file",file);
        setisUploading(true);
        setuploadingPercentage(0);
        const response = await axios.post(`${HOST}/api/messages/upload-files`,formData,{withCredentials:true,
          onUploadProgress:(data)=>{
            setuploadingPercentage(Math.round(100*data.loaded/data.total));
          }}
        );

        if(response.status === 200 && response.data){
          setisUploading(false)
          if(selectedChatType === 'contact'){
          socket.emit("sendMessage",{
            sender: userInfo.id,
            content: undefined,
            recipient: selectedChatData._id,
            messageType: "file",
            fileURL: response.data.filePath
          })
         }else if(selectedChatType === 'channel'){
          socket.emit("send-channel-message",{
            sender: userInfo.id,
            content: message,
            messageType: 'file',
            fileURL: response.data.filePath,
            channelId:selectedChatData._id
          })
         }
        }
      }
      fileref.current.value = null;
    } catch (error) {
      setisUploading(false)
      console.log(error.message);
    }
  }

  useEffect(()=>{
           function handleclickoutside(e){
            if(emojiref.current && !emojiref.current.contains(e.target)){
              setshowemoji(false)
            }
           }
           document.addEventListener("mousedown",handleclickoutside)
           return ()=>{
            document.removeEventListener("mousedown",handleclickoutside)
           }
  },[emojiref])

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setmessage(e.target.value)}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={handleAttachment}>
          <GrAttachment className="text-2xl" />
        </button>
        <input type="file" className="hidden" ref={fileref} onChange={handleAttachmentChange}></input>
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setshowemoji(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiref}>
            <EmojiPicker theme="dark" open={showemoji} onEmojiClick={handleaddemoji} autoFocusSearch={false}/>
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus: focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handlesendmsg}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default messagebar;
