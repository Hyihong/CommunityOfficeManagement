
import React from 'react';
import { connect } from 'react-redux';
import { postCreateRoomForm } from './actions'
import { Radio,Toast,InputItem, List,WhiteSpace  } from 'antd-mobile';
import { createForm } from 'rc-form';
import { withRouter } from 'react-router-dom'
import { actions as roomListAction} from "../roomList"
import { getQueryString } from '../../tools/baseTools'


import './style.less'
import img_building from "../../assets/images_m/building_2.png"

import TopNav from '../shared/views/TopNav'

const { AddNewRoomToList,fetchRoomInfo } = roomListAction ;
const RadioItem = Radio.RadioItem;

//判断表单是否有误
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


//创建房间view
class CreateBuilding extends React.Component {
    constructor(props){
        super(props)
        this.state={
            gender:"1"
        }
    }
    componentDidMount(){
         if(!!this.props.bdData){
             return;
         }else{
            this.props.fetchRoomInfo(this.props.location.state.buildingID)
         }
    }
    componentWillReceiveProps(nextProps){
         //创建房间信息反馈
         const { status,history }= this.props;
         if( nextProps.status === 'success' &&  nextProps.status!== status ){
             console.log("创建房间成功")
            //将新数据插入房间列表
            console.log(nextProps.newRoomData )
            this.props.AddNewRoomToList( {...nextProps.newRoomData} );
            Toast.success("创建房间成功！",1.5);
            setTimeout( ()=>{
                history.goBack()
            },1500)
         }else if ( nextProps.status === 'failure' &&  nextProps.status!== status){
            Toast.fail("创建房间失败:"+nextProps.errMsg)
         }
    }

    onSubmit=()=>{
        const { validateFields } = this.props.form;
        validateFields((error, value) => {
              if( error == null){
                  //填写信息无误，提交修改信息
                  const {roomCode,roomName,residentName,tel} = value;
                  this.props.postCreateRoomForm( this.props.location.state.buildingID,roomCode,roomName,residentName,tel,this.state.gender);
              }else{
                  //表单验证错误
                  let errMsgArr=[];
                  Object.values(error).map( item =>{
                    errMsgArr.push( item.errors[0].message);
                  }) 
                  Toast.info( errMsgArr.map( (i,idx) => <div key={idx}>{ i } </div>), 4);
              }
        });
    }
    onRadioChange =(f)=>{
           if( this.state.gender !== f){
                this.setState({
                    gender:f
                })
           };
    }
    render(){
        const { getFieldProps } = this.props.form;
        return(
             <div>
                  <TopNav home title="新增房间"  check onCheckClick={ this.onSubmit }></TopNav>
                  <WhiteSpace></WhiteSpace> 
                    <div style={{textAlign:"center",margin:"10px 0"}}>
                       <img src={ img_building } alt="" style={{width:"20%"}}/>
                    </div>
                  <div className="leelen-create-building">
                        <List>  
                            <div className="leelen-input-section">
                                <p className="tip">房间代码</p>
                                <InputItem 
                                    {...getFieldProps('roomCode',{
                                        rules: [{required: true,message:"房间代码不能为空"},{pattern:/^\S+$/,message:"房间代码请勿包含空格"}],
                                    })} 
                                    placeholder="请输入房间代码"
                                    >
                                </InputItem>
                            </div>
                            <WhiteSpace></WhiteSpace>
                            <div className="leelen-input-section">
                                <p className="tip">房间名称</p>
                                <InputItem 
                                    {...getFieldProps('roomName',{
                                        rules: [{required: true,message:"房间名称不能为空"},{pattern:/^\S+$/,message:"房间名称请勿包含空格"}],
                                    })} 
                                    placeholder="请输入房间名称"
                                    >
                                </InputItem>
                            </div>
                            <WhiteSpace></WhiteSpace>
                            <div className="leelen-input-section">
                                <p className="tip">业主名称</p>
                                <InputItem 
                                    {...getFieldProps('residentName',{
                                        rules: [{required: true,message:"业主名称不能为空"},{pattern:/^\S+$/,message:"业主名称请勿包含空格"}],
                                    })} 
                                    placeholder="请输入业主名称"
                                    >
                                </InputItem>
                            </div>
                            <WhiteSpace></WhiteSpace>
                            <div className="leelen-input-section">
                                <p className="tip">联系电话</p>
                                <InputItem 
                                    {...getFieldProps('tel',{
                                        rules: [{required: true,message:"联系电话不能为空"},{pattern:/^\S+$/,message:"联系电话请勿包含空格"}],
                                    })} 
                                    type="number"
                                    placeholder="请输入联系电话"
                                    >
                                </InputItem>
                            </div>
                            <div className="tip" style={{marginTop:"10px"}}>业主性别
                                <Radio name="gender"  checked={this.state.gender === "1"} onChange={() => this.onRadioChange("1")}>男</Radio> 
                                <Radio name="gender"  checked={this.state.gender === "0"}onChange={() => this.onRadioChange("0")}>女</Radio> 
                            </div>
                            
                        </List> 
                  </div>
             </div>
        )
    }
}

CreateBuilding = createForm()(CreateBuilding);


const mapStateToProps = (state) => {
    const createRoom =  state.createRoom ;
    return{
         status:createRoom.status,
         errMsg:createRoom.Message,
         newRoomData:createRoom.Data,
         showSuccess:createRoom.showSuccess
    }
}

const mapDispatchToProps = (dispatch) => ({
    postCreateRoomForm:(id,code,name,residentName,tel,gender)=>{
        dispatch( postCreateRoomForm(id,code,name,residentName,tel,gender) )
    },
    AddNewRoomToList:(roomId,code,name,residentName,tel,gender)=>{
        dispatch( AddNewRoomToList(roomId,code,name,residentName,tel,gender) )
    },
    fetchRoomInfo:(id)=>{
        dispatch( fetchRoomInfo(id) )
    }
});

export default  withRouter ( connect(mapStateToProps, mapDispatchToProps)(CreateBuilding) );
