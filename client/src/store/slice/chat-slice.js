export const createChatSlice = (set,get) =>({
   selectedChatType:undefined,
   selectedChatData:undefined,
   selectedChatMessages:[],
   directMessagesContacts:[],
   isUploading:false,
   isDownloading:false,
   uploadPercentage:0,
   downloadPercentage:0,
   channels:[],
   setChannel:(channels)=>set({channels}),
   setisUploading:(isUploading)=>set({isUploading}),
   setisDownloading:(isDownloading)=>set({isDownloading}),
   setuploadingPercentage:(uploadPercentage)=>set({uploadPercentage}),
   setdownloadingPercentage:(downloadPercentage)=>set({downloadPercentage}),
   setSelectedChatType:(selectedChatType)=>set({selectedChatType}),
   setSelectedChatData: (selectedChatData) => set({selectedChatData}),
   setSelectedChatMessages:(selectedChatMessages)=>set({selectedChatMessages}),
   setDirectMessagesContacts:(directMessagesContacts)=>set({directMessagesContacts}),
   closeChat:()=>set({selectedChatData:undefined,selectedChatType:undefined,selectedChatMessages:[]
   }),
   addChannel:(channel)=>{
     const channels = get().channel;
     set({channels : [channel,...channels]})
   },
   addMessage:(message)=>{
      const selectedChatMessages = get().selectedChatMessages;
      const selectedChatType = get().selectedChatType

      set({
         selectedChatMessages:[...selectedChatMessages,{
            ...message,
            recipient:
            selectedChatType === "channel" ? message.recipient : message.recipient._id,
            sender: 
            selectedChatType === "channel" ? message.sender : message.sender._id
         }]
      })
   },
   addChannelInChannelList:(message)=>{
      const channels = get().channels;
      const data = channels.find(channel => channel._id === message.channelId);
      const index = channels.findIndex(
         (channel)=>channel._id === message.channelId
      )
      console.log(channels , data , index);
      if(index !== -1 && index !== undefined){
         channels.splice(index,1);
         channels.unshift(data);
      }
   },
   addContactInDmContacts:(message)=>{
         const userId = get().userInfo.id;
         const fromId = userId === message.sender._id ?
         message.recipient._id : message.sender._id
         const fromData = message.sender._id === userId ? message.recipient : message.sender;
         const dmContacts = get().directMessagesContacts;
         const data = dmContacts.find((contact)=>contact._id === fromId);
         const index = dmContacts.findIndex((contact)=>contact._id === fromId);

         if(index !== -1 && index !== undefined){
            dmContacts.splice(index,1);
            dmContacts.unshift(data);
         }else{
            console.log("in else condition")
            dmContacts.unshift(fromData)
         }
   }
})