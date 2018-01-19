//本文档为移动版存储的工具方法，PC版本因引入JQ，若移动版本与之共用，会使打包体积过大。
export const isArray = function isArray(object){
    return object && typeof object==='object' &&
            Array === object.constructor;
}

export const isPC = function IsPC()    
{    
  var userAgentInfo = navigator.userAgent;    
  var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod" ];    
  var flag = true;    
  for (var v = 0; v < Agents.length; v++) {    
    if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }    
        }    
    return flag;    
}  

export const getQueryString = function getQueryString(search,name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

export const trim = (s)=>{
      
}
