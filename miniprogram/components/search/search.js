// components/search/search.js

const db = wx.cloud.database()
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  options:{
    styleIsolation: 'apply-shared'
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    historyList: [],
    searchList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toSearch(){
      if (!this.data.isFocus) {
        this.setData({
          isFocus: true
        })
        wx.getStorage({
          key: 'searchHistory',
          success: (res) => {
            this.setData({
              historyList: res.data
            })
          }
        })
      }
    },
    cancelSearch(){
      this.setData({
        isFocus: false
      })
    },
    search(ev){
      const value = ev.detail.value
      this.getData(value)

      let oldList = [...this.data.historyList]
      oldList.unshift(value)
      wx.setStorage({
        key: "searchHistory",
        data: [...new Set(oldList)]
      })
      wx.getStorage({
        key: 'searchHistory',
        success: (res) => {
          this.setData({
            historyList: res.data
          })
        }
      })
    },
    getData (value) {
      db.collection('users').where({
        nickName: db.RegExp({
          regexp: value,
          options: 'i',
        })
      }).field({
        nickName: true,
        userAvatar: true
      }).get().then(res => {
        this.setData({
          searchList: res.data
        })
      })
    },
    toHome(ev){
      const id = ev.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/home?userId=${id}`
      })
    },
    delete(ev){
      // this.setData()
      const i = ev.target.dataset.index
      let list = this.data.searchList
      list.splice(i, 1)
      this.setData({
        searchList: list
      })
    },
    clearHistory () {
      wx.showModal({
        confirmColor: '#ff3300',
        content: '你确定要清空历史记录吗？',
        success: (res) => {
          if (res.confirm) {
            wx.removeStorage({
              key: 'searchHistory'
            })
            this.setData({
              historyList: []
            })
          }
        }
      })
    }
  }
})
