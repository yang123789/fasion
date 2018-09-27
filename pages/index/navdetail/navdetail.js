// pages/index/navdetail/navdetail.js
const app = getApp();
var wxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      article:'',
      NavigationBarTitle:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var classid = options.classid;
      var NavigationBarTitle = options.NavigationBarTitle;
      console.log(options)
      wx.setNavigationBarTitle({
          title: NavigationBarTitle//页面标题为路由参数
      })
      var that=this;
      app.sendRequest({
          url: "api.php?s=article/getArticleListDetail",
          data: {
              class_id: classid
          },
          success: function (res) {
              console.log(res.data)
              
              if (res.data.length>0){
                 
                  that.setData({
                      article: res.data[0]
                  })
              let content = res.data[0].content;
              wxParse.wxParse('description', 'html', content, that, 5)
              }else{
                  wx.showModal({
                      title: '提示',
                      content: '还没有上传文章',
                      showCancel:false,
                      success: function (res) {
                          if (res.confirm) {
                              wx.switchTab({
                                  url: '../index',
                              })
                          }
                      }
                      
                  })
                  
              }
           
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
  
  }
})