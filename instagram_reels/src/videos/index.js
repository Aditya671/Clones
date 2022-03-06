import React, { Fragment, useEffect, useRef, useState } from 'react';
import VideoFooter from './../footer/index';
import Videoheader from './../header/index';
import db from './../firebase';
import { collection, getDocs, onSnapshot,doc  } from "firebase/firestore"; 


const VideoApp = () => {
   const [reels,setReels] = useState([]);
   const [isVideoPlaying,setIsVideoPlaying] = useState(false);
   const videoRef = useRef(null);
   const onVideoPress = () => {
      if(isVideoPlaying){
         // setIsVideoPlaying(false)
         videoRef.current.pause();
         setIsVideoPlaying(false)
      }
      else
      {
         videoRef.current.play();
         setIsVideoPlaying(true)
      }
   }


   useEffect( () => {
      onSnapshot(collection(db, "reels",), (collection) => {
         setReels(
            collection.docs.map(function(v){
               return v.data()
            })
         )
      })
     //   onSnapshot(collection(db, "reels",), (collection) => {
     //     console.log("Current data: ", collection.docChanges().forEach(change => {
     //       if (change.type === "added") {
     //         console.log("recent data: ", change.doc.data());
     //       }
     //       if (change.type === "modified") {
     //           console.log("Modified data: ", change.doc.data());
     //            setReels([change.doc.data()])
     //       }
     //       if (change.type === "removed") {
     //           console.log("Removed data: ", change.doc.data());
     //       }
     //     }));
     //  });
   },[])
   return(
      <div className='app__videos'>
      
      {/* <div className='videoCard'>    */}
         
         {reels.map(value => {
            return (
            <Fragment key={value.id} >
               <div className='videoCard'>
                  <Videoheader/>
                  <video ref={videoRef} onClick={onVideoPress}
                     src={value.url} alt='my Video' loop className='video__player'
                  />
               <VideoFooter
                  channel={value.channel} 
                  avatarSrc={value.avatarSrc} 
                  song={value.song} 
                  likes={value.likes} shares={value.shares}
               />
               </div>
            </Fragment>
            )      
         })}
         {/* </div> */}
      </div>
   )
}
export default VideoApp;