import React, { Fragment, useEffect, useState } from 'react';
import { ChatOutlined, DonutLarge, MoreVertOutlined, SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import "./sidebar.css"; 
import SidebarChat from './sidebarChat';
import {firestoreDb} from './firebase.js';
import { collection, onSnapshot } from "firebase/firestore";
import { useStateValue } from './contextStateProvider';
import MenuBar from './menuBar';

const Sidebar = () => {
   const [userName,setUserName] = useState(null);
   const [face,setFace] = useState(null);
   const [rooms,setRooms] = useState([]);
   const [value,setValue] = useState('');
   const [showParent,setShowParent] = useState(false);
   const [showSeachParent,setShowSearchParent] = useState(false);
   const [showSideMenu,setShowSideMenu] = useState(false);
   const [{user}] = useStateValue();
   
   const onSearchSubmit = (e) => {
      e.preventDefault();
      if(value !== "")console.log(value);
      else alert("Please Enter something")
   }
   const openMainChatScreen = (e) => {
      e.preventDefault();
      setShowParent(!showParent)
   }
   const openMenu = (e) => {
      e.preventDefault();
      setShowSideMenu(!showSideMenu);
   }
   useEffect(() => {
      const unsubscribe = onSnapshot(collection(firestoreDb, "whatsapp"), (doc) => {
         setRooms(
         doc.docs.map(d => ({
            id:d.id,
            data:d.data()
         }))
         )
      });

      return () => unsubscribe();
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
      
            <IconButton onClick={() =>setShowSideMenu(!showSideMenu)}>
               <MoreVertOutlined/>
               {showSideMenu ? (<Fragment>
            <MenuBar></MenuBar>
         </Fragment>) : null}
            </IconButton>
         </div>
         
      </div>
      <div className='sidebar__search'>
         <div className='sidebar__searchContainer'>
            <IconButton onClick={onSearchSubmit}>
               <SearchOutlined/>
            </IconButton>
            <input placeholder='Search or Start New Chat' type="text" onChange={(e) => setValue(e.target.value)} />
         </div>
      </div>
      <div className='sidebar__chats'>
         {showParent === false ? (
            <div className='sidebarChat'>
               <div className='sidebarChat__info'>
                  <h2>Please click Chat Icon to View Chats</h2>
               </div>
            </div>
         ) : (
            <Fragment>
               <SidebarChat addNewChat/>
               {rooms.map(
                  room => <SidebarChat open={!showParent} key={room.id} id={room.id} stuff={room.data} name={room.data.name}/>
               )}
            </Fragment>
         )}
      </div>
      </div>
   );
}
 
export default Sidebar;