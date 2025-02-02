import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { FaPlus } from "react-icons/fa";
import HOST from "@/utils/constants";
import { getColor } from "@/lib/utils";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { useAppStore } from "@/store";

function Index() {
  const [newChannelModel, setNewChannelModel] = useState(false);
  const { setSelectedChatData, setSelectedChatType, addChannel } = useAppStore();
  const [allcontacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [ChannelName, setChannelName] = useState("");

  const searchContact = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const result = await axios.post(
          `${HOST}/api/contacts/search`,
          { searchTerm },
          { withCredentials: true }
        );

        if (result.status === 200) {
          const filteredContacts = result.data.contact.filter(
            (contact) =>
              !selectedContacts.some((selected) => selected._id === contact._id)
          );
          setAllContacts(filteredContacts);
        }
      } else {
        setAllContacts([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const addChannelMembers = (contact) => {
    if (!selectedContacts.includes(contact)) {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  useEffect(() => {
    if (newChannelModel == false) {
      setChannelName("");
      setSelectedContacts([]);
    }
  }, [newChannelModel]);

  const createChannel = async () => {
    try {
        if(ChannelName.length >0 && selectedContacts.length > 0){
            console.log(selectedContacts.map((contact)=>contact))
        const response = await axios.post(`${HOST}/api/channel/create-Channel`,
          {  name:ChannelName,
             members:selectedContacts.map((contact)=>contact._id)
          }
            ,{withCredentials:true},)
        if(response.status === 201){
            setChannelName("");
            setSelectedContacts([]);
            setNewChannelModel(false);
            addChannel(response.data.channel)
            
        }
        }
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div>
      <FaPlus
        className="cursor-pointer text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 transition-all duration-300"
        data-tooltip-id="tooltip-add"
        onClick={() => setNewChannelModel(true)}
      />
      <Tooltip id="tooltip-add" content="Select New Contact" />

      {newChannelModel == true ? (
        <div
          className="fixed inset-0 transition-all duration-400 bg-black bg-opacity-80 backdrop-blur-sm z-40"
          onClick={() => setNewChannelModel(false)}
        />
      ) : null}

      <dialog
        open={newChannelModel}
        className="rounded-2xl absolute top-[50px] bg-black z-50 sm:ml-[12vw] md:ml-[25vw] lg:ml-[30vw] xl:ml-[35vw] "
      >
        <div className="bg-[#242530] absolute border-none rounded-2xl text-white w-[400px] h-[600px] flex-col flex items-center">
          <span>
            <p className="tracking-widest text-white pl-5 font-semibold text-opacity-90 text-lg mt-2">
              Fill up details for new Channel...
            </p>
          </span>

          {selectedContacts.length > 0 && (
            <div className="rounded-lg p-3 border-none w-[50vw] md:w-[50vw] lg:w-[30vw] xl:w-[20vw] mt-2 overflow-hidden">
              {selectedContacts.map((contacts) => (
                <span
                  key={contacts._id}
                  className="bg-[#2c2e3b] p-2 px-4 rounded-3xl mb-2"
                >
                  {contacts.firstName}
                  <button
                    className="rounded-xl ml-2 bg-black"
                    onClick={() =>
                      setSelectedContacts(
                        selectedContacts.filter(
                          (contact) => contact._id !== contacts._id
                        )
                      )
                    }
                  >
                    <RxCross2 className="text-md p-[1px]" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div>
            <input
              placeholder="Channel Name"
              className="rounded-lg p-3 bg-[#2c2e3b] border-none w-[50vw] md:w-[50vw] lg:w-[30vw] xl:w-[20vw] mt-2 overflow-hidden"
              value={ChannelName}
              onChange={(e) => {
                setChannelName(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              placeholder="Add Channel Members"
              className="rounded-lg p-3 bg-[#2c2e3b] border-none w-[50vw] md:w-[50vw] lg:w-[30vw] xl:w-[20vw] mt-2 overflow-hidden"
              onChange={(e) => searchContact(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full ml-10 md:ml-15 lg:ml-20 overflow-y-scroll my-2">
            {allcontacts.map((contacts) => (
              <div
                key={contacts._id}
                className="my-5 flex gap-3 items-center cursor-pointer"
                onClick={() => addChannelMembers(contacts)}
              >
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
                    {contacts.firstName && contacts.lastName
                      ? `${contacts.firstName} ${contacts.lastName}`
                      : ""}
                  </span>
                  <span className="text-xs text-gray-500">
                    {contacts.email}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-[50vw] md:w-[50vw] lg:w-[30vw] xl:w-[20vw] bg-purple-700 hover:bg-purple-900 transition-all duration-300 p-3 rounded-lg" onClick={()=>createChannel()}>
            Create Channel
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default Index;
