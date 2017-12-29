
import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { fetchAllProjects,wakeOperationPanel,saveViewSize } from './actions'
import { Flex,ListView,Card,WhiteSpace,WingBlank,Grid,Toast   } from 'antd-mobile';
import Transition from 'react-transition-group/Transition';
import './style.less'
import TopNav from '../shared/views/TopNav'
import '../../assets/font-awesome-4.7.0/less/font-awesome.less'

class ProjectList extends React.Component {
    constructor(props) {
      super(props);
      var ds = new ListView.DataSource(
        { rowHasChanged: (r1, r2) => { 
             return r1 !== r2 },
          sectionHeaderHasChanged:(s1,s2) => s1!==s2,
        }
      );    
      this.state = {
        dataSource:ds,
      };
    };

    componentWillMount(){
         //判断已审核列表 || 未审核列表
         let { pathname } = this.props.location;
         let pathArray = pathname.split('/');
         if( pathArray[ pathArray.length -1 ] === "projectListAuditing"){
             this.isProjectListAuditing = true;
         }
    }
    componentWillReceiveProps(nextProps,nextState) {
        if (nextProps.data !== this.props.data) {
            this.isOwnPageFlag= true;
        }
        //加载状态
        if( nextProps.loadingStatus === 'loading' ){
            Toast.loading('Loading...', 0);
        }else{
            Toast.hide()
        }
    }
   
   componentDidMount() {
        //设置列表滚动高度
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        this.props.saveViewSize({
            scrollContainterHeight : hei
        })
        //判断刷新
        if( !!this.props.data ){
            this.lv.scrollTo(0,this.props.viewSize.scrollPosition);
            return;
        }else{
            this.props.fetchAllProjects();
        }
  }

  shouldComponentUpdate(nextProps, nextState){
     if(this.props.history.action.toLowerCase() === 'pop' && !!this.props.data){
         if(this.isOwnPageFlag){
             return true;
         }else{
             return false;
         }
     }
     return true;
  }

  //打开操作栏
  wakeOperationPanel = ( sectionID )=>{
        this.props.wakeOperationPanel(sectionID);
  }

  //点击宫格
  operateBtnOnclick=(el,proID)=>{
    this.props.saveViewSize({
        scrollPosition : this.scrollPosition
    })
    switch(el.text){
        case '修改申请': this.props.history.push(`/home/applyModify?id=${proID}`);break;
        case '楼栋管理': this.props.history.push(`/home/buildingList?id=${proID}`);break;
        case '更多信息': alert("开发中...");break;
        // this.props.history.push(`/home/apply?id=${proID}`)
        default:;
    }
  }

  onScroll =(e)=>{
      this.scrollPosition = e.target.scrollTop
  }

  onEndReached =()=>{
  }

  _renderRow = (rowData, sectionID, rowID, highlightRow)=>{
    return(
        <div style={{display: this.isProjectListAuditing ? ( rowData.Status ? "none" :"block"): ( rowData.Status ? "block" :"none") }}>  
            <Card full className={rowData.Status ? "audited" :"auditing"} >
                <Card.Header
                    title={ 
                        <div>
                            <div style={{color:'#fff',fontSize:'20px',lineHeight:2}}><i className="fa fa-building-o" aria-hidden="true" style={{fontSize:"16px"}}></i><b> {rowData.Name}</b></div>
                            <div style={{color:"#d9d9d9",fontSize:"14px"}}>ID:{rowData.ID}</div>
                        </div>
                     }
                />
                <Card.Body>
                    <div className={ `info-panel ${ rowData.operatePanelAwake ? 'awake':'sleep'}` } >
                        <div className="fold-guide">
                               <div onClick={ ()=>this.wakeOperationPanel(sectionID) }>

                                    
                                    { rowData.operatePanelAwake ? <icon className="fa fa-arrow-circle-right" style={{fontSize:"30px"}}></icon>:<icon className="fa fa-arrow-circle-left" style={{fontSize:"30px"}}></icon>}
                                </div>
                        </div>
                        <ul className="project-card">
                            <li>
                                <Flex className="grid-wrapper">
                                    <Flex.Item>
                                            <div>{ rowData.Master }</div>
                                            <div>负责人</div>
                                    </Flex.Item >
                                    <Flex.Item>
                                            <div>{ rowData.Contactor }</div>
                                            <div>联系人</div>
                                    </Flex.Item>
                                    <Flex.Item>
                                            <div>{ rowData.DeviceCount }</div>
                                            <div>设备数量</div>
                                    </Flex.Item>
                                </Flex>
                            </li>
                            <li className="contact"><div>T e l :</div><div>{rowData.Contact}</div></li>
                            <li className="address"><div>地  址:</div><div>{rowData.Address || "暂无数据"}</div></li>
                            <li className="desc"><div>描  述:</div><div>{rowData.Desc || "暂无数据"}</div></li>
                            <li className="status"><div>状  态:</div><div> { rowData.Status ? "已通过" :"审核中"}</div></li>
                          
                        </ul>
                    </div>
                    <div className={ `operate-panel ${ rowData.operatePanelAwake ? 'awake':'sleep'}` }>
                        {
                            rowData.Status ?  <Grid columnNum={1} data={[{
                                icon:<icon className="fa fa-object-group"></icon>,
                                text:"楼栋管理"
                                },{
                                    icon:<icon className="fa fa-info"></icon>,
                                    text:"更多信息",
                                }] }
                                onClick={ (el,index)=>this.operateBtnOnclick(el,rowData.ID) }
                                />  : <Grid columnNum={1} data={[{
                                    icon:<icon className="fa fa-pencil"></icon>,
                                    text:"修改申请"
                                    }] } 
                                    onClick={ (el)=>this.operateBtnOnclick(el,rowData.ID) }
                                /> 
                        }
                    </div>
                    
                </Card.Body>
                </Card>
           <WhiteSpace size="lg"/>        
        </div>
                
    )
  }

  render(){   
    return (
      <div>
           <TopNav home title={ this.isProjectListAuditing ? "未审核项目列表":"已审核项目列表"}></TopNav>
           <WingBlank size="ls">    
           <Transition timeout={3000}>  
                <div id="leelen-listview">
                    <ListView
                        ref={el => this.lv = el}
                        style={{ height:this.props.viewSize.scrollContainterHeight,transition:"opacity 1000ms ease-in-out" }}
                        initialListSize={ 500 }
                        dataSource={ this.state.dataSource.cloneWithRowsAndSections( !!this.props.data ? this.props.data : []) }
                        renderRow={ (rowData,rowId,sectionId)=>this._renderRow(rowData,rowId,sectionId)}
                        renderSeparator={
                            (sectionID, rowID, adjacentRowHighlighted)=>(
                                <div key={rowID}></div>
                            )
                        }
                        renderHeader={() => <span></span>}
                        onScroll ={(e)=>this.onScroll(e)}
                    />
                </div>
           </Transition >      
           </WingBlank>  
      </div>
    );
  }
};

const mapStateToProps = (state) => {
    const pl = state.projectList ;
    return{
        data:pl.Data,
        viewSize:pl.viewSize,
        loadingStatus:pl.status
    }
}


const mapDispatchToProps = (dispatch) => ({
    fetchAllProjects: () => {
        dispatch( fetchAllProjects() );
    },
    wakeOperationPanel:(sectionID)=>{
        dispatch( wakeOperationPanel(sectionID) );
    },
    saveViewSize:(option)=>{
        dispatch( saveViewSize(option) );
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
