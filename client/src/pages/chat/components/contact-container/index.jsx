import React, { useEffect } from 'react';
import ProfileInfo from './components/profile-info';
import NewDm from './components/new-dm';
import Channel from './components/CreateChannel';
import ContactList from './components/contact-list';
import { useAppStore } from '@/store';
import axios from 'axios';
import HOST from '@/utils/constants';
function ContactContainer() {

  const {selectedChatType , setDirectMessagesContacts, directMessagesContacts, channels , setChannel} = useAppStore()

  useEffect(()=>{
    const getcontacts = async ( ) =>{
      const response = await axios.get(`${HOST}/api/contacts/get-contact-dm`,{withCredentials:true});
      if(response.data.contacts){
        setDirectMessagesContacts(response.data.contacts);
      }
    }
  
    const getChannels = async ( ) =>{
        const response = await axios.get(`${HOST}/api/channel/get-channels`,{withCredentials:true});
        if(response.data.channel){
          
          setChannel(response.data.channel);
        }
    }

    getcontacts();
    getChannels();
  },[setDirectMessagesContacts,setChannel])

  
    
    return (
        <div className={`relative md:w-[35vw] lg:w-[30vw] xl:w-[25vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-screen ${selectedChatType ? 'hidden md:block' : ""}`}>
            <div>
            <Logo/>
            </div>
            <div className='my-5'>
                 <div className='flex items-center justify-between pr-10'>
                 <Title text="Direct Messages"/>
                 <NewDm/>
                 </div>
                 <div className='max-h-[30vh] overflow-y-auto scrollbar-hidden'>
                 <ContactList contact={directMessagesContacts}/>
                 </div>
            </div>
            <div className='my-5'>
                 <div className='flex items-center justify-between pr-10'>
                 <Title text="Channels"/>
                 <Channel/>
                 </div>
                 <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
                 <ContactList contact={channels} isChannel={true}/>
                 </div>
            </div>
            <ProfileInfo/>
        </div>
        
    );
}

export default ContactContainer;


const Logo = () => {
    return (
      <div className="flex p-5  justify-start items-center gap-2">
        <svg
          id="logo-38"
          width="78"
          height="32"
          viewBox="0 0 78 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <path
            d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
            className="ccustom"
            fill="#8338ec"
          ></path>{" "}
          <path
            d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
            className="ccompli1"
            fill="#975aed"
          ></path>{" "}
          <path
            d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
            className="ccompli2"
            fill="#a16ee8"
          ></path>{" "}
        </svg>
        <span className="text-3xl font-semibold ">Fling</span>
      </div>
    );
  };

  const Title = ({text})=>{
        return(
          <h6 className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm'>
          {text}
          </h6>
        )
  }
   