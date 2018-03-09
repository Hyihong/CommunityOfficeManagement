
import React from 'react'
import TopNav from '../components_m/shared/views/TopNav'
import { List, TextareaItem,InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import './style/about.less'
import avatar from '../assets/images_m/avatar.png'

class Test extends React.Component {
   constructor(props){
     super(props);
   }
   componentDidMount=()=>{
     
   }
   handleFocus=(e)=>{
       
   }
  render(){
    const { getFieldProps } = this.props.form;
    return (
      <div>
          <div>{ "1021-10-10" } </div>
          <p>1021-10</p>
      </div>
      
    
    );
  }
};

const TestExampleWrapper = createForm()(Test);
export default TestExampleWrapper;







