import React, { useEffect, useState }  from 'react';
import { Col, Row } from 'antd';
import ReplyPreview from './replypreview';
import { useParams } from 'react-router-dom';
import { status, json } from '../utilities/requestHandlers';


function ReplyFeed() {

  let { postID, commentID } = useParams();
  const [replies, setReplies]= useState(null);

  // Fetch all replies to a given comment from API
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/posts/${postID}/comments/${commentID}/replies`)
    .then(status)
    .then(json)
    .then(data => {
      setReplies(data);
      console.log("data = ", data);
    })
    .catch(err => 
      console.log("Error fetching replies", err));

  }, [postID, commentID]);

  console.log("Replies retrieved:", replies);

  let replyText;

  if (!replies) {
    return <h3 style={{padding:25}}>No replies</h3>
  } else if (replies.length === 1) {
    replyText = "replies";
  } else {
    replyText = "replies";
  } 

  const cardList = replies.map(reply => {
    return (
      <>
      <Col span={24}>
        <div style={{padding:"10px"}} key={reply.ID}>
            <ReplyPreview {...reply} pID={postID} cID={commentID} />  
        </div>
      </Col>
      </>
    )
  });
  return (
    <>
    <h3 style={{padding:25}}>{replies.length} {replyText}</h3>
    <Row type="flex" justify="space-around">
      {cardList}
    </Row>
    </>
  );

}
  
 




export default ReplyFeed;
