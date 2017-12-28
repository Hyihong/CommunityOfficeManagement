
import React from 'react';
import { List,WhiteSpace,SearchBar,WingBlank} from 'antd-mobile'

import './style.less'
const searchPanelStyle={
    position:"absolute",
    width:"100%",
    height:"44px",
    top:"0%",
    background:"#fff",
    zIndex:10

}

//编辑楼栋View
class Search extends React.Component {
    constructor(props){
         super(props)
    }
    componentDidMount(){
        this.height = document.documentElement.clientHeight - 80;
        
    }
    componentDidUpdate(){
        //this.autoFocusInst.focus();
    }

    onSubmit =(value)=>{
        if( value ==='' || value===null){
            return;
        }
        this.props.onSubmit(value);
    }

    onSearchChange =(value)=>{
        if(value===''){
            return;
        }
    }
   
    render(){
        return(
             <div style={{ ...searchPanelStyle, ...this.props.style}}>
                    <SearchBar 
                        placeholder= { this.props.placeholder} 
                        ref={ ref => this.autoFocusInst = ref}
                        showCancelButton
                        onCancel={ this.props.onCancel }
                        onSubmit={ this.onSubmit}
                        clear={false}
                        maxLength= { 15 }
                        onChange={ this.onSearchChange }
                     ></SearchBar>  
                     <WhiteSpace/>
                     <WingBlank size="ls"> 
                     </WingBlank> 
                       
                    
                     
             </div>
          
        )
    }

}



export default Search;
