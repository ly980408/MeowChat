// miniprogram/pages/home/home.js

const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    isFriend: false,
    isMan: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = options.userId
    db.collection('users')
      .doc(userId).get()
      .then(res => {
        this.setData({
          info: res.data
        })
        if (res.data.gender == 1) {
          this.setData({ isMan: true})
        } else {
          this.setData({ isMan: false})
        }
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
  handleLikes (ev) {
    // 此方法暂未实现第二次点击取消功能，而是可以无限喜欢
    // 待更新。。。
    let id = ev.target.dataset.id

    // 调用云函数 update 
    wx.cloud.callFunction({
      name: 'update',
      data: {
        collection: 'users',
        doc: id,
        data: `{
          likes: _.inc(1)
        }`
      }
    }).then(res => {
      let updated = res.result.stats.updated
      if (updated) {
        let oldInfo = this.data.info
        let newLikes = oldInfo.likes + 1
        let newInfo = { ...oldInfo }
        newInfo.likes = newLikes
        this.setData({
          info: newInfo
        })
      }
    })
  }
})