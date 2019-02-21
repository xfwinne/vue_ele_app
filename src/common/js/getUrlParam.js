// 公共的多组件都能使用的方法，放到这个公共的js文件中
// 获取到url中的参数
export function urlParse(){
    // 取出来的字符串类似于（两个参数）：?id=123&a=b
    let urlParam = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = urlParam.match(reg);
    // arr = ['?id=123','&a=b']
    if(arr){
        arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            // url地址会存在编码问题，所以要解码
            let key = decodeURIComponent(tempArr[0]);
            let value = decodeURIComponent(tempArr[1]);
            obj[key] = value;
        })
    }
    return obj;
}