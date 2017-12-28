import React from 'react';

import  Header  from './Header';
import "./style.less";
// import  SilderMenu from './SilderMenu';
import { Layout} from 'antd';
const { Content } = Layout ;

 class Container  extends React.Component{
      componentWillMount(){
      }
      render(){
           
        return(
          <div>
            <Layout>
                    <Header></Header>
                       <div className="lee-containter">
                        <Content className="lee-layout-center">
                              {this.props.children}
                        </Content>
                    </div>
            </Layout>
          </div>)
      }
};

export default Container ;

// #e6e8ea