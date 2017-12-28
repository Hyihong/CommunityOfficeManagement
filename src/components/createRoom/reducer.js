import { CREATE_ROOM_START, CREATE_ROOM_SUCCESS,CREATE_ROOM_FAILURE} from './actionTypes'
import { CREATE_ROOM_DATA } from './actionTypes'

export default (state = {visible:false},action ) =>{   
    switch(action.type){
        case CREATE_ROOM_START:{
            return {
               ...state,
               status:"posting",
            }
        }
        case CREATE_ROOM_SUCCESS:{
            return {
               ...state,
               status:"success",
               ...action.result,
               visible:false,
            }
        }
        case CREATE_ROOM_FAILURE:{
            return {
               ...state,
               status:"failure",
               ...action.result,
               visible:false,
            }
        }
        case CREATE_ROOM_DATA :{
            return{
                ...state,
                RoomData_Add:{
                    ...action
                }
            }
        }
        default:{
            return state;
        }
    }
}
