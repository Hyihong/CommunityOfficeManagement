
import React from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom'
import { postmodifyApplyForm,fetchApplyInfo } from './actions'
import { Form, Icon, Input, Button,Modal,Checkbox,InputNumber,Spin  } from 'antd';
import { view as Organizations,actions as OrzActions } from '../organizations'
import { actions as projectListActions } from '../projectList'
import { view as ChinaDivision } from '../chinaDivision'
import './style.less'
import {setPlaceholder,getQueryString} from '../../tools/baseTools'
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

//解析拆分地址
function parseAddress( ad ){
    let _city,_detail;
    if(!!ad && ad.includes("￥￥")){
         const adArr = ad.split("￥￥");
         _city = adArr[0];
         _detail = ad.replace(`${adArr[0]}￥￥`,"");
    }else{
        _city = [];
        _detail = !!ad ? ad :"";
    }
    return [_city,_detail]  
}
//生成城市数组
function cityToArray( st ) {
    if( typeof st  !== 'string'){
        return [];
    }
    let cityArr = [];
    if(st!== undefined && st!== ''){
         cityArr = st.match( /(\S.*?[省|区|市])(\S.*?[市|区|州|划|县])?(\S.*?[市|区|县])?/ ).filter( (city,idx) =>{
            return city !== undefined && idx !==0;
        });
    }
    return cityArr;
}
//设置输入框数值范围
function validatePrimeNumber(number) {
    if (number>0 && number<=100000) {
        return {
            validateStatus: 'success',
            errorMsg: null,
        };
    }
    else if(number<1){
        return {
            validateStatus: 'error',
            errorMsg: '最小值不能低于1',
        };
    }
    else {
        return {
            validateStatus: 'error',
            errorMsg: '最大值不能超过100000',
        };
    }
}
class ApplyModify extends React.Component{ 
constructor(props){
    super(props);
    this.state = {
        city:[],
        formInit:[],
        number: {
            value:'',
        },
    };
}
componentWillMount(){
    document.title="修改项目申请信息"
    getQueryString( this.props.location.search,"ID" );
   
    this.props.fetchApplyInfo( getQueryString( this.props.location.search,"ID" ));
    
    if( !this.props.orzAll.Data){
       this.props.fetchORZs()//获取所有组织机构
    }

    
}

componentDidMount(){
    setPlaceholder();
}


componentWillReceiveProps(nextProps){
   

    //反馈提交信息
    if(nextProps.postData.status !== this.props.postData.status ){
        if(nextProps.postData.status==='success'){
            Modal.success({
                title:"您已成功修改申请信息",
                okText:"确定",
                onOk:()=>{                    
                    //刷新项目列表数据
                    this.props.fetchORZsWithProject();
                    this.props.fetchAllProjects();
                    this.props.history.push("/home/projectList")
                },
            })
        }else if(nextProps.postData.status==='failure'){
            Modal.error({
                title:"修改申请信息失败",
                okText:"确定",
                content: nextProps.errMsg,
            })
    
        }
    }
}

handleNumberChange = (value) =>{
    this.setState({
        number: {
            ...validatePrimeNumber(value),
            value,
        }
    })
}

handleSubmit =(e)=>{
    e.preventDefault();
    const {  getFieldsError,validateFields,getFieldsValue } = this.props.form;
    validateFields();

    if( hasErrors(getFieldsError())){
        return;
    }else{
        //*******提交申请 ******
        let {  name, organizationId, master, contactor, contact, deviceCount,desc,address,city, deviceTypeList } = getFieldsValue();
        console.log( address )
        //拼接地址
        this.props.postmodifyApplyForm(    
            this.props.fetchData.Data.ID,
            name._trim(),
            organizationId[organizationId.length -1 ],
            master._trim(),
            contactor._trim(),
            contact._trim(),
            city.join(""),
            address,
            deviceCount,
            desc,
            deviceTypeList.join(',')
        )
    }
   
}
changeCity = (value, selectedOptions) =>{
    console.log(selectedOptions)
     this.setState({
         cityString: value.join(""),
         city:value,
     })
}


render(){
    //表单前端验证
    const { getFieldDecorator,isFieldTouched, getFieldError} = this.props.form;
    const errArr = ["name","organizationId","master","contactor","contact","deviceTypeList"].map( (item)=>{
        return isFieldTouched(item) && getFieldError(item) ;
    })

    //表单初始数据
     //初始化表单数据
     const initialData =  this.props.fetchData.Data;
     let _d = {};
     if( !!initialData  ){
         Object.keys(initialData).map((key)=>{
             if( key === 'Address'){
                 if( !!initialData[key]){
                    const adArr = parseAddress(initialData[key] );
                    _d['ad_city']= cityToArray( adArr[0] );
                    _d['ad_detail'] = adArr[1];
                 }else{
                     //原始值为null或undefined ，数据来源主要是从总后台直接创建项目
                     _d['ad_city']= [];
                     _d['ad_detail'] ="";
                 }
             }else{
                 _d[key]= initialData[key];
             }
         })
     }

return (
    <Spin tip="正在为您修改项目信息..."  size="large" spinning={false} >
    <Spin tip="数据加载中..."  size="large" spinning={ this.props.fetchData.status ==='loading' && this.props.orzAll.status === 'loading'} >
    <div className="lee-apply">
        <Form onSubmit={this.handleSubmit}>
            <FormItem
                 {...formItemLayout}
                 label="项目名称"
                 validateStatus={ errArr[0] ? 'error' : ''}
                 help={ errArr[0] || ''}
            >{
                getFieldDecorator('name',{
                    initialValue:_d.Name,
                    rules:[
                        {transform:(transformeValue) =>{ return validateTrim(transformeValue) } },
                        {required: true,message: '项目名称不能为空',},
                        {pattern:/^\S+$/,message:"格式错误，请勿包含空格"},
                        {max:100,message: '项目名称长度不能超过100',}]
                })(
                    <Input size="large" prefix={<Icon type="cloud-o" />} placeholder="项目名称" />
                    
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
                    initialValue:_d.OrganizationId,
                    rules:[{
                        required: true,
                        message: '请选择组织机构',
                    }]
                })(
                    <Organizations orzOptions = { !!this.props.orzAll.Data ? JSON.parse( this.props.orzAll.Data ):[] }
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
                    initialValue:_d.Master,
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
                    initialValue:_d.Contactor,
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
                    initialValue:_d.Contact,
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
                    initialValue:_d.DeviceTypeList,
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
                 validateStatus={this.state.number.validateStatus}
                 help={this.state.number.errorMsg}
            > {
                getFieldDecorator('deviceCount',{
                    initialValue:_d.DeviceCount
                })(
                    <InputNumber  min={1} max={100000} style={{width:"100%"}} onChange={this.handleNumberChange}/>
                )
            }
            </FormItem>
            <FormItem
                 {...formItemLayout}
                 label="地址"
            >
                    <InputGroup compact>
                        {
                             getFieldDecorator('city',{
                                initialValue:_d.ad_city,
                            })(
                                <ChinaDivision width="35%" bgColor="#f7f7f7" onChange= { this.changeCity } ></ChinaDivision>
                            )
                        }
                        {
                             getFieldDecorator('address',{
                                initialValue:_d.ad_detail,
                            })(
                                <Input  id="detailAddress" placeholder="详细地址"  style={{width:"65%"}} />
                            )
                        }
        
                    </InputGroup>
            </FormItem>
            <FormItem
                 {...formItemLayout}
                 label="描述"
            > {
                getFieldDecorator('desc',{
                    initialValue:_d.Desc
                })(
                    <Input prefix={<Icon type="edit" />} placeholder="描述" />
                )
            }

            </FormItem>
            <div style={{textAlign:"center",marginTop:"30px"}}>
                 <Button type="primary" style={{width:"35%"}} disabled={ hasErrors(this.props.form.getFieldsError())} onClick = {this.handleSubmit}> 确认修改</Button>
            </div>
        </Form>
    </div>
    </Spin>
    </Spin>

);
};
}


const WrappedApply = Form.create()(ApplyModify);
const mapStateToProps = (state) => {
    const modify =  state.applyModify ;
    const organizations = state.organizations;
    return{ 
         fetchData:modify.fetchData,
         postData:modify.postData,
         orzAll:organizations.orzAll
    }
}

const mapDispatchToProps = (dispatch) => {
   return{
    postmodifyApplyForm: (id,name,organizationId,master,contactor,contact,address_city,address_detail,deviceCount,desc,deviceTypeList) => {
        dispatch(postmodifyApplyForm(id,name,organizationId,master,contactor,contact,address_city,address_detail,deviceCount,desc,deviceTypeList));
    },
    fetchORZs:() => dispatch( fetchORZs() ),
    fetchORZsWithProject:() => dispatch( fetchORZsWithProject() ),
    fetchAllProjects:() => dispatch( fetchAllProjects() ),
    fetchApplyInfo:(projectID)=>{
        dispatch( fetchApplyInfo(projectID));
    }
    }
}


export default withRouter( connect(mapStateToProps, mapDispatchToProps)(WrappedApply) );
