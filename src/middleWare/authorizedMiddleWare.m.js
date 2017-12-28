import { Toast } from 'antd-mobile'

export default function authorizedMiddleWare( {dispatch} ) {
      return function (next){
          return function(action){
              const { type } = action;
              if(  type === '401'){
                Toast.info("登录过期...",1)
                setTimeout( ()=>{
                      window.location = '/Account/Login'
                },1000)
              }else{
                return next(action)
              }
          }
      }
}