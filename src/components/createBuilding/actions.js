

import { CREATE_BUILDING_START, CREATE_BUILDING_SUCCESS,CREATE_BUILDING_FAILURE} from './actionTypes'

  //创建楼栋 : 项目ID,楼栋代码，楼栋名称
export const postCreateBuildingForm = ( id ,code, name ) =>{ 
    const apiUrl = "/api/building/v1/create";
    return {
        promise:fetch(apiUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectid: id,
                code: code,
                name:name,
            })
        }),
        types: [CREATE_BUILDING_START, CREATE_BUILDING_SUCCESS,CREATE_BUILDING_FAILURE],
    }
}


