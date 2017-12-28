function createThunkMiddleware( extraArgument ){
    return function(  {dispatch,getState}){
      return function(next){
          return function(action){
              //对传入的action对象进行处理
              if(typeof action === "function"){
                  return action(dispatch,getState,extraArgument)
              }
              return next(action)
          }
      }
    }
}

const thunk = createThunkMiddleware();
export default thunk ;