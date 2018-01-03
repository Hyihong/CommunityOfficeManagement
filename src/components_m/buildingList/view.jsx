
import React from 'react';
import { connect } from 'react-redux';
import { Link,withRouter,Prompt   } from 'react-router-dom'
import ReactDOM from 'react-dom';
import { fetchProjectBuildings , SetBuildingStatus ,saveViewSize} from './actions'
import { Flex,ListView,WingBlank,Steps,Toast,WhiteSpace  } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import Animate from 'rc-animate';
import TopNav from '../shared/views/TopNav'
import { view as Search } from '../search'
import { getQueryString } from '../../tools/baseTools'
import './style.less'

const Step = Steps.Step;

//楼栋列表View
class Project extends React.Component {
    previousLocation = this.props.location

    constructor(props){
        super(props);
        var ds = new ListView.DataSource(
            { rowHasChanged: (r1, r2) => r1 !== r2 ,
              sectionHeaderHasChanged:(s1,s2) => s1!==s2,
            }
          );    
    
          this.state = {
            dataSoure:ds,
            //data
            listView:"",
            searchList:[],
            id:getQueryString( this.props.location.search,'ID' ),

            //view
            showSearch:'none',
            isListViewShow:1,
            isListViewBlur:0,
            hasListViewMask:1,
            isSearchFocus:0
          };
    }

    componentWillReceiveProps(nextProps) {
         //加载状态
        if( !!this.isOnSearch ){
           
        }else{
            if( nextProps.loadingStatus === 'loading' ){
                Toast.loading('Loading...', 0);
            }else{
                Toast.hide();
            }
        }
      
    }
    
    componentDidMount(){ 
         //设置列表滚动高度
            //const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this._lv).offsetTop;
            const hei = document.documentElement.clientHeight - this._listViewOccupy.offsetTop;
            this.props.saveViewSize({
                scrollContainterHeight : hei
            })

         //判断刷新
         if( this.props.history.action.toLowerCase() === 'pop' && !!this.props.bdData ){
             this.scrollPosition = this.props.viewSize.scrollPosition;
             setTimeout( ()=>{
                 this.lv.scrollTo(0,this.props.viewSize.scrollPosition);
             },100)
             return;
         }else{
             //通过项目ID获取楼栋信息
             setTimeout( ()=>{
                const projectID = getQueryString( this.props.location.search,'ID' ); 
                this.props.fetchProjectBuildings( projectID );
             },0)

         }
        
    }

    onScroll =(e)=>{
        this.scrollPosition = e.target.scrollTop
    }

    onSearchClick =()=>{
        this.setState({
            showSearch:'block',
            isListViewBlur:1,
            isSearchFocus:1,
        })
    }

    onSearchCancel =()=>{
        this.setState({
            showSearch:'none',
            isListViewBlur:0
        })
        if( !!getQueryString( decodeURI( this.props.location.search),'SEARCH' ) ){
            this.props.history.goBack();
        }
        this.lv.scrollTo(0,0);
    }

    onSearchFocus =()=>{
        this.setState({
            isListViewBlur:1,
            hasListViewMask:1
        })
    }

    onSearchSubmit=(value)=>{
        this.isOnSearch = true;
        this.setState({
            isListViewShow:0,
            isListViewBlur:0,
            isSearchFocus:0,
            hasListViewMask:0
        })
        Toast.loading('正在搜索...', 0.8,()=>this.setState({
            isListViewShow:1
        }));
        const { location } = this.props;
        let s = value;

        this.lv.scrollTo(0,0);
        
        //获取搜索条件
        if( !!getQueryString( decodeURI( this.props.location.search),'SEARCH' ) ){
            this.props.history.replace(`${location.pathname}?id=${this.state.id}&search=${s}` )
        }else{
            this.props.history.push( `${location.pathname}?id=${this.state.id}&search=${s}` )
        }
    }

    //实时搜索
    onSearchChange=( value )=>{
        // let r = [];
        // this.props.bdData.map( item =>{
        //     if( item[0].Name.indexOf( value) !== -1 ){
        //         r.push( item[0].Name )
        //     }
        // })
        // this.setState({
        //     searchList:r
        // })
    }

