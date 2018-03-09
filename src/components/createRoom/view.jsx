
import React from 'react';
import { connect } from 'react-redux';
import { postCreateRoomForm } from './actions'
import { actions as roomListAction} from "../roomList"
import { Modal,Form,Input,Radio   } from 'antd';
import { withRouter } from 'react-router-dom'
import './style.less'


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { AddNewRoomToList } = roomListAction ;
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };


//判断表单是否有误
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


//创建房间view
class CreateRoomModal extends React.Component {

    componentWillReceiveProps(nextProps){
         //创建房间信息反馈
         const { status,location,history }= this.props;

         if( nextProps.status === 'success' &&  nextProps.status!== status ){
            //todo...将新数据插入房间列表
            const _new = nextProps.newRoomData ;
             console.log(_new)
            // this.props.AddNewRoomToList(_new.roomid,_new.roomcode, _new.roomname,_new.residentname, _new.residentphone,_new.residentgender);
                this.props.AddNewRoomToList({..._new})
            //end
            history.goBack()
            Modal.success({
                 title: '您已成功创建新房间！',
                 okText:<span>确定</span>,
                 onOk:()=>{
                    //this.props.history.push(`/home/project/room?id=${location.state.buildingID}`)
                 }
            });
         }else if ( nextProps.status === 'failure' &&  nextProps.status!== status){
            Modal.error({
                 title: '创建新房间失败！',
                 content: nextProps.errMsg,
                 okText:'OK'
            });
         }
    }

    handleOk = (e) => {
        const { getFieldsValue,validateFields,getFieldsError } = this.props.form;
        validateFields()
        if( hasErrors(getFieldsError()) ){
            return;
        }else{
            //提交创建房间表单信息
            const { resetFields } = this.props.form;
            const v = getFieldsValue();
            resetFields();
            this.props.postCreateRoomForm(this.props.location.state.buildingID,v.roomCode,v.roomName,v.residentName,v.tel,v.gender )

        }
    }
    //取消
    handleCancel = (e) => {
        const { resetFields } = this.props.form;
        const { history } = this.props;
        resetFields();
        e.stopPropagation()
        history.goBack()
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <Modal
                title= "新增房间"
                visible={ true }
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading = {this.props.status === "posting"}
                okText="提交"
                style={{top:"200px"}}
            >
                <Form>
                    <FormItem {...formItemLayout} label="房间代码">
                        {
                        getFieldDecorator('roomCode',{
                            rules:[
                                {transform:(transformedValue) =>{
                                    if( transformedValue === undefined ||  transformedValue === null){
                                        return undefined;
                                    }else{
                                        return transformedValue._trim();
                                    }
                                }},
                                {required:true,message:"房间代码不能为空"},
                                {pattern:/^\S+$/,message:"请勿包含空格"},
                                {max:15,message:"最多只能包含15个字符"}
                                ]
                        })(
                        <Input
                            type="text"
                            placeholder="房间代码"/>)
                        }

                    </FormItem >
                    <FormItem {...formItemLayout} label="房间名称">
                        {
                        getFieldDecorator('roomName',{
                            rules:[
                                {transform:(transformedValue) =>{
                                    if( transformedValue === undefined ||  transformedValue === null){
                                        return undefined;
                                    }else{
                                        return transformedValue._trim();
                                    }
                                }},
                                {required:true,message:"房间名称不能为空"},
                                {pattern:/^\S+$/,message:"请勿包含空格"},
                                {max:15,message:"最多只能包含15个字符"}
                                ]
                        })(
                        <Input
                            type="text"
                            placeholder="房间名称"/>)
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="业主姓名">
                        {
                        getFieldDecorator('residentName',{
                            rules:[
                                {transform:(transformedValue) =>{
                                    if( transformedValue === undefined ||  transformedValue === null){
                                        return undefined;
                                    }else{
                                        return transformedValue._trim();
                                    }
                                }},
                                {required:true,message:"业主姓名不能为空"},
                                {pattern:/^\S+$/,message:"请勿包含空格"},
                                {max:10,message:"最多只能包含10个字符"}
                                ]
                        })(
                        <Input
                            type="text"
                            placeholder="业主姓名"/>)
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="业主电话">
                        {
                        getFieldDecorator('tel',{
                            rules:[
                                {required:true,message:"业主电话不能为空"},
                                {pattern:/^\S+$/,message:"请勿包含空格"},
                                ]
                        })(
                        <Input
                            type="text"
                            placeholder="业主电话"/>)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                            label="业主性别"
                        > {
                            getFieldDecorator('gender',{
                                initialValue:"1",
                                rules:[]
                            })(
                                <RadioGroup>
                                    <Radio value="1">男</Radio >
                                    <Radio value="2">女</Radio >
                                </RadioGroup>
                            )
                        }
                    </FormItem>
                </Form>
          </Modal>
        )
    }

}

CreateRoomModal = Form.create({})(CreateRoomModal);


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
});

export default   withRouter ( connect(mapStateToProps, mapDispatchToProps)(CreateRoomModal) );
