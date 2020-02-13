// miniprogram/pages/near/near.js

const db = wx.cloud.database()
const app = getApp()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: undefined,
    latitude: undefined,
    markers: []
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
    db.collection('users').where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 5000
      }),
      isLocation: true
    }).field({
      longitude: true,
      latitude: true,
      userAvatar: true
    }).get().then(res => {
      // console.log(res.data)
      let data = res.data
      let result = []
      if (data.length) {
        for (let i = 0; i < data.length; i++) {
          result.push({
              iconPath: data[i].userAvatar,
              id: data[i]._id,
              latitude: data[i].latitude,
              longitude: data[i].longitude,
              width: 30,
              height: 30
          })
        }
        this.setData({
          markers: result
        })
      }
    })
  },
  markertap (ev) {
    const id = ev.markerId
    wx.navigateTo({
      url: `/pages/home/home?userId=${id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getLocation()
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