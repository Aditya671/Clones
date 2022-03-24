import React , {Fragment, useEffect, useState} from 'react';
import "./app.css";
import Sidebar from './sidebar';
import Chat from './chat';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {auth,googleAuthProvider} from "./firebase.js";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { useStateValue } from './contextStateProvider';
import {ActionTypes} from './reducer';

function App() {
   const [users,setUsers] = useState(null);
   const [{user},dispatch] = useStateValue();
   useEffect(() => {
      if(user){
         setUsers(user.displayName)
      }
   },[user]);
   useEffect(() => {
      onAuthStateChanged(auth, (user) => {
         if (user) {
            dispatch({
               type:ActionTypes.SET_USER,
               user:user
            });
         }
         else { 
            //
         }
      });
   },[])
   const tryLogin = () => {
      if(!users){
         signInWithPopup(auth,googleAuthProvider)
         .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            dispatch({
               type:ActionTypes.SET_USER,
               user:result.user
            })
          }).catch((error) => {
            const errorMessage = error.message;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorMessage,credential);
         });
      }
      else{
         alert("Already Logged In",users);
      }
   }

   return (
      <div className="app">
         <div className="app__body">
            {!users ? (
               <Fragment>
                  <div className='app__LoginCard'>
                     <div className='app_loginBody'>
                        <h1>Sign In with Google</h1>
                        <button type="submit" onClick={tryLogin}>Sign In</button>
                     </div>
                  </div>
               </Fragment>
            ): (
               <Fragment>
                  <Router>
                     <Sidebar/>
                     <Routes>
                        <Route path='/' element={<Chat/>}/>
                        <Route path='/rooms/:roomId' element={<Chat/>}/>
                     </Routes>
                  </Router>
               </Fragment>
            )}
         </div>
      </div>
   );
}

export default App;
