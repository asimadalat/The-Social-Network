import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { status, json } from '../utilities/requestHandlers';

const formLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 3} },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const titleValidate = [
  {required: true, message: 'Title is required.' }
];

const bodyValidate = [
  { required: true, message: 'Body is required.' }
];

function PostEdit() {
    let {postID} = useParams();
    const [posts, setPosts]= useState(null);

    // Get post to edit from API
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/api/v1/posts/${postID}`, {  
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }        
        })
        .then(status)
        .then(json)
        .then(data => {
            console.log(data);
            setPosts(data);
        })
        .catch(err => 
            console.log("Error fetching post", err), []);
      }, [postID]);


    // Use inputs of form as JSON request to update post in API database
    function OnUpdate(arg1) {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/api/v1/posts/${postID}`, {
            method: "PUT",
            body: JSON.stringify(arg1),
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        })
        .then(status)
        .then(data => {
            console.log(data);
            alert("Post updated");
        })
        .catch(err => {
            console.error(err);
            alert(`Error: ${err}`);
        });
    }

    if (!posts) {
        return (<div> Loading editor...</div>)
    }
    const { TextArea } = Input;
    return (
        <>
        <h1 style={{textAlign:'left', padding:30, paddingLeft:160}}>Edit Post</h1>
        <Form {...formLayout} 
            name="postEdit" 
            onFinish={OnUpdate} 
            initialValues={{ title: posts.title, bodyText: posts.bodyText, imageURL: posts.imageURL }}>
            <Form.Item name="title" label="Title" rules={titleValidate}>
                <Input />
            </Form.Item>

            <Form.Item name="bodyText" label="Body" rules={bodyValidate}>
                <TextArea style={{height:100}}/>
            </Form.Item>

            <Form.Item name="imageURL" label="Image URL">
                <Input />
            </Form.Item>

            <Form.Item>
                <Button style={{marginLeft: '116%', marginTop: '3%', backgroundColor: '#0FE87C'}} type="primary" htmlType="submit">
                    Edit
                </Button>
            </Form.Item>
        </Form>
        </>
    );
}

  
export default PostEdit;  
