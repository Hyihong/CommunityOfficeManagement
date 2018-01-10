
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { fetchVirtualRoomInfo} from './actions'
import { WhiteSpace,List  } from 'antd-mobile';
import { getQueryString } from '../../tools/baseTools'
import TopNav from '../shared/views/TopNav'
import './style.less'

const Item = List.Item;

//房间列表View
class SurRoom extends React.Component {
    constructor(props){
        super(props)
        this.state={
            height:0
        }
    }
    componentWillMount(){
        this.props.fetchVirtualRoomInfo( getQueryString( this.props.location.search,'ID' ) )
    }
    componentDidMount(){
    }

    onSuperLineClick=()=>{
        this.setState({
            height:this.state.height === 0 ? "141px":0
        })
    }
    render(){
        const { roomData } = this.props;
        let customers;
        if( roomData ){
            roomData.map(item=>{
                if(item[0].ID === this.roomId){
                    customers = item[0].Customers;
                }
            })
        }
        return(
            <div>
                <TopNav home title="成员列表" ></TopNav>
                <WhiteSpace></WhiteSpace>  
                { !!customers ? 
                  ( <List id="leelen-subroom-list">
                        <Item arrow="horizontal" onClick={this.onSuperLineClick } thumb={ <icon className="fa fa-heart-o"></icon> }>子房间号：1</Item>
                        <List className="sub" style={{height:this.state.height}}>
                            <Item extra="小黄">姓名</Item>
                            <Item extra="4545655666">电话</Item>
                            <Item extra="已开通">云对讲</Item>
                            <WhiteSpace></WhiteSpace>
                        </List>
                        <Item arrow="horizontal" onClick={this.onSuperLineClick } thumb={ <icon className="fa fa-heart-o"></icon> }>子房间号：2</Item>
                        <List className="sub" style={{height:this.state.height}}>
                            <Item extra="小黄">姓名</Item>
                            <Item extra="4545655666">电话</Item>
                            <Item extra="已开通">云对讲</Item>
                            <WhiteSpace></WhiteSpace>
                        </List>
                    </List> ) :<div>重新获取数据</div>
                 } 
               
            </div>
        )
    }
}

const mapStateToProps = (state) => {
     const rl =  state.roomList ;
     return{
        roomData:rl.Data,   
     }
}
const mapDispatchToProps = (dispatch) => ({
    fetchVirtualRoomInfo: ( buildingID ) => {
       dispatch( fetchVirtualRoomInfo( buildingID ));
    },
});

export default  withRouter( connect(mapStateToProps, mapDispatchToProps)(SurRoom) );
