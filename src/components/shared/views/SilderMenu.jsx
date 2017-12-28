// ***  ***
// ***  file description: 侧边菜单 ***
// ***  ***
import React from 'react'
import { Menu,Icon } from 'antd';
import { connect } from 'react-redux';
import { Link,withRouter} from 'react-router-dom';
import { changeMenu, menuitemclick,initialize} from '../actions'
//import logo from '../../../assets/images/logo.png'
const { Item, SubMenu } = Menu;

class SilderMenu extends React.Component{
    componentWillMount(){
        const {location,onInitializeMenu} = this.props;
        //根据一级，二级路由，判断菜单展开和选中状态 
        const _location = location.pathname.split('/');
        const _locationLen = _location.length;
        let initCurrent ;
        
        if( _locationLen <=2 ){
            if(location.pathname==="/"){
                 initCurrent = "/home";
            }else{
               initCurrent = location.pathname;
            }
            
        }else{
            initCurrent = `/${_location[1]}/${ _location[2]}`
        }
        const openKeys = [ _location[1] ]

        onInitializeMenu(initCurrent,openKeys ) 

    }
  
    handleMenuClick = (e) =>{
        const {  onClickMenuItem,onOpenChange} = this.props; 
        onClickMenuItem(e.key)
        //如果是一级路由，则收起菜单列表
        if(e.key.split("/").length<=2){
             onOpenChange([])
        }
    }


   //只展开当前父级菜单
    handleOpenChange =( newOpenKeys )=>{
        const {  openKeys,onOpenChange } = this.props; //原数据
        const latestOpenKey = newOpenKeys.find(key => !(openKeys.indexOf(key) > -1));
        const latestCloseKey = openKeys.find(key => !(newOpenKeys.indexOf(key) > -1));
        let nextOpenKeys = [];
         if (latestOpenKey) {
            nextOpenKeys = this._getAncestorKeys(latestOpenKey).concat(latestOpenKey);
         }
        if (latestCloseKey) {
            nextOpenKeys = this._getAncestorKeys(latestCloseKey);
        }
        onOpenChange(nextOpenKeys)
    }

    _getAncestorKeys = (key) => {
        const map = {
           sub3: ['sub2'],
        };
        return map[key] || [];
    }

    render(){
        const {current, openKeys } = this.props;
                
        return(
            <div style={{flex: "0 0 175px", width: "175px",height:"100%",background:'rgb(51, 51, 51)'}}>
                <div className="logo" 
                         style={{height:'50px',background:"#333",lineHeight:"50px",color:"#1985ac",fontSize:"16px",textAlign:"center",fontWeight:'bold'}}
            >办事处管理系统</div>
                {/* <img src={logo} alt="logo" style={{width:"100%",height:"30px",float:'left'}}/> */}
                <Menu
                    theme="dark"
                    mode="inline"
                    openKeys={ openKeys }
                    selectedKeys={ [current]}
                    current = { current }
                    onOpenChange = { this.handleOpenChange }
                    onClick = {this.handleMenuClick}
                >
                    <Item key="/home"><Link to="/home"><Icon type="home"></Icon>首页</Link></Item>
                    <SubMenu key ='ui' title= { <div><Icon type="laptop" /><span>物业管理</span></div>}>
                        <Item key="/ui/counter"><Link to="/ui/counter"><Icon type="exception" />项目管理</Link></Item>
                        <Item key="/ui/about"><Link to="/ui/about"><Icon type="heart" />关于</Link></Item>
                        <Item key="/ui/weather"><Link to="/ui/weather" ><Icon type="heart" />天气查询</Link></Item>
                        <Item key="/ui/articles"><Link to={{pathname:"/ui/articles"}} ><Icon type="heart" />前端库排行</Link></Item>
                        <Item key="/ui/address"><Link to={{pathname:"/ui/address"}} ><Icon type="heart" />地址选择</Link></Item>
                    </SubMenu>
                    <SubMenu key ='other' title= { <div><Icon type="laptop" /><span>其他</span></div>}>
                        <Item key="/other/other1"><Link to="/other/other1">404</Link></Item>
                    </SubMenu>
                </Menu>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
     const shared = state.shared ;
     return {
         current: shared.current,
         openKeys: shared.openKeys,
    };
}

const mapDispatchToProps = (dispatch, ownProps) =>{
    return {
        onOpenChange:  newOpenKeys  => {
            dispatch( changeMenu(newOpenKeys));
        },
        onClickMenuItem : current => {
            dispatch( menuitemclick(current) )
        },
        onInitializeMenu : (current,OpenKeys) =>{
            dispatch( initialize(current,OpenKeys))
        } 

    }
       
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(SilderMenu)) ;