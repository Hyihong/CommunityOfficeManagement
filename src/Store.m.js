import {createStore, combineReducers, compose,  applyMiddleware} from 'redux';
import { routerReducer } from 'react-router-redux'
import Perf from 'react-addons-perf' ;
import { reducer as projectsReducer } from './components_m/projectList'
import { reducer as buildingListReducer } from './components_m/buildingList'
import { reducer as roomListReducer } from './components_m/roomList'
import { reducer as virtualroomReducer } from './components_m/virtualRoom'
import { reducer as editBuildingReducer } from './components_m/editBuilding'
import { reducer as editRoomReducer } from './components_m/editRoom'
import { reducer as createBuildingReducer } from './components_m/createBuilding'
import { reducer as createRoomReducer } from './components_m/createRoom'
import { reducer as applyReducer } from './components_m/apply'
import { reducer as applyModify } from './components/applyModify'
import { reducer as organizationsReducer } from './components/organizations'
import { reducer as projectDetailReducer } from './components/projectDetail'




import resetEnhancer from './middleWare/reset.js' 
//中间件
import promise from './middleWare/promiseMiddleWare' 
import authorized from './middleWare/authorizedMiddleWare.m' 

const win = window;

if (process.env.NODE_ENV !== 'production') {
    win.Perf = Perf ;
}

const originalReducers = {
    routing: routerReducer,
    projectList: projectsReducer,
    projectDetail:projectDetailReducer,

    buildingList:buildingListReducer,
    editBuilding:editBuildingReducer,
    createBuilding:createBuildingReducer,

    roomList:roomListReducer,
    virtualRoom:virtualroomReducer,
    editRoom:editRoomReducer,
    createRoom:createRoomReducer,

    apply:applyReducer,
    applyModify:applyModify,

    organizations:organizationsReducer,
    
}

const reducer =  combineReducers(originalReducers)
const middleWare = [promise,authorized]

const storeEnhancers = compose(
  applyMiddleware(...middleWare),
  resetEnhancer,
  (win && win.devToolsExtension) ? win.devToolsExtension() : f => f
);

const store = createStore(reducer, {}, storeEnhancers);
store._reducers = originalReducers

export default store;