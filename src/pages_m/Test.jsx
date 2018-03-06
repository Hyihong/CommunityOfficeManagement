
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
      <div id="test-panel"> 
        <List renderHeader={() => 'Customize to focus'}>
          <TextareaItem
            title="标题"
            placeholder="auto focus in Alipay client"
            data-seed="logId"
            ref={el => this.autoFocusInst = el}
            autoHeight
          />
          <TextareaItem
            title="标题"
            placeholder="click the button below to focus"
            data-seed="logId"
            autoHeight
           
          />
          <List.Item>
            <div
              style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}
              onClick={() => this.customFocusInst.focus()}
            >
              click to focus
            </div>
          </List.Item>
        </List>

        <List renderHeader={() => 'Whether is controlled'}>
          <TextareaItem
            {...getFieldProps('control')}
            title="受控组件"
            placeholder="controlled"
          />
          <TextareaItem
            title="非受控组件"
            placeholder="please input content"
            clear
          />
        </List>

        <textarea name="" id="" cols="30" rows="2"></textarea>

        <List renderHeader={() => 'Whether is controlled'}>
          <TextareaItem
            {...getFieldProps('control')}
            title="受控组件"
            placeholder="controlled"
          />
          <TextareaItem
            title="非受控组件"
            placeholder="please input content"
            clear
          />
        </List>
        <List renderHeader={() => 'Whether is controlled'}>
          <TextareaItem
            {...getFieldProps('control')}
            title="受控组件"
            placeholder="controlled"
          />
          <TextareaItem
            title="非受控组件"
            placeholder="please input content"
            clear
          />
        </List>
        <List renderHeader={() => 'Auto / Fixed height'}>
          <TextareaItem
            {...getFieldProps('note3')}
            title="高度自适应"
            autoHeight
            labelNumber={5}
          />
          <TextareaItem/>
          <TextareaItem
            {...getFieldProps('note3')}
            title="高度自适应"
            autoHeight
            labelNumber={5}
          />
          <TextareaItem/>
          <TextareaItem
            {...getFieldProps('note3')}
            title="测试框"
            ref={el => this.customFocusInst = el}
            autoHeight
            labelNumber={5}
          />
        </List>
        
        <InputItem >Input框</InputItem>

      </div>
    );
  }
};

const TestExampleWrapper = createForm()(Test);
export default TestExampleWrapper;







