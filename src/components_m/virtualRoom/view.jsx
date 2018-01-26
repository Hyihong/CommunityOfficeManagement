
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { fetchVirtualRoomInfo} from './actions'
import { WhiteSpace,List,Toast  } from 'antd-mobile';
import { getQueryString } from '../../tools/baseTools'
import TopNav from '../shared/views/TopNav'
import './style.less'

const Item = List.Item;

//房间列表View
class SurRoom extends React.Component {
    constructor(props){
        super(props)
        this.state={
            islistItemFold:[]
        }
    }
    componentDidMount(){
        //获取成员数据
        this.props.fetchVirtualRoomInfo( getQueryString( this.props.location.search,'ID' ) )
    }

    componentWillReceiveProps(nextProps){
        const { status } = nextProps ;
        if( status !== this.props.status){
            if( status === 'loading' ){
                Toast.loading('Loading...', 0);
            }else{
                Toast.hide();
            }

            if( status === 'success' ){
                this.setState({
                    islistItemFold: new Array( nextProps.data.length ).fill(1)
                })
            }
        }
    }

    onSuperLineClick=(key)=>{
        let _ = this.state.islistItemFold.concat().fill(1);
        if( this.state.islistItemFold[key]  ){
            _[key] = !_[key];
        }
        
        this.setState({
            islistItemFold : _
        })
    }
    render(){
        const { data } = this.props;
        return(
            <div>
                <TopNav home title="云对讲用户" ></TopNav>
                <WhiteSpace></WhiteSpace>  
                <List id="leelen-subroom-list">
                        {!!data ? 
                            data.map( (item,idx)=>{
                                 return(
                                    <div key={ item.key }>
                                        <Item arrow="horizontal" onClick={ ()=>this.onSuperLineClick(idx) } thumb={ <icon className="fa fa-heart-o"></icon> }>用户名：{item.CustomerName}</Item>
                                        <List className="sub" style={{ height:this.state.islistItemFold[idx] ? 0:"141px"}}>
                                            <Item extra={ item.CustomerPhone}>电话</Item>
                                            <Item extra={ item.EnableCloudTalk}>云对讲</Item>
                                            <Item extra={ item.VirtualCode === "" ? "无" : item.VirtualCode} >房间子号</Item>
                                            <WhiteSpace></WhiteSpace>
                                        </List>
                                    </div>
                                 )
                            })
                            :  null
                        }
                    </List>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
     const vr =  state.virtualRoom ;
     return{
        data:vr.Data,
        status:vr.status   
     }
}
const mapDispatchToProps = (dispatch) => ({
    fetchVirtualRoomInfo: ( buildingID ) => {
       dispatch( fetchVirtualRoomInfo( buildingID ));
    },
});

export default  withRouter( connect(mapStateToProps, mapDispatchToProps)(SurRoom) );
