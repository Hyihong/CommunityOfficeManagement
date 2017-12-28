import { EDIT_BUILDING_START, EDIT_BUILDING_SUCCESS,EDIT_BUILDING_FAILURE} from './actionTypes'

export default (state = {},action ) =>{
    switch(action.type){
        case EDIT_BUILDING_START:{
            return {
               ...state,
               status:"posting",
            }
        }
        case EDIT_BUILDING_SUCCESS:{
            return {
               ...state,
               status:"success",
               ...action.result
            }
        }
        case EDIT_BUILDING_FAILURE:{
            return {
               ...state,
               status:"failure",
               ...action.result
            }
        }
        default:{
            return state;
        }
    }
}
