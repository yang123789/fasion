const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 1,
    coupon_list: {},
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let status = that.data.status;

    that.getCouponList(that, status);
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
   * 顶部导航选中
   */
  topNav: function (e) {
    let that = this;
    let status = e.currentTarget.dataset.status;

    that.getCouponList(that, status);
  },

  /**
   * 获取优惠券列表
   */
  getCouponList: function(that, status) {
    app.sendRequest({
      url: 'api.php?s=member/memberCoupon',
      data: {
        status: status,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {

          that.setData({
            coupon_list: data,
            status: status
          })
        }
        console.log(res)
      }
    });
  }
})