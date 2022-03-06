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
   const [rooms,setRooms] = useState([]);
   const [value,setValue] = useState('');
   const [{user}] = useStateValue();
   const onSubmit = (e) => {
      e.preventDefault();
      if(value !== ""){
         console.log(value)
      }
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
      }
   },[user])
   return ( 
      <div className="sidebar">
      <div className='sidebar__header'>
         <Avatar/> {!userName ? "" : `${userName}`}
         <div className='sidebar__headerRight'>
            <IconButton>
               <DonutLarge/>
            </IconButton>
      
            <IconButton>
               <ChatOutlined/>
            </IconButton>
      
            <IconButton>
               <MoreVertOutlined/>
            </IconButton>
         </div>
      </div>
      <div className='sidebar__search'>
         <div className='sidebar__searchContainer'>
            <IconButton onClick={onSubmit}>
               <SearchOutlined />
            </IconButton>
            <input placeholder='Search or Start New Chat' type="text" onChange={(e) => setValue(e.target.value)} />
         </div>
      </div>
      <div className='sidebar__chats'>
         <SidebarChat addNewChat/>
         {rooms.map(
            room => <SidebarChat key={room.id} id={room.id} stuff={room.data} name={room.data.name}/>
         )}
      </div>
      </div>
   );
}
 
export default Sidebar;