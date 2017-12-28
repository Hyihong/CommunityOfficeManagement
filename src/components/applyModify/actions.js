//action对象
import {POST_MODIFY_START,POST_MODIFY_SUCCESS,POST_MODIFY_FAILURE} from './actionTypes.js';
import {FETCH_MODIFY_START,FETCH_MODIFY_SUCCESS,FETCH_MODIFY_FAILURE} from './actionTypes.js';


 //提交修改信息
 export const postmodifyApplyForm = ( id,name,organizationId,master,contactor,contact,address_city,address_detail,deviceCount,desc,deviceTypeList) =>{
    const apiUrl = "/api/project/v1/edit";
    return {
        promise:fetch(apiUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                 id:id,
                 Name:name,
                 OrganizationId:organizationId,
                 Master:master,
                 Contactor:contactor,
                 Contact:contact,
                 Address_city:address_city,
                 Address_detail:address_detail,
                 DeviceCount:deviceCount,
                 Desc:desc,
                 DeviceTypeList:deviceTypeList
            })
        }),
        types: [POST_MODIFY_START, POST_MODIFY_SUCCESS,POST_MODIFY_FAILURE],
    }
}

 //获取申请中项目的数据
 export const fetchApplyInfo =(projectID) =>{
     const apiUrl =`/api/project/v1/get?projectid=${projectID}`;
     return{
        promise:fetch(apiUrl, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
        }),
        types: [FETCH_MODIFY_START,FETCH_MODIFY_SUCCESS,FETCH_MODIFY_FAILURE],
    }
 }
