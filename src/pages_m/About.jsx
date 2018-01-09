
import React from 'react'
import{ Button,Toast } from 'antd-mobile'
import TopNav from '../components_m/shared/views/TopNav'
import './style/about.less'
import avatar from '../assets/images_m/avatar.png'

class About extends React.Component {
   constructor(props){
     super(props);
   }
   componentDidMount=()=>{
     
   }

   avatarClick=()=>{
     Toast.info('暂不支持自定义头像',1);
   }

   handleExit =()=>{
      const form = document.getElementById("exitForm")
      form.submit()
   }

  render(){
    return (
      <div> 
          {/* <TopNav title="用户中心"></TopNav> */}
          <div>
                <div className="leelen-user-info-container">
                <icon className="fa fa-angle-left back" style={{fontSize:"34px",margin:"10px 0 0 10px",color:"#fff"}} onClick ={ ()=>this.props.history.goBack()}/>
                      <div className="leelen-user">
                          <div className="avatar"><img src={avatar} alt="" onClick={ this.avatarClick }/></div>
                      </div>
                      <div style={{textAlign:"center",color:"#303336",fontSize:"20px"}}> { document.getElementById('username') ?  document.getElementById('username').value : "developer" } </div>
                </div>
          </div>
          <Button type="warning" style={{margin:"200px 10px 0 10px"}} onClick={ this.handleExit}>退出登录</Button>
          {/* style={{position:"absolute",bottom:"10px",left:"10px",right:"10px",margin:"0 10px"}} */}
          <form action="/Account/Logoff" id="exitForm" method="post" ></form>
      </div>
    );
  }
};

export default About;







