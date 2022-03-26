import React, { Fragment, useEffect, useState} from 'react';
import "./chat.css";
import { Avatar, IconButton } from '@mui/material';
import { AttachFileOutlined, SearchOutlined, MoreVertOutlined, InsertEmoticon, MicOutlined, SendSharp } from '@mui/icons-material';
import {useParams} from "react-router-dom";
import { firestoreDb } from './firebase';
import { onSnapshot, collection, doc, query, getDocs, serverTimestamp, addDoc,setDoc } from 'firebase/firestore';
import { useStateValue } from './contextStateProvider';
import SpeechRecognition, {
   useSpeechRecognition
 } from "react-speech-recognition";
const Chat = (props) => {
   const [roomName,setRoomName] = useState('');
   const [roomFace,setRoomFace] = useState(null);
   const [value,setValue] = useState("");
   const {roomId} = useParams();
   const [{user}] = useStateValue();
   const [messages,setMessages] = useState("");
   const [speechActive,setSpeechActive] = useState(true);
   const { transcript, resetTranscript } = useSpeechRecognition();
   
   useEffect(() => {
      if(roomId){
         onSnapshot(doc(firestoreDb, "whatsapp",roomId), (d) => {
            setRoomName(d.data().name);
         });
         onSnapshot(collection(firestoreDb, `whatsapp/${roomId}/messages`), (d) => {
            setMessages(d.docs.map(v => ({
               ...v.data()
            })
            ))
         });
      }
   },[roomId]);
   // useEffect(() => {
      // async function ola(){
         // const q = query(collection(firestoreDb,"whatsapp"));
         // const querySnapshot = await getDocs(q);
         // const queryData = querySnapshot.docs.map((doc) => ({
         //    ...doc.data(),
         //    id:doc.id,
         // }))
         // }
         // ola()
   // },[])
   useEffect(() => {
      if(user){
         const name = user.displayName.split(" ")
         // setUserName(user.displayName);
         // setSender(name[0].charAt(0).toUpperCase() + name[0].slice(1,name[0].length))
         // setRoomFace(user.photoURL);
      }
      
   },[user]);

   const createChat = () => {
      const roomName = prompt("Please Enter Name for Chat");
      if(!roomName){
         addDoc(collection(firestoreDb,"whatsapp"), {
            name:roomName
         })
         
      }
   }
   const sendMessage = async (e) => {
      e.preventDefault();
      const q = query(collection(firestoreDb,"whatsapp"));
      const querySnapshot = await getDocs(q);
      
      if(value !== ""){
         const queryData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id:doc.id
         }))
         queryData.map(async (v,id) => {
            if(v.id === roomId){
               await setDoc(doc(firestoreDb, `whatsapp/${roomId}/messages`,doc.data()), {
                  userName: user.displayName,
                  message:value,
                  userImage:user.photoURL,
                  timestamp: serverTimestamp(),
               });
            }

         })

         resetTranscript();
      }
   }
   const MicSpeechToText = (e) => {
      e.preventDefault();
      
      setSpeechActive(!speechActive);
      if(speechActive === true){
         SpeechRecognition.startListening({ continuous: true });
      }else{
         SpeechRecognition.stopListening();
      }      
   }

   return ( 
      <div className='chat'>
         <div className='chat__header'>
            <Avatar src={!roomFace ? null : `${roomFace}`}/>
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
            {messages ? 
            messages.map((mess) => {
            <Fragment>
               <p className='chat__message chat__sender'>{mess.userName} 
                  <span className='chat__name'>{mess.message}</span>
                  <span className='chat__timestamp'>3:25pm</span>
               </p>
               <p className='chat__message chat__receiver'>
                  {mess.message} 
                  <span className='chat__name'>{mess.userName}</span>
                  <span className='chat__timestamp'>4:25pm</span>
               </p>
            </Fragment>         
            }) : 
               <Fragment>
                  <p className='chat__message chat__sender'>message
                     <span className='chat__name'>sender</span>
                     <span className='chat__timestamp'>3:25pm</span>
                  </p>
                  <p className='chat__message chat__receiver'>
                     message
                     <span className='chat__name'>Sender</span>
                     <span className='chat__timestamp'>4:25pm</span>
                  </p>
               </Fragment>
            }
         </div>
         <div className='chat__footer'>
            <IconButton>
               <InsertEmoticon/>
            </IconButton>
            <form className='chat__footerContainer'>
               <input type="text" placeholder="Type your message" name="ChatText"
               onChange={e => setValue(e.target.value)}
               />
               {/* <span>{value + transcript}</span> */}
               <IconButton onClick={sendMessage}>
                  <SendSharp/>
               </IconButton>
               <IconButton onClick={MicSpeechToText}>
                  <MicOutlined/>
               </IconButton>
            </form>  
            
         </div>
      </div>
   );
}
 
export default Chat;