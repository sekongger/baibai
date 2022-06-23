// pages/addNeed/addNeed.js

const app = getApp()
var plugin = requirePlugin("WechatSI")

let manager = plugin.getRecordRecognitionManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordState: false, //录音状态
    time:null,
    date:null,
    type:["娱乐","工作","生活"],
    typeIndex:0,
    text:''
  },
  conInput: function (e) {
    console.log(e)
    this.setData({
     
      text:e.detail.value,
    })
  },
  //识别语音 -- 初始化
  initRecord: function () {
    const that = this;
    // 有新的识别内容返回，则会调用此事件
    manager.onRecognize = function (res) {
      console.log(res)
    }
    // 正常开始录音识别时会调用此事件
    manager.onStart = function (res) {
      console.log("成功开始录音识别", res)
    }
    // 识别错误事件
    manager.onError = function (res) {
      console.error("error msg", res)
    }
    //识别结束事件
    manager.onStop = function (res) {
      console.log('..............结束录音')
      console.log('录音临时文件地址 -->' + res.tempFilePath); 
      console.log('录音总时长 -->' + res.duration + 'ms'); 
      console.log('文件大小 --> ' + res.fileSize + 'B');
      console.log('语音内容 --> ' + res.result);
      if (res.result == '') {
        wx.showModal({
          title: '提示',
          text: '听不清楚，请重新说一遍！',
          showCancel: false,
          success: function (res) {}
        })
        return;
      }
      var tex = that.data.text + res.result;
      that.setData({
        text: tex
      })
    }
  },
  //语音  --按住说话
  touchStart: function (e) {
    this.setData({
      recordState: true  //录音状态
    })
    // 语音开始识别
    manager.start({
      lang: 'zh_CN',// 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
    })
  },
  //语音  --松开结束
  touchEnd: function (e) {
    this.setData({
      recordState: false
    })
    // 语音结束识别
    manager.stop();
  },
  seleDate(e){
    console.log(e)
    this.setData({
      date:e.detail.value
    })
  },
  submit(){
    var date=this.data.date;
    var time=this.data.time;
    var type=this.data.type[this.data.typeIndex];
    var text=this.data.text;
    var param={
      date:date,type:type,time:time,text:text
    };
    var list=wx.getStorageSync('list')
    if(!list){list=[]}
    list.push(param);
    wx.setStorageSync('list', list)
    wx.showToast({
      title: '添加成功',
    })
    
  },
  text(e){
    this.setData({text:e.detail.value})
  },
  seleTime(e){
    console.log(e)
    this.setData({
      time:e.detail.value
    })
  },
  type(e){
    this.setData({
      typeIndex:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initRecord();//录音初始化
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})