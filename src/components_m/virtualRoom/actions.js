//action对象
import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE} from './actionTypes.js';

//根据楼栋ID获取房间信息
export const fetchVirtualRoomInfo = ( roomID) =>{
    const apiUrl = `/api/room/v1/customerroomdeviceinfo?roomId=${roomID}`;
    //const apiUrl = `/api/room/v1/customerroomdeviceinfo?roomId=992000F3-9254-4D21-803B-4B72977C9EB3`;
    return {
        promise:fetch(apiUrl,{
            method:'get',
            credentials: 'same-origin',
            // credentials: 'same-origin',
            // headers: {
            //     Authorization:'Basic',
            // },
        }),
        types: [FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE]
    }
}
