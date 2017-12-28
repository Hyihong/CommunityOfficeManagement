//action类型,习惯用法 'type/'+type ，避免action类型冲突

//export const LOGIN_HASLOGIN = "LOGIN/LOGIN_HASLOGIN" //判断用户是否已登入
export const LOGIN_SET_STATUS ="LOGIN/SET_STATUS" // 记录用户状态

export const LOGIN_START = 'LOGIN/LOGIN_START';     // 开始登入
export const LOGIN_SUCCESS = 'LOGIN/LOGIN_SUCCESS'; // 登入成功
export const LOGIN_FAILURE = 'LOGIN/LOGIN_FAILURE'; // 登入失败
export const LOGIN_RESET ='LOGIN/LOGIN_RESET' //登入重置

export const LOGOUT = 'LOGOUT/LOGOUT'; //登出