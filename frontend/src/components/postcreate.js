import React from 'react';
import { Form, Input, Button } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { jwtDecode } from 'jwt-decode';

const formLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8} },
  wrapperCol: { xs: { span: 24 }, sm: { span: 9 } }
};

const titleValidate = [
  {required: true, message: 'Post title is required.' }
];

const bodyValidate = [
  { required: true, message: 'Post body is required.' }
];

class PostCreate extends React.Component {

  constructor(props) { 
    super(props);
    this.onFinish = this.onFinish.bind(this);
  }

  // Use inputs of form as JSON request to create post in API database
  onFinish(arg1) {
    const token = localStorage.getItem('token');
    arg1.userID = jwtDecode(token).UserMetaData.id;
    console.log(JSON.stringify(arg1));
    fetch('http://localhost:3000/api/v1/posts', {  
        method: "POST",
        body: JSON.stringify(arg1),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }        
    })
    .then(status)
    .then(json)
    .then(data => {
        console.log(data);
        alert("Post added")
    })
    .catch(err => {
	      console.error(err);
        alert("Error:", err);
    });  

  }

  render() {
    const { TextArea } = Input;
    return (
      <>
      <h1 style={{textAlign:'center', padding:30}}>Create New Post</h1>
      <Form {...formLayout} name="post" onFinish={this.onFinish} scrollToFirstError>
        
        <Form.Item name="title" label="Title" rules={titleValidate}>
            <Input />
        </Form.Item>

        <Form.Item name="imageURL" label="Image URL">
            <Input />
        </Form.Item>

        <Form.Item name="bodyText" label="Body" rules={bodyValidate}>
            <TextArea style={{height:200}}/>
        </Form.Item>

        <Form.Item>
            <Button style={{marginLeft: '126%', marginTop: '3%', backgroundColor: '#0FE87C'}} type="primary" htmlType="Post">
                Create Post
            </Button>
        </Form.Item>
      </Form>
      </>
    );
  };
};
  
export default PostCreate;  


