//action类型,习惯用法 'type/'+type ，避免action类型冲突

export const FETCH_STARTED = 'ROOM/FETCH_STARTED';
export const FETCH_SUCCESS = 'ROOM/FETCH_SUCCESS';
export const FETCH_FAILURE = 'ROOM/FETCH_FAILURE';

//编辑房间数据
export const ADD_ROOM = "ROOM/ADD";
export const EDIT_ROOM = "ROOM/EDIT";

//页面布局
export const SAVE_VIEW_SIZE = "ROOM_LIST/SAVE_VIEW_SIZE"

//房间启用or禁用
export const CHANGE_STATUS_STARTED = 'ROOM/CHANGE_STATUS_STARTED';
export const CHANGE_STATUS_SUCCESS = 'ROOM/CHANGE_STATUS_SUCCESS';
export const CHANGE_STATUST_FAILURE = 'ROOM/CHANGE_STATUST_FAILURE';