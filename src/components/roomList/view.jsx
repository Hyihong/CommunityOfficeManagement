
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { fetchRoomInfo } from './actions'
import { Table,Spin,Modal,Popover ,Icon,Button  } from 'antd';
import { Error } from '../shared'
import { getQueryString } from '../../tools/baseTools'
import './style.less'

export const stateKey = 'project';
 
class Project extends React.Component {
    constructor(){
        super();
        this.state = {
            customersModal:{
                visible:false,
                data:[]
            }
        }
        this.roomColumns =  [
            { title: '房间代码',dataIndex: 'Code',key: 'Code',className:"Code"}, 
            { title: '房间号', dataIndex: 'Name', key: 'Name',}, 
            { title: '业主姓名',dataIndex: 'ResidentName',key: 'ResidentName' }, 
            { title: '电话',dataIndex: 'ResidentPhone',key: 'ResidentPhone'}, 
            { title: '是否启用', dataIndex: 'Status', key: 'Status',render: ( text,record) =>{
                return record.Status === 1 ? "已启用" :"未启用" 
            }},
            {
                title:"成员",dataIndex:"customers",key:"customers",render:( text,record ) =>{
                    if( !!record && record.Customers.length > 0){
                        return <a onClick = { () => this.checkCustomers(record) }><span> {record.Customers.length}人</span></a>
                    }else{
                        return "无"
                    }
                   
                }
            },{
               title:"操作",dataIndex:"action",key:"action",render:(text,record) =>{
                return(
                    <div className="operate-btn">
                         {/* 编辑楼栋按钮=> 路由控制方式 */}
                         <Popover content={<div>编辑房间</div>} trigger="hover">
                            <span> <Link to={
                                {   pathname:"/home/project/room/edit",
                                search: `?id=${getQueryString( this.props.location.search,'ID' )}`,
                                    state: { 
                                        modal: true,
                                        roomID: record.ID ,
                                        buildingID:  getQueryString( this.props.location.search,'ID' ),
                                        code:record.Code,
                                        name : record.Name,
                                        residentName:record.ResidentName,
                                        residentPhone:record.ResidentPhone
                                        }
                                    }
                            }><Icon type="edit" style={{ fontSize: 16, color: '#08c' }}/></Link>
                            </span>
                        </Popover>
                    </div>
                        )
               }
            }
        ];
    }
    componentDidMount(){ 
        //通过楼栋ID获取房间
        const buildingID = getQueryString( this.props.location.search,'ID' );  
          //返回操作且有数据 或是 loaction中带有state (表示是弹出框操作) 时，数据不刷新
        if( ( this.props.history.action.toLowerCase() === 'pop' && !!this.props.data ) || !!this.props.history.location.state){ 
            return ;
        }else{
            this.props.fetchRoomInfo( buildingID );
        }
        
    }
    //查看成员列表
    checkCustomers =( record ) =>{
        this.setState({
            customersModal:{
                visible:true,
                data:record.Customers
            }
        })
    }
    //关闭成员列表
    handleCustomersModalOK = () =>{
        this.setState({
            customersModal:{
                ...this.state.customersModal,
                visible:false,
            }
        })
    }
    render(){
        let { status ,data} = this.props;

        //成员列表信息
        let { customersModal } = this.state;    
        customersModal.data.map( item =>{
             if( item.BindingStatus){
                item.BindingStatus = '已开通'
             }else{
                item.BindingStatus = '未开通'
             }
             return null;

        })
        let renderContent;
        if(status === 'success'){
            renderContent = (  
                                <div id="room-table" className="lee-table">
                                    <Table  columns={this.roomColumns} 
                                        dataSource={data} 
                                        pagination = {  data.length > 10 } />
                                </div>
                             )
           }else if( status === 'failure'){
            renderContent=( <Error onClick={ () => this.props.fetchRoomInfo()}/> )
        }
        return (
          <div> 
                {/* 新增房间 */}
                <div style={{textAlign:"right",marginBottom:"10px"}}>
                            <Link to={
                                   {   
                                        pathname:"/home/project/room/create",
                                        search: `?id=${getQueryString( this.props.location.search,'ID' )}`,
                                        state: { 
                                           modal: true,
                                           buildingID:  getQueryString( this.props.location.search,'ID' )
                                        }
                                    }
                                }>
                                <Button><Icon type="plus" />新增房间</Button> 
                            </Link>
                </div>
                <Spin size="large" tip="正在加载房间数据..." spinning={  this.props.status === 'loading' }> 
                         {/* this.props.status === 'loading' */}
                         {renderContent}
                </Spin>
                {/* 成员列表 */}
                <Modal
                    title="成员信息"
                    className = "lee-customers-modal"
                    width ="50%"
                    closable = { false }
                    visible={ customersModal.visible }
                    footer = { <div className="close" onClick = {this.handleCustomersModalOK} >关闭</div>}
                    >
                    <Table columns = {
                         [ { title: '子房间号',dataIndex: 'VirtualCode',key: 'VirtualCode',},
                         { title: '姓名',dataIndex: 'CustomerName',key: 'CustomerName',},
                         { title: '电话',dataIndex: 'CustomerPhone',key: 'CustomerPhone',} ,
                         { title: '云对讲',dataIndex: 'BindingStatus',key: 'BindingStatus',}]
                    }
                         dataSource = { customersModal.data }
                         size = "small"
                         pagination = {false}
                         bordered = { false } >
                    </Table>
                </Modal>
          </div>
        );
      }
    };
    

const mapStateToProps = (state) => {
     const room =  state.room ;
     return{
          status: room.status,
          data:  room.Data,
     }
}
const mapDispatchToProps = (dispatch) => ({
    fetchRoomInfo: ( buildingID ) => {
     dispatch( fetchRoomInfo( buildingID));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
