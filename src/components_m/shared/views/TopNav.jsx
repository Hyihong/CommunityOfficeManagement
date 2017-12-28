import React from 'react';
//顶部导航
import "./style.less";
import { Flex } from 'antd-mobile';
import { Link ,withRouter } from 'react-router-dom'



 class Container  extends React.Component{

      render(){
      
        return(
           <Flex className="top-nav" style={{...this.props.style}}>
                  <Flex.Item className="back-guide">
                      <icon className="fa fa-angle-left back" style={{fontSize:"34px",marginTop:"0px",color:"#1985ac"}} onClick ={ ()=>this.props.history.goBack()}/>
                  </Flex.Item >
                   {
                     !!this.props.home ?  
                     <Flex.Item className="home-guide">
                           <Link to="/home"><icon className="fa fa-home home" style={{fontSize:"22px",marginTop:"4px"}}/></Link>
                     </Flex.Item >  : null
                   }
                   {
                     this.props.title ? 
                     <Flex.Item className="title">
                            <span> { this.props.title || "标题"  } </span>
                    </Flex.Item > :null
                   }
                   {
                     !!this.props.search ? 
                     <Flex.Item className="fakeSearch-wrapper">
                            <div className="fakeSearch" onClick = { this.props.onSearchClick }>
                                <icon className="fa fa-search-plus" style={{marginRight:"10px"}}></icon>搜索
                            </div>
                    </Flex.Item > : null
                   }
                   {
                      this.props.search ? null :
                      <Flex.Item className="sure">
                          { !!this.props.check  ?  <span onClick={ this.props.onCheckClick }>完成</span>  :  null } 
                      </Flex.Item > 
                   }
                    
                   
                
          </Flex>)
      }
};

export default withRouter(Container) ;
