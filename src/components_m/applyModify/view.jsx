
import React from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom'
import { createForm } from 'rc-form';
import ReactDOM from 'react-dom';
import { Toast,InputItem, List,WhiteSpace,WingBlank,Checkbox,Picker,TextareaItem   } from 'antd-mobile';
import { actions as OrzActions } from '../../components/organizations'
import { actions as projectListActions } from '../projectList'
import { postmodifyApplyForm,fetchApplyInfo } from './actions'
import TopNav from '../shared/views/TopNav'
import mapOrganazitionsJson from "../../tools/mapOrganazitionsJson" 
import { mapChinaDivisionJson } from "../../tools/mapChinaDivisionJson" 
import { getQueryString} from '../../tools/baseTools'
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
        if( arr[i] !== '' ){
            return arr[i];
        }
   }
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
        _detail = ad;
    }
    return [_city,_detail]  
}
//生成城市数组
function cityToArray( st ) {
    let cityArr = [];
    if(st!== undefined && st!== '' ){
         cityArr = st.match( /(\S.*?[省|区|市])(\S.*?[市|区|州|划|县])?(\S.*?[市|区|县])?/ ).filter( (city,idx) =>{
            return city !== undefined && idx !==0;
        });
    }
    return cityArr;
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

class ApplyModify extends React.Component{ 
componentWillMount(){
    this.state = {
        height:0,
        orzPickerVisible:false,
        isOrzPickerCheck:false,
        hasOrzPickerLoading:false,
        orzpickerValue:[],
        DeviceTypeListValue:[],
    }
    //存储表单初始化数据
    this._d = {};
    getQueryString( this.props.location.search,"ID" );
    this.props.fetchApplyInfo( getQueryString( this.props.location.search,"ID" ));
    
    if( !this.props.orzAll.Data){
       this.props.fetchORZs()//获取所有组织机构
    }

}
componentDidMount(){
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
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

    //修改提交反馈
    if(nextProps.postData.status !== this.props.postData.status ){
        if(nextProps.postData.status==='success'){
            this.props.fetchAllProjects();
            Toast.success( '项目信息修改成功！即将为您跳转页面', 2.5);
            setTimeout( ()=>{
                this.props.history.push("/home/projectListAuditing")
            },3000)
        }else if(nextProps.status==='failure'){
            Toast.error( '项目信息修改失败'+nextProps.errMsg, 3);
        }
    }
    
    //初始化表单数据
    if( nextProps.fetchData.status !== this.props.fetchData.status){
        if(nextProps.fetchData.status === 'loading' ){
            Toast.loading( '项目数据加载中...',0);
        }
        if( nextProps.fetchData.status === 'success'){
            const initialData = nextProps.fetchData.Data;
            Toast.hide();
            
            Object.keys(initialData).map((key)=>{
                if( key === 'Address' && !!initialData[key] ){
                    const adArr = parseAddress(initialData[key] );
                    this._d['ad_city']= cityToArray( adArr[0] );
                    this._d['ad_detail'] = adArr[1];
                }else{
                    this._d[key]= initialData[key];
                }
            })
            this.setState({
                DeviceTypeListValue:this._d.DeviceTypeList
            })
        }
    }

}

onSubmit=()=>{
    const { validateFields } = this.props.form;
    validateFields((error, value) => {
        if( error == null && this.state.DeviceTypeListValue.length !== 0 ){
            //填写信息无误，提交修改信息
            const {name,organizationId,master,contactor,contact,deviceCount,address_city,address_detail,desc} = value;
            let _orzId = getActualValue( organizationId );
            console.log(this.state.DeviceTypeListValue.join(',') )
            this.props.postmodifyApplyForm(   
                this.props.fetchData.Data.ID, 
                name,
                _orzId,
                master,
                contactor,
                contact,
                address_city.join(""),
                address_detail,
                deviceCount,
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
    if( DeviceTypeListValue.includes(value.toString()) ){
         let _idx =DeviceTypeListValue.indexOf(value.toString()) ;
        this.setState({
           DeviceTypeListValue:[ ...DeviceTypeListValue.slice(0,_idx), ...DeviceTypeListValue.slice(_idx+1,DeviceTypeListValue.length)]
        })
    }else{
        this.setState({
            DeviceTypeListValue:[value.toString(), ...DeviceTypeListValue]
        })
    }
}

render(){
    const { getFieldProps } = this.props.form;
   
    return( 
        <div>
            <TopNav home title="项目修改"  check onCheckClick={ this.onSubmit }></TopNav>
            <div className="leelen-applyModify" style={{height:this.state.height,overflow:"auto"}}>
                <WingBlank size="ls">   
                <List ref={el => this.lv = el} >
                    <h5>项目<span className="require">（必填）</span></h5>
                    <InputItem 
                        placeholder="在此输入"
                        {...getFieldProps('name',{
                            initialValue:this._d.Name,
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
                            initialValue:this._d.OrganizationId,
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
                            initialValue:this._d.Master,
                            rules: [{required: true,message:"负责人不能为空"},{pattern:/^\S+$/,message:"负责人请勿包含空格"}],
                        })}
                        >负责人
                    </InputItem> 

                    <InputItem  
                        {...getFieldProps('contactor',{
                            initialValue:this._d.Contactor,
                            rules: [{required: true,message:"联系人不能为空"},{pattern:/^\S+$/,message:"联系人请勿包含空格"}],
                        })} 
                        placeholder="在此输入">联系人
                    </InputItem> 

                       <InputItem 
                            {...getFieldProps('contact',{
                                initialValue:this._d.Contact,
                                rules: [{required: true,message:"联系方式不能为空"},{pattern:/^\S+$/,message:"项目名称请勿包含空格"}],
                            })} 
                            placeholder="在此输入">
                            联系方式
                        </InputItem> 

                        <InputItem 
                           {...getFieldProps('deviceCount',{
                              initialValue:this._d.DeviceCount,
                              rules: [{required: true,message:"设备数量不能为空"},{pattern:/^\S+$/,message:"项目名称请勿包含空格"},{pattern:/^[1-9]\d*$/,message:"设备数量必须为大于0的整数"}],
                           })} 
                           type="number"
                           placeholder="设备数量必须大于0"
                        >设备数量</InputItem>
                   

                      <h5>设备类型<span className="require">（必选）</span></h5>
                        
                       {
                           !!this._d.DeviceTypeList ? 
                            <div className="real">
                                <CheckboxItem 
                                    key={1} value={4} onChange={()=>this.onDeviceTypeListChange(4)} 
                                    defaultChecked ={this._d.DeviceTypeList.indexOf("4") !== -1}
                                >室内分机 
                                </CheckboxItem>
                                <CheckboxItem 
                                    key={2} value={1} onChange={()=>this.onDeviceTypeListChange(1)} 
                                    defaultChecked={ this._d.DeviceTypeList.indexOf("1") !== -1 }
                                >围墙机</CheckboxItem>
                                <CheckboxItem 
                                    key={3} value={2} onChange={()=>this.onDeviceTypeListChange(2)} 
                                    defaultChecked={ this._d.DeviceTypeList.indexOf("2") !== -1 }
                                    >单元主机
                                </CheckboxItem>
                            </div> 
                            :  
                           <div className="fake">
                                <CheckboxItem key={4} >室内分机</CheckboxItem>
                                <CheckboxItem key={5} >围墙机</CheckboxItem>
                                <CheckboxItem key={6} >单元主机</CheckboxItem>
                            </div>
                     
                       }
                        
                  
                    

                    <h5>地址<span>（选填）</span></h5>
                    <Picker 
                        extra="请选择"
                        data={ChinaDivisionJsonOptions}
                        {...getFieldProps('address_city', {
                            initialValue: this._d.ad_city,
                          })}
                        >
                        <List.Item arrow="horizontal">城市</List.Item>
                    </Picker>

                    <TextareaItem 
                        title="详细地址" autoHeight 
                        {...getFieldProps('address_detail',{
                            initialValue: this._d.ad_detail,
                        })} 
                    ></TextareaItem>  

                    <h5>描述<span>（选填）</span></h5>  
                    <TextareaItem title="描述"   
                       {...getFieldProps('desc',{
                          initialValue: this._d.Desc,
                       })}  
                       rows={3}
                    >
                    </TextareaItem>  

                    <WhiteSpace></WhiteSpace>
                    <WhiteSpace></WhiteSpace>

                </List>  
                </WingBlank>   
            </div>
        </div>
       
    )
};
}


const WrappedApplyModify = createForm()(ApplyModify);
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
    fetchAllProjects:() => dispatch( fetchAllProjects() ),
    fetchApplyInfo:(projectID)=>{ dispatch( fetchApplyInfo(projectID));}
    }
}


export default withRouter( connect(mapStateToProps, mapDispatchToProps)(WrappedApplyModify) );
