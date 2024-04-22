import React, { useEffect, useState }  from 'react';
import { Col, Row } from 'antd';
import ReplyPreview from './replypreview';
import { useParams } from 'react-router-dom';
import { status, json } from '../utilities/requestHandlers';


function ReplyFeed( {cId} ) {

  let { postID } = useParams();
  let commentID = cId
  const [replies, setReplies]= useState(null);

  // Fetch all replies to a given comment from API
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/posts/${postID}/comments/${commentID}/replies`)
    .then(status)
    .then(json)
    .then(data => {
      setReplies(data.slice(0,3));
      console.log("data = ", data);
    })
    .catch(err => 
      console.log("Error fetching replies", err));

  }, [postID, commentID]);

  console.log("Replies retrieved:", replies);

  if (!replies) {
    return (
      <>
      <Col span={24}>
      </Col>
      </> 
    )
  } else {
    const cardList = replies.map(reply => {
        return (
          <>
          <Col span={2}>
          </Col>
          <Col span={22}>
            <div style={{paddingBottom:"0px", paddingTop:"7px"}} key={reply.ID}>
                <ReplyPreview {...reply} pID={postID} cID={commentID} />  
            </div>
          </Col>
          </>
        )
      });
      return (
        <Row type="flex" justify="space-around" style={{marginTop:-7}}>
          {cardList}
        </Row>
      );

  }
  
 

}


export default ReplyFeed;
