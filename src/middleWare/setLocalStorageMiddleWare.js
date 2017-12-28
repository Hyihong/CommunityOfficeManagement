
export default function setLocalStorageMiddleWare( {dispatch} ) {
      return function (next){
          return function(action){
              const { result } = action;

              if(result && result.localStorage){
                //拦截含有localStorage属性的action,进行本地存储
                 let _r =  result.localStorage ;
                 Object.keys( _r ).map( key => {
                       return localStorage.setItem( key , _r[key])
                 })
              }
            
              return next(action)
              
            
          }
      }
}