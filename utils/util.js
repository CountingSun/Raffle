const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


var validatemobile = function (mobile){
  if (mobile.length == 0) {
    wx.showToast({
      title: '请输入手机号！',
      icon: 'none',
    })
    return false;
  }
  if (mobile.length != 11) {
    wx.showToast({
      title: '手机号长度有误！',
      icon: 'none',
    })
    return false;
  }
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (!myreg.test(mobile)) {
    wx.showToast({
      title: '手机号有误！',
      icon: 'none',
      duration: 1500
    })
    return false;
  }
  return true;
}
/**
 * 用于判断空，Undefined String Array Object
 */
function isBlank(str) {
  if (Object.prototype.toString.call(str) === '[object Undefined]') {//空
    return true
  } else if (
    Object.prototype.toString.call(str) === '[object String]' ||
    Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
    return str.length == 0 ? true : false
  } else if (Object.prototype.toString.call(str) === '[object Object]') {
    return JSON.stringify(str) == '{}' ? true : false
  } else {
    return true
  }

}


module.exports = {
  formatTime: formatTime,
  validatemobile: validatemobile,
  String: {
    isBlank: isBlank
  }

}
