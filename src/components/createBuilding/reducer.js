import { CREATE_BUILDING_START, CREATE_BUILDING_SUCCESS,CREATE_BUILDING_FAILURE} from './actionTypes'
import { CREATE_BUILDING_DATA } from './actionTypes'

export default ( state={}, action ) =>{   
    switch(action.type){
        case CREATE_BUILDING_START:{
            return {
               ...state,
               status:"posting",
            }
        }
        case CREATE_BUILDING_SUCCESS:{
            return {
               ...state,
               status:"success",
               ...action.result,
            }
        }
        case CREATE_BUILDING_FAILURE:{
            return {
               ...state,
               status:"failure",
               ...action.result,
            }
        }
        case CREATE_BUILDING_DATA :{
            return{
                ...state,
                BUILDINGData_Add:{
                    ...action
                }
            }
        }
        default:{
            return state;
        }
    }
}
