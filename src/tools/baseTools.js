import $ from 'jquery'
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

//判断是否兼容placeholder方法
export const setPlaceholder = () =>{
    if (!placeholderSupport()&& $(".placeholder").length===0) {
        var input = $(".ant-input");
        input.each(function () {
            const text = $(this).attr("placeholder");
            if (this.value === "" && $(".placeholder")) {
                $("<span>", {
                    "class": "placeholder",
                    "text": text,
                    "style": 'position:absolute;z-index:10;color:#d9d9d9;top:0px;left:5px;'
                }).appendTo(this.parentNode);
                if (this.parentNode.firstChild.hasChildNodes("i")) {
                    $(this.parentNode.lastElementChild).css('left', "23px");
                }
                if (text === "详细地址") {
                    $(this.parentNode.lastElementChild).css('left', "205px");
                }
                if ($(".placeholder")) {
                    $(".placeholder").click(function () {
                        $(this).hide();
                        if(this.parentNode.className !== "ant-cascader-picker"){
                            $(this.previousSibling).focus();
                        }
                    });
                }
                if($(this).attr("name")==="UserName"||$(this).attr("name")==="Password"){
                    $(this.parentNode.lastElementChild).css('top', "3px");
                }
            }
            $(this).focus(function () {
                $(this.parentNode.lastElementChild).hide();
            });
            $(this).blur(function () {
                if (this.value === "" && this.parentNode.className !== "ant-cascader-picker") {
                    $(this.parentNode.lastElementChild).show();
                }
            });
        });
    }
}
function placeholderSupport() {
    return 'placeholder' in document.createElement('input');
}
//判断大写按键是否被锁定,ie浏览器使用默认的样式
export const capitalTip =() =>{
    if(!!window.ActiveXObject || "ActiveXObject" in window){
        return;
    }
    else {
        var inputPWD = document.getElementById('password');
        var capital = false;
        var capitalTip = document.getElementById('capsLock');
        if (inputPWD && capitalTip) {
            inputPWD.onkeypress = function (event) {
                if (capital) { return };
                var e = event || window.event;
                var keyCode = e.keyCode || e.which;
                var isShift = e.shiftKey || (keyCode === 16) || false;
                if (
                    ((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift)
                ) { capitalTip.style.visibility = "visible"; capital = true; }
                else { capitalTip.style.visibility = "hidden"; }
            }

            inputPWD.onblur = function () {
                capitalTip.style.visibility = 'hidden';
                capital = false;
            }

            inputPWD.onkeyup = function (event) {
                var e = event || window.event;
                if (e.keyCode === 20 && capital) {
                    if (capitalTip.style.visibility === 'visible') {
                        capitalTip.style.visibility = "hidden";
                    }
                    else {
                        capitalTip.style.visibility = 'visible';
                    }
                }
            }
        }
    }
}