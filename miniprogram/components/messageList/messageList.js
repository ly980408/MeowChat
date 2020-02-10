// components/messageList.js

const db = wx.cloud.database()
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toHome(ev){
      let id = ev.target.dataset.id
      wx.navigateTo({
        url: `/pages/home/home?userId=${id}`
      })
    },
    deleteMessage(){
      wx.showModal({
        content: '你确定要删除吗？',
        confirmText: '删除',
        confirmColor: '#ff0000',
        success: (res) => {
          if (res.confirm) {
            db.collection('message').where({
              userId: app.userInfo._id
            }).get().then(res => {
              let list = res.data[0].list
              list = list.filter((val, i) => {
                return val != this.data.messageId
              })
              let id = res.data[0]._id
              wx.cloud.callFunction({
                name: 'update',
                data: {
                  collection: 'message',
                  doc: id,
                  data: {
                    list
                  }
                }
              }).then(res => {
                this.triggerEvent('myevent', list)
              })
            })
          }
        }
      })
    }

  },
  lifetimes: {
    attached () {
      db.collection('users').doc(this.data.messageId).field({
        userAvatar: true,
        nickName: true
      }).get().then(res => {
        this.setData({
          userInfo: res.data
        })
      })
    }
  }
})
