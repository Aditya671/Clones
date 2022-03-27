import React, { Fragment, useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { collection, doc, onSnapshot, query, setDoc, orderBy } from "firebase/firestore"; 
import {firestoreDb} from './firebase.js'
import { Link } from 'react-router-dom';

const SidebarChat = ({addNewChat,id,stuff,name}) => {
   const [face,setFace] = useState('');
   const [lastMessage,setLastMessage] = useState("Last Message was seen on ...");
   useEffect(() => {
      setFace('');
      if(id){
         const qq = query(collection(firestoreDb, `whatsapp/${id}/messages`), orderBy("timestamp", "desc"));
         onSnapshot(qq, (d) => {
            setLastMessage(d.docs.map(v => ({
               ...v.data()
            })
            ))
         });
      }
   },[id])
   const createChat = async () => {
      const roomName = prompt("Please Enter Name for Chat");
      
      if(roomName){
         await setDoc(doc(collection(firestoreDb, "whatsapp")), {
            name: roomName.toString()
         });
      }
      else{
         alert("Please Enter Proper Name")
      }
   }
   return ( !addNewChat ? (
      <Fragment>
         <Link to={`/rooms/${id}`}>
         <div className='sidebarChat'>
            <Avatar src={face} />
            <div className='sidebarChat__info'>
               <h2>{!name ? `Room Name` : name}</h2>
               <p>{lastMessage ? lastMessage[0]?.message : lastMessage}</p>
            </div>
         </div>
         </Link>
      </Fragment> 
      ) : (
      <Fragment>
         <div onClick={createChat} className="sidebarChat">
            <h2>Add New Chat</h2>
         </div>
      </Fragment>   
      )
   );
}
 
export default SidebarChat;