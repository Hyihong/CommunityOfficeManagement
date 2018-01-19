import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { actions as projectListAction } from '../projectList'
import { getQueryString } from '../../tools/baseTools'
//import $ from 'jquery'
//import 'jquery-form'
import './style.less'


class ImportProjectInfo extends React.Component {
   constructor(){
     super()
     this.state = {}
   }
   componentDidMount(){
      const projectID = getQueryString( this.props.location.search,'ID' );   
   }
      

    render(){ 
        return (
            <div>
                文件上传页面
            </div>
        );
      }
    };
    

const mapStateToProps = (state) => {
    const projects = state.projectList;
    return{
      
    }
}


//或者
const mapDispatchToProps = (dispatch) => ({
  
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ImportProjectInfo));
