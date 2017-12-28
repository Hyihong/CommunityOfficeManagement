
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { fetchProjectBuildings , SetBuildingStatus ,changeTablePage } from './actions'
import { Tabs,Table,Switch,Icon,Spin,Popover,Button } from 'antd';
import Animate  from 'rc-animate';
import { getQueryString } from '../../tools/baseTools'
import './style.less'

export const stateKey = 'project';
const TabPane = Tabs.TabPane;

//项目详情View
class Project extends React.Component {
    constructor(){
        super();
        //楼栋信息表头设置
        this.buildingColumns = 
            [
            { title: '楼栋代码',dataIndex: 'Code',key: 'Code',width:"13%",className:"Code"},
            { title: '名称', dataIndex: 'Name', key: 'Name',width:"13%"}, 
            { title: '创建用户 | 创建时间',dataIndex: 'CreateInfo',key: 'CreateInfo', width:"20%",render:( text, record )=>{
                const CreateInfo = record.CreateInfo ;
                return (
                    <div>
                        <p className="extrude"> {CreateInfo.Creator}</p>
                        <p className="smaller"><Icon type="clock-circle-o" /> {CreateInfo.Created}</p>
                    </div> 
            )}}, 
            { title: '更新用户 | 更新时间',dataIndex: 'ModifyInfo',key: 'ModifyInfo',width:"20%",render:( text, record )=>{
                const modifyInfo = record.ModifyInfo ;
                return (
                    <div>
                        <p className="extrude"> {modifyInfo.Modifier}</p>
                        <p className="smaller"><Icon type="clock-circle-o" /> {modifyInfo.Modified}</p>
                    </div> 
            )}}, 
            { title: '是否启用', dataIndex: 'Status', key: 'Status',width:"10%",render:( text, record ,index)=> {
            return (
                <div>
                <Switch checkedChildren={<Icon type="check" />} 
                        unCheckedChildren={<Icon type="cross" />} 
                        defaultChecked ={ !!Number( record.Status ) }
                        checked = { !!Number( record.Status) }
                        onChange = { ( checked ) => {
                              this.props.SetBuildingStatus( record.ID, Number( checked ),index );
                        }}>
                        
                </Switch>  
                </div>
            )
            }
            },{
            title: '操作',dataIndex: 'action',key: 'action',render:( text, record, index) =>{
            return(
                <div className="operate-btn">
                     {/* 编辑楼栋按钮=> 路由控制方式 */}
                     <Popover content={<div>编辑楼栋</div>} trigger="hover">
                        <span> <Link to={
                            {   pathname:"/home/project/building/edit",
                                search: `?id=${getQueryString( this.props.location.search,'ID' )}`,
                                state: { 
                                    modal: true,
                                    buildingID: record.ID ,
                                    code:record.Code,
                                    name : record.Name,
                                    projectID:  getQueryString( this.props.location.search,'ID' )
                                    }
                                }
                        }><Icon type="edit" style={{ fontSize: 16, color: '#08c' }}/></Link>
                        </span>
                    </Popover>
                    {/* 查看详情按钮 */}
                    <Popover content={<div>查看详情</div>} trigger="hover">
                        <span>
                            <Link to={ {pathname:"/home/project/room",
                                    search:`?id=${record.ID}`}}>
                                    <Icon type="right" style={{ fontSize: 16, color: '#08c' }}/>
                            </Link>
                        </span>
                    </Popover>
                   
                </div>
            )
            }
            }];

           this.buildingData = [] ;
    }
    componentDidMount(){ 
        //通过项目ID获取楼栋信息
        const projectID = getQueryString( this.props.location.search,'ID' );  
        //返回操作且有数据 或是 loaction中带有state (表示是弹出框操作) 时，数据不刷新
        if( ( this.props.history.action.toLowerCase() === 'pop' && !!this.props.buildingData ) || !!this.props.history.location.state){ 
             return ;
        }else{
            this.props.changeTablePage(1)
            this.props.fetchProjectBuildings( projectID );
        }
        
    }

    onPaginationChange = (page ) =>{
        this.props.changeTablePage( page )
    }

    getBodyWrapper = (body) =>{
        return (
            <Animate   className = {body.props.className} 
                             component="tbody"  
                             transitionName="table-toggle"
                             transitionAppear={true}
            >   
               { body.props.children }
            </Animate>  
        )
    }

    render(){

        const {status,forbidden } = this.props.switch ;
        let renderContent;
 
        if( this.props.buildingData ){
            this.buildingData =  this.props.buildingData;
            renderContent = (
                <div className="lee-project-item">
                    <Spin size="large" 
                        tip={ <div id="lee-switch-spin-title"><Icon type="ellipsis" spin={true}/>  <span>{`正在为您${ !!forbidden ? "启用" : "禁用" }楼栋...`} </span></div> } 
                        spinning={  status === 'loading' } 
                        /* status === 'loading' */
                        wrapperClassName="lee-switch-spin"
                        >
                                    {
                                        <div id="building-table" className="lee-table" >
                                            <Table  columns={this.buildingColumns} 
                                                    dataSource={this.buildingData}
                                                    onRowClick={ this.handleRowClick }
                                                    //getBodyWrapper = { this.getBodyWrapper}
                                                    pagination = {
                                                        this.buildingData.length > 8  ? 
                                                        {
                                                            onChange:this.onPaginationChange,
                                                            current : this.props.currentPage ,
                                                            pageSize:8,
                                                        } : false
                                                    }/>
                                        </div>
                                    }
                            </Spin>
                    </div>
            )
        }
       
        //加载状态
        return (
            <div>
                <div style={{textAlign:"right",marginBottom:"10px"}}>
                 <Link to={
                        {   
                             pathname:"/home/project/building/create",
                             search: `?id=${getQueryString( this.props.location.search,'ID' )}`,
                             state: { 
                                modal: true,
                                projectID:  getQueryString( this.props.location.search,'ID' )
                             }
                         }
                     }>
                     <Button><Icon type="plus" />新增楼栋</Button> 
                 </Link>
                </div>
                <Spin size="large" tip="正在加载项目详情数据..." spinning={ this.props.status === 'loading' } wrapperClassName="lee-loading-spin">
                {/* this.props.status === 'loading' */}
                     { renderContent }
                </Spin>
            </div>
        );
      }
    };

const mapStateToProps = (state) => {
     const buildingList =  state.building.buildingList ;
     return{
          status: buildingList.status,
          buildingData: buildingList.Data,

          switch:state.building.switch,
          currentPage:state.building.currentPage
          
     }
}
const mapDispatchToProps = (dispatch) => ({
    fetchProjectBuildings: ( projectID ) => {
     dispatch( fetchProjectBuildings( projectID));
    },
    SetBuildingStatus : (buildingID, b,index ) =>{
        dispatch( SetBuildingStatus(buildingID,b,index) );
    },
    changeTablePage :(p) =>{
        dispatch( changeTablePage( p ) );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
