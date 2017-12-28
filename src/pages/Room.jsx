import React from 'react';
import { Return } from '../components/shared';
import { Route,Switch,Redirect } from 'react-router-dom';
import { Bundle }from '../components/functional'

//异步页面，代码分割，按需加载
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

const EditRoom = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            cb(require('../components/editRoom').view );
        },'editRoom');
    }}>
        {(EditRoom) => <EditRoom {...props}/>}
    </Bundle>
)

class RoomPage extends React.Component{   

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
        //判断是否为弹出框
        const isModal = !!( location.state && location.state.modal && this.previousLocation !== location) // location带有state参数，且非初次选渲染 &&  
 
        return (
            <div> 
                <Return>房间详情</Return>  
                { isModal ?
                      <div>
                        <Switch location={ this.previousLocation }>
                            <Route  exact path= { `${match.url}`}  component={Room}/> 
                        </Switch> 
                        <Switch>
                            <Route  exact path= { `${match.url}/create`} component={CreateRoom}/> 
                            <Route  exact path= { `${match.url}/edit`} component={EditRoom}/> 
                        </Switch> 
                      </div> 
                     :     
                     <Switch location={ location }>
                        <Route  exact path= { `${match.url}`}  component={Room}/>  
                        <Redirect from={ `${match.url}/create`}  
                                  to ={{ pathname:`/home/project/room`,search:location.search}} >
                        </Redirect> 
                    </Switch>    
                }
            </div>
        );
   };
}
export  { RoomPage };
