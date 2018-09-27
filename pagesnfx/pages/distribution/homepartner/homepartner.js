const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    shop_id: 0,
    listClickFlag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let shop_id = options.shop_id;

    that.setData({
      shop_id: shop_id
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
    let that = this;

    app.restStatus(that, 'listClickFlag');
    app.sendRequest({
      url: 'api.php?s=Distribution/homePartner',
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let partner_info = data;
          that.setData({
            partner_info: partner_info
          })
        }
      }
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
   * 页面跳转
   */
  listClick: function (e) {
    let that = this;
    let url = e.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;
    if (listClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: url,
      fail: function (error) {
        console.log('页面跳转失败：' + JSON.stringify(error));
        app.restStatus(that, 'listClickFlag');
      }
    })
  }
})