import React from 'react';
import {Route,Switch ,Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { Toast } from 'antd-mobile'
import { Bundle }from './components/functional'
import './cover.m.less'

import { view as ProjectList} from './components_m/projectList'
import  ProjectDetail from './pages_m/ProjectDetail'
import { view as BuildingList} from './components_m/buildingList'
import { view as RoomList} from './components_m/roomList'
import { view as VirtualRoom} from './components_m/virtualRoom'
import { view as editBuilding} from './components_m/editBuilding'
import { view as editRoom} from './components_m/editRoom'
import { view as createBuilding} from './components_m/createBuilding'
import { view as createRoom} from './components_m/createRoom'
import { view as Apply} from './components_m/apply'
import { view as ApplyModify} from './components_m/applyModify'
import About from './pages_m/About'

import { actions as globalAction } from './components_m/shared'

const { saveScreenOrientation } =globalAction;

//异步页面，代码分割，按需加载
const Home = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            cb(require('./pages_m/Home'));
        },'home');
    }}>
        {(Home) => <Home {...props}/>}
    </Bundle>
)

const Upload = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            let Upload = require("./components_m/importProjectInfo/view.jsx");
            cb(Upload);
        },'upload');
    }}>
        {(Upload) => <Upload {...props}/>}
    </Bundle>
)

const WARNING_INFO = "为获得良好的用户体验，强烈建议您竖屏浏览!";
class App extends React.Component{ 
    componentWillMount(){
       
    }
    componentDidMount(){
        document.addEventListener("touchstart", function(){}, true);
         //屏幕方向检测
         const _o = this.detectScreen() ;
         this.props.saveOrientation(_o);
         if( _o === 'l'){
            setTimeout( ()=>{
                Toast.info(WARNING_INFO,2);
            },500)
        }
        
        //监听屏幕方向
        let evt = "onorientationchange" in window ? "orientationchange" : "resize";
        window.addEventListener(evt,()=>{
            let _o2 = this.detectScreen();
            this.props.saveOrientation(_o2);
            if(_o2 === 'l'){
                Toast.info(WARNING_INFO,2)
            }else if( _o2 === 'unknow'){
                window.reload();
            }
        },false);
    }
    componentWillReceiveProps(){

    }
    detectScreen(){
        if( !!window.matchMedia ){
            return  window.matchMedia("(orientation: portrait)").matches ? 'p':'l';
        }
        return 'unknow'
    }
    render(){
        return(
                <div>   
                    <Switch>
                        <Redirect exact from='/' to='/home' />
                        <Route  exact path="/home" component={Home} />
                        <Route  exact path="/home/about" component={About} />
                        {/* 项目管理 */}
                        <Route  exact path="/home/projectList" component={ProjectList} />
                        <Route  exact path="/home/projectListAuditing" component={ProjectList} />
                        <Route  path="/home/projectDetail" component={ProjectDetail} />
                        {/* 楼栋管理 */}
                        <Route  exact path="/home/buildingList" component={BuildingList}/>
                        <Route  exact path="/home/editBuilding" component={editBuilding}/>
                        <Route  exact path="/home/createBuilding" component={createBuilding}/>
                        {/* 房间管理 */}
                        <Route  exact path="/home/roomList" component={RoomList}/>
                        <Route  exact path="/home/virtualRoom" component={ VirtualRoom }/>
                        <Route  exact path="/home/editRoom" component={editRoom}/>
                        <Route  exact path="/home/createRoom" component={createRoom}/>
                        {/* 项目申请与修改 */}
                        <Route  exact path="/home/apply" component={Apply}/>
                        <Route  exact path="/home/applyModify" component={ApplyModify}/>
                        {/* 文件上传 */}
                        <Route  exact path="/home/upload" component={Upload}/>
                        <Redirect from='*' to='/404' />  
                    </Switch>
                </div>
        )
    }
};


const mapDispatchToProps = (dispatch) => {
    return{
        saveOrientation: (o)=> dispatch( saveScreenOrientation(o) )
     }
 }

export default connect(null,mapDispatchToProps)(App);


