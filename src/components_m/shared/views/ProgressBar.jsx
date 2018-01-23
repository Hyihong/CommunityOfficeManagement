import React from 'react';
import './style.less'

class ProgeressBar extends React.Component{
    constructor(props){
        super(props)
        this.state={
            show:true
        }
    }
    componentDidMount(){
       
    }
    componentWillReceiveProps(nextProps){
        setTimeout(()=>{
            this.setState({
                show: nextProps.percentage !== 100
            })
        },600)
       
    }
    // shouldComponentUpdate(nextProps){
    //     console.log( nextProps.percentage )
    // }
    retur
    render(){
        const { percentage } = this.props;
        return(
            this.state.show  ? 
            <div className='leelen-progress-bar-containter'>
                <div className='progress-bar progress-striped progress-bar-color' role='progressbar' style={{width:percentage+"%"}}>
                    { percentage +"%" }
                </div>
            </div> : null
        )
    }
   
}

export default ProgeressBar ;
