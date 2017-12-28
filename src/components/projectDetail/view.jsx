import React from 'react';
import { connect } from 'react-redux';
import { fetchProjectBuildings , changeTablePage } from './actions'
import { Tabs,Table,Spin} from 'antd';
import { Return} from '../shared'
import Animate  from 'rc-animate';
import { getQueryString } from '../../tools/baseTools'
import './style.less'

export const stateKey = 'project';
const TabPane = Tabs.TabPane;

//项目详情View
class ProjectDetail extends React.Component {
    constructor(){
        super();
        //电信码号表头设置
        this.callingNumberPoolColumns = 
            [{ title: '数量', dataIndex: 'Number', key: 'Number',}, 
            { title: '类型',dataIndex: 'Type',key: 'Type',render:(text,record) =>{
                return record.Type ? '设备码号' :"用户码号" 
            }}, 
            { title: '状态',dataIndex: 'Status',key: 'Status',render: ( text,record) =>{
                return record.Status === 1 ? "未使用" :( record.Status === 2 ? "已使用" :"禁用") 
            }},
            ];

        //设备信息表头设置
        this.deviceColumns = 
            [{ title: '系列号', dataIndex: 'SerialNo', key: 'SerialNo',}, 
            { title: '设备类型',dataIndex: 'DeviceType',key: 'DeviceType',render: ( text,record) =>{
                return record.Status === 1 ? "围墙机" :( record.Status === 2 ? "单元主机" :"室内分机") 
            }},
            { title: '电信码号',dataIndex: 'CallingNumberPool',key: 'CallingNumberPool'},
            { title: '设备版本',dataIndex: 'Desc',key: 'Desc',}, 
            { title: '状态',dataIndex: 'Status',key: 'Status',render: ( text,record) =>{
                return record.Status === 1 ? "未使用" :( record.Status === 2 ? "已使用" :"禁用") 
            }},
        ];
        this.buildingData = [] ;
    }
    componentDidMount(){ 
        //通过项目ID获取楼栋信息
        const projectID = getQueryString( this.props.location.search,'ID' );  
        this.props.changeTablePage(1)
        this.props.fetchProjectBuildings( projectID );
        
        
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
        let CallingNumberPoolData,deviceData ;
        let renderContent;
        if( this.props.data && this.props.data.length !==0){
            let data = this.props.data ;
            CallingNumberPoolData = data.CallingNumberPool;
            deviceData = data.Device;
            renderContent = (
                <div className="lee-project-item">
                                <Tabs defaultActiveKey="1">
                                        <TabPane tab="电信码号" key="1">
                                            <div id="dianxin-table" className="lee-table">
                                                <Table  columns={this.callingNumberPoolColumns} 
                                                        dataSource={CallingNumberPoolData}
                                                        pagination = {  CallingNumberPoolData && CallingNumberPoolData.length > 10 }  />
                                            </div>
                                        </TabPane>
                                        <TabPane tab="设备列表" key="2" >
                                            <div id="device-table" className="lee-table">
                                                <Table  columns={this.deviceColumns} dataSource={deviceData} 
                                                pagination = {  deviceData && deviceData.length > 10 } 
                                                />
                                            </div>
                                        </TabPane>
                                </Tabs>
                    </div>
            )
        }
        //加载状态
        return (
            <div>
                <Return>项目详情</Return>
                <Spin size="large" tip="正在加载项目详情数据..." spinning={ this.props.status === 'loading' } wrapperClassName="lee-loading-spin">
                {/* this.props.status === 'loading' */}
                     { renderContent }
                </Spin>
            </div>
        );
      }
    };

const mapStateToProps = (state) => {
     const projectItem =  state.projectDetail.projectItem ;
     return{
          status: projectItem.status,
          data: projectItem.Data,
          currentPage:state.building.currentPage
          
     }
}
const mapDispatchToProps = (dispatch) => ({
    fetchProjectBuildings: ( projectID ) => {
     dispatch( fetchProjectBuildings( projectID));
    },
    changeTablePage :(p) =>{
        dispatch( changeTablePage( p ) );
    }
});

//export default connect(mapStateToProps, mapDispatchToProps)(Project);
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);