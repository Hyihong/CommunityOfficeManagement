
import React from 'react'
import ReactDOM from 'react-dom'
import { Flex,PullToRefresh,ListView,NoticeBar,WhiteSpace,List,WingBlank } from 'antd-mobile';
import { Link,Switch,Route} from 'react-router-dom';
import Animate  from 'rc-animate';
import TopNav from '../components_m/shared/views/TopNav'
import { getQueryString} from '../tools/baseTools'
import { view as projectDetail} from '../components_m/projectDetail'
const Item = List.Item ;

function getPageStatus(pathname){
    const _pathArr = pathname.split('/');
    switch( _pathArr[_pathArr.length -1] ){
      case 'projectDetail' : return 0 ;
      case 'callingNumber' : return 1;  
      case 'device' : return 2;  
      default  : return 0 ; 
    }
}
class ProjectDetail extends React.Component {
    constructor(props) {
      super(props);
      this.state={
         scrollTop:0,
         pageFlag:getPageStatus( this.props.location.pathname )
      }
    };
    componentDidMount() {
         this.projectID = getQueryString(this.props.location.search,'ID' );
    }
    componentDidUpdate(nextProps,nextStates) {
        if(this.props.location.pathname !== nextProps.location.pathname){
            this.setState({
              pageFlag : getPageStatus( this.props.location.pathname )
            })
        }
     }

    onItemClick =()=>{}

  render(){
    let renderContent;
    if( this.state.pageFlag ){
      renderContent=(
        <Switch >
            <Route  exact path= {"/home/projectDetail/callingNumber"}  component={projectDetail}/> 
            <Route  exact path= {"/home/projectDetail/device"}  component={projectDetail}/> 
        </Switch> 
      )
    }else{
      renderContent = (
        <div>
            <TopNav home title="项目数据" ></TopNav>
            <WhiteSpace/>
            <Animate  transitionName="fade" transitionAppear>
                <List>
                  <Item arrow="horizontal" multipleLine  onClick={this.onItemClick}>
                        <Link to={{ pathname: "/home/projectDetail/callingNumber",search:`?id=${getQueryString(this.props.location.search,'ID' )}`}}>
                              <div style={{color:"#333"}}>电信码号</div>
                        </Link>
                  </Item>  
                  <Item arrow="horizontal"  multipleLine  onClick={this.onItemClick}>
                      <Link to={{ pathname:"/home/projectDetail/device",search:`?id=${getQueryString(this.props.location.search,'ID' )}` }}>
                            <div style={{color:"#333"}}>设备类型</div>
                      </Link>
                  </Item>
              </List>  
          </Animate>
        </div>
      )
    }
    return (
      <div>
          { renderContent }
      </div>
    );
  }
};

export default ProjectDetail;







