// miniprogram/pages/message/message.js

const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogged: false,
    userMessage: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息列表'
    })
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
    if (!app.userInfo._id) {
      wx.showToast({
        title: '请先登录！',
        duration: 2000,
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '../user/user'
            })
          }, 2000)
        }
      })
    } else {
      this.setData({
        isLogged: app.isLogged,
        userMessage: app.userMessage
      })
    }
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

  },
  onDelete(ev){
    this.setData({
      userMessage: []
    },() => {
      this.setData({
        userMessage: ev.detail
      })
    })
  }
})