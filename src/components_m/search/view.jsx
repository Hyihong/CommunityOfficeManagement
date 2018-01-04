
import React from 'react';
import { List,WhiteSpace,SearchBar,WingBlank} from 'antd-mobile'

import './style.less'
const searchPanelStyle={
    position:"fixed",
    width:"100%",
    height:"100%",
    top:0,
    bottom:0,
    background:"#fff",
    zIndex:10,
    opacity:0.4
}
const searchBarStyle={
    position:"absolute",
    width:"100%",
    height:"44px",
    opacity:1,
    zIndex:12
}
//搜索框View
class Search extends React.Component {
    constructor(props){
         super(props)
         this.state= {
             display:"none",
             left:"-100%",
             opacity:0
         }
    }
    componentDidMount(){
        this.height = document.documentElement.clientHeight - 80;
    }

    componentWillReceiveProps(nextProps){
        let {display} = nextProps.style ;
        if( display !== this.props.style.display){
            if(display === 'block' ){
                this.setState({
                    display:"block",
                })
                setTimeout( ()=>{
                    this.setState({
                        left:0,
                        opacity:1
                    })
                },100)
            }else{
                this.setState({
                    display:"none",
                    left:'-100%',
                    opacity:0
                })
                setTimeout( ()=>{
                    this.setState({
                        display:"none"
                    })
                })
                
            }
        }
       
    }
    componentDidUpdate(){
        if( this.props.focus ){
            this.autoFocusInst.focus();
        }
        
    }
    onFocus =()=>{
        this.props.onFocus();
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
        let maskStyle={ }
        if( !this.props.hasListViewMask ){
            maskStyle={
                display:"none"
            }
        }
        return(
             <div className="wrapper" style={{display:this.state.display}}>
                <div style={{ ...searchPanelStyle,...maskStyle, }}></div>
                <SearchBar 
                    style={{...searchBarStyle,left: this.state.left,opacity:this.state.opacity}}
                    placeholder= { this.props.placeholder} 
                    ref={ ref => this.autoFocusInst = ref}
                    showCancelButton
                    onCancel={ this.props.onCancel }
                    onSubmit={ this.onSubmit}
                    onFocus = { this.onFocus }
                    clear={false}
                    maxLength= { 15 }
                    onChange={ this.onSearchChange }
                ></SearchBar>  
             </div>
             
          
        )
    }

}



export default Search;
