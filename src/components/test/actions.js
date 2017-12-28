
import {FETCH_PROJECT_STARTED, FETCH_PROJECT_SUCCESS, FETCH_PROJECT_FAILURE} from './actionTypes.js';
import { Table_Page_Change } from './actionTypes.js';




//获取项目详细信息
export const fetchProjectBuildings = ( projectID) =>{
    
    //获取项目详细信息
    const apiUrl = `/api/project/v1/getprojectdetails?projectid=${projectID}`; 
    return {
        promise:fetch( apiUrl,{
            credentials: 'same-origin',
        }),
        types: [FETCH_PROJECT_STARTED, FETCH_PROJECT_SUCCESS, FETCH_PROJECT_FAILURE]
    }
}

export const changeTablePage =(page) => ({
    type:Table_Page_Change,
    page:page
})







