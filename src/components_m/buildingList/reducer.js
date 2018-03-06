import {FETCH_BUILIDING_STARTED, FETCH_BUILIDING_SUCCESS, FETCH_BUILIDING_FAILURE} from './actionTypes.js';
import {CHANGE_STATUS_STARTED, CHANGE_STATUS_SUCCESS, CHANGE_STATUST_FAILURE} from './actionTypes.js';
import { FRESH,CREATE,SAVE_VIEW_SIZE } from './actionTypes.js';

//数据格式转换
function pareseListData( data ){
    if( data === undefined || data === null){
        return data;
    }
    let newFamateData=[];
    Object.keys(data).map((key) =>{
        let wrapperData = [ data[key] ] ;
        newFamateData.push( wrapperData )
    })
    return newFamateData;
}


const initState = {
    buildingList:{  status:'loading' },
    switch:{  status:'' },
    viewSize:{}
}
export default (state = initState , action) =>{
    switch(action.type){
        case FETCH_BUILIDING_STARTED:
          return {
              ...state,
              buildingList:{
                    status:'loading',
                }
          }
        case FETCH_BUILIDING_SUCCESS:{
            return {
                ...state,
                buildingList:{
                    status:'success',
                    Data: pareseListData(action.result.Data)
                },
               
            }
        }
        case FETCH_BUILIDING_FAILURE:{
            return {
                ...state,
                buildingList:{
                    status:'failure',
                    errMsg:action.error.statusText
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

            state.buildingList.Data.map( item =>{             
                if( item[0].ID === action.buildingID){
                    return item[0].Status = !item[0].Status;
                }
                return null;
            })
            //修改楼栋状态
            return {
                ...state,
                buildingList:{
                    ...state.buildingList,
                    Data: [...state.buildingList.Data],
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
        case SAVE_VIEW_SIZE:{
            return{
                ...state,
                viewSize:{
                    ...state.viewSize,
                    ...action.option
                }
            }
        }
        case FRESH :{
           
            state.buildingList.Data.map( item =>{
             
                if( item[0].ID === action.ID){
                    item[0].Code = action.Code ;
                    item[0].Name = action.Name ;
                    item[0].ModifyInfo = {
                        Modifier:action.Modifier,
                        Modified:action.Modified
                    }
                }
                return null ;
            })
            const newBuildingData = state.buildingList.Data.slice(0);
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
            console.log( newData )
            state.buildingList.Data.unshift(newData);

            return {
                 ...state
            }
        }
        default:{
            return state;
        }
    }
}
