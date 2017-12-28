
import React from 'react'
import { Row,Col,Card } from 'antd'
import { Link} from 'react-router-dom';
import {view as Time} from '../components/showTime';
import "./style/home.less"
import footerImg from "../assets/images/home/footer-bg.jpg"
class Home extends React.Component {
   componentWillMount(){
       document.title="首页";
   }

  render(){
    return (
      <div className="lee-home">
          <Time></Time>
          <div className="lee-guide">
              {/*<h5>- nav -</h5>*/}
              {/*<div className="line"></div>*/}
              {/*<Row type="flex" justify="center">*/}

                  <Col md={{span:17,offset:3}} sm={{span:20,offset:2}}>

                      <Row type="flex"  justify="space-around" className="nav-list">
                          <Col md={{span:7,offset:1}} sm={{span:8,offset:1}} xs={{span:11,offset:1}}>
                              <Link to="/home/projectList">
                                  <Card className="lists">
                                      <div className="space">
                                          <div className="circle">
                                              <div className="list-img"/>
                                          </div>
                                      </div>
                                      <div className="details">
                                          <h5>我的项目</h5>
                                          <h6>-显示我的项目列表-</h6>
                                      </div>
                                  </Card>
                              </Link>
                          </Col>
                          <Col md={{span:7,offset:1}} sm={{span:8,offset:1}} xs={{span:11,offset:1}}>
                              <Link to="/home/apply/create">
                                  <Card className="apply">
                                      <div className="space">
                                          <div className="circle">
                                              <div className="apply-img"/>
                                          </div>
                                      </div>
                                      <div className="details">
                                          <h5>项目申请</h5>
                                          <h6>-申请创建新项目-</h6>
                                      </div>
                                  </Card>
                              </Link>
                          </Col>
                          <Col md={{span:7,offset:1}} sm={{span:8,offset:1}} xs={{span:11,offset:1}}>
                              <Link to="/home/project/import">
                                  <Card className="import">
                                      <div className="space">
                                          <div className="circle">
                                              <div className="import-img"/>
                                          </div>
                                      </div>
                                      <div className="ant-card-cover"></div>
                                      <div className="details">
                                          <h5>业主导入</h5>
                                          <h6>-导入业主数据-</h6>
                                      </div>
                                  </Card>
                              </Link>
                          </Col>
                      </Row>
                  </Col>
              {/*</Row>*/}

          </div>
          <div className="lee-footer">
              <img className="footImg" src={footerImg}/>
              <img className="downImg" src={footerImg}/>
          </div>
      </div>
    );
  }
};

export default Home;


