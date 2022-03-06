import { ArrowBackIos, CameraAltOutlined } from '@mui/icons-material';
import React from 'react';
import './header.css';

const Videoheader = () => {
   return (
      <div className='videoHeader'>
         <ArrowBackIos/>
         <h3>Reels</h3>
         <CameraAltOutlined/>
      </div>
   )
}
export default Videoheader;