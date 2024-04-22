import React from 'react';
import { Col, Row } from 'antd';
import LogCard from './logcard';
import { status, json } from '../utilities/requestHandlers';


class LogFeed extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      logs: []
    }
  }

  // Fetch all logs from API
  componentDidMount() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/api/v1/logs', {  
        headers: {
            "Authorization": "Bearer " + token
        }        
    })
    .then(status)
    .then(json)
    .then(data => {
      this.setState({ logs: data })
    })
    .catch(err => 
      console.log("Error fetching logs", err));

  }

  render() {
    if (!this.state.logs.length) {
      return <h3>Loading logs...</h3>
    }

    const cardList = this.state.logs.map(log => {
      return (
        <>
        <Col span={4} />
        <Col span={16}>
          <div style={{padding:"5px"}} key={log.ID}>
            <LogCard {...log} />  
          </div>
        </Col>
        <Col span={4} />
        </>
      )
    });
    return (
      <>
        <h3 style={{ textAlign:'center' }}>ID : TIMESTAMP</h3>
        <Row type="flex" justify="space-around">
            {cardList}
        </Row>
      </>
    );
  }
}

export default LogFeed;