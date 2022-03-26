import React, { useEffect, useState } from 'react';
import "./chat.css";
import { Avatar, IconButton } from '@mui/material';
import { AttachFileOutlined, SearchOutlined, MoreVertOutlined, InsertEmoticon, MicOutlined, SendSharp } from '@mui/icons-material';
import {useParams} from "react-router-dom";
import { firestoreDb } from './firebase';
import { onSnapshot, collection, doc, query, getDocs, serverTimestamp, addDoc } from 'firebase/firestore';
import { useStateValue } from './contextStateProvider';
import SpeechRecognition, {
   useSpeechRecognition
 } from "react-speech-recognition";
const Chat = (props) => {
   const [roomFace,setRoomFace] = useState(null);
   const [value,setValue] = useState("");
   const {roomId} = useParams();
   const [{user}] = useStateValue();
   const [userName, setUserName] = useState('');
   const [roomName,setRoomName] = useState('');
   const [receiver,setReceiver] = useState(null);
   const [sender,setSender] = useState(null);
   const [speechActive,setSpeechActive] = useState(true);
   const { transcript, resetTranscript } = useSpeechRecognition();
   
   useEffect(() => {
      if(roomId){
         onSnapshot(doc(firestoreDb, "whatsapp",roomId), (d) => {
            setRoomName(d.data().name);
         });
         // async function getD(){
         //    const q = query(collection(firestoreDb,"whatsapp"));
         //    const querySnapshot = await getDocs(q);
         //    const queryData = querySnapshot.docs.map((doc) => {
         //      // doc.data() is never undefined for query doc snapshots
         //      console.log(doc.id, " => ", doc.data());
         //    });
         // }
         // getD();
      }
   },[roomId]);
   useEffect(() => {
      if(user){
         const name = user.displayName.split(" ")
         setUserName(user.displayName);
         setSender(name[0].charAt(0).toUpperCase() + name[0].slice(1,name[0].length))
         setRoomFace(user.photoURL);
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
      console.log(transcript,"Transcript");
      const q = query(collection(firestoreDb,"whatsapp"));
      const querySnapshot = await getDocs(q);
      
      if(value !== ""){
         console.log("Message to be Send",value);
         const queryData = querySnapshot.docs.map((doc) => {})
         queryData.map(async (v) => {
            console.log(v)
            await addDoc(doc(firestoreDb, `whatsapp/${roomId}/messages`), {
               userName: user.displayName,
               message:value,
               userImage:user.photoURL,
               timestamp: serverTimestamp(),
            });
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
            <p className='chat__message chat__sender'>Hey Guys
               <span className='chat__name'>{!receiver ? "Receiver" : `${receiver}`}</span>
               <span className='chat__timestamp'>3:25pm</span>
            </p>
            <p className='chat__message chat__receiver'>
                  How is your day going and Are u all right. There's many things going on in this earth. 
               <span className='chat__name'>{!sender ? "Sender" : `${sender}`}</span>
               <span className='chat__timestamp'>4:25pm</span>
            </p>
         </div>
         <div className='chat__footer'>
            <IconButton>
               <InsertEmoticon/>
            </IconButton>
            <form className='chat__footerContainer'>
               <input type="text" placeholder="Type your message" name="ChatText"
               onChange={e => {setValue(e.target.value); console.log(e)}}
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