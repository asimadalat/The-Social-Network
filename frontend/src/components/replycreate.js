import React from 'react';
import { Form, Input, Button } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { jwtDecode } from 'jwt-decode';

const replyValidate = [
    { required: true, message: 'Reply text is required.' }
  ];

class CommentCreate extends React.Component {

  constructor(props) { 
    super(props);
    this.state = {
      postID: this.props.postID, 
      commentID: this.props.commentID
    };

    this.onCreate = this.onCreate.bind(this);
  }

  // Use inputs in form as JSON request to API
  onCreate(arg1) {
    const token = localStorage.getItem('token');
    arg1.userID = jwtDecode(token).UserMetaData.id;
    console.log(arg1);
    fetch(`http://localhost:3000/api/v1/posts/${this.state.postID}/comments/${this.state.commentID}/replies`, {  
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
      alert("Reply created")
    })
    .catch(err => {
      console.error(err);
      alert(`Error: ${err}`);
    });  

  }

  render() {
    return (
      <>
      <Form style={{ paddingTop:10, paddingLeft:20}} name="details" onFinish={this.onCreate} scrollToFirstError>
        <div style={{ display: 'flex' }}>
        <Form.Item name="allText" label="Reply:" rules={replyValidate}>
            <Input style={{width:350}}/>
        </Form.Item>

        <Form.Item>
            <Button style={{marginLeft: '10%', marginTop: '0%', backgroundColor: '#0FE87C'}} type="primary" htmlType="submit">
                Reply
            </Button>
        </Form.Item>
        </div>
      </Form>
      </>
    );
  };
};
  
export default CommentCreate;  
