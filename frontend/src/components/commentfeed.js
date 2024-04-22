import React, { useEffect, useState }  from 'react';
import { Col, Row } from 'antd';
import CommentPreview from './commentpreview';
import { useParams } from 'react-router-dom';
import { status, json } from '../utilities/requestHandlers';


function CommentFeed() {

  let { postID } = useParams();
  const [comments, setComments]= useState(null);

  // Fetch all comments on a given post by its id, postID
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/posts/${postID}/comments`)
    .then(status)
    .then(json)
    .then(data => {
      setComments(data);
      console.log("data = ", data);
    })
    .catch(err => 
      console.log("Error fetching comments", err));

  }, [postID]);

  let commentText;
  
  if (!comments) {
    return <h3 style={{padding:25}}>No comments</h3>
  } else if (comments.length === 1) {
    commentText = "comment";
  } else {
    commentText = "comments";
  }
  console.log("Comments retrieved:", comments);

  const cardList = comments.map(comment => {
    console.log(comment);
    return (
      <>
      <Col span={24}>
        <div style={{padding:"10px"}} key={comment.ID}>
            <CommentPreview {...comment} isPostDetail={true}/>  
        </div>
      </Col>
      </>
    )
  });
  return (
    <>
    <h3 style={{padding:25}}>{comments.length} {commentText}</h3>
    <Row type="flex" justify="space-around">
      {cardList}
    </Row>
    </>
  );
 

}


export default CommentFeed;
