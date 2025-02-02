import React from "react";
import { useAppStore } from "@/store";
import moment from "moment";
import { useState, useRef, useEffect } from "react";
import HOST from "@/utils/constants";
import axios from "axios";
import { MdFolderZip } from "react-icons/md";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const messagecontainer = () => {
  const scrollRef = useRef();

  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setisDownloading,
    setdownloadingPercentage,
  } = useAppStore();
  const [imageopen, setimageopen] = useState(false);
  const [imageURL, setimageURL] = useState("");

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.post(
          `${HOST}/api/messages/get-messages`,
          { id: selectedChatData._id },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error(
          "Error fetching messages:",
          error.response?.data || error.message
        );
      }
    };

    const getChannelMessages = async()=>{
      try {
        const response = await axios.get(`${HOST}/api/channel/get-channel-messages/${selectedChatData._id}`,{withCredentials: true});
        if(response.status === 200){
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if (selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    }
    if(selectedChatData._id && selectedChatType === 'channel'){
      getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-gray-500 my-2 text-center">
              {moment(message.timeStamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMmessage(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const checkImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (file) => {
    setisDownloading(true);
    setdownloadingPercentage(0);
    const response = await axios.get(`${HOST}/${file}`, {
      responseType: "blob",
      onDownloadProgress:(progressEvent)=>{
        const {loaded,total} = progressEvent
        const percentcomplete = Math.round(100*loaded/total);
        setdownloadingPercentage(percentcomplete);
      }
    });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", file.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setisDownloading(false);
  };

  const renderDMmessage = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/40 text-white border-[#8417ff]/50"
              : "bg-[#2a2b33]/50 text-white/80 border-white/20"
          } border inline-block rounded-md p-4 my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" ? (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/20 text-white border-[#8417ff]/50"
              : "bg-[#2a2b33]/50 text-white/80 border-white/20"
          } border inline-block rounded-md p-1 my-1 max-w-[50%] md:max-w-[75%] break-words`}
        >
          {checkImage(message.fileURL) ? (
            <div className="cursor-pointer">
              <img
                src={`${HOST}/${message.fileURL}`}
                height={200}
                width={200}
                onClick={() => (
                  setimageopen(true), setimageURL(message.fileURL)
                )}
              />

              {imageopen && (
                <div>
                  <dialog
                    open={imageopen}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 lg:w-[50%] lg:h-[50%]"
                  >
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                      <div className="absolute top-2 right-2 flex items-center justify-center gap-2">
                        {message.sender === selectedChatData._id ?<button
                          className=" text-white bg-black/50 hover:bg-black rounded-full p-2 transition-all duration-300"
                          onClick={() => downloadFile(imageURL)}
                        >
                          <IoCloudDownloadOutline className="text-2xl" />
                        </button>:null}
                        <button
                          className=" text-white bg-black/50 hover:bg-black rounded-full p-2 transition-all duration-300"
                          onClick={() => setimageopen(false)}
                        >
                          <RxCross2 className="text-2xl" />
                        </button>
                      </div>
                      <img
                        src={`${HOST}/${imageURL}`}
                        alt="Preview"
                        className="rounded-md object-contain w-full h-full"
                      />
                    </div>
                  </dialog>
                </div>
              )}
              {imageopen && (
                <div
                  className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
                  onClick={() => setimageopen(false)}
                ></div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-white text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span className="overflow-hidden">
                {message.fileURL.split("/").pop()}
              </span>
              {message.sender === selectedChatData._id ? <span className="bg-black/20 p-3 text-3xl rounded-full hover:bg-black/50 transition-all duration-300">
              
                <IoCloudDownloadOutline
                  height={15}
                  width={15}
                  onClick={() => downloadFile(message.fileURL)}
                />
              </span>:null}
            </div>
          )}
        </div>
      ) : null}
      <div className="text-xs text-gray-600">
        {moment(message.timeStamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessages = (message) =>{
    
     return (
      <div className={`mt-5 ${message.sender._id === userInfo.id ? "text-right" : "text-left"} `}>
      {message.messageType === "text" && (
        <div>
        <div>
        {message.sender._id !== userInfo.id && 
            <span className="text-sm text-gray-400">{message.sender.firstName + " " + message.sender.lastName}</span>
        }
        </div>
        <div
          className={`${
            message.sender._id === userInfo.id
              ? "bg-[#8417ff]/40 text-white border-[#8417ff]/50"
              : "bg-[#2a2b33]/50 text-white/80 border-white/20"
          } border inline-block rounded-md p-4 my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
        <div className="text-xs text-gray-600">
        {moment(message.timeStamp).format("LT")}
      </div>
        </div>
        
      )}
      {message.messageType === "file" && (
        <div>
        {
          message.sender._id !== userInfo.id ? <div className="text-sm text-gray-400">
          {message.sender.firstName + " " + message.sender.lastName}
          </div>:null
        }
        <div
          className={`${
            message.sender._id !== selectedChatData._id
              ? "bg-[#8417ff]/20 text-white border-[#8417ff]/50"
              : "bg-[#2a2b33]/50 text-white/80 border-white/20"
          } border inline-block rounded-md p-1 my-1 max-w-[50%] md:max-w-[75%] break-words`}
        >
          {checkImage(message.fileURL) ? (
            <div className="cursor-pointer">
              <img
                src={`${HOST}/${message.fileURL}`}
                height={200}
                width={200}
                onClick={() => (
                  setimageopen(true), setimageURL(message.fileURL)
                )}
              />

              {imageopen && (
                <div>
                  <dialog
                    open={imageopen}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 lg:w-[50%] lg:h-[50%]"
                  >
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                      <div className="absolute top-2 right-2 flex items-center justify-center gap-2">
                        {message.sender === selectedChatData._id ?<button
                          className=" text-white bg-black/50 hover:bg-black rounded-full p-2 transition-all duration-300"
                          onClick={() => downloadFile(imageURL)}
                        >
                          <IoCloudDownloadOutline className="text-2xl" />
                        </button>:null}
                        <button
                          className=" text-white bg-black/50 hover:bg-black rounded-full p-2 transition-all duration-300"
                          onClick={() => setimageopen(false)}
                        >
                          <RxCross2 className="text-2xl" />
                        </button>
                      </div>
                      <img
                        src={`${HOST}/${imageURL}`}
                        alt="Preview"
                        className="rounded-md object-contain w-full h-full"
                      />
                    </div>
                  </dialog>
                </div>
              )}
              {imageopen && (
                <div
                  className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
                  onClick={() => setimageopen(false)}
                ></div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-white text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span className="overflow-hidden">
                {message.fileURL.split("/").pop()}
              </span>
              {message.sender === selectedChatData._id ? <span className="bg-black/20 p-3 text-3xl rounded-full hover:bg-black/50 transition-all duration-300">
              
                <IoCloudDownloadOutline
                  height={15}
                  width={15}
                  onClick={() => downloadFile(message.fileURL)}
                />
              </span>:null}
            </div>
          )}
          
        </div>
        <div className="text-xs text-gray-600">
        {moment(message.timeStamp).format("LT")}
      </div>
      </div>
      )}
    
      </div>
     )
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full h-[75vh]">
      {renderMessage()}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default messagecontainer;
