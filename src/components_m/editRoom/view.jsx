
import React from 'react';
import { connect } from 'react-redux';
import { postEditForm  } from './actions'
import { actions as roomListAction} from "../roomList"
import { List,Flex, InputItem,WhiteSpace,Toast} from 'antd-mobile'
import { createForm } from 'rc-form';

import TopNav from '../shared/views/TopNav'
import './style.less'
 
const { editRoomData } = roomListAction ;

//编辑房间View
class EditBuilding extends React.Component {
    componentDidMount(){
        
    }
    componentWillReceiveProps(nextProps){
        const { status,history,location }= this.props;
            if( nextProps.status!== status ){
                if( nextProps.status === 'success'){
                //更新房间信息
                const editData = nextProps.editData ;
                this.props.editRoomData( {ID:location.state.roomID,...editData});
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
                  const { code,name,residentName,residentPhone, roomID,buildingID} = this.props.location.state;
                  const { roomCode,roomName } = value ;
                  //const { code,name,}
                  if( code === roomCode && name === roomName && residentName === value.residentName && residentPhone === value.residentPhone ){
                      Toast.info( '您没有做任何修改', 1);
                  }else{
                    //提交修改信息
                    this.props.postEditForm(roomID,buildingID,roomCode,roomName,value.residentName,value.residentPhone);
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
                <TopNav home title="编辑房间" check onCheckClick={ this.onSubmit }></TopNav> 
                <WhiteSpace></WhiteSpace>  
                <List> 
                    <InputItem 
                        {...getFieldProps('roomCode',{
                            initialValue: state.code,
                            rules: [{required: true,message:"房间代码不能为空"},{pattern:/^\S+$/,message:"房间代码请勿包含空格"},{pattern:/^\d{8}$/,message:"房间代码只能为8位纯数字"}],
                        })} 
                        placeholder="请输入房间代码"
                        //error ={true}
                           >房间代码
                    </InputItem>
                    <InputItem 
                        {...getFieldProps('roomName',{
                            initialValue: state.name,
                            rules: [{required: true,message:"房间名称不能为空"},{pattern:/^\S+$/,message:"房间名称请勿包含空格"}],
                        })} 
                        placeholder="请输入房间名称"
                           >房间名称
                    </InputItem>
                    <InputItem 
                        {...getFieldProps('residentName',{
                            initialValue: state.residentName,
                            rules: [{required: true,message:"业主名称不能为空"},{pattern:/^\S+$/,message:"业主名称请勿包含空格"}],
                        })} 
                        placeholder="请输入业主名称"
                           >业主名称
                    </InputItem>
                    <InputItem 
                        {...getFieldProps('residentPhone',{
                            initialValue: state.residentPhone,
                            rules: [{required: true,message:"业主电话不能为空"},{pattern:/^\S+$/,message:"业主电话请勿包含空格"},{pattern:/^\d{1,11}$/,message:"电话号码格式错误"}],
                        })} 
                        placeholder="请输入业主电话"
                           >业主电话
                    </InputItem>
                </List>   
            </div>
          
        )
    }

}

const EditBuildingWrapper = createForm()(EditBuilding);

const mapStateToProps = (state) => {
    const editRoom =  state.editRoom ;
    return{
         status: editRoom.status,
         editData:editRoom.Data,
         errMsg:editRoom.Message,
    }
}

const mapDispatchToProps = (dispatch) => ({ //房间ID,项目ID,房间代码，房间名称
    postEditForm:(roomID,buildingID,code,name,rname,rphone)=>{
        dispatch( postEditForm( roomID,buildingID,code,name,rname,rphone ))
    },
    editRoomData:(id,code,name)=>{
        dispatch( editRoomData( id,code,name ))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBuildingWrapper);
