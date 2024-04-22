import React from 'react';
import { Col, Row } from 'antd';
import PostPreview from './postpreview';
import { status, json } from '../utilities/requestHandlers';


class PostFeed extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }

  // Fetch all posts from API
  componentDidMount() {
    fetch('http://localhost:3000/api/v1/posts')
    .then(status)
    .then(json)
    .then(data => {
      this.setState({ posts: data })
    })
    .catch(err => 
      console.log("Error fetching posts", err));

  }

  render() {
    if (!this.state.posts.length) {
      return <h3>Loading posts...</h3>
    }

    const cardList = this.state.posts.map(post => {
      return (
        <>
        <Col span={4} />
        <Col span={16}>
          <div style={{padding:"10px"}} key={post.ID}>
            <PostPreview {...post} />  
          </div>
        </Col>
        <Col span={4} />
        </>
      )
    });
    return (
      <Row type="flex" justify="space-around">
        {cardList}
      </Row>
    );
  }
}

export default PostFeed;
