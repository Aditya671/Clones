import React, { useState } from 'react';
import "./menubar.css"
import { IconButton } from '@mui/material';
import { signOut } from "firebase/auth";
import { auth } from './firebase';
import { useStateValue } from './contextStateProvider';
import {ActionTypes} from './reducer';
const MenuBar = () => {
   const [{user},dispatch] = useStateValue();
   const [users,setUsers] = useState(null);
   const logout = () => {
      signOut(auth).then(() => {
         dispatch({
            type:ActionTypes.SET_USER,
            user:null
         });
         console.log("success")
      }).catch((error) => {
         console.log(error,user)
      });
   };
   const changeTheme = () => {
      return true;
   } 
   return ( 
      <div className='menuBar'>
         <div className='menuBar__link'>
            <IconButton onClick={logout}>
               <p>Logout</p>
            </IconButton>
         </div>
         <div className='menuBar__link'>
            <IconButton onClick={changeTheme}>
               <p>Switch Theme</p>
            </IconButton>
         </div>
         <div className='menuBar__link'></div>
      </div>
    );
}
 
export default MenuBar;