import React from 'react';
import { connect } from 'react-redux';
import { Link,withRouter,Prompt   } from 'react-router-dom'
import ReactDOM from 'react-dom';
import { fetchRoomInfo,SetRoomStatus,saveViewSize} from './actions'
import { Flex,ListView,WingBlank,Toast } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import Animate from 'rc-animate';
import TopNav from '../shared/views/TopNav'
import { view as Search } from '../search'
import { getQueryString } from '../../tools/baseTools'
import './style.less'

//房间列表View
class RoomList extends React.Component {
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
            const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this._listViewOccupy).offsetTop;
            this.props.saveViewSize({
                scrollContainterHeight : hei
            })

         //判断刷新
         if( this.props.history.action.toLowerCase() === 'pop' && !!this.props.roomData ){
             this.scrollPosition = this.props.viewSize.scrollPosition;
             setTimeout( ()=>{
                this.lv.scrollTo(0,this.props.viewSize.scrollPosition);
            },100)
             return;
         }else{
             //通过项目ID获取房间信息
            const buildingID = getQueryString( this.props.location.search,'ID' ); 
            this.props.fetchRoomInfo( buildingID );
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
            isListViewBlur:0,
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
    
    _renderRow=(rowData,rowId,sectionId)=>{
         return(
            <Animate  transitionName="fade" transitionAppear >
                <div  className={ `build-item ${ rowData.Status ? "enable":"disable"}`} >
                    <Flex>
                        <Flex.Item>
                            <div style={{textAlign:"left",marginRight:"20px",color:"#999",fontSize:"12px"}}>房间代码：{ rowData.Code}</div> 
                        </Flex.Item>
                        { parseInt( rowData.CustomerNumber,10 ) === 0 ? null :
                            <Flex.Item>
                                <div style={{textAlign:"right",marginRight:"10px"}}><Link to= { {pathname:"/home/virtualRoom",search:`?id=${rowData.ID}` }}><span className="tag">成员列表</span></Link></div> 
                            </Flex.Item>
                        }  
                        
                    </Flex>
                    <Flex>
                        <Flex.Item className="prefix">
                            <div className="image"></div>
                        </Flex.Item>
                        <Flex.Item className="content-wrapper">
                            <div className ="head" style={{}}>
                                <Link to= {{
                                        pathname:"/home/editRoom",search:`?id=${rowData.ID}` ,
                                        state: { 
                                            roomID: rowData.ID ,
                                            code:rowData.Code,
                                            name : rowData.Name,
                                            residentName:rowData.ResidentName,
                                            residentPhone:rowData.ResidentPhone,
                                            buildingID:  getQueryString( this.props.location.search,'ID' )
                                        }
                                        }}><icon className="fa fa-edit" style={{fontSize:"16px",lineHeight:"16px",marginRight:"5px"}}></icon>
                                    </Link>
                                    <b>{ rowData.Name }</b>
                            </div>
                            <ul className="roomInfo">
                                    <li><span>业主姓名</span>：<strong> {rowData.ResidentName}</strong></li>
                                    <li><span>联系电话</span>：<strong>{rowData.ResidentPhone}</strong></li>
                                    <li><span>业主性别</span>：<strong>{rowData.Gender}</strong></li>
                            </ul>
                        </Flex.Item>
                        <Flex.Item className="switch">
                            <div className="switch-btn" onClick={ ()=> this.props.SetRoomStatus(rowData.ID,Number(!rowData.Status),rowId)}>{ rowData.Status ? '禁用':'启用'}</div>
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
           if( !!this.props.roomData ){
                    this.props.roomData.map( item =>{
                        if( !!item[0].Name){
                            if( item[0].Name.indexOf( search) !== -1 || item[0].Code.indexOf( search) !== -1 ){
                                dataSource.push( item ) 
                           }
                        }
               })
               
           }
       }else{
           dataSource = this.props.roomData;
       }
       
        return(
            <div>
                {/* 搜索 */}
                <Search style={{display:this.state.showSearch}} 
                         hasListViewMask={this.state.hasListViewMask}
                         onCancel={ this.onSearchCancel } 
                         onSubmit={this.onSearchSubmit} 
                         onChange ={ this.onSearchChange }
                         onFocus = { this.onSearchFocus }
                         placeholder ="搜索房间代码或房间名称"
                         searchList = {this.state.searchList}
                ></Search>
                {/* 顶部导航 */}
                <TopNav home search onSearchClick = { this.onSearchClick } ></TopNav>   
                {/* 列表*/}
                <div ref ={el => this._listViewOccupy = el}></div>
                <QueueAnim> 
                <div id="leelen-room-listview" style={{opacity:this.state.isListViewShow}} className={ this.state.isListViewBlur ? "blur":"" } key="1"> 
                    <WingBlank size="ls">  
                        <ListView
                            ref={ el => this.lv = el }
                            initialListSize={ !!this.props.viewSize.scrollPosition ? this.props.viewSize.scrollPosition / 180 + 5: 10}
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
                            renderHeader={() => <span style={{color:"#fff"}}>{ !!search? "搜索结果":"房间列表" }(共{ !!dataSource ? dataSource.length:"0"}条数据)</span>}
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
               
                { !!search ?   null :  <span className="leelen-add-btn">
                    <Link to={ { pathname:"/home/createRoom",search: `?id=${getQueryString( this.props.location.search,'ID' )}`,state:{buildingID:getQueryString( this.props.location.search,'ID' )}} }>
                        <icon className="fa fa-plus" style={{color:"#fff"}}></icon>
                    </Link>
                    </span> }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
     const rl =  state.roomList ;
     return{
        roomData:rl.Data,
        loadingStatus:rl.status,
        viewSize:rl.viewSize,
          
     }
}
const mapDispatchToProps = (dispatch) => ({
    fetchRoomInfo: ( buildingID ) => {
     dispatch( fetchRoomInfo( buildingID ));
    },
    SetRoomStatus : (buildingID, b,index ) =>{
        dispatch( SetRoomStatus(buildingID,b,index) );
    },
    saveViewSize:(option)=>{
        dispatch( saveViewSize(option) );
    }
});

export default  withRouter( connect(mapStateToProps, mapDispatchToProps)(RoomList) );
