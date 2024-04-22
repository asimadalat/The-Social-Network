import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Button } from 'antd';
import PostIcon from './posticon';
import CommentFeed from './commentfeed';
import CommentCreate from './commentcreate';
import { useParams } from 'react-router-dom';
import { status, json } from '../utilities/requestHandlers';
import blank from '../resources/images/blank.png';
import { jwtDecode } from 'jwt-decode';


function PostDetail() {

  let { postID } = useParams();
  const [posts, setPosts]= useState(null);

  // Delete post from API database using its id, postID
  function OnDelete() {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/v1/posts/${postID}`, {  
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }        
    })
    .then(status)
    .then(data => {
      console.log(data);
      alert("Post deleted");
    })
    .catch(err => {
      console.error(err);
      alert(`Error: ${err}`);
    });  
  }

  // Get post to display from API
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/posts/${postID}`)
    .then(status)
    .then(json)
    .then(data => {
      setPosts(data);
    })
    .catch(err => 
      console.log("Error fetching post", err));

  }, [postID]);
  
  if (!posts)
  {
    return (<div>"Loading post...</div>);
  }
  let image;
  let imgWidth;
  let imgHeight;
  if (posts.imageURL !== null) {
    image = posts.imageURL;
    imgWidth = 300;
    imgHeight= 200;
  } else {
    image = blank;
    imgWidth = 0;
    imgHeight= 0;
  }
  let token = localStorage.getItem('token');
  if (token === null) {
    return (
      <>
      <Row style={{paddingTop:20}}>
        <Col span={18} style={ {paddingLeft:20, paddingRight:20} }>
          <div style={ {borderRadius: 25} }>
            <Card style={{ overflow: 'hidden', borderRadius: 25 }} >
  
              <Card.Meta
                  title={<><div style={{color: 'gray', fontSize:'Small'}}>Space name</div> 
                  <h1 style={{ whiteSpace: 'normal'}}>{posts.title} </h1>
                  <img src={image} alt="example" style={{ width: imgWidth, height: imgHeight, marginRight: 20}} /></>} 
                  description={<div style={{color:'black', fontSize: 'Small'}}>{posts.bodyText}</div>} />
            </Card>
          </div>
          <CommentFeed />
        </Col>
        <Col span={6} style={ {paddingRight:20} }>
          <Card style={{ borderRadius: 25} } >
            <Card.Meta
                title={<div style={{fontSize:'Large', whiteSpace: 'normal'}}>Space name </div>}
                description={<div style={{fontSize: 'Small'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi proin sed libero enim sed faucibus turpis in eu. Facilisis sed odio morbi quis. Convallis tellus id interdum velit laoreet id donec. Vel eros donec ac odio tempor orci dapibus. Netus et malesuada fames ac turpis egestas integer. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Vel turpis nunc eget lorem. Urna et pharetra pharetra massa massa ultricies mi quis. Urna nec tincidunt praesent semper feugiat nibh. Fusce id velit ut tortor. Quis blandit turpis cursus in hac. Velit egestas dui id ornare arcu odio ut sem. Est lorem ipsum dolor sit. Proin nibh nisl condimentum id venenatis a condimentum vitae sapien. Eros donec ac odio tempor orci dapibus.
  
                rmelis bibendum ut tristique et egestas quis. Id faucibus nisl tincidunt eget nullam non nisi est. Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Tortor consequat id porta nibh venenatis cras sed felis eget. Urna neque viverra justo nec ultrices. Est lorem ipsum dolor sit amet consectetur adipiscing. Netus et malesuada fames ac turpis egestas maecenas pharetra convallis. Nunc sed velit dignissim sodales ut. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae.
                
                </div>} />
          </Card>
        </Col>
      </Row>
      </>
    );
  } else {
    const currentUserId = jwtDecode(token).UserMetaData.id;
    const userRole = jwtDecode(token).UserMetaData.role;

    if (currentUserId !== 0) {
      if (currentUserId === posts.userID || userRole === 'admin') {
        const path = `/post/${postID}/edit`
        return (
          <>
          <Row style={{paddingTop:20}}>
            <Col span={18} style={ {paddingLeft:20, paddingRight:20} }>
              <div style={ {borderRadius: 25} }>
                <Card style={{ overflow: 'hidden', borderRadius: 25 }} 
                  actions={[
                    <PostIcon type="like" id={posts.ID} likeCountLink={posts.links.likes} handleToggle={posts.toggleLike} selected={posts.liked}/>,
                    <PostIcon type="message" count='0'/>,
                    <PostIcon type="view" id={posts.ID} viewCountLink={posts.links.views}/>
                  ]}>
      
                  <Card.Meta
                      title={<><div style={{ display:'flex' }}><h4>Space name</h4>
                      <Link to={{ pathname: path }}>
                        <Button style={{ marginLeft:660 }} >Edit</Button>
                      </Link>
                      <Button ghost={true} onClick={OnDelete} style={{ marginLeft:5, backgroundColor:'#821517' }}>Delete</Button></div> 
                      <h1 style={{ whiteSpace: 'normal'}}>{posts.title} </h1>
                      <img src={image} alt="example" style={{ width: imgWidth, height: imgHeight, marginRight: 20}} /></>} 
                      description={<div style={{color:'black', fontSize: 'Small'}}>{posts.bodyText}</div>} />
                </Card>
              </div>
              <CommentCreate postID={postID}/>
              <CommentFeed />
            </Col>
            <Col span={6} style={ {paddingRight:20} }>
              <Card style={{ borderRadius: 25} } >
                <Card.Meta
                    title={<div style={{fontSize:'Large', whiteSpace: 'normal'}}>Space name </div>}
                    description={<div style={{fontSize: 'Small'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi proin sed libero enim sed faucibus turpis in eu. Facilisis sed odio morbi quis. Convallis tellus id interdum velit laoreet id donec. Vel eros donec ac odio tempor orci dapibus. Netus et malesuada fames ac turpis egestas integer. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Vel turpis nunc eget lorem. Urna et pharetra pharetra massa massa ultricies mi quis. Urna nec tincidunt praesent semper feugiat nibh. Fusce id velit ut tortor. Quis blandit turpis cursus in hac. Velit egestas dui id ornare arcu odio ut sem. Est lorem ipsum dolor sit. Proin nibh nisl condimentum id venenatis a condimentum vitae sapien. Eros donec ac odio tempor orci dapibus.
      
                    rmelis bibendum ut tristique et egestas quis. Id faucibus nisl tincidunt eget nullam non nisi est. Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Tortor consequat id porta nibh venenatis cras sed felis eget. Urna neque viverra justo nec ultrices. Est lorem ipsum dolor sit amet consectetur adipiscing. Netus et malesuada fames ac turpis egestas maecenas pharetra convallis. Nunc sed velit dignissim sodales ut. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae.
                    
                    </div>} />
              </Card>
            </Col>
          </Row>
          </>
        );
      } else {
        return (
          <>
          <Row style={{paddingTop:20}}>
            <Col span={18} style={ {paddingLeft:20, paddingRight:20} }>
              <div style={ {borderRadius: 25} }>
                <Card style={{ overflow: 'hidden', borderRadius: 25 }} 
                  actions={[
                    <PostIcon type="like" id={posts.ID} likeCountLink={posts.links.likes} handleToggle={posts.toggleLike} selected={posts.liked}/>,
                    <PostIcon type="message" count='3'/>,
                    <PostIcon type="view" id={posts.ID} viewCountLink={posts.links.views}/>
                  ]}>
      
                  <Card.Meta
                      title={<><div style={{color: 'gray', fontSize:'Small'}}>Space name</div> 
                      <h1 style={{ whiteSpace: 'normal'}}>{posts.title} </h1>
                      <img src={image} alt="example" style={{ width: imgWidth, height: imgHeight, marginRight: 20}} /></>} 
                      description={<div style={{color:'black', fontSize: 'Small'}}>{posts.bodyText}</div>} />
                </Card>
              </div>
              <CommentCreate postID={postID}/>
              <CommentFeed />
            </Col>
            <Col span={6} style={ {paddingRight:20} }>
              <Card style={{ borderRadius: 25} } >
                <Card.Meta
                    title={<div style={{fontSize:'Large', whiteSpace: 'normal'}}>Space name </div>}
                    description={<div style={{fontSize: 'Small'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi proin sed libero enim sed faucibus turpis in eu. Facilisis sed odio morbi quis. Convallis tellus id interdum velit laoreet id donec. Vel eros donec ac odio tempor orci dapibus. Netus et malesuada fames ac turpis egestas integer. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Vel turpis nunc eget lorem. Urna et pharetra pharetra massa massa ultricies mi quis. Urna nec tincidunt praesent semper feugiat nibh. Fusce id velit ut tortor. Quis blandit turpis cursus in hac. Velit egestas dui id ornare arcu odio ut sem. Est lorem ipsum dolor sit. Proin nibh nisl condimentum id venenatis a condimentum vitae sapien. Eros donec ac odio tempor orci dapibus.
      
                    rmelis bibendum ut tristique et egestas quis. Id faucibus nisl tincidunt eget nullam non nisi est. Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Tortor consequat id porta nibh venenatis cras sed felis eget. Urna neque viverra justo nec ultrices. Est lorem ipsum dolor sit amet consectetur adipiscing. Netus et malesuada fames ac turpis egestas maecenas pharetra convallis. Nunc sed velit dignissim sodales ut. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae.
                    
                    </div>} />
              </Card>
            </Col>
          </Row>
          </>
        );
      }
    } 
  }
}

export default PostDetail;