import React from 'react';
import { Route,Switch,Redirect} from 'react-router-dom';
import { Bundle }from './components/functional'
import './tools/global.js'
import './cover.less'
//同步页面
import { Container } from './components/shared';

//因涉及react-router弹出框展示，异步加载会丢失componentWillUpdate生命钩子，故采用同步加载方法
import { BuildingPage } from "./pages/Building" 
import { RoomPage } from "./pages/Room" 

//异步页面，代码分割，按需加载
const Home = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            cb(require('./pages/Home'));
        },'home');
    }}>
        {(Home) => <Home {...props}/>}
    </Bundle>
)

const Developing = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            cb(require('./pages/Developing'));
        },'developing');
    }}>
        {(Developing) => <Developing {...props}/>}
    </Bundle>
)
const ProjectList = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            const { view } = require('./components/projectList')
            cb(view);
        },'projectList');
    }}>
        {(ProjectList) => <ProjectList {...props}/>}
    </Bundle>
)

const ApplyPage = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
             const { ApplyPage } = require('./pages/Apply.jsx');
            cb(ApplyPage);
        },'apply');
    }}>
        {(Apply) => <Apply {...props}/>}
    </Bundle>
)

const Import = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
             const { view } = require('./components/importProjectInfo');
            cb(view);
        },'import');
    }}>
        {(Import) => <Import {...props}/>}
    </Bundle>
)


const ProjectDetail = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            const { view } = require('./components/projectDetail')
            cb(view);
        },'pppppp');
    }}>
        {(ProjectDetail) => <ProjectDetail {...props}/>}
    </Bundle>
)



// const BuildingPage = (props) => (
//     <Bundle  load={(cb) => {
//         require.ensure([], require => {
//              const { BuildingPage } = require('./pages/Building');
//             cb(BuildingPage);
//         },'import');
//     }}>
//         {(BuildingPage) => <BuildingPage {...props}/>}
//     </Bundle>
// )

// const RoomPage = (props) => (
//     <Bundle  load={(cb) => {
//         require.ensure([], require => {
//              const { RoomPage } = require('./pages/Room');
//             cb(RoomPage);
//         },'import');
//     }}>
//         {(RoomPage) => <RoomPage {...props}/>}
//     </Bundle>
// )


class App extends React.Component{ 
    componentDidMount(){
        
    }
    render(){
        return(
                <div>   
                        <Container >
                            <Switch>
                                <Redirect exact from='/' to='/home' />
                                <Route  exact path="/home" component={Home} />
                                <Route  path="/home/projectList" component={ProjectList} />
                                <Route  path="/home/apply" component={ApplyPage} />
                                <Route  exact path="/home/developing" component={Developing} />
                                <Route  path="/home/project/building" component={BuildingPage} />
                                <Route  path="/home/project/room" component={RoomPage} />
                                <Route  exact path="/home/project/import" component={Import} /> 
                                <Route  exact path="/home/project/detail" component={ProjectDetail} />
                                <Redirect from='*' to='/404' />  
                            </Switch>
                        </Container >
                </div>
        )
    }
};


export default App;


