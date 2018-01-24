
import React from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom'
import { createForm } from 'rc-form';
import ReactDOM from 'react-dom';
import { Toast,InputItem, List,WhiteSpace,WingBlank,Checkbox,Picker,TextareaItem   } from 'antd-mobile';
import { actions as OrzActions } from '../../components/organizations'
import { actions as projectListActions } from '../projectList'
import Animate from 'rc-animate';
import { postApplyForm } from './actions'
import TopNav from '../shared/views/TopNav'
import mapOrganazitionsJson from "../../tools/mapOrganazitionsJson" 
import { mapChinaDivisionJson } from "../../tools/mapChinaDivisionJson" 
import './style.less'
const divisionJson = require("../../DB/address3.json") ;


const ChinaDivisionJsonOptions = new mapChinaDivisionJson( divisionJson ) ;

const  { fetchAllProjects } = projectListActions;
const  { fetchORZs } = OrzActions ; 
const CheckboxItem = Checkbox.CheckboxItem;

//计算实际选择列表长度
function countActualLength( str){
    let _L = str.split(",").length;
    str.split(",").map( item=>{
        if(item === '' || item === null){
            _L--;
        }
    })
    return _L ;
}

//获取项目ID
function getActualValue( arr){
    for( let i = arr.length -1;i>=0;i--){
        console.log(arr[i] )
        if( arr[i] !== '' ){
            return arr[i];
        }
   }
}
//自定义列表组件
const CustomChildren = props => (
    <div
      onClick={props.onClick}
      style={{ backgroundColor: '#fff', paddingLeft: 15 }}
      className="am-list-item"
    >
      <div className="am-list-line" style={{ display: 'flex',padding:"10px 0",minHeight: '30px'}}>
        <div style={{ flex:"1",overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',color:"#000"}}>{props.children}</div>
        <div style={{ flex:"2",textAlign: 'right', color: '#888', marginRight: 0 }}>
             { props.extra === "请选择" ? props.extra :props.extra.split(',').map( (item,index) =>{
                 return(
                     <span key={index} >
                           {item }
                           {
                            index < countActualLength(props.extra) - 1 ?  <icon className="fa fa-arrow-circle-right" style={{fontSize:"10px",marginRight:"8px"}}></icon> : null
                           }
                     </span>)
             })
             }
        </div>
         <div style={{flex:"0,1,auto", width:"20px",marginTop:"4px",marginRight:"10px"}}>
            <div className="am-list-arrow am-list-arrow-horizontal" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  );

class Apply extends React.Component{ 
componentWillMount(){
    this.state = {
        height:0,
        city:"",
        orzPickerVisible:false,
        isOrzPickerCheck:false,
        hasOrzPickerLoading:false,
        orzpickerValue:[],

        DeviceTypeListValue:[],
    }
}
componentDidMount(){
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.parentNode.offsetTop;
        this.setState({
            height:hei
        })
}
componentWillReceiveProps(nextProps){
    //组织机构数据未加载时，定义组织机构选择器行为
    if(nextProps.orzAll.status ==='sucess' && this.state.hasOrzPickerLoading === false){
        Toast.hide();
        this.setState({
            hasOrzPickerLoading:true,
        })
        if( !this.state.orzPickerVisible && this.state.isOrzPickerCheck ){
            this.setState({
                orzPickerVisible:true
            })
        }
    }

    if(nextProps.status !== this.props.status ){
        if(nextProps.status==='success'){
            this.props.fetchAllProjects();
            Toast.success( '项目申请成功！即将为您跳转至申请列表', 3);
            setTimeout( ()=>{
                this.props.history.push("/home/projectListAuditing")
            },3000)
        }else if(nextProps.status==='failure'){
            Toast.error( '项目申请失败：'+nextProps.errMsg, 3);
        }
    }
}

onSubmit=()=>{
    const { validateFields } = this.props.form;
    validateFields((error, value) => {
        if( error == null && this.state.DeviceTypeListValue.length !== 0 ){
            //填写信息无误，提交修改信息
            const {name,organizationId,master,contactor,contact,deviceCount,address_city,address_detail,desc} = value;
            let _orzId = getActualValue( organizationId);
            this.props.postApplyForm(    
                name,
                _orzId,
                master,
                contactor,
                contact,
                deviceCount,
                address_city.join(""),
                address_detail,
                desc,
                this.state.DeviceTypeListValue.join(',')
            )
            
        }else{
            //表单验证错误
            let errMsgArr=[];
            if( error !== null){
                Object.values(error).map( item =>{
                    errMsgArr.push( item.errors[0].message);
                 }) 
            }
            if(this.state.DeviceTypeListValue.length ===0 ){
                errMsgArr.push("请选择设备类型")
            }
            Toast.info( errMsgArr.map( (i,idx) => <div key={idx}>{ i } </div>), 3);
        }
  });
    
}
//点击组织机构选择器
onOrganizationItemClick=()=>{
    this.setState({
        isOrzPickerCheck:true
    })
    if( !!this.props.orzAll.Data ){
        this.setState({orzPickerVisible:true})
    }else{
        Toast.loading("组织机构数据加载中",0);
        this.setState({isOrzPickerLoading:true})
        this.props.fetchORZs(); 
    }  
}
onOrganizationPickerOk =(value)=>{
    this.setState({
        orzPickerVisible:false,
        isOrzPickerCheck:false,
        orzpickerValue:value
    })

}
onOrganizationPickerDismiss =()=>{
    this.setState({
        orzPickerVisible:false,
        isOrzPickerCheck:false,
        
    })
}
//选择设备类型
onDeviceTypeListChange =(value)=>{  
    let { DeviceTypeListValue } = this.state;
    if( DeviceTypeListValue.includes(value) ){
         let _idx =DeviceTypeListValue.indexOf(value) ;
        this.setState({
           DeviceTypeListValue:[ ...DeviceTypeListValue.slice(0,_idx), ...DeviceTypeListValue.slice(_idx+1,DeviceTypeListValue.length)]
        })
    }else{
        this.setState({
            DeviceTypeListValue:[value, ...DeviceTypeListValue]
        })
    }
   
    
}


render(){
    const { getFieldProps } = this.props.form;
    return( 
        <div> 
            <TopNav home title="项目申请"  check onCheckClick={ this.onSubmit }></TopNav>
            <div className="leelen-apply" style={{height:this.state.height}}>
                <WingBlank size="ls">   
                <Animate  transitionName="fade" transitionAppear>
                <List ref={el => this.lv = el} >

                    <h5>项目<span className="require">（必填）</span></h5>
                    <InputItem 
                        placeholder="在此输入"
                        {...getFieldProps('name',{
                            rules: [{required: true,message:"项目名称不能为空"},{pattern:/^\S+$/,message:"项目名称请勿包含空格"}],
                        })} 
                        >项目名称
                    </InputItem> 

                    <Picker 
                         data = {!!this.props.orzAll.Data? new mapOrganazitionsJson( JSON.parse(this.props.orzAll.Data),"mobile"): []} 
                         visible={ this.state.orzPickerVisible } 
                         value={this.state.orzpickerValue }
                         onOk = { this.onOrganizationPickerOk }
                         onDismiss ={ this.onOrganizationPickerDismiss}
                         cascade ={ true}
                         {...getFieldProps('organizationId',{
                            rules: [{required: true,message:"请选择组织机构"}],
                          })} 
                         >
                         <CustomChildren 
                            extra="请选择"
                            onClick = { this.onOrganizationItemClick}
                            >组织机构
                        </CustomChildren>
                    </Picker>
                        
                    <h5>基本信息<span className="require">（必填）</span></h5>
                    <InputItem 
                        placeholder="在此输入"
                        {...getFieldProps('master',{
                            rules: [{required: true,message:"负责人不能为空"},{pattern:/^\S+$/,message:"负责人请勿包含空格"}],
                        })}
                        >负责人
                    </InputItem> 

                    <InputItem  
                        {...getFieldProps('contactor',{
                            rules: [{required: true,message:"联系人不能为空"},{pattern:/^\S+$/,message:"联系人请勿包含空格"}],
                        })} 
                        placeholder="在此输入">联系人
                    </InputItem> 

                    <InputItem 
                            {...getFieldProps('contact',{
                                rules: [{required: true,message:"联系方式不能为空"},{pattern:/^\S+$/,message:"项目名称请勿包含空格"},{max:13,message:"联系方式不能超过13位"}],
                            })} 
                            placeholder="在此输入">联系方式
                    </InputItem> 

                    <InputItem 
                           {...getFieldProps('deviceCount',{
                              initialValue:1,
                              rules: [
                                  {required: true,message:"设备数量不能为空"},
                                  {pattern:/^\S+$/,message:"项目名称请勿包含空格"},
                                  {pattern:/^[1-9][0-9]{0,4}$/,message:"设备数量必须在0~100,000之间"}
                                ],
                           })} 
                           type="number"
                           placeholder="设备数量必须大于0"
                        >设备数量
                    </InputItem>
                   


                    <h5>设备类型<span className="require">（必选）</span></h5>
                    <CheckboxItem key={1}  onChange={()=>this.onDeviceTypeListChange(4)}>室内分机</CheckboxItem>
                    <CheckboxItem key={2}  onChange={()=>this.onDeviceTypeListChange(1)}>围墙机</CheckboxItem>
                    <CheckboxItem key={3}  onChange={()=>this.onDeviceTypeListChange(2)}>单元主机</CheckboxItem>
                   


                    <h5>地址<span>（选填）</span></h5>
                    <Picker 
                        extra="请选择"
                        data={ChinaDivisionJsonOptions}
                        {...getFieldProps('address_city', {
                            initialValue: [],
                          })}
                        >
                        <List.Item arrow="horizontal">城市</List.Item>
                    </Picker>

                    <TextareaItem 
                        title="详细地址" autoHeight 
                        {...getFieldProps('address_detail')} 
                    ></TextareaItem>  

                    <h5>描述<span>（选填）</span></h5>  
                    <TextareaItem title="描述"   
                       {...getFieldProps('desc')}  
                      rows={3}>
                    </TextareaItem>  

                    <WhiteSpace></WhiteSpace>
                    <WhiteSpace></WhiteSpace>

                </List>  
                </Animate> 
                </WingBlank>   
            </div>
        </div>
       
    )
};
}


const WrappedApply = createForm()(Apply);
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
    fetchAllProjects:() => dispatch( fetchAllProjects() ),
    }
}


export default withRouter( connect(mapStateToProps, mapDispatchToProps)(WrappedApply) );
