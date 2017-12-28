
import React from 'react'
import { Row,Col } from 'antd'
import "./style.less"
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
class Welcome extends React.Component {
   constructor(){
       super()
       this.state = {
           time:{Year:"?",Month:"?",Day:"?",DayOfWeek:"?"},
        }
   }
   componentWillMount(){
       document.title="首页";
       const that = this;
       //获取本地时间
       //var date = new Date();

       fetch( "/api/common/getdateinfo",{
             credentials: 'same-origin',
       }).then( response =>{
             if( response.status === 200) {
                 response.json().then( data =>{
                     that.setState({
                         time: data 
                     })
                 })
             }else if( response.status === 401){
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
             }

             // todo 若服务端获取失败，则获取本地时间
             // ...
       })
   }

  render(){
    const time = this.state.time;
    return (
      <div className="welcome"> 
          <div>
              <div className="lee-layout-center">
                    <Row type="flex" align="middle" justify="end"> 
                        <Col>
                            {/* <h1>WelcomeW</h1> */}
                        </Col>
                        {
                            time ? (
                                 <Col className="time">
                                    <h2>{ `${ time.Year }年${time.Month}月${time.Day}日`} {time.DayOfWeek}</h2>
                                </Col>) : null 
                        }
                        
                    </Row>
              </div>
          </div>
      </div>
    );
  }
};

export default Welcome;


