import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router ,Route,Switch } from 'react-router-dom';
import { Provider } from 'react-redux'
import { Bundle }from './components/functional'


import App from './App.m.js'
import store from './Store.m'


//NotFonund按需加载
const NotFonund = (props) => (
    <Bundle  load={(cb) => {
        require.ensure([], require => {
            cb(require('./pages/404'));
        },'notfound');
    }}>
        {(NotFonund) => <NotFonund {...props}/>}
    </Bundle>
)

ReactDOM.render(
    <Provider store={store}>
       <Router>
           <div>
                <Switch>
                    <Route exact path="/404" component={NotFonund} />
                    <Route  path="/"  component={ App }/> 
                </Switch>
            </div>
       </Router>
    </Provider>    
  ,
  document.getElementById('root')
);

