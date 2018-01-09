//action对象
import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE,Filter_Status,Set_Current_Page,SWITCH_OPERATE_PANEL,SAVE_VIEW_SIZE} from './actionTypes.js';

export const fetchAllProjects = () =>{
    const apiUrl = "/api/project/v1/get";
    return {
        promise:fetch( apiUrl,{
            credentials: 'same-origin',
            headers: {
                //Authorization:'Basic',
            },
        }),
        types: [FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE]
    }
}

export const setFilterStatus =  ( s ) =>({
    type:Filter_Status,
    filterStatus:s,
})

export const setCurrentPage =  ( p ) =>({
    type:Set_Current_Page,
    currentPage:p,
})


export const wakeOperationPanel = (id)=>({
    type:SWITCH_OPERATE_PANEL,
    id:id
})

export const saveViewSize = ({...argument}) => ({
    type:SAVE_VIEW_SIZE,
    option:argument
})