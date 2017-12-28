import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE} from './actionTypes.js';
import { ADD_ROOM } from './actionTypes.js';

export default (state = {status:'loading'} , action) =>{
    switch(action.type){
        case FETCH_STARTED:
          return {status:'loading'}
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
        //新增房间
        case ADD_ROOM:{
            let newRoom ={ ...action , key:action.ID ,Customers:[] };
            //头部插入
            state.Data.unshift(newRoom); 
            return{
                ...state,
            }
        }
        default:{
            return state;
        }
    }
}
