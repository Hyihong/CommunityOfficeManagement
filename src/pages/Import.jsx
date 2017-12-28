import React from 'react';
import {view as ImportProjectInfo} from '../components/importProjectInfo';


import "./style/apply.less"
import { Return } from '../components/shared';

class ImportPage extends React.Component{ 
    componentWillMount(){
        document.title="导入业主数据";
        
    }
    render(){
        return(
            <div>
                <Return> 导入业主数据 </Return> 
                <ImportProjectInfo></ImportProjectInfo>   
            </div>
        );
   };
}


export {ImportPage};


