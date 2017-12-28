import React from 'react'
import { Modal} from 'antd'

class CountDown extends React.Component {
    constructor(props){
        super(props);
        this.state={
            count:this.props.seconds
        }
    }
    componentDidMount(){
        setInterval( ()=>{
            this.setState({
                count:this.state.count - 1 
            })
        },1000)
    }
    render(){
        return(
        <div>{ this.state.count}秒后将为您跳转至登录页...</div>)
    }
}


export default function authorizedMiddleWare( {dispatch} ) {
      return function (next){
          return function(action){
              const { type } = action;
              if(  type === '401'){
                Modal.warning({
                    title:"登录过期!",
                    content:<CountDown seconds={3}/>   ,
                    okText:"重新登录",
                    onOk:()=>{
                        window.location = '/Account/Login'
                    }
                })
                setTimeout( ()=>{
                      window.location = '/Account/Login'
                },3000)
              }else{
                return next(action)
              }
          }
      }
}