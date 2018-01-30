import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getQueryString } from '../../tools/baseTools'
import {Button,WingBlank,Flex,Toast,WhiteSpace } from 'antd-mobile'
import TopNav from '../shared/views/TopNav'
import ProgressBar from '../shared/views/ProgressBar'
import generateGuid from 'uuid/v4'
//import $ from '../../tools/jquery.min.js'
import $ from 'jquery'
import './style.less'

const FILE_TYPE_CHECK_INFO = "只接受后缀名为.xls, .xlsx, .xlsm的Excel文件" ;
const FILE_NAME_PLACEHOLDER= "请选择上传文件";
const NETWORK_INFO ="请确保处于良好的网络环境，不要关闭浏览器..."
const INFO_ICON_CLASS = {
    loading: "fa fa-spin fa-spinner",
    success: "fa fa-check",
    failure: "fa fa-close",
  };
const UPLOAD_INDO={
    loading: "正在上传文件...",
    success: "文件已成功上传！",
    failure: "文件上传失败！",
}
const  MANIPULATE_INDO={
    loading: "正在为您处理数据，可能需要几分钟，请耐心等待(功能开发中)...",
    success: "数据处理完毕！",
    failure: "处理数据时发生错误！",
}



class ImportProjectInfo extends React.Component {
   constructor(){
     super()
     this.state = {
         filename:FILE_NAME_PLACEHOLDER,
         btnDisable:true,
         fileUploadingProgress:'ready',//ready->loading->sucess|fauilre
         uploadPercentage:0,
         isProgressShow:false,
         progressStep:'ready', //ready->upload->manipulate

         second1:0
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
                    btnDisable:false,
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
       //判断文件 size : B
       let size_kb =this.file.files[0].size / 1024;

       //上传文件UI
       this.setState({
            fileUploadingProgress:"loading",
            isProgressShow:true,
            progressStep:'upload'
       })
       //开始上传文件
       let file = this.file.files[0];
       let data = new FormData();
       data.append("file",file) 
  
       let _guid = generateGuid();
       let clock1 = setInterval( ()=>{
           this.setState({
               second1 :this.state.second1 + 1
           })
       },1000)
       $.ajax({
           url:`/api/project/v1/importProjectInfo?projectid=${this.projectID}&guid=${_guid}`,
           type:"POST",
           processData:false,
           contentType :false,
           data:data,
           success:(result)=>{
                clearInterval(clock1);
                if ( JSON.parse( result ).Code.toString() === "0"){
                that.setState({ uploadPercentage:100 });
                setTimeout( ()=>{
                    this.setState({
                        fileUploadingProgress:"success",
                        //进入数据处理流程
                        progressStep:'manipulate'
                    })
                    //轮询获取上传进度
                    this.trackProgress(_guid);
                },600)

                

               }else{
                   alert( JSON.parse( result ).Message )
               }
           },
           error:(error)=>{
               console.log(error)
           },
           xhr:()=>{
                let xhr = $.ajaxSettings.xhr();
                if( 'onprogress' in window){
                    xhr.upload.onprogress = function (e) {
                        if(e.lengthComputable ){
                            if(e.loaded !== e.total ){
                                that.setState({
                                    uploadPercentage:(e.loaded/e.total )*100
                                })
                            }
                        }
                    }  
                }else{
                    that.setState({
                        uploadPercentage:20
                    })
                }
               return xhr;
           }
       })
   }
   trackProgress =(guid)=>{
        fetch(`/api/project/v1/trackprogress?guid=${guid}`,{
            credentials: 'same-origin',
        }).then(
            response=>{
                if( response.status === 200){
                    response.json().then( data=>{
                        console.log(data)
                    })
                }else{
                    console.log("获取文件进度失败")
                }
            }
        )
   }
   

    render=()=>{ 
        const { fileUploadingProgress,progressStep } = this.state ;
        let isUploadReady = fileUploadingProgress === 'ready' ;
        return (
            <div>
                <div>
                <TopNav home title="导入项目信息"></TopNav>
                <WingBlank>
                    <form id="fileForm" method="post" encType="multipart/form-data">
                       <Flex>
                           <Flex.Item style={{flex:"0 1 auto"}}>
                                <div className="chose-icon" >
                                    <icon className="fa fa-cloud-upload" style={{fontSize: isUploadReady ? "60px":"30px",color:"#fff"}}></icon>
                                    <input ref={ el => this.file= el} type="file" style={{display:isUploadReady ? "display": "none" }}onChange={this.handlefileInputChange}/>
                                </div>
                           </Flex.Item>
                           <Flex.Item>
                               <div className="fileName">
                                   <h3 style={{color:"#fff"}}>{this.state.filename} </h3>
                                   <h5 style={{color:"#e7615c",height : isUploadReady ? 'auto' :'0'}}>注：{FILE_TYPE_CHECK_INFO}</h5>
                                </div>
                           </Flex.Item>
                       </Flex>
                    </form>
                    <div className="progress" style={{height:this.state.isProgressShow ? 'auto' :'0',opacity:this.state.isProgressShow?1:0 }}>
                        <WhiteSpace/>
                        <hr/>
                        <WhiteSpace/>
                        <div className="progress-info">
                            <h3><icon className={ INFO_ICON_CLASS[ fileUploadingProgress] }></icon><span>{ UPLOAD_INDO[fileUploadingProgress]} </span></h3>
                            {
                                progressStep === 'manipulate' ?
                                 <h3><icon className={ INFO_ICON_CLASS['loading'] }></icon><span>{ MANIPULATE_INDO['loading']} </span></h3> 
                                 : null
                            }
                        </div>
                        <ProgressBar percentage={ 
                             progressStep === 'upload' ? 
                             parseInt( this.state.uploadPercentage,10) : 0 }
                        >
                        </ProgressBar>
                    </div>
                    <Button  type="primary" disabled={this.state.btnDisable}  onClick={ this.handleSumbit } style={{display: isUploadReady? "block":"none",marginTop:"30px"}}>上传</Button>
                </WingBlank>
                <div>上传文件API计时器:{this.state.second1}秒</div>
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
