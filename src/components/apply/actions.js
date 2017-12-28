//action对象
import {APPLY_START,APPLY_SUCCESS,APPLY_FAILURE} from './actionTypes.js';


 //编辑楼栋
 export const postApplyForm = ( name,organizationId,master,contactor,contact,deviceCount,address_city,address_detail,desc,deviceTypeList) =>{
    const apiUrl = "/api/project/v1/create";
    return {
        promise:fetch(apiUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
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
        types: [APPLY_START, APPLY_SUCCESS,APPLY_FAILURE],
    }
}