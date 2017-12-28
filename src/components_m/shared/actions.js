import * as ActionTypes from './actionTypes.js';

//初始化页面，主要用于定位导航
export const initialize = (current,openKeys) => ({
   type: ActionTypes.INITIALIZE,
   current: current,
   openKeys: openKeys
   
});

export const changeMenu = (openKeys) => ({
   type: ActionTypes.CHANGEMENU,
   openKeys: openKeys
});

export const menuitemclick = (current) => ({
   type: ActionTypes.MENUITEMCLICK,
   current: current
});

