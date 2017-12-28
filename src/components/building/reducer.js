import {FETCH_BUILIDING_STARTED, FETCH_BUILIDING_SUCCESS, FETCH_BUILIDING_FAILURE} from './actionTypes.js';
import {CHANGE_STATUS_STARTED, CHANGE_STATUS_SUCCESS, CHANGE_STATUST_FAILURE} from './actionTypes.js';
import { FRESH,CREATE,Table_Page_Change } from './actionTypes.js';

const initState = {
    buildingList:{  status:'loading'},
    switch:{  status:'' }
}
export default (state = initState , action) =>{
    switch(action.type){
        case FETCH_BUILIDING_STARTED:
          return {
              ...state,
              buildingList:{
                    status:'loading',
                    Data:[]
                }
          }
        case FETCH_BUILIDING_SUCCESS:{
            return {
                ...state,
                buildingList:{
                    status:'success',
                    ...action.result
                },
               
            }
        }
        case FETCH_BUILIDING_FAILURE:{
            return {
                ...state,
                buildingList:{
                    status:'failure',
                }
            }
        }
        case CHANGE_STATUS_STARTED:{
            return {
                ...state,
                switch:{
                    status:'loading', //请求状态
                    forbidden : action.status //禁用or开启
                }
            }
        }

        case CHANGE_STATUS_SUCCESS:{
            //禁用|启用成功
            const newBuildingData = state.buildingList.Data.slice(0);
            newBuildingData.map( item =>{
                if( item.ID === action.buildingID){
                    //console.log(item.Status);
                    return item.Status = !item.Status;
                }else{
                    return item
                }
            })
            return {
                ...state,
                buildingList:{
                    ...state.buildingList,
                    Data: [...newBuildingData] 
                },
                switch:{
                    status:'success',
                    forbidden : action.status 
                }
               
            }
        }
        case CHANGE_STATUST_FAILURE:{
            return {
                ...state,
                switch:{
                    status:"failure",
                }
            }
        }
        case FRESH :{
            const newBuildingData = state.buildingList.Data.slice(0);
            newBuildingData.map( item =>{
                if( item.ID === action.ID){
                    item.Code = action.Code ;
                    item.Name = action.Name ;
                    item.ModifyInfo = {
                        Modifier:action.Modifier,
                        Modified:action.Modified
                    }
                }
                return null ;
            })
            return{
                ...state,
                buildingList:{
                    ...state.buildingList,
                    Data:[
                        ...newBuildingData
                    ]
                },
            }
        }
        case CREATE:{
            let { type,...newData} = action;
            state.buildingList.Data.unshift(newData);

            return {
                 ...state
            }
        }
        case Table_Page_Change:{
            return{
                ...state,
                currentPage:action.page
            }
        }
        default:{
            return state;
        }
    }
}
