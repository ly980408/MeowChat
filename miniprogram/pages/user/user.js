// miniprogram/pages/user/user.js

const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAvatar: "/images/user/user-unlogin.png",
    nickName: '',
    isLogged: false,
    disabled: true
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
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res => {
      // 实现自动登录功能
      db.collection('users').where({
        _openid: res.result.openid
      }).get().then((res) => {
        if (res.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          this.setData({
            userAvatar: app.userInfo.userAvatar,
            nickName: app.userInfo.nickName,
            isLogged: true
          })
        } else {
          this.setData({
            disabled: false
          })
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userAvatar: app.userInfo.userAvatar,
      nickName: app.userInfo.nickName
    })
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
  bindGetUserInfo (ev) {
    // 点击按钮后获取用户信息
    let userInfo = ev.detail.userInfo
    if (!this.data.isLogged && userInfo) {
      // 向集合users中添加记录
      db.collection('users').add({
        data: {
          userAvatar: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          gender: userInfo.gender,
          province: userInfo.province,
          city: userInfo.city,
          country: userInfo.country,
          signature: '',
          phoneNumber: '',
          wxId:'',
          likes: 0,
          time: new Date(),
          isLocation: true
        }
      }).then((res) => {
        // 读取信息并更新到全局属性中
        db.collection('users').doc(res._id).get().then((res) => {
          app.userInfo = Object.assign( app.userInfo, res.data )
          // 利用setData方法更新数据
          this.setData({
            userAvatar: app.userInfo.userAvatar,
            nickName: app.userInfo.nickName,
            isLogged: true
          });
        });
      });
    }
  }
})