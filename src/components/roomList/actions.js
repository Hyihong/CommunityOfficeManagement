//action对象
import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE} from './actionTypes.js';
import { ADD_ROOM,EDIT_ROOM } from './actionTypes.js';


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
    return{
        type:ADD_ROOM,
        ID:roomId,
        Code:code,
        Name:name,
        ResidentName:residentName,
        ResidentPhone:tel,
        gender:gender 
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