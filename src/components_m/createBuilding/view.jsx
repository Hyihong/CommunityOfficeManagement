
import React from 'react';
import { connect } from 'react-redux';
import { postCreateBuildingForm } from './actions'
import { actions as buildingListAction} from "../buildingList"
import { Toast,InputItem, List,WhiteSpace  } from 'antd-mobile';
import { createForm } from 'rc-form';
import { withRouter } from 'react-router-dom'
import { fetchProjectBuildings } from '../buildingList/actions'
import QueueAnim from 'rc-queue-anim';

import './style.less'
import img_building from "../../assets/images_m/building_2.png"

import TopNav from '../shared/views/TopNav'

const { AddNewBuildingToList } = buildingListAction ;


//判断表单是否有误
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


//创建楼栋view
class CreateBuilding extends React.Component {
    componentDidMount(){
         if(!!this.props.bdData){
             return;
         }else{
             this.props.fetchProjectBuildings(this.props.location.state.projectID)
         }
    }
    componentWillReceiveProps(nextProps){
         //创建楼栋信息反馈
         const { status,history }= this.props;
         if( nextProps.status === 'success' &&  nextProps.status!== status ){
            //将新数据插入楼栋列表
            const _new = [nextProps.newBuildingData] ;
            this.props.AddNewBuildingToList({..._new});
            history.goBack()
         }else if ( nextProps.status === 'failure' &&  nextProps.status!== status){
            Toast.fail("申请失败:"+nextProps.errMsg)
         }
    }

    onSubmit=()=>{
        const { validateFields } = this.props.form;
        validateFields((error, value) => {
              if( error == null){
                  //填写信息无误，提交修改信息
                  this.props.postCreateBuildingForm(this.props.location.state.projectID,value.bdCode,value.bdName );
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

    render(){
        const { getFieldProps } = this.props.form;
        return(
             <div>
                  <TopNav home title="新增楼栋"  check onCheckClick={ this.onSubmit }></TopNav>
                  <WhiteSpace></WhiteSpace> 
                    <div style={{textAlign:"center",margin:"30px 0"}}>
                       <img src={ img_building } alt="" style={{width:"40%",heighe:"100px"}}/>
                    </div>
                  <div className="leelen-create-building">
                    <List>  
                            <QueueAnim delay={0} className="queue-simple">
                            <div className="leelen-input-section" key="1">
                                <p className="tip">楼栋代码</p>
                                <InputItem 
                                    {...getFieldProps('bdCode',{
                                        rules: [{required: true,message:"楼栋代码不能为空"},{pattern:/^\S+$/,message:"楼栋代码请勿包含空格"}],
                                    })} 
                                    placeholder="请输入楼栋代码"
                                    >
                                </InputItem>
                            </div>
                            <WhiteSpace></WhiteSpace>
                            <div className="leelen-input-section" key="2">
                                <p className="tip">楼栋名称</p>
                                <InputItem 
                                    {...getFieldProps('bdName',{
                                        rules: [{required: true,message:"楼栋名称不能为空"},{pattern:/^\S+$/,message:"楼栋名称请勿包含空格"}],
                                    })} 
                                    placeholder="请输入楼栋名称"
                                    >
                                </InputItem>
                            </div>
                            </QueueAnim>
                        </List> 
                  </div>
             </div>
        )
    }

}

CreateBuilding = createForm()(CreateBuilding);


const mapStateToProps = (state) => {
    const createBuilding =  state.createBuilding ;
    const buildingList = state.buildingList.buildingList; 
    return{
         status:createBuilding.status,
         errMsg:createBuilding.Message,
         newBuildingData:createBuilding.Data,
         showSuccess:createBuilding.showSuccess,

         bdData:buildingList.Data
    }
}

const mapDispatchToProps = (dispatch) => ({
    postCreateBuildingForm:(id,code,name)=>{ 
        dispatch( postCreateBuildingForm(id,code,name) )
    },
    fetchProjectBuildings: ( projectID ) => {
        dispatch( fetchProjectBuildings( projectID));
       },
    AddNewBuildingToList:(roomId,code,name,residentName,tel,gender)=>{
        dispatch( AddNewBuildingToList(roomId,code,name,residentName,tel,gender) )
    },
});

export default  withRouter ( connect(mapStateToProps, mapDispatchToProps)(CreateBuilding) );
