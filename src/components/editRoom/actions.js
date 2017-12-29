import { EDIT_ROOM_START, EDIT_ROOM_SUCCESS,EDIT_ROOM_FAILURE} from './actionTypes'



 //编辑房间(房间ID,房间代码，房间名字，业主名字，业主电话，业主性别)
export const postEditForm = ( roomId,buildingID,code, name ,residentName,residentPhone,residentGender) =>{
    const apiUrl = `/api/room/v1/edit`;
    return {
        promise:fetch(apiUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id:roomId,
                BuildingId:buildingID,
                name:name,
                code:code, 
                residentName:residentName,
                residentPhone:residentPhone,
                status:"1",
                residentGender:residentGender
            })
        }),
        types: [EDIT_ROOM_START, EDIT_ROOM_SUCCESS,EDIT_ROOM_FAILURE],
    }
}