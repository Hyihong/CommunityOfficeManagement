import { EDIT_BUILDING_START, EDIT_BUILDING_SUCCESS,EDIT_BUILDING_FAILURE} from './actionTypes'



 //编辑楼栋
export const postEditForm = ( buildingID , projectID, code, name) =>{
    const apiUrl = `/api/building/v1/edit`;
    console.log( buildingID)
    return {
        promise:fetch(apiUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                id:buildingID,
                name:name,
                code:code, 
                projectid:projectID
        
            })
        }),
        types: [EDIT_BUILDING_START, EDIT_BUILDING_SUCCESS,EDIT_BUILDING_FAILURE],
    }
}