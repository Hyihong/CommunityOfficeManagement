
import React from 'react';
import { connect } from 'react-redux';
import { postCreateBuildingForm } from './actions'
import { actions as buildingListAction} from "../building"
import { Modal,Form,Input} from 'antd';
import { withRouter } from 'react-router-dom'
import './style.less'


const FormItem = Form.Item;
const { AddNewBuildingToList } = buildingListAction ;
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


//创建楼栋view
class CreateBuildingModal extends React.Component {

    componentWillReceiveProps(nextProps){
         //创建楼栋信息反馈
         const { status,history }= this.props;

         if( nextProps.status === 'success' &&  nextProps.status!== status ){
            //将新数据插入楼栋列表
            const _new = nextProps.newBuildingData ;
            this.props.AddNewBuildingToList({..._new});
    
            //end
            history.goBack()
            Modal.success({
                 title: '您已成功创建新楼栋！',
                 okText:<span>确定</span>,
            });
         }else if ( nextProps.status === 'failure' &&  nextProps.status!== status){
            Modal.error({
                 title: '创建新楼栋失败！',
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
            //提交创建楼栋表单信息
            const { resetFields } = this.props.form;
            const v = getFieldsValue();
            resetFields();
            console.log( this.props.location.state.projectID)
            this.props.postCreateBuildingForm(this.props.location.state.projectID,v.buildingCode._trim(),v.buildingName._trim() )

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
                title= "新增楼栋"
                visible={ true }
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading = {this.props.status === "posting"}
                okText="提交"
                style={{top:"200px"}}
            >
                <Form>
                    <FormItem {...formItemLayout} label="楼栋代码">
                        {
                        getFieldDecorator('buildingCode',{
                            rules:[
                                {transform:(transformedValue) =>{
                                    if( transformedValue === undefined ||  transformedValue === null){
                                         return undefined;
                                    }else{
                                        return transformedValue._trim();
                                    }
                                }},
                                {required:true,message:"楼栋代码不能为空"},
                                {pattern:/^\S+$/,message:"请勿包含空格"},
                                {max:15,message:"最多只能包含15个字符"}
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
                            rules:[
                                {transform:(transformedValue) =>{
                                    if( transformedValue === undefined ||  transformedValue === null){
                                        return undefined;
                                    }else{
                                       return transformedValue._trim();
                                   }
                                }},
                                {required:true,message:"楼栋代码不能为空"},
                                {pattern:/^\S+$/,message:"请勿包含空格"},
                                {max:15,message:"最多只能包含15个字符"}
                                ]
                        })(
                        <Input
                            type="text"
                            placeholder="楼栋名称"/>)
                        }
                    </FormItem>
                </Form>
          </Modal>
        )
    }

}

CreateBuildingModal = Form.create({})(CreateBuildingModal);


const mapStateToProps = (state) => {
    const createBuilding =  state.createBuilding ;
    return{
         status:createBuilding.status,
         errMsg:createBuilding.Message,
         newBuildingData:createBuilding.Data,
         showSuccess:createBuilding.showSuccess
    }
}

const mapDispatchToProps = (dispatch) => ({
    postCreateBuildingForm:(id,code,name)=>{ 
        dispatch( postCreateBuildingForm(id,code,name) )
    },
    AddNewBuildingToList:(roomId,code,name,residentName,tel,gender)=>{
        dispatch( AddNewBuildingToList(roomId,code,name,residentName,tel,gender) )
    },
});

export default  withRouter ( connect(mapStateToProps, mapDispatchToProps)(CreateBuildingModal) );
