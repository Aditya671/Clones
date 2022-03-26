import React, { Fragment, useEffect, useState} from 'react';
import "./chat.css";
import { Avatar, IconButton } from '@mui/material';
import { AttachFileOutlined, SearchOutlined, MoreVertOutlined, InsertEmoticon, MicOutlined, SendSharp } from '@mui/icons-material';
import {useParams} from "react-router-dom";
import { firestoreDb } from './firebase';
import { onSnapshot, collection, doc, query, serverTimestamp, addDoc,setDoc, orderBy } from 'firebase/firestore';
import { useStateValue } from './contextStateProvider';
import SpeechRecognition, {
   useSpeechRecognition
 } from "react-speech-recognition";
const Chat = (props) => {
   const [roomName,setRoomName] = useState('');
   const [roomFace,setRoomFace] = useState(null);
   const [sendM,setSendM] = useState(null);
   const {roomId} = useParams();
   const [{user}] = useStateValue();
   const [sender,setSender] = useState("");
   const [messages,setMessages] = useState("");
   const [speechActive,setSpeechActive] = useState(true);
   const { transcript, resetTranscript } = useSpeechRecognition();
   
   useEffect(() => {
      if(roomId){
         onSnapshot(doc(firestoreDb, "whatsapp",roomId), (d) => {
            setRoomName(d.data().name);
         });
         const qq = query(collection(firestoreDb, `whatsapp/${roomId}/messages`), orderBy("timestamp", "asc"));
         onSnapshot(qq, (d) => {
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
         setSender(name[0].charAt(0).toUpperCase() + name[0].slice(1,name[0].length))
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
   const sendMessage = (e) => {
      e.preventDefault();
      if(sendM !== ""){
         setDoc(doc(collection(firestoreDb, `whatsapp/${roomId}/messages`)), {
            userName: sender,
            message:sendM,
            userImage:user.photoURL,
            timestamp: serverTimestamp(),
         });
         setSendM("")
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
            messages.map((mess,index) => {
            return (<Fragment key={index}>
               <p className={`chat__message ${mess.userName === sender ? 'chat__sender' : 'chat__receiver'}`}>
                  {mess.message}
                  <span className='chat__name'>{mess.userName} </span>
                  <span className='chat__timestamp'>{new Date(mess.timestamp?.toDate()).toLocaleTimeString()}</span>
               </p>
            </Fragment> )        
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
               onChange={(e) => setSendM(e.target.value)}
               />
               <IconButton  onClick={sendMessage} >
                  <SendSharp/>
               </IconButton>
            </form>  
            <IconButton onClick={MicSpeechToText}>
                  <MicOutlined/>
               </IconButton>
         </div>
      </div>
   );
}
 
export default Chat;