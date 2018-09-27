// pages/index/question/question.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      ques:'',
      NavigationBarTitle:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
      var NavigationBarTitle = options.NavigationBarTitle;
      wx.setNavigationBarTitle({
          title: NavigationBarTitle//页面标题为路由参数
      })
      app.sendRequest({
          url: "api.php?s=goods/promotionTopic",
          data: {},
          success: function (res) {
              
            console.log(res)
            that.setData({
                ques:res.data
            })
          }
      })
  },
    goqd:function(e){
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: 'qdetails/qdetails?id='+id,
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