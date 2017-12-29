import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE} from './actionTypes.js';
import {CHANGE_STATUS_STARTED,CHANGE_STATUS_SUCCESS,CHANGE_STATUS_FAILURE} from "./actionTypes"
import { ADD_ROOM,EDIT_ROOM } from './actionTypes.js';

export default (state = {status:'loading',switch:{status:''}} , action) =>{
    switch(action.type){
        case FETCH_STARTED:
          return {
              ...state,
            status:'loading'
          }
        case FETCH_SUCCESS:{
            return {
                ...state,
                status:'success',
                ...action.result
            }
        }
        case FETCH_FAILURE:{
            return {
                status:'failure',
            }
        }
        //启用|禁用房间
        case CHANGE_STATUS_STARTED:{
            return {
                ...state,
                switch:{
                    enableStatus:'loading', //请求状态
                    forbidden : action.status //禁用or开启
                }
            }
        }
        case CHANGE_STATUS_SUCCESS:{
            const roomData = state.Data.slice(0);
            roomData.map( item =>{
                if( item.ID === action.buildingID){
                    return item.Status = !item.Status;
                }else{
                    return item
                }
            })
            return {
                ...state,
                Data: [...roomData],
                switch:{
                    enableStatus:'success',
                    forbidden : action.status
                }

            }
        }
        case CHANGE_STATUS_FAILURE:{
            return {
                ...state,
                switch:{
                    enableStatus:"failure",
                }
            }
        }
        //新增房间
        case ADD_ROOM:{
            let newRoom ={ ...action , key:action.ID ,Customers:[],Status:1 };
            //头部插入
            state.Data.unshift(newRoom); 
            return{
                ...state,
            }
        }
        default:{
            return state;
        }
        //重新刷新列表信息
        case EDIT_ROOM:{
            const roomData = state.Data.slice(0);
            roomData.map( item =>{
                if( item.ID === action.ID){
                    item.Code = action.Code ;
                    item.Name = action.Name ;
                    item.ResidentName = action.ResidentName ;
                    item.ResidentPhone = action.Phone;
                    item.Gender = action.Gender;
                    item.ModifyInfo = {
                        Modifier:action.Modifier,
                        Modified:action.Modified
                    }
                }
                return null ;
            })
            return{
                ...state,
                Data: [...roomData],
            }
        }
    }
}
