
import React from 'react'
import { Link} from 'react-router-dom';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import img_logo  from '../assets/images_m/logo.png'
import './style/home.less'

class Home extends React.Component {
   constructor(props){
     super(props);
     this.state={
        height:0
     }
   }
   componentDidMount=()=>{
       document.title="首页"
       const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.nav).offsetTop; 
       this.setState({
          height:(hei)/3,
          transform:"scale(1)"
       })
   }
   componentWillReceiveProps(nextProps){
     if( this.props.g_ori !== nextProps.g_ori){
        this.setState({
          height:(document.documentElement.clientHeight - ReactDOM.findDOMNode(this.nav).offsetTop)/3,
        })
     }
   }

  render(){
    return (
      <div>
         {/* <NoticeBar mode="closable">移动版正在开发中，尽请期待 ˃̶͈ᴗ˂̶͈ ...</NoticeBar>   */}
          <div className="logo" style={{textAlign:"center",padding:"30px 0 20px 0",background:"#fff"}}>
             <img src={ img_logo } alt="" style={{height:"28px"}}/>
             <span style={{marginLeft:"8px"}}>
                  <Link to="/home/about"><icon className="fa fa-bars" style={{marginRight:"5px",fontSize:"20px"}}></icon></Link>
             </span>
          </div>
          <div className="home"  
               ref={el => this.nav = el}
          >
            <Link to="/home/projectList"> 
                <div className="leelen-homeNav project-list" style={{height:this.state.height,transform:this.state.transform}}>
                    <div className={this.props.g_ori === 'l' ? "ori-l":"ori-p" }>
                      <h2>已审核项目</h2>
                      <h4>显示已审核项目详情</h4>
                      <h4>楼栋管理</h4>
                    </div>
                </div>
            </Link> 
            <Link to="/home/projectListAuditing">
                <div className="leelen-homeNav project-modify" style={{height:this.state.height,transform:this.state.transform}}>
                    <div className={this.props.g_ori === 'l' ? "ori-l":"ori-p" }>
                      <h2>未审核项目</h2>
                      <h4>显示未审核项目详情</h4>
                      <h4>修改申请信息</h4>
                    </div>
                </div>
            </Link> 
            <Link to="/home/apply">
                <div className="leelen-homeNav project-apply" style={{height:this.state.height,transform:this.state.transform}}>
                    <div className={this.props.g_ori === 'l' ? "ori-l":"ori-p" }>
                      <h2>项目申请</h2>
                      <h4>申请新的项目</h4>
                    </div>
                </div>
            </Link> 
          </div>

      </div>
    );
  }
};

const mapStateToProps = (state) => {
  const global =  state.global ;
  return{
     g_ori: global.orientation
  }
}
export default connect(mapStateToProps,null)(Home);







