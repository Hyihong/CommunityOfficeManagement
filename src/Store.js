import {createStore, combineReducers, compose,  applyMiddleware} from 'redux';
import { routerReducer } from 'react-router-redux'
import Perf from 'react-addons-perf' ;
import { reducer as sharedReducer } from './components/shared'
import { reducer as projectsReducer } from './components/projectList'
import { reducer as buildingReducer } from './components/building'
import { reducer as roomReducer } from './components/roomList'
import { reducer as organizationsReducer } from './components/organizations'
import { reducer as projectDetailReducer } from './components/projectDetail'
import { reducer as createRoomReducer } from './components/createRoom'
import { reducer as createBuildingReducer } from './components/createBuilding'
import { reducer as editBuilidngReducer } from './components/editBuilding'
import { reducer as editRoomReducer } from './components/editRoom'
import { reducer as applyReducer } from './components/apply'
import { reducer as applyModify } from './components/applyModify'
import resetEnhancer from './middleWare/reset.js' 
//中间件
import promise from './middleWare/promiseMiddleWare' 
import authorized from './middleWare/authorizedMiddleWare' 

const win = window;

if (process.env.NODE_ENV !== 'production') {
    win.Perf = Perf ;
}


const originalReducers = {
    routing: routerReducer,
    shared: sharedReducer,
    projectList: projectsReducer,
    projectDetail:projectDetailReducer,
    
    building: buildingReducer,
    room:roomReducer,

    createRoom: createRoomReducer,
    createBuilding: createBuildingReducer,

    editBuilding : editBuilidngReducer,
    editRoom : editRoomReducer,

    organizations: organizationsReducer,
    apply:applyReducer,
    applyModify:applyModify,
}

const reducer =  combineReducers(originalReducers)
const middleWare = [promise]

const storeEnhancers = compose(
  applyMiddleware(...middleWare),
  resetEnhancer,
  (win && win.devToolsExtension) ? win.devToolsExtension() : f => f
);

const store = createStore(reducer, {}, storeEnhancers);
store._reducers = originalReducers

export default store;