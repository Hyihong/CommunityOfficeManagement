import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getQueryString } from '../../tools/baseTools'
import {Button,WingBlank,Flex,Toast} from 'antd-mobile'
import TopNav from '../shared/views/TopNav'
import ProgressCircle from '../shared/views/ProgressCircle'
import $ from '../../tools/jquery.min.js'
//import 'jquery-form'
import './style.less'

const FILE_TYPE_CHECK_INFO = "只接受后缀名为.xls, .xlsx, .xlsm的Excel文件" ;
const FILE_NAME_PLACEHOLDER= "请选择上传文件";

class ImportProjectInfo extends React.Component {
   constructor(){
     super()
     this.state = {
         filename:FILE_NAME_PLACEHOLDER,
         btnDisable:true,
         fileUploading:false,
         uploadPercentage:0
     }
   }
   componentDidMount(){
      this.projectID = getQueryString( this.props.location.search,'ID' );   
   }
   handlefileInputChange=()=>{
      if(this.file.files.length > 0 ){
            let filename = this.file.files[0].name;
            if ( /.xls$|.xlsx$|.xlsm$/.test( filename ) ){
                this.setState({
                    filename:filename,
                    btnDisable:false
                })
            }else{
                Toast.info(FILE_TYPE_CHECK_INFO);
                if( this.state.filename !==FILE_NAME_PLACEHOLDER){
                    this.setState({
                        filename:FILE_NAME_PLACEHOLDER,
                        btnDisable:true
                    })
                }
            }
      }else{
            this.setState({
                filename:FILE_NAME_PLACEHOLDER,
                btnDisable:true
            })
      }
      
   }

   handleSumbit=()=>{
       var that = this;
       //上传文件UI
       this.setState({
            fileUploading:true,
            btnDisable:true
       })
       //开始上传文件
       let file = this.file.files[0];
       let data = new FormData();
       data.append("file",file)
       
       $.ajax({
           url:`/api/project/v1/importProjectInfo?projectid=${this.projectID}`,
           type:"POST",
           processData:false,
           contentType :false,
           data:data,
           success:(result)=>{
               console.log( result )
           },
           error:(error)=>{
               console.log(error)
           },
           xhr:()=>{
                let xhr = $.ajaxSettings.xhr();
                xhr.upload.onprogress = function (e) {  
                    if(e.lengthComputable ){
                        that.setState({
                            uploadPercentage:(e.loaded/e.total )*100
                        })
                    }

                }  
               return xhr;
           }
       })
   }

    render(){ 
        const { fileUploading } = this.state ;
        return (
            <div>
                <div>
                <TopNav home title="导入项目信息"></TopNav>
                <WingBlank>
                    <form id="fileForm" method="post" encType="multipart/form-data">
                       <Flex>
                           <Flex.Item style={{flex:"0 1 auto"}}>
                                <div className="chose-icon" >
                                    <icon className="fa fa-cloud-upload" style={{fontSize: fileUploading ? "30px":"60px",color:"#fff"}}></icon>
                                    <input ref={ el => this.file= el} type="file" style={{display:fileUploading ? "none": "display" }}onChange={this.handlefileInputChange}/>
                                </div>
                           </Flex.Item>
                           <Flex.Item>
                               <div className="fileName">
                                   <h3 style={{color:"#fff"}}>{this.state.filename} </h3>
                                   <h5 style={{color:"#e7615c",height : fileUploading ? "0" :"auto"}}>注：{FILE_TYPE_CHECK_INFO}</h5>
                                </div>
                           </Flex.Item>
                       </Flex>
                    </form>
                    <div className="progress">
                        <ProgressCircle percentage={ parseInt( this.state.uploadPercentage,10) } ></ProgressCircle>
                    </div>
                    <Button  type="primary" disabled={this.state.btnDisable}  onClick={ this.handleSumbit } style={{marginTop: fileUploading? "20px":"100px" }}>上传</Button>
                </WingBlank>
                
            </div>
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
