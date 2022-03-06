import React, { useEffect, useState } from 'react';
import "./chat.css";
import { Avatar, IconButton } from '@mui/material';
import { AttachFileOutlined, SearchOutlined, MoreVertOutlined, InsertEmoticon, MicOutlined, SendSharp } from '@mui/icons-material';
import {useParams} from "react-router-dom";
import { firestoreDb } from './firebase';
import { onSnapshot, doc } from 'firebase/firestore';

const Chat = (props) => {
   const [face,setFace] = useState('');
   const [value,setValue] = useState("");
   const {roomId} = useParams();
   const [roomName,setRoomName] = useState('');
   
   useEffect(() => {
      setFace('');
      if(roomId){
         onSnapshot(doc(firestoreDb, "whatsapp",roomId), (d) => {
            setRoomName(
               d.data().name
            )
         });
      }
   },[roomId]);

   const createChat = () => {
      const roomName = prompt("Please Enter Name for Chat");
      if(!roomName){
         // do Something
      }
   }
   const sendMessage = (e) => {
      e.preventDefault();
      if(value !== ""){
         console.log("Message to be Send",value)
      }
   }
   return ( 
      <div className='chat'>
         <div className='chat__header'>
            <Avatar/>
            <div className='chat__headerInfo'>
               <h3>{!roomName ? "Room Name" : `${roomName}`}</h3>
               <p>Last seen at...</p>
            </div>
            <div className='chat__headerRight'>
               <IconButton>
                  <SearchOutlined/>
               </IconButton>
               <IconButton>
                  <AttachFileOutlined/>
               </IconButton>
               <IconButton>
                  <MoreVertOutlined/>
               </IconButton>
            </div>
         </div>
         <div className='chat__body'>
            <p className='chat__message chat__sender'>Hey Guys
               <span className='chat__name'>Aditya</span>
               <span className='chat__timestamp'>3:25pm</span>
            </p>
            <p className='chat__message chat__receiver'>
                  How is your day going and Are u all right. There's many things going on in this earth. 
               <span className='chat__name'>Shubham</span>
               <span className='chat__timestamp'>4:25pm</span>
            </p>
         </div>
         <div className='chat__footer'>
            <IconButton>
               <InsertEmoticon/>
            </IconButton>
            <form className='chat__footerContainer' onClick={sendMessage}>
               <input type="text" placeholder="Type your message" onChange={e => setValue(e.target.value)}/>
               <IconButton >
                  <SendSharp/>
               </IconButton>
            </form>  
            <IconButton>
               <MicOutlined/>
            </IconButton>
         </div>
      </div>
   );
}
 
export default Chat;