// miniprogram/pages/index/index.js

const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580827190001&di=25ab7a695b671855634e31ac2e4cea36&imgtype=0&src=http%3A%2F%2Fimg.kj-cy.cn%2Fuploads%2Flitimg%2F20160204%2F1454551556260729.jpg',
      'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=346437509,61221999&fm=26&gp=0.jpg',
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3714693612,2461480459&fm=26&gp=0.jpg'
      ],
      dataList: [],
      current: 'likes'
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
      let db = wx.cloud.database()
      db.collection('users').where({
        _openid: res.result.openid
      }).get().then((res) => {
        if (res.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          app.isLogged = true
          wx.showToast({
            title: `${app.userInfo.nickName} 欢迎回来~`,
            icon: 'none'
          })
          this.refreshData()
          this.watchMessage()
        } else {
          app.isLogged = false
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.refreshData()
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
    wx.showLoading({
      title: '正在刷新...',
    })
    this.refreshData()
    wx.showToast({
        title: '刷新成功',
      })
      wx.stopPullDownRefresh()
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
  refreshData(){
    db.collection('users')
    .field({
      userAvatar: true,
      nickName: true,
      gender: true,
      likes: true
    })
    .orderBy(this.data.current, 'desc')
    .get()
    .then((res) => {
      this.setData({
        dataList: res.data
      })
    })
  },
  handleClick(ev){
    let current = ev.target.dataset.sort
    if(current == this.data.current){
      return false
    }
    this.setData({
      current
    })
    this.refreshData()
  },
  toHome(ev){
    let id = ev.target.dataset.id
    wx.navigateTo({
      url: `../home/home?userId=${id}`
    })
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