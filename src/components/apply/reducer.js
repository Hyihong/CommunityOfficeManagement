import {APPLY_START,APPLY_SUCCESS,APPLY_FAILURE} from './actionTypes.js';

// state ： 初始数据，Type : any 
export default (state = {visible:false},action ) =>{
    switch(action.type){
        case APPLY_START:{
            return {
               ...state,
               status:"posting",
            }
        }
        case APPLY_SUCCESS:{
            console.log( action.result)
            let s = action.result === true ?  'success' :'failure' ;
            return {
               ...state,
               status: s,
            }
        }
        case APPLY_FAILURE:{
            return {
               ...state,
               status:"failure",
            }
        }
        default:{
            return state;
        }
    }
}
