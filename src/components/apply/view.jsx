
import React from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom'
import { postApplyForm } from './actions'
import { Form, Icon, Input, Button,Modal,Checkbox,InputNumber,Spin  } from 'antd';
import { view as Organizations,actions as OrzActions } from '../organizations'
import { actions as projectListActions } from '../projectList'
import { view as ChinaDivision } from '../chinaDivision'
import './style.less'
import {setPlaceholder} from '../../tools/baseTools'
const FormItem = Form.Item;
const InputGroup = Input.Group;
const CheckboxGroup = Checkbox.Group;
const  { fetchORZs,fetchORZsWithProject } = OrzActions ; 
const  { fetchAllProjects } = projectListActions;


 //label样式
 const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
    },
};


//判断表单内是否有错误
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

//首次验证_trim()
function validateTrim(v){
     return v === undefined ? v : v._trim();
}

class Apply extends React.Component{ 
componentWillMount(){
    this.state = {
        city:""
    }
    if( !this.props.orzAll.Data){
        this.props.fetchORZs()//获取所有组织机构
    }
}
componentDidMount(){
    //验证
    this.props.form.validateFields();
    setPlaceholder();
}
componentWillReceiveProps(nextProps){
    if(nextProps.status !== this.props.status ){
        if(nextProps.status==='success'){
            Modal.confirm({
                title:"您所申请的项目已成功提交",
                okText:"前往项目列表",
                cancelText:"继续申请",
                onOk:()=>{                    
                    //刷新项目列表数据
                    this.props.fetchORZsWithProject();
                    this.props.fetchAllProjects();
                    this.props.history.push("/home/projectList")
                },
                onCancel:()=>{
                    this.props.form.resetFields();
                    this.setState({city: []});
                    document.getElementById("detailAddress").value = "";

                    //刷新项目列表数据,留在本页
                    this.props.fetchORZsWithProject();
                    this.props.fetchAllProjects();
                }
            })
        }else if(nextProps.status==='failure'){
            Modal.error({
                title:"项目创建失败！",
                okText:"确定",
                content: nextProps.errMsg,
            })
    
        }
    }
}

handleSubmit =(e)=>{
    e.preventDefault();
    const {  getFieldsError,validateFields,getFieldsValue } = this.props.form;
    validateFields();

    if( hasErrors(getFieldsError())){
        return;
    }else{
        //*******提交申请 ******
        let {  name, organizationId, master, contactor, contact, deviceCount,desc, deviceTypeList } = getFieldsValue();
        //拼接地址
        let address = this.state.cityString  ? this.state.cityString: '' + document.getElementById("detailAddress").value;
        this.props.postApplyForm(    
            name._trim(),
            organizationId[organizationId.length -1 ],
            master._trim(),
            contactor._trim(),
            contact._trim(),
            deviceCount,
            this.state.cityString  ? this.state.cityString: '',
            document.getElementById("detailAddress").value,
            desc,
            deviceTypeList.join(',')
        )
    }
   
}
changeCity = (value, selectedOptions) =>{
     this.setState({
         cityString: value.join(""),
         city:value,
     })
}


render(){
const { getFieldDecorator,isFieldTouched, getFieldError} = this.props.form;

const errArr = ["name","organizationId","master","contactor","contact","deviceTypeList"].map( (item)=>{
    return isFieldTouched(item) && getFieldError(item) ;
})

return (
    <Spin tip="正在申请..."  size="large" spinning={this.props.status === 'posting'} >
    <div className="lee-apply">
        <Form onSubmit={this.handleSubmit}>
            <FormItem
                 {...formItemLayout}
                 label="项目名称"
                 validateStatus={ errArr[0] ? 'error' : ''}
                 help={ errArr[0] || ''}
            >{
                getFieldDecorator('name',{
                    rules:[
                        {transform:(transformeValue) =>{ return validateTrim(transformeValue) } },
                        {required: true,message: '项目名称不能为空',},
                        {pattern:/^\S+$/,message:"格式错误，请勿包含空格"},
                        {max:100,message: '项目名称长度不能超过100',}]
                })(
                    <Input size="large" prefix={<Icon type="cloud-o" />} placeholder="项目名称"/>
                )
            }

            </FormItem>
            <FormItem
                 {...formItemLayout}
                 label="组织机构"
                 validateStatus={ !!errArr[1] ? 'error' : ''}
                 help={ errArr[1] || ''}
            >
            {
                getFieldDecorator('organizationId',{
                    initialValue:[],
                    rules:[{
                        required: true,
                        message: '请选择组织机构',
                    }]
                })(
                    <Organizations orzOptions = { this.props.orzAll.Data}
                                    status = { this.props.orzAll.status}>
                    </Organizations>
                )
            }

            </FormItem>
            <FormItem
                 {...formItemLayout}
                 label="负责人"
                 validateStatus={ !!errArr[2] ? 'error' : ''}
                 help={ errArr[2] || ''}
            >
            {
                getFieldDecorator('master',{
                    rules:[
                        { transform:(transformeValue) =>{ return validateTrim(transformeValue)} },
                        { required: true,message: '负责人不能为空',},
                        { pattern:/^\S+$/,message:"格式错误，请勿包含空格" },
                        { max:50,message: '负责人名称长度不能超过50',}]
                })(
                    <Input prefix={<Icon type="user"  />} placeholder="负责人" />
                )
            }
            </FormItem>
            <FormItem
                 {...formItemLayout}
                 label="联系人"
                 validateStatus={ !!errArr[3] ? 'error' : ''}
                 help={ errArr[3] || ''}
            >
            {
                getFieldDecorator('contactor',{
                    rules:[
                        { transform:(transformeValue) =>{return validateTrim(transformeValue)} },
                        { required: true,message: '联系人不能为空' },
                        { pattern:/^\S+$/,message:"格式错误，请勿包含空格" },
                        { max:50, message: '联系人名称长度不能超过50'}]
                })(
                    <Input prefix={<Icon type="user-add" />} placeholder="联系人" />
                )
            }
            </FormItem>
            <FormItem
                 {...formItemLayout}
                 label="联系方式"
                 validateStatus={ !!errArr[4] ? 'error' : ''}
                 help={ errArr[4] || ''}
            > {
                getFieldDecorator('contact',{
                    rules:[
                        { transform:(transformeValue) =>{return validateTrim(transformeValue)} },
                        { required: true,message: '联系方式不能为空'},
                        { pattern:/^\S+$/,message:"格式错误，请勿包含空格" },
                        { max:13, message: '请输入合法联系方式',}
                    ]
                })(
                    <Input prefix={<Icon type="mobile" />} placeholder="联系方式" />
                )
            }
            </FormItem>
            <FormItem
                 {...formItemLayout}
                 label="设备类型"
                 validateStatus={ !!errArr[5] ? 'error' : ''}
                 help={ errArr[5] || ''}
            > {
                getFieldDecorator('deviceTypeList',{
                    rules:[{
                        required: true,
                        message: '请选择设备类型',
                    }]
                })(
                    <CheckboxGroup>
                          <Checkbox value="4">室内分机</Checkbox>
                          <Checkbox value="1">围墙机</Checkbox>
                          <Checkbox value="2">单元主机</Checkbox>
                    </CheckboxGroup>
                )
            }
            </FormItem>
            <FormItem
                 {...formItemLayout}
                 label="设备数量"
            > {
                getFieldDecorator('deviceCount',{
                    initialValue:1
                })(
                    <InputNumber  min={1} max={2147483647} style={{width:"100%"}}/>
                )
            }
            </FormItem>
            <FormItem
                 {...formItemLayout}
                 label="地址"
            >
                    <InputGroup compact>
                           <ChinaDivision width="35%" bgColor="#f7f7f7" onChange= { this.changeCity } value={this.state.city}></ChinaDivision>
                           <Input  id="detailAddress" placeholder="详细地址" style={{width:"65%"}}/>
                    </InputGroup>
            </FormItem>
            <FormItem
                 {...formItemLayout}
                 label="描述"
            > {
                getFieldDecorator('desc',{

                })(
                    <Input prefix={<Icon type="edit" />} placeholder="描述" />
                )
            }

            </FormItem>
            <div style={{textAlign:"center",marginTop:"30px"}}>
                 <Button type="primary" style={{width:"35%"}} disabled={ hasErrors(this.props.form.getFieldsError())} onClick = {this.handleSubmit}> 提交申请</Button>
            </div>
        </Form>
    </div>
    </Spin>

);
};
}


const WrappedApply = Form.create()(Apply);
const mapStateToProps = (state) => {
    const apply =  state.apply ;
    const organizations = state.organizations;
    return{
         status:apply.status, 
         orzAll:organizations.orzAll
    }
}

const mapDispatchToProps = (dispatch) => {
   return{
    postApplyForm: (name,organizationId,master,contactor,contact,deviceCount,address_city,address_detail,desc,deviceTypeList) => {
        dispatch(postApplyForm(name,organizationId,master,contactor,contact,deviceCount,address_city,address_detail,desc,deviceTypeList));
    },
    fetchORZs:() => dispatch( fetchORZs() ),
    fetchORZsWithProject:() => dispatch( fetchORZsWithProject() ),
    fetchAllProjects:() => dispatch( fetchAllProjects() ),
    }
}


export default withRouter( connect(mapStateToProps, mapDispatchToProps)(WrappedApply) );
