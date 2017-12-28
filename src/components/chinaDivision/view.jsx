
import React from 'react';
import { Cascader } from 'antd';
import { mapChinaDivisionJson } from "../../tools/mapChinaDivisionJson" 
//import divisionJson from '../../DB/address3.json'

const divisionJson = require("../../DB/address3.json") ;

const options = new mapChinaDivisionJson( divisionJson ) ;

class ChinaDivision extends React.Component{  
    changeHandle (){
        this.props.onChange()
    }  
    render(){
        return(
           <Cascader options={options} 
                     placeholder="请选择城市" 
                     changeOnSelect = {true}
                     style={{width:this.props.width,background:this.props.bgColor}} 
                     onChange = { this.props.onChange }
                     defaultValue ={ this.props.defaultValue || []}
                     value = { this.props.value }
          />
        )
    }
}

export default ChinaDivision;
