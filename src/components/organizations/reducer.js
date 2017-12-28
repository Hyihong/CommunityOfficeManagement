import {FETCH_STARTED_ALL, FETCH_SUCCESS_ALL, FETCH_FAILURE_ALL} from './actionTypes.js';
import {FETCH_STARTED_PROJECT, FETCH_SUCCESS_PROJECT, FETCH_FAILURE_PROJECT,ORZ_PROJECT_SELECT_ARR} from './actionTypes.js';



export default (state = {orzWithProject:{},orzAll:{}} , action) =>{
    switch(action.type){
        case FETCH_STARTED_ALL:
        return {
              ...state,
              orzAll:{
                  status:'loading'
              }
          }
        case FETCH_SUCCESS_ALL:{
            return {
                ...state,
                orzAll:{
                    status:'sucess',
                    ...action.result
                }
            }
        }
        case FETCH_FAILURE_ALL:{
            return {
                ...state,
                orzAll:{
                    status:'failure',
                    error: action.error
                }
            }
        }

        case FETCH_STARTED_PROJECT:
          return {
              ...state,
              orzWithProject:{
                  status:'loading'
              }
          }
        case FETCH_SUCCESS_PROJECT:{
            return {
                ...state,
                orzWithProject:{
                    status:'sucess',
                    ...action.result
                }
            }
        }
        case FETCH_FAILURE_PROJECT:{
            return {
                ...state,
                orzWithProject:{
                    status:'failure',
                    error: action.error
                }
            }
        }
        case ORZ_PROJECT_SELECT_ARR:{
            return{
                ...state,
                orzWithProject:{
                   ...state.orzWithProject,
                   selectArr: action.selectArr
               }
                
            }

        }
        default:{
            return state;
        }
    }
}
