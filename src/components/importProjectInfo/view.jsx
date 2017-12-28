import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Upload,Button,Icon ,Row,Col,Form,Modal,Select} from 'antd'
import { actions as projectListAction } from '../projectList'
import { Return } from '../shared';
import { getQueryString } from '../../tools/baseTools'
import $ from 'jquery'
import 'jquery-form'
import './style.less'



const Dragger = Upload.Dragger;
const Item = Form.Item;
const { fetchAllProjects } = projectListAction ;

const itemLayout = {
    labelCol: {  md:{span:5} , sm:{span:8} },
    wrapperCol :{  md:{span:19} , sm:{span:16} }
}


class ImportProjectInfo extends React.Component {
   constructor(){
     super()
     this.state = {
        fileList: [],
        uploading: false,
        renderFlag:'',
        projectID:'init',
        hasFormDataApi: !!window.FormData ,
        _ie_filename:""
      }
   }
   componentWillMount(){
       document.title="导入业主数据";
   }
   componentDidMount(){
      const projectID = getQueryString( this.props.location.search,'ID' );   
      
      // S 表示三种渲染条件
      // 1 => 有ID,有数据 （从列表页进入）
      // 2 => 有ID,无数据  (用户手动刷新)
      // 3 => 无ID,有数据  (用户从首页导航链接进入，已加载过项目列表)
      // 4 => 无ID,无数据  (用户从首页导航链接进入，未加载过项目列表)

      let S = !!projectID ? ( !!this.props.projects.Data ?  1 : 2) : ( !!this.props.projects.Data ? 3 : 4 )
      this.setState({renderFlag: S,projectID:projectID})

      if( S === 2 || S ===4){
          //进行项目数据加载
          this.props.fetchAllProjects();
      }
   }

   //根据项目Id，检索到该项目的名称
   getProjectName =( id ) =>{
        let n ;
        this.props.projects.Data.map( item =>{
            if( item.ID === id ){
                n = item.Name ;
            }
            return null;
        })
        return n;
   }

   //用户手动选择项目
   handleSelectChange = (value)=>{
       this.setState({projectID:value})
   }

   //IEhank,监听文件选择
   changeFile =(e)=>{
       let filename =  document.getElementById("uploadFile").value;
       if (!(/xls$|xlsx$|xlsm$/).test( filename )) {
            Modal.warn({
                title:"您选择上传的文件类型有误！",
                content:"请上传后缀名为.xls, .xlsx, .xlsm的Excel文件"
            })
       }else{
           this.setState({
            _ie_filename:filename
           })
       }
   }
   
