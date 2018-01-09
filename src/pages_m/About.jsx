
import React from 'react'
import{ Button } from 'antd-mobile'
import './style/about.less'

class About extends React.Component {
   constructor(props){
     super(props);
   }
   componentDidMount=()=>{
     
   }

  render(){
    return (
      <div> 
          <div className="leelen-user-info">
               <div className="leelen-user-bg">
                   { document.getElementById('username') ?  document.getElementById('username').value : "developer" }
               </div>
          </div>
          <Button type="warning" style={{position:"absolute",bottom:"10px",left:"10px",right:"10px",margin:"0 10px"}}>退出登录</Button>
          <form action="/Account/Logoff" id="exitForm" method="post" ></form>
      </div>
    );
  }
};

export default About;







