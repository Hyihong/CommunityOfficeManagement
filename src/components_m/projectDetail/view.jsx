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
            listHeight:0,
            category:''
        }
     
    }
    componentDidMount(){ 
        //判断页面
        //this.category = this.props.location.pathname.split('/')[3] ;
        
        //set header style 
        // window.onscroll = function(){
        //     var t = document.documentElement.scrollTop || document.body.scrollTop;  //获取距离页面顶部的距离
        //     that.setState({
        //         headerPosition: that.state.scrollTop > t ? 'static' :'fixed'
        //     })
        //     that.setState({scrollTop:t})
        // }

        // page type
        this.setState({
            category:this.props.location.pathname.split('/')[3]
        })
        // has fetch data 
        const projectID = getQueryString( this.props.location.search,'ID' ); 
        const { data } = this.props;
        if(!!data && data.ID && data.ID === projectID){
            return;
        }
        this.props.fetchProjectDetail( projectID );
        
    }
    componentDidUpdate(nextProps){
        //get list offset
        if( this.state.listHeight === 0 && this.listbody ){
            const hei = document.documentElement.clientHeight - this.listbody.offsetTop;
            this.setState({listHeight:hei})
        }
        this.category = this.props.location.pathname.split('/')[3] ;
 
    }

    render(){
        //加载状态
        let renderContent; 
        switch ( this.state.category ){
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
                                <Item><b>码号类型</b></Item>
                                <Item><b>数量</b></Item>
                            </Flex>
                            <div className="leelen-detail-list-body" style={{height:this.state.listHeight}} ref={el => this.listbody = el }>
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
            if( !!this.props.data  && this.props.data.Device ){
                renderContent=  (
                    <div>
                        <div className="device leelen-detail-list">
                            <Flex className="header">
                                <Item style={{flex:"0 0 60px"}}>
                                    <ul className="header-status">
                                        <li key="1" style={{color:'#47cf73'}}><span style={{background:'#47cf73'}}></span>已用</li>
                                        <li key="2" style={{color:'#fe4800'}}><span style={{background:'#fe4800'}}></span>未用</li>
                                        <li key="3" style={{color:'#b7b9b8'}}><span style={{background:'#b7b9b8'}}></span>禁用</li>
                                    </ul>
                                </Item>
                                <Item style={{flex:"1 0 30%"}}><b>系列号 | 电信码号</b></Item>
                                <Item><b>类型 | 版本</b></Item>
                            </Flex>
                            <div className="leelen-detail-list-body" style={{height:this.state.listHeight}} ref={el => this.listbody = el }>
                                { this.props.data.Device.map( record =>{
                                    return (
                                        <Flex key={record.key}>
                                            <Item className="status">
                                                    <div className={record.Status === 1 ? "not-use" :( record.Status === 2 ? "used" :"disable") }> </div>
                                            </Item>
                                            <Item className="number">
                                                <div><span className="color-1">系</span>{ record.SerialNo}</div>
                                                <div><span className="color-2">码</span>{ record.CallingNumberPool}</div>
                                               
                                            </Item>
                                            <Item className="about"> 
                                                <div><span className="color-3">类</span>{ record.DeviceType === 1 ? "围墙机" :( record.DeviceType === 2 ? "单元主机" :"室内分机") }</div>
                                                <div><span className="color-4">版</span>{ record.Desc}</div>
                                            </Item>
                                        </Flex>
                                    )
                                } ) }
                            </div>
                        </div>
                   </div>
                   );
            }
            break;
            default: return <div>nothing</div> ;

        }
        return (
            <div>
                <TopNav home title= {  this.state.category ==='callingNumber'? "电信码号":"设备类型"}></TopNav>
                <Animate  transitionName="fade" transitionAppear>
                    { renderContent }
                </Animate>
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
