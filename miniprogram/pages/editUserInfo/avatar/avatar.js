// miniprogram/pages/editUserInfo/avatar/avatar.js

const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAvatar: '',
    isUpdate: false
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
    this.setData({
      userAvatar: app.userInfo.userAvatar
    })
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
  chooseImage(){
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.setData({
          userAvatar: tempFilePath,
          isUpdate: true
        })
      }
    })
  },
  updateAvatar () {
    if (!this.data.isUpdate) {
      wx.showToast({
        title: '请先点击头像进行更改！',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '上传中...'
    })

    let cloudPath = `userAvatar/${app.userInfo._openid}${Date.now()}.jpg`

    wx.cloud.uploadFile({
      cloudPath,
      filePath: this.data.userAvatar
    }).then((res) => {
      let fileID = res.fileID
      if (fileID) {
        db.collection('users').doc(app.userInfo._id).update({
          data: {
            userAvatar: fileID
          }
        }).then((res) => {
          wx.hideLoading()
          wx.showToast({
            title: '上传成功!'
          })
          app.userInfo.userAvatar = fileID
        })
      }
    })
  },
  bindGetUserInfo (ev) {
    let userAvatar = ev.detail.userInfo.avatarUrl
    if(userAvatar){
      this.setData({
        userAvatar
      }, () => {
        wx.showLoading({
          title: '上传中...'
        })
        db.collection('users').doc(app.userInfo._id).update({
          data: {
            userAvatar
          }
        }).then((res) => {
          wx.hideLoading()
          wx.showToast({
            title: '上传成功!'
          })
          app.userInfo.userAvatar = userAvatar
        })
      })
    }
  }
})