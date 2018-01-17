//action对象
import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE} from './actionTypes.js';
import {CHANGE_STATUS_STARTED, CHANGE_STATUS_SUCCESS, CHANGE_STATUST_FAILURE} from './actionTypes.js';
import { ADD_ROOM,EDIT_ROOM,SAVE_VIEW_SIZE } from './actionTypes.js';


//根据楼栋ID获取房间信息
export const fetchRoomInfo = ( buildingID) =>{
    //const apiUrl = `/api/room/v1/get?buildingId=${buildingID}`;
    //此URL为移动端专用URL,返回的数据中不包含【房间成员】的具体信息，反之用CustomerNumber代替
    const apiUrl = `/api/room/m/v1/get?buildingId=${buildingID}`
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

//启用or禁用房间
export const SetRoomStatus = ( roomID ,status,index ) =>{
    const apiUrl = `/api/room/v1/setenable?roomId=${roomID}&status=${status}`;
    return {
        promise:fetch(apiUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        types: [CHANGE_STATUS_STARTED, CHANGE_STATUS_SUCCESS, CHANGE_STATUST_FAILURE],
        roomID:roomID,
        index:index,
        status:status
    }
}

//新增房间
export const AddNewRoomToList = ({...argument}) =>{
    return({
        type:ADD_ROOM,
        ...argument
    })
}

//编辑房间:根据房间ID,房间code 和 房间name, 修改房间列表
export const editRoomData = ({...argument}) =>{ 
    return ({
     type:EDIT_ROOM,
     ...argument
  })
}

//页面布局位置参数存储
export const saveViewSize = ({...argument}) => ({
    type:SAVE_VIEW_SIZE,
    option:argument
})