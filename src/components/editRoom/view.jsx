
import React from 'react';
import { connect } from 'react-redux';
import { postEditForm  } from './actions'
import { actions as roomListAction} from "../roomList"
import { Modal,Form,Input,Radio  } from 'antd';
import './style.less'
 
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { editRoomData } = roomListAction ;

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


//编辑房间View
class EditBuildingModal extends React.Component {

    componentWillReceiveProps(nextProps){
 
        const { status,history,location }= this.props;
            
            if( nextProps.status!== status ){
                if( nextProps.status === 'success'){
                //更新房间信息
                const editData = nextProps.editData ;
                this.props.editRoomData( {ID:location.state.buildingID,...editData});
                history.goBack();
                Modal.success({
                        title: '更新房间信息成功！',
                        okText:<span>确定</span>,
                });
            }else if ( nextProps.status === 'failure' &&  nextProps.status!== status){
                Modal.error({
                        title: '更新房间信息栋失败！',
                        content: nextProps.errMsg,
                        okText:'OK'
                });
         }}
    }

    handleOk = (e) => {
        const { getFieldsValue,validateFields,getFieldsError } = this.props.form;
        validateFields()
        if( hasErrors(getFieldsError()) ){
           return
        }else{
            //提交编辑房间表单信息
            const { resetFields } = this.props.form;
            const { history,location } = this.props;
            const _ =  location.state;
            const v = getFieldsValue();
            //trim()
            Object.keys(v).map((key)=>{
                v[key] = v[key]._trim();
            })

            if( _.code === v.buildingCode && _.name === v.buildingName && _.residentName === v.residentName && _.residentPhone === v.residentPhone && _.residentGender === v.residentGender){
                //不提交
                resetFields();
                Modal.warning({
                    title: '您未进行修改!',
                    okText:'确定'
                });
                history.goBack();
                return;
            }
            this.props.postEditForm(_.roomID,_.buildingID, v.buildingCode,v.buildingName,v.residentName,v.residentPhone,v.residentGender);
            e.stopPropagation();
        }
    }
    //取消
    handleCancel = (e) => {
        const { resetFields } = this.props.form;
        const { history } = this.props;
        resetFields();
        e.stopPropagation();
        history.goBack();
        //console.log( history.goBack );
       
    }
    render(){

        const { getFieldDecorator } = this.props.form;
        const { state } = this.props.location;
        return(
            <Modal
                title= "编辑房间" 
                visible={ true }
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading = {this.props.status === "posting"}
                okText="提交"
            >
                <Form>
                    <FormItem {...formItemLayout} label="房间代码">
                        {
                        getFieldDecorator('buildingCode',{
                            initialValue:state.code,
                            
                            rules:[
                                 {transform:(transformedValue) =>{
                                     return transformedValue._trim();
                                 }},
                                {required:true,message:"房间代码不能为空"},
                                {pattern:/^\S+$/,message:"请勿包含空格"},
                                {whitespace:true,message:"请勿输入空格"}
                                ]
                        })(
                        <Input
                            type="text" 
                            placeholder="房间代码"/>)
                        }
                    </FormItem >
                    <FormItem {...formItemLayout} label="房间名称">
                        {
                        getFieldDecorator('buildingName',{
                            initialValue:state.name,
                            rules:[
                                {transform:(transformedValue) =>{
                                     return transformedValue._trim();
                                 }},
                                 {required:true,message:"房间名称不能为空"},
                                {pattern:/^\S+$/,message:"请勿包含空格"},
                                ]
                        })(
                        <Input
                            type="roomName" 
                            placeholder="房间名称"/>)
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="业主名称">
                        {
                        getFieldDecorator('residentName',{
                            initialValue:state.residentName,
                            rules:[
                                {transform:(transformedValue) =>{
                                     return transformedValue._trim();
                                 }},
                                 {required:true,message:"业主名称不能为空"},
                                {pattern:/^\S+$/,message:"请勿包含空格"},
                                ]
                        })(
                        <Input
                            type="roomName" 
                            placeholder="业主名称"/>)
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="业主电话">
                        {
                        getFieldDecorator('residentPhone',{
                            initialValue:state.residentPhone,
                            rules:[
                                {transform:(transformedValue) =>{
                                     return transformedValue._trim();
                                 }},
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
                        getFieldDecorator('residentGender',{
                            initialValue:state.residentGender,
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

EditBuildingModal = Form.create({})(EditBuildingModal);


const mapStateToProps = (state) => {
    const editRoom =  state.editRoom ;
    return{
         status: editRoom.status,
         editData:editRoom.Data,
         errMsg:editRoom.Message,
    }
}

const mapDispatchToProps = (dispatch) => ({
    postEditForm:(roomID,buildingID,code,name,rname,rphone,rgender)=>{
        dispatch( postEditForm( roomID,buildingID,code,name,rname,rphone,rgender ))
    },
    editRoomData:(id,code,name)=>{
        dispatch( editRoomData( id,code,name ))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBuildingModal);
