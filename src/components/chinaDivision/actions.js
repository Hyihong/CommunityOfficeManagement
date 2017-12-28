//action对象
import * as ActionTypes from './actionTypes.js';

//无参数，触发TYPEONE类型的reducer
export const typeOneAction = () => ({
   type: ActionTypes.TYPEONE
});

//有参数，触发TYPETWO类型的reducer
export const typeTwoAction = (params1,params2) => ({
   type: ActionTypes.TYPETWO,
   params1:params1,
   params2:params2
});

//Function类型的action,在不加中间件的情况下，会比捕获报错，但是加上中间件（异步请求用 redux-thunk ）
export const fetchWeather = (cityCode) =>{
    const apiUrl = `/data/cityinfo/${cityCode}.html`;
    return {
        // promise:fetch( apiUrl ).then(response => {
        //     if( response.status !== 200){
        //         throw new Error("获取失败")
        //     }
            
        //     return response.json().then( responseJson  => responseJson.weatherinfo)
        // }),
        promise:  fetch( apiUrl )
    }
}