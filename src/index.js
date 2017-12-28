import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router ,Route,Switch } from 'react-router-dom';//BrowserRouter
import { Provider } from 'react-redux'
import { Bundle }from './components/functional'
//import NotFonund from './pages/404';
import App from './App.js';
//import NotFonund from './pages/404';
//import Test from './pages/Test'

import store from './Store'

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

// const App = (props) => (
//     <Bundle  load={(cb) => {
//         require.ensure([], require => {
//             cb(require('./App'));
//         },'main');
//     }}>
//         {(App) => <App {...props}/>}
//     </Bundle>
// )

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

