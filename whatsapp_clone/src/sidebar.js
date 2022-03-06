import React, { useEffect, useState } from 'react';
import { ChatOutlined, DonutLarge, MoreVertOutlined, SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import "./sidebar.css"; 
import SidebarChat from './sidebarChat';
import {firestoreDb} from './firebase.js';
import { collection, onSnapshot } from "firebase/firestore";
import { useStateValue } from './contextStateProvider';

const Sidebar = () => {
   const [userName,setUserName] = useState(null);
   const [face,setFace] = useState(null);
   const [rooms,setRooms] = useState([]);
   const [value,setValue] = useState('');
   const [showParent,setShowParent] = useState(false);
   const [showSeachParent,setShowSearchParent] = useState(false);
   const [{user}] = useStateValue();
   
   const onSearchSubmit = (e) => {
      e.preventDefault();
      setShowParent(!showParent);
      if(showParent){
         if(value !== ""){
            console.log(value)
         }
      }
   }
   const openMainChatScreen = (e) => {
      e.preventDefault();
      // if(!showParent){
         setShowParent(!showParent)
      // }
   }
   useEffect(() => {
      async function getRooms(){
         onSnapshot(collection(firestoreDb, "whatsapp"), (doc) => {
            setRooms(
            doc.docs.map(d => ({
               id:d.id,
               data:d.data()
            }))
            )
         });
      }
      console.log(rooms,"");
      getRooms();
   },[]);
   useEffect(() => {
      if(user){
         setUserName(user.displayName)
         setFace(user.photoURL);
      }
   },[user])
   return ( 
      <div className="sidebar">
      <div className='sidebar__header'>
         <Avatar src={!face ? null : `${face}`}/> {!userName ? "" : `${userName}`}
         <div className='sidebar__headerRight'>
            <IconButton>
               <DonutLarge/>
            </IconButton>
      
            <IconButton onClick={openMainChatScreen}>
               <ChatOutlined/>
            </IconButton>
      
            <IconButton>
               <MoreVertOutlined/>
            </IconButton>
         </div>
      </div>
      <div className='sidebar__search'>
         <div className='sidebar__searchContainer'>
            <IconButton onClick={onSearchSubmit}>
               <SearchOutlined open={showSeachParent}/>
            </IconButton>
            <input placeholder='Search or Start New Chat' type="text" onChange={(e) => setValue(e.target.value)} />
         </div>
      </div>
      <div className='sidebar__chats'>
         <SidebarChat addNewChat open={showParent}/>
         {rooms.map(
            room => <SidebarChat open={!showParent} key={room.id} id={room.id} stuff={room.data} name={room.data.name}/>
         )}
      </div>
      </div>
   );
}
 
export default Sidebar;