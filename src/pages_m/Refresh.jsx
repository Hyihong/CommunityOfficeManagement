
import React from 'react'
import ReactDOM from 'react-dom'
import { Flex,PullToRefresh,ListView,NoticeBar,WhiteSpace,Button,WingBlank } from 'antd-mobile';
import { Link} from 'react-router-dom';


const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];

class Refresh extends React.Component {
    constructor(props) {
      super(props);
      var ds = new ListView.DataSource(
        { rowHasChanged: (r1, r2) => r1 !== r2 ,
          sectionHeaderHasChanged:(s1,s2) => s1!==s2,
          //getRowData(dataBlob, sectionID, rowID);
          //getSectionHeaderData(dataBlob, sectionID);
        }
      );    
      this.state = {
        dataSource:ds,
        data:{
            section_1:{
              row_1:['a','b']
            },
            section_2:['e','j']
          }
      };
    };
   componentDidMount() {
    setTimeout(() => this.setState({
      height: document.documentElement.clientHeight * 3 / 4,
    }), 0);
  }

  _renderRow = (rowData,rowId,sectionId)=>{
    return(
        <div>{ sectionId }:{rowId}:{ rowData }</div>
    )
  }

  render(){
    return (
      <div>
          
           <WingBlank size="sm">
           <div id="leelen-listview">
              <ListView
                style={{height:this.state.height}}
                initialListSize={ 8 }
                dataSource={ this.state.dataSource.cloneWithRowsAndSections( this.state.data) }
                renderRow={ (rowData,rowId,sectionId)=>this._renderRow(rowData,rowId,sectionId)}
              />
           </div>
           
           </WingBlank>  
      </div>
    );
  }
};

export default Refresh;







