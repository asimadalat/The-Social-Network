import React from 'react';
import { Card } from 'antd';
import { Link } from "react-router-dom";
import PostIcon from './posticon';
import { status, json } from '../utilities/requestHandlers';

class PostPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }

  // Fetch user based on userID of post prop
  componentDidMount() {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/v1/users/${this.props.userID}`, {  
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


  render() {
    const path = `/post/${this.props.ID}`

    
    let username;
    if (this.state.user) {
      username = this.state.user.username;
    } else {
      username = "";
    }

    const token = localStorage.getItem('token');
    if (!this.props.imageURL)
    {
      if (token) {
        return (
          <>
          <div style={ {borderRadius: 25} }>
            <Link to={{ pathname: path }}>
              <Card style={{ borderRadius: 25, overflow:'hidden'}} 
                actions={[
                  <PostIcon type="like" id={this.props.ID} likeCountLink={this.props.links.likes} handleToggle={this.toggleLike} selected={this.props.liked}/>,
                  <PostIcon type="message" countLink={this.props.links.comments}/>,
                  <PostIcon type="view" id={this.props.ID} viewCountLink={this.props.links.views}/>
                ]}>
            
                  <Card.Meta style={{ paddingLeft: 20 }}
                      title={<><div style={{color: 'gray', fontSize:'Small'}}>{username}</div> 
                          <div style={{fontSize:'Large', whiteSpace: 'normal'}}>{this.props.title} </div></>} 
                      description={<div style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      textOverflow: 'ellipsis',
                      fontSize: 'Small',
                      lineHeight: '1.3em'}}>{this.props.bodyText} </div>} />
      
              </Card>
            </Link>
          </div>
          </>
        );
      } else {
        return (
          <>
          <div style={ {borderRadius: 25} }>
            <Link to={{ pathname: path }}>
              <Card style={{ borderRadius: 25, overflow:'hidden'}}>
            
                  <Card.Meta
                      title={<><div style={{color: 'gray', fontSize:'Small'}}>{username}</div> 
                          <div style={{fontSize:'Large', whiteSpace: 'normal'}}>{this.props.title} </div></>} 
                      description={<div style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      textOverflow: 'ellipsis',
                      fontSize: 'Small',
                      lineHeight: '1.3em'}}>{this.props.bodyText} </div>} />
     
              </Card>
            </Link>
          </div>
          </>
        );
      }
    } else {
      if (token) {
        return (
          <>
          <div style={ {borderRadius: 25} }>
            <Link to={{ pathname: path }}>
              <Card style={{ borderRadius: 25, overflow:'hidden'}} 
                actions={[
                  <PostIcon type="like" id={this.props.ID} likeCountLink={this.props.links.likes} handleToggle={this.toggleLike} selected={this.props.liked}/>,
                  <PostIcon type="message" countLink={this.props.links.comments}/>,
                  <PostIcon type="view" id={this.props.ID} viewCountLink={this.props.links.views}/>
                ]}>
  
                <div style={{ display: 'flex' }}>
                  <img src={this.props.imageURL} alt="example" style={{ borderRadius: 15, width: 100, height: 100, marginRight: 20}} />
            
                  <Card.Meta
                      title={<><div style={{color: 'gray', fontSize:'Small'}}>{username}</div> 
                          <div style={{fontSize:'Large', whiteSpace: 'normal'}}>{this.props.title} </div></>} 
                      description={<div style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      textOverflow: 'ellipsis',
                      fontSize: 'Small',
                      lineHeight: '1.3em'}}>{this.props.bodyText} </div>} />
                </div>
              </Card>
            </Link>
          </div>
          </>
        );
      } else {
        return (
          <>
          <div style={ {borderRadius: 25} }>
            <Link to={{ pathname: path }}>
              <Card style={{ borderRadius: 25, overflow:'hidden'}}>
  
                <div style={{ display: 'flex' }}>
                  <img src={this.props.imageURL} alt="example" style={{ borderRadius: 15, width: 100, height: 100, marginRight: 20}} />
            
                  <Card.Meta
                      title={<><div style={{color: 'gray', fontSize:'Small'}}>{username}</div> 
                          <div style={{fontSize:'Large', whiteSpace: 'normal'}}>{this.props.title} </div></>} 
                      description={<div style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      textOverflow: 'ellipsis',
                      fontSize: 'Small',
                      lineHeight: '1.3em'}}>{this.props.bodyText} </div>} />
                </div>
              </Card>
            </Link>
          </div>
          </>
        );
      }
    }
    
  }
}


export default PostPreview;
