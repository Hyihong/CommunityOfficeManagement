import React from 'react';
import { connect } from 'react-redux';
import { fetchProjectDetail  } from './actions'
import { List,Flex } from 'antd-mobile';
import Animate  from 'rc-animate';
import TopNav from '../shared/views/TopNav'
import { getQueryString } from '../../tools/baseTools'
import './style.less'

export const stateKey = 'project';
const Item = Flex.Item;

//项目详情View
class ProjectDetail extends React.Component {
    constructor(){
        super();
        this.state={
            headerPosition:'static',
            scrollTop:0
        }
     
    }
    componentDidMount(){ 
        const that = this;
        this.category = this.props.location.pathname.split('/')[3] ;
        window.onscroll = function(){
            var t = document.documentElement.scrollTop || document.body.scrollTop;  //获取距离页面顶部的距离
            // that.setState({
            //     headerPosition: that.state.scrollTop > t ? 'static' :'fixed'
            // })
            // that.setState({scrollTop:t})
            
        }
        //get listbody dom
        
        // has fetch data 
        const projectID = getQueryString( this.props.location.search,'ID' ); 
        this.props.fetchProjectDetail( projectID );
      
    }

    render(){
        //加载状态
        let renderContent; 
        switch ( this.category ){
            case "callingNumber":
               if( !!this.props.data  && this.props.data.CallingNumberPool ){
                renderContent=  (
                    <div>
                        <div className="calling-number leelen-detail-list">
                            <Flex className="header">
                                <Item style={{flex:"0 0 60px"}}>
                                    <ul className="header-status">
                                        <li key="1" style={{color:'#47cf73'}}><span style={{background:'#47cf73'}}></span>已用</li>
                                        <li key="2" style={{color:'#fe4800'}}><span style={{background:'#fe4800'}}></span>未用</li>
                                        <li key="3" style={{color:'#b7b9b8'}}><span style={{background:'#b7b9b8'}}></span>禁用</li>
                                    </ul>
                                </Item>
                                <Item>码号类型</Item>
                                <Item>数量</Item>
                            </Flex>
                            <div className="leelen-detail-list-body">
                                { this.props.data.CallingNumberPool.map( record =>{
                                    return (
                                        <Flex key={record.key}>
                                            <Item className="status">
                                                    <div className={record.Status === 1 ? "not-use" :( record.Status === 2 ? "used" :"disable") }> </div>
                                            </Item>
                                            <Item>{ record.Type ? <div><icon className="fa fa-podcast" style={{marginRight:"5px"}}></icon>设备</div> :<div><icon className="fa fa-male " style={{marginRight:"5px"}}></icon>用户</div>  }</Item>
                                            <Item>{record.Number}</Item>
                                        </Flex>
                                    )
                                } ) }
                            </div>
                        </div>
                   </div>
                   );
               };
               break;
            case "device":
                renderContent= (
                    <div className="device">
                        {/* <Flex className="header"><Item>数量</Item><Item>类型</Item></Flex>
                        <Flex>
                            <Item>数量</Item><Item>类型</Item><Item>状态</Item>
                        </Flex> */}
                    </div>);
                break;
            default: return null ;

        }
        return (
            <div>
                <TopNav home title="电信码号" style={{position:"fixed",width:"100%"}}></TopNav>
                { renderContent }
            </div>
        )
      }
    };

const mapStateToProps = (state) => {
     const projectItem =  state.projectDetail.projectItem ;
     return{
          status: projectItem.status,
          data: projectItem.Data,
     }
}
const mapDispatchToProps = (dispatch) => ({
    fetchProjectDetail: ( projectID ) => {
     dispatch( fetchProjectDetail( projectID));
    },
});

//export default connect(mapStateToProps, mapDispatchToProps)(Project);
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);