   //IE上传
   handleUploadForIEhack=()=>{ //IE hack
            const that = this ;
            $("#formForIE").ajaxSubmit({
                url: `/api/project/v1/importProjectInfo?projectid=${that.state.projectID}`, /*设置post提交到的页面*/
                type: "POST", /*设置表单以post方法提交*/
                dataType: "json", /*设置返回值类型为文本*///text/html
                beforeSubmit: ()=>{},
                success: function (result) {
                    if( result.Code === 0 ){
                          Modal.confirm({
                            title:"上传成功！",
                            okText:"查看项目详情",
                            cancelText:"继续导入",
                            onOk:()=>{                    
                                that.props.history.push(`/home/project/building?id=${that.state.projectID}`)
                            },
                            onCancel:()=>{
                                that.setState({
                                    fileList: [],
                                })
                            }
                        })
                    }else{
                        Modal.error({
                            title:'上传文件失败！(success回调返回)',
                            okText:"OK",
                            content:result.responseText
                        })
                    }
                },
                error: function (error) { 
                    Modal.error({
                        title:'上传文件失败(error回调返回)！',
                        okText:"OK",
                        content:"接受信息失败"
                    })
                },
               
            });
         return false;

   }
   //上传
   handleUpload =()=>{
        const { fileList } = this.state;
        
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('fileInfo', file);
        });
        formData.append('ie', 0);
        if( this.state.projectID === null ){
             return ;
        }
        //上传文件
        fetch(`/api/project/v1/importProjectInfo?projectid=${this.state.projectID}`, {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'no-cors',
            body: formData,
        }).then( (response) =>{
            if( response.status === 200){
                response.json().then(  result =>{
                    //console.log(result)
                    if( result.Code === 0 ){
                        Modal.confirm({
                            title:"上传成功！",
                            okText:"查看项目详情",
                            cancelText:"继续导入",
                            onOk:()=>{                    
                                this.props.history.push(`/home/project/building?id=${this.state.projectID}`)
                            },
                            onCancel:()=>{
                                this.setState({
                                    fileList: [],
                                })
                            }
                        })
                    }else{
                        Modal.error({
                            title:'上传失败！',
                            okText:"OK",
                            content:result.Message
                        })
                    }

                 },error =>{
                    Modal.error({
                        title:'上传失败',
                        okText:"OK"
                    })
                 })
            }else{
                Modal.error({
                    title:'上传失败',
                    okText:"OK",
                    content:"未能获取响应"
                })
            }
           
        })
        
   }
    render(){
        const uploadProps = {
            name: 'file',
            //action: `api/project/v1/importProjectInfo?projectid=${this.state.projectID}`,
            multiple:false,
            showUploadList:true,
            listType:"picture",
            accept:"file",
            beforeUpload: (file) => {
                if((/xls$|xlsx$|xlsm$/).test(file.name)){
                    this.setState({
                        fileList: [file],
                    });
                }else{
                    Modal.warn({
                        title:"您选择上传的文件类型有误！",
                        content:"请上传后缀名为.xls, .xlsx, .xlsm的Excel文件"
                    })
                }
               
            },
            onRemove: (file) => {
                //删除上传列表
                this.setState(
                      ({ fileList }) => {
                  const index = fileList.indexOf(file);
                  const newFileList = fileList.slice();
                  newFileList.splice(index, 1);
                  return {
                    fileList: newFileList,
                  };
                });
            },
            fileList: this.state.fileList
        };

        let renderContent ;
        const f = this.state.renderFlag;
        switch (f) {
            case 1: 
            case 2:{
                renderContent = (
                    <Item label="项目名称" {...itemLayout}>
                        { this.props.projects.status === 'success' ? 
                            <div> <b>{ this.getProjectName(this.state.projectID) }</b></div> : 
                            <div>
                                <b><span><Icon type="loading"></Icon> 正在加载项目信息... </span></b>
                            </div>
                         }
                    </Item>
                );
                break;
            }
            case 3:
            case 4: {
                //let validProps = this.state.projectID === null? { help:"请选择业主信息所要上传的项目" ,validateStatus:"error"} : null;
                renderContent = ( 
                    <Item label="请选择项目" {...itemLayout} >
                    <div>
                        {/* 无ID情况 */}
                        { this.props.projects.status ==='success' ? 
                            <Select placeholder="可输入项目名进行搜索"
                                    showSearch
                                    //value = {this.state.projectID}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onChange = { this.handleSelectChange }
                            >
                            { 
                                this.props.projects.Data.map( item =>{
                                    return ( <Select.Option key={item.Key} value={item.Key}>{ item.Name }</Select.Option>)
                                })
                            } 
                            </Select> : 
                            <Select  placeholder = { <div><Icon type="loading"></Icon>正在加载项目数据...</div>}></Select>
                        }
                    </div>
                    </Item>
                );
                break;
            }
            default:break;
        }
        
        return (

            <div>
                   <Return> 导入业主数据 </Return>  
                   <Row type="flex" justify="left">
                        <Col md={{span:12,offset:6}} sm={{span:15,offset:5}} xs={{span:18,offset:3}} >
                            <Form>
                                { renderContent }
                                { this.state.hasFormDataApi ? 
                                    <div>
                                        <Item label="上传文件" {...itemLayout} style={{color:"#1985ac"}}>
                                            <Dragger {...uploadProps}>
                                                <div >
                                                    <Icon type="inbox"></Icon>
                                                    <span style={{marginLeft:"5px"}}>{ this.state.fileList.length === 0 ? "请选择上传文件": "重新选择" }</span>
                                                </div>
                                            </Dragger>
                                            <div style={{color:"#999"}}>注：只接受后缀名为.xls, .xlsx, .xlsm的Excel文件</div>
                                        </Item>  
                                        <Item>
                                        <div style={{textAlign:"center",marginTop:"30px"}}>  
                                            <Button type="primary" 
                                                style={{width:"35%",marginBottom:"10px"}} 
                                                disabled = { this.state.projectID === null || this.state.fileList.length === 0}
                                                onClick={this.handleUpload}>确认上传
                                            </Button>
                                        </div>
                                        </Item>
                                     </div>
                                    : null
                                 }    
                               
                            </Form>    
                            { this.state.hasFormDataApi ? 
                                    null :
                                    <div style={{textAlign:"center"}}>
                                        <form id="formForIE" method="post" encType="multipart/form-data">
                                            <div id="uploadSection">
                                                <label htmlFor="uploadFile">上传文件:</label>
                                                <div id="tickForIE">
                                                    <div id="tickInput">
                                                        <p id="notice">请双击上次文件</p>
                                                        <input type="file" name="fileInfo" id="uploadFile" onChange = {this.changeFile} />
                                                    </div>
                                                    <p id="notice"  style={{color:"#999"}}>注：只接受后缀名为.xls, .xlsx, .xlsm的Excel文件</p>
                                                    {   this.state._ie_filename !== "" ? 
                                                        <div id="showFilename">
                                                            <Icon type="file" style={{fontSize:"22px",marginLeft:"10px"}}></Icon>
                                                            {this.state._ie_filename}
                                                        </div> : null
                                                    }
                                                </div>
                                                
                                            </div>
                                        </form>
                                        <Button 
                                              id="IEHackUploadBtn"
                                              type="primary" 
                                              style={{width:"35%",marginTop:"25px"}} 
                                              disabled = {false }
                                              onClick={this.handleUploadForIEhack}>确认上传
                                        </Button>
                                    </div>
                            }                            
                        </Col>
                    </Row>
            </div>
        );
      }
    };
    
const WrappedImportProjectInfo = Form.create()(ImportProjectInfo);

const mapStateToProps = (state) => {
    const projects = state.projectList;
    return{
        projects: projects
    }
}


//或者
const mapDispatchToProps = (dispatch) => ({
    fetchAllProjects: () => {
        dispatch( fetchAllProjects());
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedImportProjectInfo));
