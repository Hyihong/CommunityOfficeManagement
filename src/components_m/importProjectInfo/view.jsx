import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { actions as projectListAction } from '../projectList'
import { getQueryString } from '../../tools/baseTools.m'
import TopNav from '../shared/views/TopNav'
//import $ from 'jquery'
//import 'jquery-form'
import './style.less'


class ImportProjectInfo extends React.Component {
   constructor(){
     super()
     
   }
   componentDidMount(){
       this.projectID = getQueryString( this.props.location.search,'ID' );       
   }

   _checkExcelHandleProgress =( f )=>{
        console.log("hahaha")
   }   
   handleSumbit=()=>{       
    if( true ){
       let file = document.getElementById('formForIE').querySelector('input[type="file"]').files[0];
       //上传文件      
       const uploadPM = this._uploadExcel(file,`/api/project/v1/importProjectInfo?projectid=${this.projectID}`);
       uploadPM.then( response =>{
           if( response.status === 200){
               response.json().then( data=>{
                   console.log( data )
                   //处理文件
                    console.log("上传文件成功，开始检测文件")
               })
           }
       }).catch(error=>{
           console.log( error )
       }) 

       

       //处理上传文件
       //
       
       const handleExcelPromise = new Promise( (resolve,reject ) =>{
            //
       })
    
    }
   }
    render(){ 
        return (
            <div>
                <TopNav home title="导入项目信息"></TopNav>
                <form id="formForIE" method="post" encType="multipart/form-data">
                       <input type="file"/>
                </form>
                <button onClick={ this.handleSumbit }>上传</button>
            </div>
        );
      }
    };
    

const mapStateToProps = (state) => {
    const projects = state.projectList;
    return{
        
    }
}


//或者
const mapDispatchToProps = (dispatch) => ({
  
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ImportProjectInfo));
