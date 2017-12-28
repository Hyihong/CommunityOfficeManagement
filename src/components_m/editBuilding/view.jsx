
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { postEditForm  } from './actions'
import { actions as buildingListAction} from "../buildingList"
import { List,Flex, InputItem,WhiteSpace,Toast} from 'antd-mobile'
import { createForm } from 'rc-form';

import TopNav from '../shared/views/TopNav'
import './style.less'
 
const { editBuildingData } = buildingListAction ;

//编辑楼栋View
class EditBuilding extends React.Component {
    componentDidMount(){
        
    }
    componentWillReceiveProps(nextProps){
        const { status,history,location }= this.props;
            
            if( nextProps.status!== status ){
                if( nextProps.status === 'success'){
                //更新楼栋信息
                const editData = nextProps.editData ;
                this.props.editBuildingData( {ID:location.state.buildingID,...editData});
                Toast.success( '修改成功', 1.5);
                setTimeout( ()=>{
                    history.goBack();
                },1500)

            }else if ( nextProps.status === 'failure' &&  nextProps.status!== status){
                Toast.fail( "编辑失败：" + nextProps.errMsg, 2);
                
         }}
    }


    //提交修改信息
    onSubmit=()=>{
        const { validateFields } = this.props.form;
        validateFields((error, value) => {
              if( error == null){
                  //填写信息无误
                  const { state } = this.props.location;
                  if( state.code === value.bdCode && state.name === value.bdName){
                      Toast.info( '您没有做任何修改', 1);
                      //this.props.history.goBack();
                  }else{
                    //提交修改信息
                    this.props.postEditForm( state.buildingID,state.projectID,value.bdCode,value.bdName);
                    //Toast.success( '修改成功', 3);
                  }

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
        const { state } = this.props.location;
        return(
             <div>
                <TopNav home title="编辑楼栋" check onCheckClick={ this.onSubmit }></TopNav> 
                <WhiteSpace></WhiteSpace>  
                <List> 
                    <InputItem 
                        {...getFieldProps('bdCode',{
                            initialValue: state.code,
                            rules: [{required: true,message:"楼栋代码不能为空"},{pattern:/^\S+$/,message:"楼栋代码请勿包含空格"}],
                        })} 
                        placeholder="请输入楼栋代码"
                        //error ={true}
                           >楼栋代码
                    </InputItem>
                    <InputItem 
                        {...getFieldProps('bdName',{
                            initialValue: state.name,
                            rules: [{required: true,message:"楼栋名称不能为空"},{pattern:/^\S+$/,message:"楼栋名称请勿包含空格"}],
                        })} 
                        placeholder="请输入楼栋名称"
                           >楼栋名称
                    </InputItem>
                </List>   
                

            </div>
          
        )
    }

}

const EditBuildingWrapper = createForm()(EditBuilding);

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

export default connect(mapStateToProps, mapDispatchToProps)(EditBuildingWrapper);
