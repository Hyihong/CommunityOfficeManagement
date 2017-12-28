import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE} from './actionTypes.js';
import { ADD_ROOM,SAVE_VIEW_SIZE } from './actionTypes.js';

//格式转换
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
              status:'loading'
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
        //新增房间
        case ADD_ROOM:{
            let newRoom ={ ...action , key:action.ID ,Customers:[] };
            //头部插入
            state.Data.unshift(newRoom); 
            return{
                ...state,
            }
        }
        case SAVE_VIEW_SIZE:{
            console.log("高度")
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
