import React from 'react';
import './style.less'

class ProgeressCircle extends React.Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
       
    }
    render(){
        const { percentage } = this.props;

        return(
            <div className="leelen-progress">
                <div className="progress-bar">
                    <div  className="outerCircle" height="100px" width="100px">
                        <div className="innerCircle">
                           <div className="bar" style={{top: percentage === 0 ? "110%": ( 100 - percentage)+"%"  }}></div>
                           <p className="perc">{ this.props.percentage}%</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
   
}

export default ProgeressCircle ;
