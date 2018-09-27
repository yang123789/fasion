const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: -2,
    order_no: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let status = options.status;
    let out_trade_no = options.out_trade_no;

    app.sendRequest({
      url: 'api.php?s=pay/getOrderNoByOutTradeNo',
      data: {
        out_trade_no: out_trade_no,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if(code == 0){

          that.setData({
            status: status,
            order_no: data.order_no
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
   * 会员中心
   */
  toMemberHome: function() {
    wx.switchTab({
      url: '/pages/member/member/member'
    })
  }
})