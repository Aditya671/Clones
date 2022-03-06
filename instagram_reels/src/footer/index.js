import { MusicNote, FavoriteOutlined, ModeCommentOutlined,SendOutlined , MoreHorizOutlined } from '@mui/icons-material';
import { Avatar, Button } from '@mui/material';
import React, { Fragment } from 'react';
import Ticker from 'react-ticker';
import './footer.css';

const VideoFooter = (props) => {
   const {channel,avatarSrc,song,likes,shares} = props;
   return (
      <Fragment>
         <div className='videoFooter'>
            <div className='videoFooter__text'>
               <Avatar src={avatarSrc} />
               <h3>{channel}
               . <Button>Follow</Button>
               </h3>
            </div>
            <div className='videoFooter__ticker'>
               <MusicNote className='videoFooter__icon'/>

               <Ticker mode="smooth">
                  {({ index}) => (<h1>{song}</h1>)}
               </Ticker>
            </div>
            <div className='videoFooter__actions'>
               <div className='videoFooter__actionsLeft'>
                  <FavoriteOutlined fontSize="small"/>
                  <ModeCommentOutlined fontSize="small"/>
                  <SendOutlined fontSize="small"/>
                  <MoreHorizOutlined fontSize="small"/>
               </div>
               <div className='videoFooter__actionsRight'>
                  <div className='videoFooter__status'>
                     <FavoriteOutlined fontSize="small"/>
                     <p>{likes}</p>
                  </div>
                  <div className='videoFooter__status'>
                     <ModeCommentOutlined fontSize="small"/>
                     <p>{shares}</p>
                  </div>
               </div>
            </div>
         </div>
      </Fragment>
   )
}
export default VideoFooter;