import './App.css';
import React from 'react';
import { Layout } from 'antd';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import UserContext from './contexts/user';
import Account from './components/account';
import Post from './components/postdetail';
import Comment from './components/commentdetail';
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';
import PostCreate from './components/postcreate';
import PostEdit from './components/postedit';
import NavigateBar from './components/navigatebar';
import LogFeed from './components/logfeed';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {loggedIn: false}
    }
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }
  
  logIn(user) {
    console.log("Updating user in app state...");
    user.loggedIn = true;
    this.setState({user:{user, loggedIn:true}});
  }
  
  logOut() {
    console.log("Removing user from app state...");
    this.setState({user: {loggedIn:false}});
  }
  
  render() {
    const context = {
      user: this.state.user,
      logIn: this.logIn,
      logOut: this.logOut
    };

    return (
      <UserContext.Provider value={context}>
        <Router>   
          <Layout className="layout">
            
            <header>
              <div style={{padding: 15, borderRadius: 50}}>
                <h1>The Social Network</h1>
                <NavigateBar />
              </div>
            </header>
  
            <content>
              <Routes>
                <Route path="/account" element={<Account />} />
                <Route path="/post/:postID" element={<Post />} />
                <Route path="/post/:postID/edit" element={<PostEdit />} />
                <Route path="/post/:postID/comment/:commentID" element={<Comment />} />
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create" element={<PostCreate />} />
                <Route path="/logs" element={<LogFeed />} />
              </Routes>
            </content>
  
            <footer style={{ textAlign: 'center' }}>
              Created for 6003CEM Web API Development
            </footer> 
  
          </Layout>
        </Router>
      </UserContext.Provider>
  );}

}

export default App;