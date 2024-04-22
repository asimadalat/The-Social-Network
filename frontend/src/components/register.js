import React from 'react';
import { Form, Input, Button } from 'antd';
import { status, json } from '../utilities/requestHandlers';

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

const confirmValidate = [
  { required: true, message: 'Confirmation of password is required.' },
  ({ getFieldValue }) => ({
      validator(rule, value) {
          if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
          }
          return Promise.reject('Passwords do not match.');
      }
  })
];



class RegistrationForm extends React.Component {

  constructor(props) { 
    super(props);
    this.onFinish = this.onFinish.bind(this);
  }

  // Register new user using form inputs excluding confirm input
  onFinish(arg1) {
    console.log(`Received: ${arg1}`);
    const { confirm, ...data } = arg1;
    fetch('http://localhost:3000/api/v1/users', {  
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }        
    })
    .then(status)
    .then(json)
    .then(data => {
        console.log(data);
        alert("User added")
    })
    .catch(err => {
	      console.error(err);
        alert("Username and password must each be longer than 6 characters");
    });  

  }

  render() {
    return (
      <>
      <h1 style={{textAlign:'center', padding:30}}>Register New Account</h1>
      <Form {...formLayout} name="register" onFinish={this.onFinish} scrollToFirstError>
        
        <Form.Item name="username" label="Username" rules={usernameValidate}>
            <Input />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={passwordValidate} hasFeedback>
            <Input.Password />
        </Form.Item>

        <Form.Item name="confirm" label="Confirm Password" rules={confirmValidate} hasFeedback>
            <Input.Password />
        </Form.Item>

        <Form.Item>
            <Button style={{marginLeft: '128%', marginTop: '3%', backgroundColor: '#0FE87C'}} type="primary" htmlType="submit">
                Register
            </Button>
        </Form.Item>
      </Form>
      </>
    );
  };
};
  
export default RegistrationForm;  


