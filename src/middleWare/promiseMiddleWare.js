function isPromise(obj){
    return obj && typeof obj.then === 'function';
}

export default function promiseMiddleware( {dispatch} ) {
      return function (next){
          return function(action){
              const { types,promise,...rest } = action;

              if( !isPromise(promise) || !(action.types && action.types.length === 3)){
                  return next(action)
              }
            
               const [pending, done, fail] = types;

               dispatch({...rest,type:pending});
               action.promise.then( response => {
                   switch( response.status){
                       case 200 : {
                              response.json().then( 
                                    result => { 
                                        if( typeof result === 'object' ){
                                            if(result.Code === 0 ){
                                                dispatch({...rest,result,type:done})
                                            }else{
                                                dispatch({...rest,result,type:fail})
                                            }
                                        } else{
                                            if( result){
                                                dispatch({...rest,result,type:done})
                                            }else{
                                                dispatch({...rest,result,type:fail})
                                            }
                                        }
                                    },
                                      
                                    error =>  dispatch({...rest,error,type:fail})
                                )
                            break;
                       }
                       case 401:{
                           dispatch({type:"401",error:{message:"登录过期,请重新登录"}});
                           break;
                       }
                       case 500 :{
                            dispatch({ type: fail,error:{ statusText :"服务端发生错误"}})
                            break;
                       }
                       default:{
                            dispatch({ type: fail,error:{ statusText :"发生未知错误"}})
                       }
                   } 
               })
          }
      }
}