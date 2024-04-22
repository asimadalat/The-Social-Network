import React from 'react';
import { status, json } from '../utilities/requestHandlers';
import { jwtDecode } from 'jwt-decode';

import HeartOutlined from '@ant-design/icons/HeartOutlined';
import HeartFilled from '@ant-design/icons/HeartFilled';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import MessageFilled from '@ant-design/icons/MessageFilled';
import EyeOutlined from '@ant-design/icons/EyeOutlined';

// Assign icon based on theme var
function getIcon (theme, iconType) {
    let Icon;

    if (theme === 'filled') {
      if (iconType === 'like') {
        Icon = HeartFilled;
      } else if (iconType === 'message') {
          Icon = MessageFilled;
      }
    } else if (theme === 'outlined') {
      if (iconType === 'like') {
        Icon = HeartOutlined;
      } else if (iconType === 'message') {
        Icon = MessageOutlined;
      } else if (iconType === 'view') {
        Icon = EyeOutlined; 
      }  
    }
    return Icon;
  }

class PostIcon extends React.Component {
  constructor(props){  
    super(props);  
    this.state = {
      selected: props.selected,
      type: props.type,
      id: props.id,
      commentCount: 0,
      likeCount: 0,
      viewCount: 0
    };
    this.onClick = this.onClick.bind(this);
  }

  // Fetch like count from API
  componentDidMount() {
    const isLiked = localStorage.getItem(`likedPost-${this.state.id}`);
    this.setState({selected: JSON.parse(isLiked)});
    fetch(this.props.likeCountLink)
    .then(status)
    .then(json)
    .then(count => {
      this.setState({likeCount:count})
    })
    .catch(err => {
      console.log(`${this.props.type} icon error for post ${this.props.id}`)
    });

    if (this.state.type === 'view') {
      this.getViews();
    }
  }
  
  // Fetch view count from API
  getViews() {
    fetch(this.props.viewCountLink)
    .then(status)
    .then(json)
    .then(data => {
      console.log(data);
      this.setState({viewCount:Math.ceil(data.viewCount)})
    })
    .catch(err => {
      console.error(err);
      alert(`Error: ${err}`);
    });  

  }

  // When icon clicked, toggle between HeartFilled and HeartOutlined and increment/decrement value
  onClick(event){
    event.preventDefault();
    this.setState({selected: !this.state.selected});
    const theme = this.state.selected ? 'filled' : 'outlined';
    const iconType = this.props.type;
    const Icon = getIcon(theme, iconType);
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).UserMetaData.id.toString();

    if (!this.state.selected) {
      if (Icon === HeartOutlined) {
        console.log("Liked post ID: 1");
        fetch(`http://localhost:3000/api/v1/posts/${this.state.id}/${userId}/likes`, {  
          method: "POST",
          headers: {
            "Authorization": "Bearer " + token
          }     
        });
        this.setState(currentState => ({likeCount: currentState.likeCount + 1}));
        localStorage.setItem(`likedPost-${this.state.id}`, 'true');
      }
    } else if (this.state.selected) {
      if (Icon === HeartFilled) {
        console.log("Removed like from post ID: 1");
        fetch(`http://localhost:3000/api/v1/posts/${this.state.id}/${userId}/likes`, {  
          method: "DELETE",
          headers: {
            "Authorization": "Bearer " + token
          }  
        });
        if (this.state.likeCount > 0) {
          this.setState(currentState => ({likeCount: currentState.likeCount - 1}))  ;
        } else {
          this.setState({ likeCount: 0 });
        }
        localStorage.setItem(`likedPost-${this.state.id}`, 'false');
      }
    }
  }

  render(){
    const iconType = this.state.type;
    let theme
    if (iconType === 'view') {
      theme = 'outlined';
    } else {
      theme = this.state.selected ? 'filled' : 'outlined';
    }
    const Icon = getIcon(theme, iconType);
    let iconColor;
    if (Icon === HeartFilled || Icon === HeartOutlined) {
        iconColor = '#FF004E';
    }
    else {
        iconColor = 'steelblue'
    }
    if (iconType === 'like') {
      return (
        <span>
          <Icon
            onClick={this.onClick}
            style={{color:iconColor}} />
          ‎ {this.state.likeCount}
        </span>
      );
    } else if (iconType === 'view') {
      return (
        <span>
          <Icon
            style={{color:iconColor}} />
          ‎ {this.state.viewCount}
        </span>
      );
    } else {
      <span>
          <Icon
            style={{color:iconColor}} />
          ‎ {this.state.commentCount}
        </span>
    }
  }
}

export default PostIcon;

  