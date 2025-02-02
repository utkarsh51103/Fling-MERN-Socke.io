import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";
import { animations } from "@/lib/utils";
import HOST from "@/utils/constants";
import { getColor } from "@/lib/utils";
import axios from "axios";
import { useAppStore } from "@/store";


function Index() {
    const [openNewContact, setOpenNewContact] = useState(false);
    const [searchedContact, setSearchedContact] = useState([]);
    const {setSelectedChatData,setSelectedChatType} = useAppStore();
    const [searchmsg,setsearchmsg] = useState("");

    const searchContact = async (searchTerm) => {
        try {
            if(searchTerm.length >0){
            const result = await axios.post(`${HOST}/api/contacts/search`,{searchTerm},{withCredentials:true});
            
            if(result.status === 200){
                setSearchedContact(result.data.contact);
                if(result.data.contact.length <= 0){
                    setsearchmsg("No Contact Found");
                }
            }
        }else{
            setSearchedContact([]);
        }
        } catch (error) {
            console.error(error);
            
        }
    };
    const selectNewContact = (contact) =>{
        setOpenNewContact(false);
        setsearchmsg("");
        setSearchedContact([])
        setSelectedChatData(contact);
        setSelectedChatType("contact");
    }

    return (
        <div>
            <FaPlus
                className="cursor-pointer text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 transition-all duration-300"
                data-tooltip-id="tooltip-add"
                onClick={() => setOpenNewContact(true)}
            />
            <Tooltip id="tooltip-add" content="Select New Contact" />

            {openNewContact == true ? (
                <div className="fixed inset-0 transition-all duration-400 bg-black backdrop-blur-sm bg-opacity-80 z-40" onClick={() => setOpenNewContact(false)
                }/>) : null
            }

            <dialog open={openNewContact} className="rounded-2xl bg-black z-50 sm:ml-[12vw] md:ml-[25vw] lg:ml-[30vw] xl:ml-[35vw]">
                <div className="bg-[#242530] absolute border-none rounded-2xl text-white w-[400px] h-[400px] flex flex-col items-center">
                    <h1 className='tracking-widest text-purple-500 pl-5 font-semibold text-opacity-90 text-lg my-5'>Contacts</h1>
                    <div>
                        <input 
                            placeholder="Search Here..."
                            className="rounded-lg p-3 bg-[#2c2e3b] border-none w-[50vw] md:w-[40vw] lg:w-[30vw] xl:w-[20vw] mt-2 overflow-hidden" 
                            onChange={e => {searchContact(e.target.value)
                            }} 
                        />
                    </div>
                    <div className="flex flex-col w-full ml-10 md:ml-15 lg:ml-20 overflow-y-scroll my-2">
                      {
                        searchedContact.map((contacts)=><div key={contacts._id} className="mt-5 flex gap-3 items-center cursor-pointer" onClick={()=>selectNewContact(contacts)}>
                        <div className="w-14 h-12 relative">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden">
                          {contacts.images ? (
                            <img
                              src={`${HOST}/${contacts.images}`}
                              alt="Profile"
                              className="object-cover w-full h-full bg-black"
                            />
                          ) : (
                            <div
                              className={`uppercase h-10 w-10 md:h-12 md:w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                                contacts.color
                              )}`}
                            >
                              {contacts.firstName
                                ? contacts.firstName.split("").shift()
                                : contacts.email.split("").shift()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col">
                      <span>
                      {
                        contacts.firstName && contacts.lastName ? `${contacts.firstName} ${contacts.lastName}` : ""
                    }</span>
                    <span className="text-xs text-gray-500">
                        {contacts.email}
                    </span>
                      </div>
                        </div>)
                      }
                    </div>
                    {
                        searchedContact.length <= 0 ? (
                            <div className='flex-1 md:flex flex-col justify-center items-center duration-1000 transition-all '>
                                <Lottie
                                    isClickToPauseDisabled={true}
                                    height={100}
                                    width={100}
                                    options={animations}
                                />
                                {
                                    searchmsg === "" ?
                                
                                <div className='text-opacity-80 flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center'>
                                    <h3 className='poppins-medium'>
                                        Hi<span className='text-purple-500'>!</span> Seach <span >new </span><span className='text-purple-500'>Contact</span>
                                    </h3>
                                </div> :
                                <div className='text-opacity-80 flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center'>
                                    <h3 className='poppins-medium'>
                                        Sorry<span className='text-purple-500'>!</span> No <span >Contact </span><span className='text-purple-500'>Found</span>
                                    </h3>
                                </div> 
                                }
                            </div>
                        ) : null
                    }
                </div>
            </dialog>
        </div>
    );
}

export default Index;
