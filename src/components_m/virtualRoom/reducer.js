import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE} from './actionTypes.js';

export default (state = { status:''} , action) =>{
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
                Data:action.result.Data
            }
        }
        case FETCH_FAILURE:{
            return {
                ...state,
                status:'failure',
            }
        }
        default:{
            return state;
        }
    }
}
