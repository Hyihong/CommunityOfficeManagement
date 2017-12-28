import { EDIT_ROOM_START, EDIT_ROOM_SUCCESS,EDIT_ROOM_FAILURE} from './actionTypes'

export default (state = {},action ) =>{
    switch(action.type){
        case EDIT_ROOM_START:{
            return {
               ...state,
               status:"posting",
            }
        }
        case EDIT_ROOM_SUCCESS:{
            return {
               ...state,
               status:"success",
               ...action.result
            }
        }
        case EDIT_ROOM_FAILURE:{
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
