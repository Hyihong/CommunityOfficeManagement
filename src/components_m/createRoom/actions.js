

import { CREATE_ROOM_START, CREATE_ROOM_SUCCESS,CREATE_ROOM_FAILURE} from './actionTypes'

  //创建房间 : 楼栋ID,房间代码，房间名称，业主名称，业主电话，业主性别
export const postCreateRoomForm = ( id ,code, name ,residentName,tel,gender) =>{ 
    const apiUrl = "/api/room/v1/create";
    return {
        promise:fetch(apiUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                BuildingId: id,
                code: code,
                Name:name,
                residentName:residentName,
                residentPhone: tel,
                residentGender:gender
            })
        }),
        types: [CREATE_ROOM_START, CREATE_ROOM_SUCCESS,CREATE_ROOM_FAILURE],
    }
}


