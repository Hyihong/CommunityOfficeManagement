//action对象
import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE} from './actionTypes.js';
import { ADD_ROOM,EDIT_ROOM } from './actionTypes.js';
import {CHANGE_STATUS_STARTED,CHANGE_STATUS_SUCCESS, CHANGE_STATUS_FAILURE} from './actionTypes'
//根据楼栋ID获取房间信息
export const fetchRoomInfo = ( buildingID) =>{
    const apiUrl = `/api/room/v1/get?buildingId=${buildingID}`;

    function getCookie(cookieName) {
      var cookieString = RegExp("" + cookieName + "[^;]+").exec(document.cookie);
      return unescape(!!cookieString ? cookieString.toString().replace(/^[^=]+/, "").replace("=", "") : "");
    }

    function setHeader(xhr) {
        var ticket = 'Basic ' + getCookie(".AuthCookie");
        xhr.setRequestHeader('Authorization', ticket);
    }
 
    

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

//新增房间
export const AddNewRoomToList = (roomId,code,name,residentName,tel,gender) =>{
    console.log(gender)
    return{
        type:ADD_ROOM,
        ID:roomId,
        Code:code,
        Name:name,
        ResidentName:residentName,
        ResidentPhone:tel,
        Gender:gender==1?"男":"女"
    }
}

//编辑房间
//根据房间ID,房间code 和 房间name, 修改房间列表
export const editRoomData = ({...argument}) =>{ 
    return ({
     type:EDIT_ROOM,
     ...argument
  })
}
//启用or禁用房间
export const SetRoomStatus = ( buildingID ,status,index ) =>{
console.log(buildingID,status,index)
    const apiUrl = `/api/room/v1/setenable?roomId=${buildingID}&status=${status}`;
    return {
        promise:fetch(apiUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        types: [CHANGE_STATUS_STARTED, CHANGE_STATUS_SUCCESS, CHANGE_STATUS_FAILURE],
        buildingID:buildingID,
        index:index,
        status:status
    }
}