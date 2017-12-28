import React from 'react';
//import {view as ProjectList} from '../components/projectList';
//import {view as ProjectItem} from '../components/project';
//import {view as Room} from '../components/roomList';
//import  { view as CreateRoom } from '../components/createRoom'
import { Return } from '../components/shared';
import { Route,Switch,Redirect } from 'react-router-dom';
import { Bundle }from '../components/functional'

//异步页面，代码分割，按需加载
const ProjectItem = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            cb(require('../components/project').view );
        },'project');
    }}>
        {(ProjectItem) => <ProjectItem {...props}/>}
    </Bundle>
)

const Room = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            cb(require('../components/roomList').view );
        },'roomList');
    }}>
        {(Room) => <Room {...props}/>}
    </Bundle>
)


const CreateRoom = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            cb(require('../components/createRoom').view );
        },'createRoom');
    }}>
        {(CreateRoom) => <CreateRoom {...props}/>}
    </Bundle>
)

const EditBuilding = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            cb(require('../components/editBuilding').view );
        },'createRoom');
    }}>
        {(EditBuilding) => <EditBuilding {...props}/>}
    </Bundle>
)

class BuildingPage extends React.Component{   

    previousLocation = this.props.location // 记录前一个location位置

    componentWillUpdate(nextProps) {
        //如果location.state 不是弹出框
        const { location } = this.props 
        // 点击弹出时,重新设置前一个location位置，it's for the  tick 
        //alert(nextProps.history.action);
        if (  nextProps.history.action === 'PUSH' && (!location.state || !location.state.modal) ) {
               this.previousLocation = this.props.location
        }
    }

    render(){
        const { match,location } = this.props;
        //设置title
        let title;
        const len = location.pathname.split("/").length;
        const page = location.pathname.split("/")[len -1];
        switch ( page ){
            case "list": { 
                title = "项目列表" 
                break;
                }
            case "detail": { 
                title = "项目详情" 
                break;
                }
            case "room": { 
                title = "房间详情" 
                break;
                }
            default: title =""
        }
        //判断是否为弹出框
        const isModal = !!( location.state && location.state.modal && this.previousLocation !== location) // location带有state参数，且非初次选渲染 &&  
        return (
            <div> 
                <Return> {title} </Return>  
                { isModal ?
                      <div>
                        <Switch location={ this.previousLocation }>
                            <Route  exact path= { `${match.url}/building`}  component={ProjectItem}/> 
                        </Switch> 
                        <Switch> 
                            <Route  exact path= { `${match.url}/createRoom`} component={CreateRoom}/> 
                            <Route  exact path= { `${match.url}/editBuilding`} component={EditBuilding}/> 
                        </Switch> 
                      </div> 
                     :     
                     <Switch location={ location }>
                        <Route  exact path= { `${match.url}/building`}  component={ProjectItem}/>  
                        <Route  exact path= { `${match.url}/room`}  component={Room}/> 
                        <Redirect from={ `${match.url}/createRoom`}  to ={{ pathname:`${match.url}/list`}} ></Redirect> 
                        <Redirect from={ `${match.url}/editBuilding`}  to ={{ pathname:`${match.url}/list`}} ></Redirect> 
                    </Switch>    
                }
            </div>
        );
   };
}
export  { BuildingPage };
