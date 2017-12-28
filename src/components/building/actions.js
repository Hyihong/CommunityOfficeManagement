
import {FETCH_BUILIDING_STARTED, FETCH_BUILIDING_SUCCESS, FETCH_BUILIDING_FAILURE} from './actionTypes.js';
import {CHANGE_STATUS_STARTED, CHANGE_STATUS_SUCCESS, CHANGE_STATUST_FAILURE} from './actionTypes.js';
import { FRESH,CREATE,Table_Page_Change, } from './actionTypes.js';




//获取楼栋列表
export const fetchProjectBuildings = ( projectID) =>{

    //旧的API: const apiUrl = `/api/project/v1/getprojectdetails?projectid=${projectID}`; 
    const apiUrl = `/api/project/v1/getprojectbuildings?projectid=${projectID}`;
    return {
        promise:fetch( apiUrl,{
            credentials: 'same-origin',
        }),
        types: [FETCH_BUILIDING_STARTED, FETCH_BUILIDING_SUCCESS, FETCH_BUILIDING_FAILURE]
    }
}

//启用or禁用栋楼
export const SetBuildingStatus = ( buildingID ,status,index ) =>{
    
    const apiUrl = `/api/building/v1/setenable?buildingId=${buildingID}&status=${status}`;
    return {
        promise:fetch(apiUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        types: [CHANGE_STATUS_STARTED, CHANGE_STATUS_SUCCESS, CHANGE_STATUST_FAILURE],
        buildingID:buildingID,
        index:index,
        status:status
    }
}

//根据楼栋ID,楼栋code 和 楼栋name, 刷新楼栋列表
export const editBuildingData = ({...argument}) =>{ 
    return ({
     type:FRESH,
     ...argument
  })
}

//新增楼栋
export const AddNewBuildingToList = ({...argument}) =>{
    return{
        type:CREATE,
        ...argument,
    }
}


export const changeTablePage =(page) => ({
    type:Table_Page_Change,
    page:page
})







