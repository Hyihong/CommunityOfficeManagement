import React from 'react';
import {withRouter } from 'react-router-dom'
import "./style.less";
import { Row,Col,Button} from 'antd';
 class Return  extends React.Component{
      componentWillMount(){
      }

      returnHandle=()=>{
          this.props.history.goBack();//返回上一页
      }
      render(){
           
        return(
              <Row type="flex" className="lee-return-bar" >
                  <div>
                      <div className="lee-layout-center">
                          <Row type="flex" align="middle" justify="end">
                               <Button onClick= {this.returnHandle }>返回</Button>
                          </Row>
                          {/*<Col sm={21} xs={0} >*/}
                          <div className="text"> <h1>{ this.props.children }</h1></div>
                          {/*</Col>*/}
                      </div>
                  </div>
              </Row>
        )
      }
};

export default withRouter(Return) ;

