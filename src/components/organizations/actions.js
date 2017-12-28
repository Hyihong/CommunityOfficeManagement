//action对象
import {FETCH_STARTED_ALL, FETCH_SUCCESS_ALL, FETCH_FAILURE_ALL} from './actionTypes.js';
import {FETCH_STARTED_PROJECT, FETCH_SUCCESS_PROJECT, FETCH_FAILURE_PROJECT,ORZ_PROJECT_SELECT_ARR} from './actionTypes.js';


//获取用户拥有项目所属的组织机构
export const fetchORZsWithProject = () =>{
    const apiUrl = "/api/organization/v1/GetOrganizationsWithProject";
    return {
        promise:fetch( apiUrl ,{
            credentials: 'same-origin',
        }),
        types: [FETCH_STARTED_PROJECT, FETCH_SUCCESS_PROJECT, FETCH_FAILURE_PROJECT]
    }
}
//设置【项目对应组织机构】所选项
export const setOrzWithProjectSelected = ( arr ) =>{
    return {
        type: ORZ_PROJECT_SELECT_ARR,
        selectArr: arr 
    }
}



//获取用户所有可申请项目所属的组织机构
export const fetchORZs = () =>{
    const apiUrl = "/api/organization/v1/get";
    return {
        promise:fetch( apiUrl ,{
            credentials: 'same-origin',
        }),
        types: [FETCH_STARTED_ALL, FETCH_SUCCESS_ALL, FETCH_FAILURE_ALL]
    }
}
