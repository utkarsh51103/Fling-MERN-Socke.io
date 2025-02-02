import React from 'react';
import Chatheader from './components/chat-header';
import Messagecontainer from './components/message-container';
import Messagebar from './components/message-bar';
function ChatContainer(props) {
    return (
        <div className='top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex-col md:static md:flex-1'>
            <Chatheader/>
            <Messagecontainer/>
            <Messagebar/>
        </div>
    );
}

export default ChatContainer;