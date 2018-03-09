
import React from 'react';
import { connect } from 'react-redux';
import { postEditForm  } from './actions'
import { actions as buildingListAction} from "../building"
import { Modal,Form,Input  } from 'antd';
import './style.less'
 
const FormItem = Form.Item;
const { editBuildingData } = buildingListAction ;

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


//编辑楼栋View
class EditBuildingModal extends React.Component {
    componentWillReceiveProps(nextProps){
        const { status,history,location }= this.props;
            if( nextProps.status!== status ){
                if( nextProps.status === 'success'){
                //更新楼栋信息
                const editData = nextProps.editData ;
                this.props.editBuildingData( {ID:location.state.buildingID,...editData});
                history.goBack();
                Modal.success({
                        title: '更新楼栋信息成功！',
                        okText:<span>确定</span>,
                });
            }else if ( nextProps.status === 'failure' &&  nextProps.status!== status){
                Modal.error({
                        title: '更新楼信息栋失败！',
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
            //提交编辑楼栋表单信息
            const { resetFields } = this.props.form;
            const { history,location } = this.props;
            
            const v = getFieldsValue();
            //trim()
            let buildingCode = v.buildingCode._trim();
            let buildingName = v.buildingName._trim();

            if( location.state.code === buildingCode && location.state.name === buildingName){
                //不提交
                resetFields();
                Modal.warning({
                    title: '您未进行修改!',
                    okText:'确定'
                });
                history.goBack();
                return;
            }
            
            this.props.postEditForm(location.state.buildingID,location.state.projectID,buildingCode,buildingName)
            e.stopPropagation();
            //history.goBack()
        }
    }
    //取消
    handleCancel = (e) => {
        const { resetFields } = this.props.form;
        const { history,location } = this.props;
        //console.log( "该API是否是模拟的：",window.history.emulate)
        resetFields();
        e.stopPropagation();
        if( window.history.emulate ){
            
        }

        history.goBack();
        //console.log( history.goBack );
       
    }
    render(){

        const { getFieldDecorator } = this.props.form;
        const { state } = this.props.location;
        
        return(
            <Modal
                title= "编辑楼栋" 
                visible={ true }
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading = {this.props.status === "posting"}
                okText="提交"
            >
                <Form>
                    <FormItem {...formItemLayout} label="楼栋代码">
                        {
                        getFieldDecorator('buildingCode',{
                            initialValue:state.code,
                            
                            rules:[
                                 {transform:(transformedValue) =>{
                                     return transformedValue._trim();
                                 }},
                                {required:true,message:"楼栋代码不能为空"},
                                {pattern:/^\S+$/,message:"请勿包含空格"},
                                {whitespace:true,message:"请勿输入空格"},
                                {max:15,message:"最多只能包含15个字符"},
                                ]
                        })(
                        <Input
                            type="text" 
                            placeholder="楼栋代码"/>)
                        }
                    </FormItem >
                    <FormItem {...formItemLayout} label="楼栋名称">
                        {
                        getFieldDecorator('buildingName',{
                            initialValue:state.name,
                            rules:[
                                {transform:(transformedValue) =>{
                                     return transformedValue._trim();
                                 }},
                                 {required:true,message:"楼栋名称不能为空"},
                                {pattern:/^\S+$/,message:"请勿包含空格"},
                                {max:15,message:"最多只能包含15个字符"}
                                ]
                        })(
                        <Input
                            type="roomName" 
                            placeholder="楼栋名称"/>)
                        }
                    </FormItem>
                </Form>
          </Modal>
        )
    }

}

EditBuildingModal = Form.create({})(EditBuildingModal);


const mapStateToProps = (state) => {
    const editBuilding =  state.editBuilding ;
    return{
         status: editBuilding.status,
         editData:editBuilding.Data,
         errMsg:editBuilding.Message,
    }
}

const mapDispatchToProps = (dispatch) => ({ //楼栋ID,项目ID,楼栋代码，楼栋名称
    postEditForm:(id,projectID,code,name)=>{
        dispatch( postEditForm( id,projectID,code,name ))
    },
    editBuildingData:(id,code,name)=>{
        dispatch( editBuildingData( id,code,name ))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBuildingModal);
