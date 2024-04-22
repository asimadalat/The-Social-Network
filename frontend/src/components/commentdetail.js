import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Form, Input } from 'antd';
import PostIcon from './posticon';
import { useParams } from 'react-router-dom';
import { status, json } from '../utilities/requestHandlers';
import ReplyCreate from './replycreate';
import ReplyFeed from './replyfeed';
import blank from '../resources/images/blank.png';
import { jwtDecode } from 'jwt-decode';

function CommentDetail() {

  let { postID, commentID } = useParams();
  const [comments, setComments]= useState(null);

  // Delete comment from API using its associated post id, postID and its own id, commentID
  function OnDelete() {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/v1/posts/${postID}/comments/${commentID}`, {  
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }        
    })
    .then(status)
    .then(data => {
      console.log(data);
      alert("Comment deleted");
    })
    .catch(err => {
      console.error(err);
      alert(`Error: ${err}`);
    });  
  }

  // Update a comment in API using form inputs converted to JSON request
  function OnUpdate(arg1) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/v1/posts/${postID}/comments/${commentID}`, {  
      method: "PUT",
      body: JSON.stringify(arg1),
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
      }        
    })
    .then(status)
    .then(json)
    .then(data => {
      console.log(data);
      alert("Comment updated")
    })
    .catch(err => {
      console.error(err);
      alert(`Error: ${err}`);
    });  
  }

  // Fetch the comment to display from API by its id, commentID and associated post id, postID
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/posts/${postID}/comments/${commentID}`)
    .then(status)
    .then(json)
    .then(data => {
      setComments(data[0]);
    })
    .catch(err => console.log("Error fetching comment", err));

  }, [postID, commentID]);

  console.log("Comment retrieved:", comments);

  if (!comments)
  {
    return (<div>"Loading comment...</div>);
  }
  if (!comments.imageURL) {
    comments.imageURL = blank;
  }

  let currentUserId = 0;
  let userRole = 'None';
  const token = localStorage.getItem('token');
  if (token !== null) {
    currentUserId = jwtDecode(token).UserMetaData.id;
    userRole = jwtDecode(token).UserMetaData.role
  }

  if (currentUserId !== 0) {
    if (currentUserId === comments.userID || userRole === 'admin') {
      const { TextArea } = Input;
      return (
        <>
        <Row style={{paddingTop:20}}>
          <Col span={18} style={ {paddingLeft:20, paddingRight:20} }>
            <div style={ {borderRadius: 25} }>
              <Card style={{ overflow: 'hidden', borderRadius: 25 }} 
                actions={[
                  <PostIcon type="like" count='3' selected='3'/>,
                  <PostIcon type="message" count='3'/>
                ]}>
                <div style={{ display: 'flex' }}>
                  <img src={comments.imageURL} alt="example" style={{ width: 70, height: 70, marginRight: 20}} />
                  <Card.Meta
                      title={<h4>{comments.ID}</h4>} 
                      description={<Form
                        name="editComment" 
                        onFinish={OnUpdate} 
                        initialValues={{allText: comments.allText, imageURL: comments.imageURL}}> 
                        <Form.Item name="imageURL" label="Image URL">
                          <Input style={{ marginBottom:-15 }}/> 
                        </Form.Item> 
                        <Form.Item name="allText" >
                          <TextArea style={{ height:40, marginBottom:-15 }}/> 
                        </Form.Item> 
                        <div style={{ display:'flex' }} >
                        <Form.Item>
                          <Button style={{ marginLeft:600 }} htmlType="submit">Edit</Button>
                        </Form.Item>
                        <Button ghost={true} onClick={OnDelete} style={{ marginLeft:5, backgroundColor:'#821517' }}>Delete</Button>
                        </div></Form>} />
                </div>
                <img src={comments.imageURL} alt="example" style={{paddingLeft: 90, paddingTop: 15}} />
              </Card> 
            </div>
            <ReplyCreate postID={postID} commentID={commentID}/>
            <ReplyFeed />
          </Col>
          <Col span={6} style={ {paddingRight:20} }>
            <Card style={{ borderRadius: 25} } >
              <Card.Meta
                  title={<div style={{fontSize:'Large', whiteSpace: 'normal'}}>Space name </div>}
                  description={<div style={{fontSize: 'Small'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi proin sed libero enim sed faucibus turpis in eu. Facilisis sed odio morbi quis. Convallis tellus id interdum velit laoreet id donec. Vel eros donec ac odio tempor orci dapibus. Netus et malesuada fames ac turpis egestas integer. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Vel turpis nunc eget lorem. Urna et pharetra pharetra massa massa ultricies mi quis. Urna nec tincidunt praesent semper feugiat nibh. Fusce id velit ut tortor. Quis blandit turpis cursus in hac. Velit egestas dui id ornare arcu odio ut sem. Est lorem ipsum dolor sit. Proin nibh nisl condimentum id venenatis a condimentum vitae sapien. Eros donec ac odio tempor orci dapibus.
    
                  rmelis bibendum ut tristique et egestas quis. Id faucibus nisl tincidunt eget nullam non nisi est. Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Tortor consequat id porta nibh venenatis cras sed felis eget. Urna neque viverra justo nec ultrices. Est lorem ipsum dolor sit amet consectetur adipiscing. Netus et malesuada fames ac turpis egestas maecenas pharetra convallis. Nunc sed velit dignissim sodales ut. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae.
                  
                  </div>} />
            </Card>
          </Col>
        </Row>
        </>
      );
    } else {
      return (
        <>
        <Row style={{paddingTop:20}}>
          <Col span={18} style={ {paddingLeft:20, paddingRight:20} }>
            <div style={ {borderRadius: 25} }>
              <Card style={{ overflow: 'hidden', borderRadius: 25 }} 
                actions={[
                  <PostIcon type="like" count='3' selected='3'/>,
                  <PostIcon type="message" count='3'/>
                ]}>
                <div style={{ display: 'flex' }}>
                  <img src={comments.imageURL} alt="example" style={{ width: 70, height: 70, marginRight: 20}} />
                  <Card.Meta
                      title={<h4>{comments.ID}</h4>} 
                      description={<div style={{color:'black', fontSize: 'Large'}}>{comments.allText}</div>} />
                </div>
                <img src={comments.imageURL} alt="example" style={{paddingLeft: 90, paddingTop: 15}} />
              </Card>
            </div>
            <ReplyCreate postID={postID} commentID={commentID}/>
            <ReplyFeed />
          </Col>
          <Col span={6} style={ {paddingRight:20} }>
            <Card style={{ borderRadius: 25} } >
              <Card.Meta
                  title={<div style={{fontSize:'Large', whiteSpace: 'normal'}}>Space name </div>}
                  description={<div style={{fontSize: 'Small'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi proin sed libero enim sed faucibus turpis in eu. Facilisis sed odio morbi quis. Convallis tellus id interdum velit laoreet id donec. Vel eros donec ac odio tempor orci dapibus. Netus et malesuada fames ac turpis egestas integer. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Vel turpis nunc eget lorem. Urna et pharetra pharetra massa massa ultricies mi quis. Urna nec tincidunt praesent semper feugiat nibh. Fusce id velit ut tortor. Quis blandit turpis cursus in hac. Velit egestas dui id ornare arcu odio ut sem. Est lorem ipsum dolor sit. Proin nibh nisl condimentum id venenatis a condimentum vitae sapien. Eros donec ac odio tempor orci dapibus.
    
                  rmelis bibendum ut tristique et egestas quis. Id faucibus nisl tincidunt eget nullam non nisi est. Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Tortor consequat id porta nibh venenatis cras sed felis eget. Urna neque viverra justo nec ultrices. Est lorem ipsum dolor sit amet consectetur adipiscing. Netus et malesuada fames ac turpis egestas maecenas pharetra convallis. Nunc sed velit dignissim sodales ut. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae.
                  
                  </div>} />
            </Card>
          </Col>
        </Row>
        </>
        );
    }
  } else {
    return (
      <>
      <Row style={{paddingTop:20}}>
        <Col span={18} style={ {paddingLeft:20, paddingRight:20} }>
          <div style={ {borderRadius: 25} }>
            <Card style={{ overflow: 'hidden', borderRadius: 25 }} >
              <div style={{ display: 'flex' }}>
                <img src={comments.imageURL} alt="example" style={{ width: 70, height: 70, marginRight: 20}} />
                <Card.Meta
                    title={<h4>{comments.ID}</h4>} 
                    description={<div style={{color:'black', fontSize: 'Large'}}>{comments.allText}</div>} />
              </div>
              <img src={comments.imageURL} alt="example" style={{paddingLeft: 90, paddingTop: 15}} />
            </Card>
          </div>
          <ReplyFeed />
        </Col>
        <Col span={6} style={ {paddingRight:20} }>
          <Card style={{ borderRadius: 25} } >
            <Card.Meta
                title={<div style={{fontSize:'Large', whiteSpace: 'normal'}}>Space name </div>}
                description={<div style={{fontSize: 'Small'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi proin sed libero enim sed faucibus turpis in eu. Facilisis sed odio morbi quis. Convallis tellus id interdum velit laoreet id donec. Vel eros donec ac odio tempor orci dapibus. Netus et malesuada fames ac turpis egestas integer. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Vel turpis nunc eget lorem. Urna et pharetra pharetra massa massa ultricies mi quis. Urna nec tincidunt praesent semper feugiat nibh. Fusce id velit ut tortor. Quis blandit turpis cursus in hac. Velit egestas dui id ornare arcu odio ut sem. Est lorem ipsum dolor sit. Proin nibh nisl condimentum id venenatis a condimentum vitae sapien. Eros donec ac odio tempor orci dapibus.
  
                rmelis bibendum ut tristique et egestas quis. Id faucibus nisl tincidunt eget nullam non nisi est. Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Tortor consequat id porta nibh venenatis cras sed felis eget. Urna neque viverra justo nec ultrices. Est lorem ipsum dolor sit amet consectetur adipiscing. Netus et malesuada fames ac turpis egestas maecenas pharetra convallis. Nunc sed velit dignissim sodales ut. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae.
                
                </div>} />
          </Card>
        </Col>
      </Row>
      </>
      );
  }
}

export default CommentDetail;