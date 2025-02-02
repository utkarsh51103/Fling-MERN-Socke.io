import { useAppStore } from "@/store";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

function chat() {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    uploadPercentage,
    downloadPercentage,
  } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profilesetup) {
      toast.error("Please setup your profile");
      navigate("/profile");
    }
  }, []);

  return (
    <div className="flex h-[100vh] w-[100vw] text-white overflow-hidden">
    {
      isUploading && <div className="h-[100vh] w-[100vw] fixed top-0 bottom-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-black/90 p-4 rounded-md">
          <h6>Uploading...</h6>
           {uploadPercentage}%
        </div>
      </div>
    }
    {
      isDownloading && <div className="h-[100vh] w-[100vw] fixed top-0 bottom-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-black/90 p-4 rounded-md">
          <h6>Downloading...</h6>
           {downloadPercentage}%
        </div>
      </div>
    }
      <ContactContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}

export default chat;
