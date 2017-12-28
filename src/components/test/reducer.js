import {FETCH_PROJECT_STARTED, FETCH_PROJECT_SUCCESS, FETCH_PROJECT_FAILURE} from './actionTypes.js';
import {Table_Page_Change } from './actionTypes.js';

const initState = {
    projectItem:{  status:'loading' },
    switch:{  status:'' }
}
export default (state = initState , action) =>{
    switch(action.type){
        case FETCH_PROJECT_STARTED:
          return {
              ...state,
              projectItem:{
                    status:'loading',
                    Data:[]
                }
          }
        case FETCH_PROJECT_SUCCESS:{
            return {
                ...state,
                projectItem:{
                    status:'success',
                    ...action.result
                },
               
            }
        }
        case FETCH_PROJECT_FAILURE:{
            return {
                ...state,
                projectItem:{
                    status:'failure',
                }
            }
        }
        case Table_Page_Change:{
            return{
                ...state,
                currentPage:action.page
            }
        }
        default:{
            return state;
        }
    }
}
