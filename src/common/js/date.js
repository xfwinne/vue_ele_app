// 公共的多组件都能使用的方法，放到这个公共的js文件中
export function formatDate (date, fmt) {
  // fmt是传过来的时间格式参数，如'yyy-MM-dd hh:mm'
  // 匹配年份格式，进行替换(年份替换有些特殊，可能两位，可能四位，所以单独设置)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let obj = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()

  }

  for (let k in obj) {
    if (new RegExp(`(${k})`).test(fmt)) {
      // 把数字转换成字符串
      let strTime = obj[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? strTime : addZero(strTime))
    }
  }

  return fmt
}

// 补0函数
function addZero (strTime) {
  return ('00' + strTime).substr(strTime.length)
}
