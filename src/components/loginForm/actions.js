//action对象
import {LOGIN_SET_STATUS,LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE,LOGIN_RESET,LOGOUT} from './actionTypes.js';

//无参数，触发LOGOUT类型的reducer
export const logout = (hasLogin) => ({
    type: LOGOUT,
    hasLogin : hasLogin
});

export const loginReset =() =>({
    type:LOGIN_RESET
})

export const fakeLogin = () =>{
    return{
        promise: new Promise(function(resolve, reject) {

             //let isSuccess = Math.random() > 0.4 ;
             if ( true ){
                    setTimeout( () =>resolve( { hasLogin: 1, localStorage:{ hasLogin: 1,}}),2000 );
                    
                } else {
                    setTimeout( () => reject( { hasLogin: 1, localStorage:{ hasLogin: 0 } }),1000 );
                }
        }),
        types:[LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE]
    }
}

export const setLoginStatus = ( hasLogin ) =>({
     type: LOGIN_SET_STATUS,
     hasLogin: hasLogin 
})
