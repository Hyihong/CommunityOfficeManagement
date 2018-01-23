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
                <p style={{color:"#fff"}}>{this.props.text}</p>
            </div>
        )
    }
   
}

export default ProgeressCircle ;

//progress-circle
// .leelen-progress{
//     display:flex;
//     justify-content: center;
//     align-items: center;
// }
// .progress-bar{
// 	width: 120px;
//     height: 120px;
    
//     .outerCircle{
//         position:relative;
//         width:110px;
//         height:110px;
//         border:5px solid #e1e1e1;
//         background:#fff;
//         border-radius: 50%;
//     }
//     .innerCircle{
//         position:absolute;
//         z-index:5;
//         width:90px;
//         height:90px;
//         margin:5px;
//         float:left;
//         background:#e6e6e6;
//         border-radius: 50%;
//         overflow: hidden;
//     }
//     .bar{
//         position:absolute;
//         transition: top 300ms linear;
//         z-index:1;
//         width:200px;
//         height:200px;
//         left:-50%;
//         background:rgb(36, 145, 139);
//         border-radius:40%;
//         animation: spin 10s linear infinite;
//     }
//     .perc{
//         position: absolute;
//         width:100%;
//         bottom:25px;
//         z-index:6;
//         font-size:30px;
//         text-align: center;
//         color:#fff;

//     }
// }

// @keyframes spin{
//     0% {
//         -webkit-transform: rotate(0deg);
//         transform: rotate(0deg);
//     }
//     100% {
//         -webkit-transform: rotate(360deg);
//         transform: rotate(360deg);
//     }
// }
