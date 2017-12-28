import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE} from './actionTypes.js';
import {CHANGE_STATUS_STARTED, CHANGE_STATUS_SUCCESS, CHANGE_STATUST_FAILURE} from './actionTypes.js';
import { ADD_ROOM,EDIT_ROOM,SAVE_VIEW_SIZE } from './actionTypes.js';

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

export default (state = { status:'loading', viewSize:{}} , action) =>{
    switch(action.type){
        case FETCH_STARTED:
          return {
              ...state,
              status:'loading',
              Data:[]
          }
        case FETCH_SUCCESS:{
            return {
                ...state,
                status:'success',
                Data:pareseListData(action.result.Data)
            }
        }
        case FETCH_FAILURE:{
            return {
                ...state,
                status:'failure',
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
            state.Data.map( item =>{             
                if( item[0].ID === action.roomID){
                    return item[0].Status = !item[0].Status;
                }
                return null;
            })
            //修改楼栋状态
            return {
                ...state,
                Data: [...state.Data],
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
        //新增房间
        case ADD_ROOM:{
            let { type,...newData} = action;
            //头部插入
            state.Data.unshift([newData]); 
            console.log( state.Data )
            return{
                ...state,
            }
        }
        //编辑房间
        case EDIT_ROOM:{
             console.log( action )
             state.Data.map( item =>{
                if( item[0].ID === action.ID){
                    item[0].Code = action.Code;
                    item[0].Name = action.Name;
                    item[0].ResidentName = action.ResidentName;
                    item[0].ResidentPhone = action.Phone;
                }
                return null ;
            })
             return{
                 ...state
             }
        }
        //修改房间状态
        case SAVE_VIEW_SIZE:{
            return{
                ...state,
                viewSize:{
                    ...state.viewSize,
                    ...action.option
                }
            }
        }
        default:{
            return state;
        }
    }
}
