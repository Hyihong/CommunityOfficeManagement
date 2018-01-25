import { ORIENTATION } from './actionTypes.js';

export default (state = {}, action) => {
switch (action.type) {
    case ORIENTATION:
        return {
                ...state,
                orientation:action.orientation
            } ;
    default:
        return state
}
}
