// ***  ***
// ***  file description: 网站头部 ***
// ***  ***
import React from 'react'
import { Layout,Menu,Icon,Row,Col,Avatar,Form} from 'antd';
import { Link } from 'react-router-dom'
import { withRouter} from 'react-router-dom';
import logoLight from '../../../assets/images/logo/logo-light.png'

const { Item } = Menu;
const { Header } = Layout  ;


class App extends React.Component{
    constructor(){
        super()
        this.state = {
            collapsed: true,
            isHomePage : ''
        }
    }
    componentWillMount(){
        this.setState({isHomePage:this.props.location.pathname === '/home'})
    }
    componentDidMount(){
        document.onclick = ()=>{
            this.setState({ collapsed:true})
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({isHomePage:nextProps.location.pathname === '/home'})
    }

    tirggerMenuHandle = (e) =>{
        // e.stopPropagation(); 组成合成事件间的冒泡
        e.nativeEvent.stopImmediatePropagation();  //阻止合成事件与最外层document上的事件间的冒泡
        this.setState({ collapsed:!this.state.collapsed})
    }

    handleExit = () =>{
        const form = document.getElementById("exitForm")
        form.submit()
    }

    
    render(){
        return (
               <div className="lee-header">
                    <Header style={{ position: 'fixed', width: '100%' ,top:'0',zIndex:'20'}}>
                            <div className="lee-layout-center">
                                <Row type="flex"align="middle">
                                    <Col sm={12} xs={21} className="logo">
                                        <div>
                                            <Icon type="left" onClick={ () => this.props.history.goBack() }/>
                                            <img  src={  logoLight } alt="logo"/>
                                            <span className="lee-xs-hidden">|</span>
                                            <b className="lee-xs-hidden">办事处管理系统</b>
                                           
                                        </div>
                                    </Col>
                                    <Col sm={0} xs={3} className="menu-fold">
                                         <div onClick={this.tirggerMenuHandle }><Icon type="menu-fold" /></div>
                                    </Col>
                                    <Col sm={ {span:12,offset:0}} xs={{span:6,offset:18}}
                                         className= "right-menu"  
                                    > 
                                        <Row type="flex" justify="end">
                                            <Col className="lee-xs-hidden" style={{float:'left'}}>
                                                <Icon type="user" style={{fontSize:16}}/>{
                                                document.getElementById('username') ?  document.getElementById('username').value : "developer"
                                            }
                                                {/*<Avatar size="large" icon="user" />*/}
                                                {/*<span className="username" ></span>*/}
                                            </Col>
                                            <Col  className={  this.state.collapsed ? "collapsed":"expand" } style={{float:'left'}}>
                                             <Menu mode="horizontal" selectedKeys={this.state.isHomePage ? ["home"] :[]}>
                                                <Item key="home"><Link to="/home"><Icon type="home" />主页</Link></Item>
                                                <Item key="exit" className="exit" >
                                                     <div onClick = { this.handleExit }> <Icon type="poweroff"  />
                                                         退出
                                                     </div>
                                                     <Form action="/Account/Logoff" id="exitForm" method="post" ></Form>
                                                </Item>
                                            </Menu>
                                            </Col>
                                        </Row>
                                    </Col>  
                                </Row>
                            </div>
                    </Header>
                    
               </div>
        )
    }
}


export default withRouter (App) ;

{/* <a href="/Account/Login" >d</a> */}