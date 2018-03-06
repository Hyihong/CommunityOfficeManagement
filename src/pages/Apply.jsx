import React from 'react';
import {Row,Col  } from 'antd';
import { Route,Switch } from 'react-router-dom';
import {view as Apply} from '../components/apply';
import {view as ApplyModify} from '../components/applyModify';
import { Return } from '../components/shared';
import "./style/apply.less"
class ApplyPage extends React.Component{ 
    constructor(props){
        super(props);
        const _hasSearch = !!this.props.location.search;
        this.state = {
            isModify: _hasSearch,
            title:  _hasSearch ? "修改项目申请信息":"申请项目"
        }
    }
    componentWillMount(){
        document.title = this.state.title;
        
    }
    render(){
        const { match } = this.props;
        return(
            <div>
                <Return> { this.state.title }</Return>  
                <Row type="flex" justify="left">
                    {/*<Col sm={15} xs={22}>*/}
                    <Col md={{span:13,offset:6}} sm={{span:15,offset:5}} xs={{span:18,offset:3}}>
                        <Switch> 
                            <Route  exact path= { `${match.url}/create`} component={Apply}/> 
                            <Route  exact path= { `${match.url}/modify`} component={ApplyModify}/> 
                        </Switch> 
                    </Col> 
                </Row> 
            </div>
        );
   };
}

export  { ApplyPage };
