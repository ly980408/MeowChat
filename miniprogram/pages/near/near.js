// miniprogram/pages/near/near.js

const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: undefined,
    latitude: undefined
  },
  getLocation () {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          longitude,
          latitude
        })
        this.getNearUsers()
      }
     })
  },
  getNearUsers () {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation()
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
      const timer = setInterval(() => {
        if (this.data.longitude) {
          clearInterval(timer)
          db.collection('users').doc(app.userInfo._id).update({
            data: {
              longitude: this.data.longitude,
              latitude: this.data.latitude,
              location: db.Geo.Point(this.data.longitude, this.data.latitude)
            }
          })
        }
      }, 50)
    }
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
    this.getLocation()
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