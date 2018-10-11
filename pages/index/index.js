
/**
 * 大转盘抽奖
 */

var util = require("../../utils/util.js");
var app = getApp();
var basePath = 'https://soundapi.dglib.cn/activity/api/';
var netErrorTost = '网络连接失败，请稍后再试...';
var canPlayCount ;
var address;
Page({

  //奖品配置
  awardsConfig: {
    chance: true,
    awards: [
    ]
  },

  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    modalHidden: true,
    finishHidden: true,
    resultHidden: true,
    titleString: '',
    resultString: '抽中一等奖！',//抽奖结果
    sureButtonTitle: '',
    awardAddress:'',
    state: 3, //1，尚未进行抽奖,未填写基本资料，2，尚未进行抽奖，已填写基本资料 3，已抽奖，未领奖 4，已领奖
    arrRulers:[],
    alearnTitle:'',
    nameString: '',//姓名
    telString: '',//电话☎️
    selectImageState: 'select',//是否正在抽奖
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

  },
  onLoad: function (e) {
    this.getStatue();

  },
  onReady: function (e) {

  },

  //画抽奖圆盘
  drawAwardRoundel: function () {
    var awards = this.awardsConfig.awards;
    var awardsList = [];
    var turnNum = 1 / awards.length;  // 文字旋转 turn 值

    // 奖项列表
    for (var i = 0; i < awards.length; i++) {
      awardsList.push({ turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: awards[i].ruleName });
    }

    this.setData({
      btnDisabled: this.awardsConfig.chance ? '' : 'disabled',
      awardsList: awardsList
    });
  },

  //发起抽奖
  playReward: function (awardIndex) {
    var runNum = 8;//旋转8周
    var duration = 2000;//时长
    var awards = this.awardsConfig.awards;

    // 旋转角度
    this.runDeg = this.runDeg || 0;
    this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - awardIndex * (360 / awards.length))
    //创建动画
    var animationRun = wx.createAnimation({
      duration: duration,
      timingFunction: 'ease'
    })
    animationRun.rotate(this.runDeg).step();
    this.setData({
      animationData: animationRun.export(),
      btnDisabled: 'disabled'
    });

    // 中奖提示
    var awardsConfig = this.awardsConfig;
    setTimeout(function () {
      var rulerInfo = awardsConfig.awards[awardIndex];
      console.log(rulerInfo);
      if (rulerInfo.ruleSort == -1){
        this.setData({
          alearnTitle:'未中奖',
          sureButtonTitle:'确定'
        })
        this.showFinishAction('很遗憾' + (rulerInfo.ruleName));

      }else{
        this.setData({
          alearnTitle: '恭喜您',
          sureButtonTitle:'凭姓名、电话前往' + address + '领奖'
        })
        this.showFinishAction('获得' + (rulerInfo.ruleName));


      }

      this.setData({
        btnDisabled: ''
      });
    }.bind(this), duration);

  },
  showAction: function () {
    this.setData({
      modalHidden: false,
    })
  },

  hideAction: function () {
    // do something
    this.setData({
      modalHidden: true,
    })
  },
  showFinishAction: function (text) {
    this.setData({
      finishHidden: false,
      resultString: text
    })
  },

  hideFinishAction: function () {
    // do something
    this.setData({
      finishHidden: true,
    })

  },
  showRsultAction: function () {
    this.setData({
      resultHidden: false,
    })
  },

  hideRsultAction: function () {
    // do something
    this.setData({
      resultHidden: true,
    })
  },
  // 获取当前抽奖状态
  getStatue: function () {

    var that = this;
    var sta = 1;

    if (sta == 1) {
      that.showAction();

    } else if (sta == 2) {

    } else if (sta == 3) {
      this.setData({
        btnDisabled: 'disabled'
      })
      this.showFinishAction('获得xxxxxxxx');


    } else if (sta == 4) {
      this.setData({
        btnDisabled: 'disabled'
      })
      this.showRsultAction();

    } else {

    }
  },
  getLotteryResult: function () {
    var that = this;

    that.setData({
      btnDisabled:  'disabled',

    })
    var openID = wx.getStorageSync('openID');
    var telString = this.data.telString;
    var nameString = this.data.nameString;
    var arrData = that.awardsConfig.awards;
    var awardIndex ;

    wx.showLoading({
      title: '请稍候',
    })
    var testNum = Math.random() *1000 >>>0;


    wx.request({
      url: basePath + 'playaty.jsp?userName=' + nameString + '&userPhone=' + telString + '&openId=' + openID + testNum+ '&activityId=' + 1,
      success:function(res){
        console.log(res.data);

        var code = res.data.result;
        if(code == 1){
          wx.hideLoading();

        
        console.log(res.data);
          for (var i = 0; i < arrData.length;i++){
            if (res.data.ruleId == arrData[i].ruleId){
              awardIndex = i;
              that.playReward(awardIndex);
              break;
            }
          }
        }else if(code == 2){
          wx.hideLoading();

          for (var i = 0; i < arrData.length; i++) {
            if (res.data.ruleId == arrData[i].ruleId) {
              awardIndex = i;
              that.playReward(awardIndex);
              break;
            }
          }

        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
          that.setData({
            btnDisabled: '',

          })

        }

      },
      fail:function(error){
        wx.showToast({
          title: netErrorTost,
          icon:'none'
        })
        that.setData({
          btnDisabled: '',

        })

      }
    })

  },
  goToLottery: function (openID) {
    var that = this;
    var nameString = this.data.nameString;

    if (util.String.isBlank(nameString)) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'

      })
      return;
    }
    var telString = this.data.telString;

    if (!util.validatemobile(telString)) {
      return;
    }
    var selectImageState = this.data.selectImageState;
    if (selectImageState != "select") {
      wx.hideLoading();

      wx.showToast({
        title: '请同意抽奖须知',
        icon: 'none'
      })

      return;

    }
    wx.showLoading({
      title: '请稍候...',
    })

    wx.request({
      url: basePath + 'login.jsp?userName=' + nameString + '&userPhone=' + telString+'&openId='+openID+'&activityId='+1,
      success:function(res){
        console.log(res.data);
        if (res.data.result == 1){
          that.awardsConfig.awards = res.data.rules;
          // var sortByRuleSort = function (ruleSort){
          //   return function (obj1,obj2){
          //     var value1 = obj1[ruleSort];
          //     var value2 = obj2[ruleSort];
          //     if(value1<value2)return -1;
          //     else if(value1>value2) return 1;
          //     else return 0;
          //   }
          // }
          // that.awardsConfig.awards.sort(sortByRuleSort('ruleSort'));
          canPlayCount = res.data.activityDetails.playCount - res.data.userPdInfo.length;
          // wx.showModal({
          //   title: '提示',
          //   content: '还剩' + canPlayCount + '抽奖机会',
          // })
          that.drawAwardRoundel();
          address = res.data.activityDetails.address;

          that.setData({
            titleString: res.data.activityDetails.activitydec,
            arrRulers:res.data.rules,
            awardAddress: address,
          })

          wx.hideLoading();
          that.hideAction();

        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
        

      },
      fail:function(error){
        console.log(error);

      }
    })


  },
  acceptPrize: function () {
    this.hideFinishAction();
  },
  nameInput: function (e) {
    this.setData({
      nameString: e.detail.value
    })
  },

  telInput: function (e) {
    this.setData({
      telString: e.detail.value
    })

  },
  selectImageClick: function () {
    if (this.data.selectImageState == 'select') {
      this.setData({
        selectImageState: "un_select"
      })
    } else {
      this.setData({
        selectImageState: "select"
      })

    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '获取用户权限失败',
        icon: "none"
      })
    } else {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })

    }
  },
  loadGetUserInfo: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  getOpenID:function(){

    var openID = wx.getStorageSync('openID');
    console.log(openID);
    var that = this;
    if (!util.String.isBlank(openID)){
      that.goToLottery(openID);

    }else{
      wx.showLoading({
        title: '请稍候...',
      })

      wx.login({
        success: function (res) {
          wx.request({
            url: basePath + 'getwxcode.jsp?jsCode=' + res.code,
            data: {

            },
            success: function (res) {
              console.log(res);
              wx.setStorageSync("openID", res.data.openid);
              that.goToLottery(res.data.openid);
            },
            fail: function (error) {
              wx.showToast({
                title: '网络连接失败，请稍后再试',
                icon:'none'
              })

            }
          })
        }
      })

    }

  }



})
