import React from 'react';
import {Route,Switch ,Redirect} from 'react-router-dom';
import { Bundle }from './components/functional'
import './cover.m.less'

import { view as ProjectList} from './components_m/projectList'
import  ProjectDetail from './pages_m/ProjectDetail'
import { view as BuildingList} from './components_m/buildingList'
import { view as RoomList} from './components_m/roomList'
import { view as SubRoom} from './components_m/subRoom'
import { view as editBuilding} from './components_m/editBuilding'
import { view as editRoom} from './components_m/editRoom'
import { view as createBuilding} from './components_m/createBuilding'
import { view as createRoom} from './components_m/createRoom'
import { view as Apply} from './components_m/apply'
import { view as ApplyModify} from './components_m/applyModify'

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

class App extends React.Component{ 
    componentDidMount(){
        document.addEventListener("touchstart", function(){}, true);
    }
    render(){
        return(
                <div>   
                    <Switch>
                        <Redirect exact from='/' to='/home' />
                        <Route  exact path="/home" component={Home} />
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
                        <Route  exact path="/home/subRoom" component={ SubRoom }/>
                        <Route  exact path="/home/editRoom" component={editRoom}/>
                        <Route  exact path="/home/createRoom" component={createRoom}/>
                        {/* 项目申请与修改 */}
                        <Route  exact path="/home/apply" component={Apply}/>
                        <Route  exact path="/home/applyModify" component={ApplyModify}/>
                        

                        <Redirect from='*' to='/404' />  
                    </Switch>
                </div>
        )
    }
};

export default App;


