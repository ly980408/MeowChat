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
    this.refreshData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.isLogged && app.toUpdate) {
      this.refreshData()
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
        let newDataList = [...this.data.dataList]
        for (let user of newDataList) {
          if (user._id == id) {
            user.likes++
            break
          }
        }
        this.setData({
          dataList: newDataList
        })
      }
      
    })
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
  }
})