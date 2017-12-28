import React from 'react';
import "./style.less";
import { Row,Col,Button} from 'antd';
import sorryImg from '../../../assets/images/sorry.png'

 class Error  extends React.Component{
      render(){
        return(
          <div style={{ width:"80%",margin:"0 auto"}}>
             <Row type="flex" justify="center">
                  <Col style={{textAlign:"center"}}>
                        <img src={ sorryImg} alt="错误图片"/>
                        <p><span style={{fontSize:"20px",color:"#f01c35"}}>请求失败</span> ！ <Button onClick = { this.props.onClick }>重新加载</Button> </p>
                  </Col>
            </Row>
          </div>)
      }
};

export default Error;

