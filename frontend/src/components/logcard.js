import React from 'react';
import { Card } from 'antd';

class LogCard extends React.Component {

  render() {
    return (
    <>
    <div style={ {borderRadius: 25} }>
        <Card style={{ borderRadius: 25, overflow:'hidden'}}>
            <Card.Meta
                title={<><div style={{color: 'gray', fontSize:'Small'}}>{this.props.ID} : {this.props.timestamp}</div> 
                    <div style={{fontSize:'Large', whiteSpace: 'normal'}}> </div></>} 
                description={<div style={{color:'black'}}>{this.props.logData} </div>} />
        </Card>
    </div>
    </>
    );
  }
}


export default LogCard;
