import React from 'react';
import { Form, Input, Button } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { jwtDecode } from 'jwt-decode';

const formLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8} },
  wrapperCol: { xs: { span: 24 }, sm: { span: 9 } }
};

const usernameValidate = [
  {required: true, message: 'Username is required.' }
];

const passwordValidate = [
  { required: true, message: 'Password is required.' }
];

class Account extends React.Component {

  constructor(props) { 
    super(props);
    this.state = {
      user: null, 
    };

    this.onUpdate = this.onUpdate.bind(this);
  }

  // Get full record of user to pre fill fields
  componentDidMount() {
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).UserMetaData.id;
    fetch(`http://localhost:3000/api/v1/users/${userId}/full`, {  
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }        
    })
    .then(status)
    .then(json)
    .then(data => {
      this.setState({ user: data });
    })
    .catch(err => 
      console.log("Error fetching user", err), []);
  }


  // Update a user in API using form inputs converted to JSON request
  onUpdate(arg1) {
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).UserMetaData.id;
    fetch(`http://localhost:3000/api/v1/users/${userId}`, {  
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
      alert("User updated")
    })
    .catch(err => {
      console.error(err);
      alert(`Usernames and passwords must be greater than 6 characters`);
    });  
  }

  // Delete user from API database
  onDelete() {
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).UserMetaData.id;
    fetch(`http://localhost:3000/api/v1/users/${userId}`, {  
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }        
    })
    .then(status)
    .then(data => {
      console.log(data);
      alert("Account deleted. Please log out.");
    })
    .catch(err => {
      console.error(err);
      alert(`Error: ${err}`);
    });  
  }

  render() {
    if (!this.state.user) {
      return (
        <div> Loading account details...</div>
      )
    }

    const { TextArea } = Input;
    const token = localStorage.getItem('token');
    const userRole = jwtDecode(token).UserMetaData.role;
    if (userRole !== 'admin') {
      return (
        <>
        <h1 style={{textAlign:'center', padding:30}}>Account Details</h1>
        <Form {...formLayout} 
          name="details" 
          onFinish={this.onUpdate} 
          initialValues={{email: this.state.user.email, username: this.state.user.username, bio: this.state.user.bio, avatarURL: this.state.user.avatarURL}}>
          <Form.Item name="username" label="Username" rules={usernameValidate}>
              <Input />
          </Form.Item>
  
          <Form.Item name="password" label="Password" rules={passwordValidate} hasFeedback>
              <Input.Password />
          </Form.Item>
  
          <Form.Item name="email" label="Email">
              <Input />
          </Form.Item>
          
          <Form.Item name="bio" label="Bio">
              <TextArea style={{height:100}}/>
          </Form.Item>
  
          <Form.Item name="avatarURL" label="Avatar URL" >
              <Input />
          </Form.Item>
          
          <div style={{ display:'flex' }}>
          <Form.Item>
              <Button style={{marginLeft:890, marginTop: '3%', backgroundColor: '#0FE87C'}} type="primary" htmlType="submit">
                  Update
              </Button>
          </Form.Item>
          <Button ghost={true} onClick={this.onDelete} style={{ marginLeft:165, marginTop:5, backgroundColor:'#821517' }}>Delete</Button>
          </div>
        </Form>
        </>
      );
    } else {
      return (
        <>
        <h1 style={{textAlign:'center', padding:30}}>Account Details</h1>
        <Form {...formLayout} 
          name="details" 
          onFinish={this.onUpdate} 
          initialValues={{email: this.state.user.email, username: this.state.user.username, bio: this.state.user.bio, avatarURL: this.state.user.avatarURL}}>
          <Form.Item name="username" label="Username" rules={usernameValidate}>
              <Input />
          </Form.Item>
  
          <Form.Item name="password" label="Password" rules={passwordValidate} hasFeedback>
              <Input.Password />
          </Form.Item>
  
          <Form.Item name="email" label="Email">
              <Input />
          </Form.Item>
          
          <Form.Item name="bio" label="Bio">
              <TextArea style={{height:100}}/>
          </Form.Item>
  
          <Form.Item name="avatarURL" label="Avatar URL" >
              <Input />
          </Form.Item>
  
          <Form.Item>
              <Button style={{marginLeft: '123%', marginTop: '3%', backgroundColor: '#0FE87C'}} type="primary" htmlType="submit">
                  Update
              </Button>
          </Form.Item>
        </Form>
        </>
      );
    }
  };
};
  
export default Account;  
