
import React from 'react';
import "./style/login.less";
import { Form, Icon, Input, Button,Row,Col,Checkbox,Modal  } from 'antd';
import logo_could from "../assets/images/logo/logo_could.png"
import login_bg from "../assets/images/login/login_bg.png"
import logo from "../assets/images/logo/logo.png"
import {capitalTip, isPC, setPlaceholder} from "../tools/baseTools"
const FormItem = Form.Item;

//判断表单内是否有错误
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Login extends React.Component{
    constructor(){
        super()
         this.state={
             loading:false
         }
    }

    componentWillMount(){
        document.title="登录"
        this.ispc = isPC() ;
    }
    componentDidMount(){
         //this.props.form.validateFields()
        setPlaceholder();
        capitalTip();
    }

    handlerSubmit = (e) =>{
        e.preventDefault();
        const { getFieldsValue } = this.props.form;
        const v = getFieldsValue();

        this.setState({
            loading:true
        })
        setTimeout( ()=>{
            fetch("/account/Login",  {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                credentials: 'same-origin',
                body:`UserName=${v.username}&Password=${v.password}&RememberMe=true&returnUrl=/`
            }).then( response =>{
                response.json().then( result =>{
                    if( result.Code === 0){
                        //window.location.reload();
                        window.location.href = '/Home';
                    }else{
                        Modal.error({
                            title:'登录错误',
                            content:result.Message,
                            onOK:'确定'
                        })
                        this.setState({
                            loading:false
                        })
                    }
                })
            })},500
        )
      

        //方法一：submit原生提交表单
        //document.getElementById("loginForm").submit()
    }

    render(){
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        const usernameError = isFieldTouched("username") && getFieldError("username") ;
        const passwordError = isFieldTouched("password") && getFieldError("password") ;

        const isFieldsHasErrors = hasErrors(getFieldsError());


        //label样式
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
            };
        return(
                  <div id="containter">
                       <Row type="flex"  className="logo-could" style={{zIndex:2,overflow:"hidden"}}>
                           <Col md={{span:2,offset:11}} xs={{span:5,offset:9}} ><img src={ logo_could } alt="logo" /></Col>
                       </Row>
                       <Row justify="center">
                           <div id="login-form-panel">
                               { this.ispc ?  <img src={ login_bg } alt="login-bg" />: " "}
                              <div id="form-box">
                                    <Row type="flex" justify="center"  align="middle" style={{height:"100%"}}>
                                      <Col  lg={7} md={8}  sm={10} xs={20} className="cofrom" >
                                        <Form  id="loginForm" hideRequiredMark={true}>
                                        {/* action="/Account/Login?ReturnUrl=%2F" method="post" */}
                                                <h2>办事处后台管理系统</h2>
                                                <hr/>
                                                <div style={{padding:"0 5%"}}>

                                                    <FormItem
                                                                {...formItemLayout}
                                                                label="用户名"
                                                                validateStatus={ usernameError ? 'error':""}
                                                                help = { usernameError ? usernameError : ""}
                                                    >
                                                        {
                                                        getFieldDecorator('username',{
                                                            rules:[
                                                                    {required:true,message:"用户名不能为空"},
                                                                    {pattern:/^\w*$/,message:"用户名包含非法字符"},
                                                                    {pattern:/^[a-zA-Z]{1}/,message:"用户名只能以字母开头"}
                                                                ]
                                                        })(
                                                        <Input prefix={<Icon type="user" style={{ fontSize: 15 }} />}
                                                                id="UserName" name="UserName" type="text"
                                                                placeholder="请输入账号"/>)
                                                        }

                                                    </FormItem>
                                                    <FormItem
                                                                {...formItemLayout}
                                                                label="密&nbsp;&nbsp;&nbsp;&nbsp;码" validateStatus={ passwordError ? 'error':""}
                                                                help = { passwordError ? passwordError : ""}
                                                    >
                                                        {
                                                        getFieldDecorator('password',{
                                                            rules:[
                                                                    {required:true,message:"密码不能为空"}
                                                                ]
                                                        })(
                                                        <Input prefix={<Icon type="lock" style={{ fontSize: 15}} />}
                                                                id="Password" name="Password" type="password"
                                                                placeholder="请输入密码"/>)
                                                        }<div id="capsLock"><span>大写锁定已打开</span></div>
                                                    </FormItem>
                                                    <FormItem className="remember"

                                                     >
                                                            {getFieldDecorator('remember', {
                                                                valuePropName: 'checked',
                                                                initialValue: true,
                                                            })(
                                                                <Checkbox>自动登录</Checkbox>
                                                            )}
                                                    </FormItem>
                                                    <Button className="login-form-button"
                                                             type="primary"
                                                             loading={ this.state.loading }
                                                             disabled = { isFieldsHasErrors }
                                                             onClick ={ e=>this.handlerSubmit(e) }>
                                                             { this.state.loading ? "登录中..." :"登录" }
                                                    </Button>
                                                 </div>
                                            </Form>

                                        </Col>
                                    </Row>
                              </div>
                           </div>
                       </Row>
                       <img className="footer-logo" src={ logo } alt="login-bg" />

                  </div>
        )
    }
}
Login = Form.create({})(Login);

export default Login;