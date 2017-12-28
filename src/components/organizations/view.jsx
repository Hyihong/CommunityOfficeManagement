
import React from 'react';
import { connect } from 'react-redux';
import { Cascader,Spin,Icon } from 'antd';
import mapOrganazitionsJson from "../../tools/mapOrganazitionsJson" 
import './style.less'


export const stateKey = '';

//生成
class Organizations extends React.Component {
    onOrganizationDisplayRender = (label, selectedOptions) =>{
        return label.join("/")
    }

    render(){
        //生成组织结构树
        const { orzOptions,status} = this.props;
        let options =[]; 
        if( orzOptions ){
            if( !!this.props.allOption){
                options.push( {key:"all",value:'all',label:'全部'} )
            }
            options.push ( ...new mapOrganazitionsJson(  ( orzOptions ) ) ) ;
        }
        let isLoading = status === 'loading' ?  true : false ;
        
        //let isLoading = true;
        return (
            <div className="lee-organizations-cascader">
                <Spin size="small"  tip="正在加载组织结构数据 ..." spinning={ isLoading }>  
                    { isLoading ?   <Icon type="loading" />  : null }
                    <Cascader 
                        options={ options } 
                        popupClassName="lee-organizations-cascader-popup"
                        changeOnSelect={true}
                        value ={this.props.value}
                        onChange={this.props.onChange }
                        onPopupVisibleChange = {this.props.onPopupVisibleChange}
                        displayRender = { this.props.displayRender }
                        placeholder = { isLoading ?  null: "请选择"} 
                        defaultValue={this.props.defaultValue}
                        >
                    </Cascader> 
                </Spin>   
          </div>  
        );
      }
    };
    

//    const mapStateToProps = (state) => {
//         const organizations = state.organizations;
//         return{
//              status :organizations.status,
//              orzOptions: organizations.Data,
//         }
//    }
   
   export default connect(null, null)(Organizations);
