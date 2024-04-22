import React from 'react';
import { Form, Input, Button } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { jwtDecode } from 'jwt-decode';

const commentValidate = [
    { required: true, message: 'Comment text is required.' }
  ];

class CommentCreate extends React.Component {

  constructor(props) { 
    super(props);
    this.state = {
      postID: this.props.postID, 
    };

    this.onCreate = this.onCreate.bind(this);
  }

  // Create a comment in API using form inputs converted to JSON request
  onCreate(arg1) {
    const token = localStorage.getItem('token');
    arg1.userID = jwtDecode(token).UserMetaData.id;
    console.log(arg1);
    fetch(`http://localhost:3000/api/v1/posts/${this.state.postID}/comments`, {  
      method: "POST",
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
      alert("Comment created")
    })
    .catch(err => {
      console.error(err);
      alert(`Error: ${err}`);
    });  

  }

  render() {
    const { TextArea } = Input;
    return (
      <>
      <Form style={{ paddingTop:20, paddingLeft:20 }} name="details" onFinish={this.onCreate} scrollToFirstError>
        
        <Form.Item name="allText" label="Leave a comment:" rules={commentValidate}>
            <TextArea style={{height:100}}/>
        </Form.Item>

        <Form.Item name="imageURL" label="Image URL" style={{ paddingLeft:52, marginTop:-15 }}>
            <Input />
        </Form.Item>

        <Form.Item>
            <Button style={{marginLeft: '90%', marginTop: '0%', backgroundColor: '#0FE87C'}} type="primary" htmlType="submit">
                Comment
            </Button>
        </Form.Item>
      </Form>
      </>
    );
  };
};
  
export default CommentCreate;  