    _renderRow=(rowData,rowId,sectionId)=>{
         return(
             <Animate   transitionName="fade" transitionAppear>
                            <div  className={ `build-item ${ rowData.Status ? "enable":"disable"}`}>
                            <Flex>
                                <Flex.Item>
                                    <div style={{textAlign:"left",marginRight:"20px",color:"#999",fontSize:"12px"}}>楼栋代码：{ rowData.Code}</div> 
                                </Flex.Item>
                                <Flex.Item>
                                    <div style={{textAlign:"right",marginRight:"10px"}}><Link to= { {pathname:"/home/roomList",search:`?id=${rowData.ID}` }}><span className="tag">房间详情</span></Link></div> 
                                </Flex.Item>
                            </Flex>
                            <Flex>
                                <Flex.Item className="prefix">
                                    <div className="image"></div>
                                </Flex.Item>
                                <Flex.Item className="content-wrapper">
                                      <div className ="head" style={{}}>
                                      <Link to= {{
                                          pathname:"/home/editBuilding",search:`?id=${rowData.ID}` ,
                                          state: { 
                                            buildingID: rowData.ID ,
                                            code:rowData.Code,
                                            name : rowData.Name,
                                            projectID:  getQueryString( this.props.location.search,'ID' )
                                            }
                                        }}><icon className="fa fa-edit" style={{fontSize:"16px",lineHeight:"16px",marginRight:"5px"}}></icon></Link>
                                      <b>{ rowData.Name }</b>
                                      </div>
                                        <Steps size="samll" className="edit-progress" >
                                            <Step  status="finish" icon={<icon className="fa fa-circle" />} title={`创建者： ${rowData.CreateInfo.Creator}`} description={rowData.CreateInfo.Created}/>
                                            <Step  status="finish" icon={<icon className="fa fa-circle" />} title={`更新者： ${rowData.ModifyInfo.Modifier}`} description={rowData.ModifyInfo.Modified}/>
                                        </Steps>
            
                                </Flex.Item>
                                <Flex.Item className="switch">
                                     <div className="switch-btn" onClick={ ()=> this.props.SetBuildingStatus(rowData.ID,Number(!rowData.Status),rowId) }>{ rowData.Status ? '禁用':'启用'}</div>
                                </Flex.Item>
                            </Flex>
                         </div>
             </Animate>
         )
    }


    render(){
       let dataSource = [] ;
       let search = getQueryString( decodeURI( this.props.location.search),'SEARCH' );
       if( !!search  ){
           this.isSearchResult = true;
           if( !!this.props.bdData ){
                    this.props.bdData.map( item =>{
                        if( item[0].Name.indexOf( search) !== -1 || item[0].Code.indexOf( search) !== -1 ){
                                dataSource.push( item ) 
                        }
               })
               
           }
       }else{
           dataSource = this.props.bdData;
       }
  
        return(
            <div>
                {/* 搜索 */}
                <Search  style={{display:this.state.showSearch}} 
                         hasListViewMask={this.state.hasListViewMask}
                         onCancel={ this.onSearchCancel } 
                         onSubmit={this.onSearchSubmit} 
                         onChange ={ this.onSearchChange }
                         onFocus = { this.onSearchFocus }
                         placeholder ="搜索楼栋代码或楼栋名称"
                         searchList = {this.state.searchList}
                         focus ={ this.state.isSearchFocus }
                ></Search>
                {/* 顶部导航 */}
                <TopNav home search onSearchClick = { this.onSearchClick } ></TopNav> 
                {/* 列表 */}
                <div ref ={el => this._listViewOccupy = el}></div>
                <QueueAnim >   
                <div id="leelen-buidling-listview" style={{opacity:this.state.isListViewShow}} key="1" className={ this.state.isListViewBlur ? "blur":"" }>
                    <WingBlank size="ls">  
                        <ListView
                            ref={el => this.lv = el}
                            initialListSize={ !!this.props.viewSize.scrollPosition ? this.props.viewSize.scrollPosition / 180 + 5: 10 }
                            style={{height:this.props.viewSize.scrollContainterHeight }}
                            dataSource={ 
                                    this.state.dataSoure.cloneWithRowsAndSections( !!dataSource ? dataSource :[] ) 
                                }
                            renderRow={ (rowData,rowId,sectionId)=>this._renderRow(rowData,rowId,sectionId)}
                            renderSeparator={
                                (sectionID, rowID, adjacentRowHighlighted)=>(
                                    <div key={rowID}></div>
                                )
                            }
                            onScroll ={(e)=>this.onScroll(e)}
                            scrollRenderAheadDistance ={600}
                            renderHeader={() => <span style={{color:"#fff"}}>{ !!search? "搜索结果":"楼栋列表" }(共{ !!dataSource ? dataSource.length:"0"}条数据)</span>}
                        />
                    </WingBlank> 
                </div>
                </QueueAnim>  
                <Prompt when ={ true } message={(location)=>{
                        //通过Prompt,作为onLeave钩子
                        this.props.saveViewSize({
                            scrollPosition : this.scrollPosition
                        })
                        return null;
                    }}></Prompt>   
                {/* 新增按钮 */}
                { !!search ?   null : <span className="leelen-add-btn">
                    <Link to={ { pathname:"/home/createBuilding",search: `?id=${getQueryString( this.props.location.search,'ID' )}`,state:{projectID:getQueryString( this.props.location.search,'ID' )}} }>
                        <icon className="fa fa-plus" style={{color:"#fff"}}></icon>
                    </Link>
                </span>}
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
     const bl =  state.buildingList.buildingList ;
     return{
        bdData:bl.Data,
        viewSize:state.buildingList.viewSize,
        loadingStatus:bl.status
          
     }
}
const mapDispatchToProps = (dispatch) => ({
    fetchProjectBuildings: ( projectID ) => {
     dispatch( fetchProjectBuildings( projectID));
    },
    SetBuildingStatus : (buildingID, b,index ) =>{
        dispatch( SetBuildingStatus(buildingID,b,index) );
    },
    saveViewSize:(option)=>{
        dispatch( saveViewSize(option) );
    }
});

export default  withRouter( connect(mapStateToProps, mapDispatchToProps)(Project) );
