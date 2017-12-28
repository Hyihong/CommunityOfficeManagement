//action对象
import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE,Filter_Status,Set_Current_Page} from './actionTypes.js';

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