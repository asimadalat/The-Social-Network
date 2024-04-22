import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Input } from 'antd';
import PostIcon from './posticon';
import { status, json } from '../utilities/requestHandlers';
import { jwtDecode } from 'jwt-decode';

function ReplyPreview(props) {
  const [users, setUsers]= useState(null);
  const token = localStorage.getItem('token');

  // Delete reply from API database
  function OnDelete() {
    fetch(`http://localhost:3000/api/v1/posts/${props.pID}/comments/${props.cID}/replies/${props.ID}`, {  
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }        
    })
    .then(status)
    .then(data => {
      console.log(data);
      alert("Reply deleted");
    })
    .catch(err => {
      console.error(err);
      alert(`Error: ${err}`);
    });  
  }

  // Use inputs of form as JSON request to update reply in API database
  function OnUpdate(arg1) {
    fetch(`http://localhost:3000/api/v1/posts/${props.pID}/comments/${props.cID}/replies/${props.ID}`, {  
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
      alert("Reply updated")
    })
    .catch(err => {
      console.error(err);
      alert(`Error: ${err}`);
    });  
  }

  // Fetch user who posted reply from API
  useEffect(() => {
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

  }, [props.userID, token]);

  if (!users) {
    return (<div>Loading user information...</div>)
  }

  let currentUserId = 0;
  let userRole = 'None';
  if (token !== null) {
    currentUserId = jwtDecode(token).UserMetaData.id;
    userRole = jwtDecode(token).UserMetaData.role
  }

  if (currentUserId === props.userID || userRole === 'admin') {
    const { TextArea } = Input;
    return (
      <>
      <div style={ {borderRadius: 25} }>
          <Card style={{ overflow: 'hidden', borderRadius:25, marginBottom:20}} 
            actions={[
              <PostIcon type="like" count={props.likes} selected={props.liked}/>
            ]}>
  
            <div style={{ display: 'flex' }}>
              <img src={users.avatarURL} alt="example" style={{ width: 40, height: 40, marginRight: 20}} />
        
              <Card.Meta
                  title={<h4 style={{color: 'gray', fontSize:'Small'}}>{users.username}</h4>} 
                  description={<Form
                    name="editReply" 
                    onFinish={OnUpdate} 
                    initialValues={{allText: props.allText}}> 
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
          </Card>
      </div>
      </>
    )
  }
  return (
    <>
    <div style={ {borderRadius: 25} }>
        <Card style={{ overflow: 'hidden', borderRadius:25}} 
          actions={[
            <PostIcon type="like" count={props.likes} selected={props.liked}/>
          ]}>

          <div style={{ display: 'flex' }}>
            <img src={users.avatarURL} alt="example" style={{ width: 40, height: 40, marginRight: 20}} />
      
            <Card.Meta
                title={<div style={{color: 'gray', fontSize:'Small'}}>{users.username}</div>} 
                description={<div style={{
                fontSize: 'Small',
                lineHeight: '1.3em', color:'black'}}>{props.allText}</div>} />
          </div>
        </Card>
    </div>
    </>
  )
}


export default ReplyPreview;