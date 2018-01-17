import {TYPEONE, TYPETWO} from './actionTypes.js';

// state ： 初始数据，Type : any 
export default (state = 100, action) => {
switch (action.type) {
    case TYPEONE:
        return state + 1;
    case TYPETWO:
        return state - 1;
    default:
        return state
}
}
