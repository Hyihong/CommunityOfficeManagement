import {POST_MODIFY_START,POST_MODIFY_SUCCESS,POST_MODIFY_FAILURE} from './actionTypes.js';
import {FETCH_MODIFY_START,FETCH_MODIFY_SUCCESS,FETCH_MODIFY_FAILURE} from './actionTypes.js';

// state ： 初始数据，Type : any 
export default (state = {
    postData:{},
    fetchData:{}
},action ) =>{
    switch(action.type){
        case FETCH_MODIFY_START:{
            return {
               ...state,
               fetchData:{
                   status:'loading'
               },
            }
        }
        case FETCH_MODIFY_SUCCESS:{
            return {
               ...state,
               fetchData:{
                status:'success',
                ...action.result
               },
            }
        }
        case FETCH_MODIFY_FAILURE:{
            return {
                ...state,
                fetchData:{
                 status:'failure',
                 ...action.result
                },
             }
        }
        case POST_MODIFY_START:{
            return{
                ...state,
                postData:{
                    status:'loading'
                }
            }
        }
        case POST_MODIFY_SUCCESS:{
            return{
                ...state,
                postData:{
                    status:'success',
                    ...action.result
                }
            }
        }
        case POST_MODIFY_FAILURE:{
            return{
                ...state,
                postData:{
                    status:'failure',
                    ...action.result
                }
            }
        }
        default:{
            return state;
        }
    }
}
