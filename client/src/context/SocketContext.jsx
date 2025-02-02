import { createContext, useContext, useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import HOST from "@/utils/constants";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect", () => {
        console.log("Socket Connected");
      });

      const handleRecievemessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage, addContactInDmContacts} = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData.id === message.sender.id ||
            selectedChatData.id === message.recipient.id)
        ) {
            addMessage(message);
        }
        addContactInDmContacts(message)
      };

      const handleRecieveChannelmessage = (message) =>{
        const { selectedChatData, selectedChatType, addMessage,addChannelInChannelList} = useAppStore.getState();

        if(selectedChatType!==undefined && selectedChatData._id === message.channelId){
          addMessage(message);
        }
        addChannelInChannelList(message);
      }

      socket.current.on("recieveMessage", handleRecievemessage);
      socket.current.on("recieve-channel-data",handleRecieveChannelmessage);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
