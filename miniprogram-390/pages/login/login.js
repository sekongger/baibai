// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null  //判断用户是否已登录，未登录时显示null
  },
  login() {
    var that = this
    wx.getUserProfile({ //获取用户信息
      desc: 'desc',
      success: function (res) {
        console.log(res.userInfo)
        that.setData({
          userInfo: res.userInfo
        })
        wx.showToast({
          title: '登陆成功',
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '../add/add',
          })
        }, 1000);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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