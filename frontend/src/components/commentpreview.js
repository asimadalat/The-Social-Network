import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Link, useParams } from "react-router-dom";
import PostIcon from './posticon';
import ReplyCreate from './replycreate';
import ReplyFeedPreview from './replyfeedpreview';
import { status, json } from '../utilities/requestHandlers';
import blank from '../resources/images/blank.png';

function CommentPreview(props) {

  let { postID } = useParams();
  const [users, setUsers]= useState(null);
  const path = `/post/${postID}/comment/${props.ID}`
  let image;
  if (props.imageURL !== null) {
    image = props.imageURL;
  } else {
    image = blank;
  }

  // Fetch user of comment to display
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/v1/users/${props.userID}`, {  
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      } 
    })
    .then(status)
    .then(json)
    .then(data => {
      setUsers(data);
    })
    .catch(err => 
      console.log("Error fetching users", err));

  }, [props.userID]);

  if (!users) {
    return (<div>Loading user information...</div>)
  }

  const token = localStorage.getItem('token');
  if (token) {
    return (
      <>
      <div style={ {borderRadius: 25} }>
      <Link to={{ pathname: path }}>
          <Card style={{ overflow: 'hidden', borderRadius:25}} 
            actions={[
              <PostIcon type="like" count={props.likes} selected={props.liked}/>,
              <PostIcon type="message" count={props.comments}/>
            ]}>

            <div style={{ display: 'flex' }}>
              <img src={users.avatarURL} alt="example" style={{ width: 50, height: 50, marginRight: 20}} />
        
              <Card.Meta
                  title={<div style={{color: 'gray', fontSize:'Small'}}>{users.username}</div>} 
                  description={<div style={{
                  fontSize: 'Small',
                  lineHeight: '1.3em', color:'black'}}>{props.allText}</div>} />
            </div>
              <img src={image} alt="example" style={{paddingLeft: 60, paddingTop: 15}} />
          </Card>
        </Link>
      </div>
      <ReplyCreate postID={postID} commentID={props.ID}/>
      <ReplyFeedPreview cId={props.ID}/>
      </>
    )
  } else {
    return (
      <>
      <div style={ {borderRadius: 25} }>
      <Link to={{ pathname: path, state: { comment: props} }}>
          <Card style={{ overflow: 'hidden', borderRadius:25}}>

            <div style={{ display: 'flex' }}>
              <img src={users.avatarURL} alt="example" style={{ width: 50, height: 50, marginRight: 20}} />
        
              <Card.Meta
                  title={<div style={{color: 'gray', fontSize:'Small'}}>{users.username}</div>} 
                  description={<div style={{
                  fontSize: 'Small',
                  lineHeight: '1.3em', color:'black'}}>{props.allText}</div>} />
            </div>
              <img src={image} alt="example" style={{paddingLeft: 60, paddingTop: 15}} />
          </Card>
        </Link>
      </div>
      <ReplyFeedPreview cId={props.ID}/>
      </>
    )
  }
}


export default CommentPreview;