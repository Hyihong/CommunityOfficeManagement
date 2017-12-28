import React from 'react';
import { Return } from '../components/shared';
import { Route,Switch,Redirect } from 'react-router-dom';
import { Bundle }from '../components/functional'

//异步页面，代码分割，按需加载
const Building = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            cb(require('../components/building').view );
        },'building');
    }}>
        {(Building) => <Building {...props}/>}
    </Bundle>
)

const CreateBuilding = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            cb(require('../components/createBuilding').view );
        },'createBuilding');
    }}>
        {(EditBuilding) => <EditBuilding {...props}/>}
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
        //console.log( location );
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
                <Return> 楼栋管理 </Return>  
                { isModal ?
                      <div>
                        <Switch location={ this.previousLocation }>
                            <Route  exact path= { `${match.url}`}  component={Building}/> 
                        </Switch> 
                        <Switch> 
                            <Route  exact path= { `${match.url}/create`} component={CreateBuilding}/> 
                            <Route  exact path= { `${match.url}/edit`} component={EditBuilding}/> 
                        </Switch> 
                      </div> 
                     :     
                     <Switch location={ location }>
                        <Route  exact path= { `${match.url}`}  component={Building}/>  
                        <Redirect from={ `${match.url}/edit`}  to ={{ pathname:`/home/project/building`,search:location.search}} ></Redirect> 
                        <Redirect from={ `${match.url}/create`}  to ={{ pathname:`/home/project/building`,search:location.search}} ></Redirect> 
                    </Switch>    
                }
            </div>
        );
   };
}
export  { BuildingPage };
