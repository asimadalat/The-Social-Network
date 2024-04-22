import React from 'react';
import { Menu } from 'antd';
import { Link } from "react-router-dom";
import UserContext from '../contexts/user';
import { jwtDecode } from 'jwt-decode';

class NavigateBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          user: {loggedIn: false}
        }
        this.loggedIn = this.loggedIn.bind(this);
        this.logOut = this.logOut.bind(this);
      }
      
    // If token is present in localstorage, user is logged in
    loggedIn() {
        const token = localStorage.getItem('token');

        if (token === null) {
            return false; 
        } else {
            return true; 
        }
    }
    
    // If no token in localstorage, user is logged out
    logOut() {
        console.log("Removing user from app state...");
        this.setState({user: {loggedIn:false}});
        localStorage.removeItem('token');
    }
    
    render() {
        const context = {
            user: this.state.user,
            logIn: this.logIn,
            logOut: this.logOut
          };

        if (this.loggedIn())
        {
            const token = localStorage.getItem('token');
            const userRole = jwtDecode(token).UserMetaData.role;
            if (userRole === 'admin') {
                return (
                    <UserContext.Provider value={context}>
                        <Menu mode={"horizontal"} style={{ overflow: 'hidden', borderRadius:15}}>
                            <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                            <Menu.Item key="2"><Link to="/create">Create</Link></Menu.Item>
                            <Menu.Item key="3"><Link to="/account">Account</Link></Menu.Item>
                            <Menu.Item key="4" onClick={this.logOut}><Link to="/">Logout</Link></Menu.Item>
                            <Menu.Item key="5"><Link to="/logs">Logs</Link></Menu.Item>
                        </Menu>
                    </UserContext.Provider>
                );
            } else {
                return (
                    <UserContext.Provider value={context}>
                        <Menu mode={"horizontal"} style={{ overflow: 'hidden', borderRadius:15}}>
                            <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                            <Menu.Item key="2"><Link to="/create">Create</Link></Menu.Item>
                            <Menu.Item key="3"><Link to="/account">Account</Link></Menu.Item>
                            <Menu.Item key="4" onClick={this.logOut}><Link to="/">Logout</Link></Menu.Item>
                        </Menu>
                    </UserContext.Provider>
                );
            }
        }
        else {
            return (
                <UserContext.Provider value={context}>
                    <Menu mode={"horizontal"} style={{ overflow: 'hidden', borderRadius:15}}>
                        <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                        <Menu.Item key="2"><Link to="/register">Register</Link></Menu.Item>
                        <Menu.Item key="3"><Link to="/login">Login</Link></Menu.Item>
                    </Menu>
                </UserContext.Provider>
            );
        }
        
    };
};
    
export default NavigateBar;  
  