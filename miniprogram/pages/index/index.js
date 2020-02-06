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
      dataList: []
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
    db.collection('users').field({
      userAvatar: true,
      nickName: true,
      gender: true,
      likes: true
    }).get().then((res) => {
      this.setData({
        dataList: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.isLogged && app.toUpdate) {
      wx.startPullDownRefresh()
      app.toUpdate = false
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
    db.collection('users').field({
      userAvatar: true,
      nickName: true,
      gender: true,
      likes: true
    }).get().then((res) => {
      this.setData({
        dataList: res.data
      })
      wx.showToast({
        title: '刷新成功',
      })
      wx.stopPullDownRefresh()
    })
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
    let id = ev.target.dataset.id
    let likeList = app.userInfo.likeList
    let target
    let index
    if (likeList.length) {
      target = likeList.some((el, i) => {
          if(el === id){
            index = i
            return true
          }
      })
    } else {
      target = false
    }
    console.log(target, index)
    // target 是否喜欢标识，true 代表已喜欢
    // index 如果已喜欢，index 表示该用户id的索引位置

    // 点击喜欢按钮后 处理
    
    // 调用云函数 update 
    // wx.cloud.callFunction({
    //   name: 'update',
    //   data: {
    //     collection: 'users',
    //     doc: id,
    //     data: `{
    //       likes: _.inc(${target?-1:1})
    //     }`
    //   }
    // }).then(res => {
    //   let updated = res.result.stats.updated
    //   // 喜欢
    //   if (updated && !target) {
    //     db.collection('users').doc(app.userInfo._id).update({
    //       data: {
    //         likeList: db.command.push(id)
    //       }
    //     }).then(res => {
    //       console.log('+1')
    //     })
    //   }
    //   // 取消喜欢
    //   else if (updated && target){
    //     likeList.splice(index, 1)
    //     db.collection('users').doc(app.userInfo._id).update({
    //       data: {
    //         likeList
    //       }
    //     }).then(res => {
    //       console.log('-1')
    //     })
    //   }
    // })
  }
})