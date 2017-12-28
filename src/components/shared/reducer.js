import { CHANGEMENU ,MENUITEMCLICK,INITIALIZE } from './actionTypes.js';
const initState = {
      current: 'home',
      openKeys: [],
}
export default (state = initState, action) => {
switch (action.type) {
    case CHANGEMENU:
        return {
                ...state,
                openKeys:action.openKeys
            } ;
    case MENUITEMCLICK:
         return {
               ...state,
                current:action.current
         };
     case INITIALIZE:
         return {
               ...state,
                current:action.current,
                openKeys:action.openKeys
         };
    default:
        return state
}
}
