import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE,Filter_Status,Set_Current_Page} from './actionTypes.js';


export default (state = {status:'',filter:{},currentPage:1} , action) =>{
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
                ...action.result,
                filterData:action.result.Data,
            }
        }
        case FETCH_FAILURE:{
            return {
                ...state,
                status:'failure',
                error: action.error
            }
        }
        case Filter_Status:{
            return{
                ...state,
            }
        }
        case Set_Current_Page:{
            return{
                ...state,
                currentPage:action.currentPage
            }
        }
        default:{
            return state;
        }
    }
}
