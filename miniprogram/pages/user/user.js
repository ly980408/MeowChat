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
    signature: '',
    homepage: '',
    isLogged: false,
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.isLogged) {
      this.setData({
        userAvatar: app.userInfo.userAvatar,
        nickName: app.userInfo.nickName,
        signature: app.userInfo.signature,
        homepage: `../home/home?userId=${app.userInfo._id}`,
        isLogged: true
      })
    } else {
      this.setData({
        isLogged: false,
        disabled: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userAvatar: app.userInfo.userAvatar,
      nickName: app.userInfo.nickName,
      signature: app.userInfo.signature
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
          isLocation: true,
          friendList: []
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
          })
          app.isLogged = true
          this.watchMessage()
        })
      })
    }
  },
  watchMessage() {
    db.collection('message').where({
      userId: app.userInfo._id
    }).watch({
      onChange: function(snapshot) {
        if (snapshot.docChanges.length) {
          let list = snapshot.docChanges[0].doc.list
          if (list.length) {  // 有消息
            wx.showTabBarRedDot({
              index: 2
            })
            app.userMessage = list
            // console.log('message list:',app.userMessage)
            app.toRefresh = true
          } else {
            wx.hideTabBarRedDot({
              index: 2
            })
            app.userMessage = []
          }
        }
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  }
})