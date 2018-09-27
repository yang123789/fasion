const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    shop_config: {},
    shop_config: {},
    listClickFlag: 0,
    toWithdrawFlag: 0
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

    that.shopConfg();
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
    let shop_id = that.data.shop_id;

    app.restStatus(that, 'listClickFlag');
    app.restStatus(that, 'toWithdrawFlag');
    app.sendRequest({
      url: 'api.php?s=Distribution/usershopcommission',
      data: {
        shop_id: shop_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let user_account = data;
          that.setData({
            user_account: user_account
          })
        }
      }
    });
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
  },

  /**
   * 店铺配置
   */
  shopConfg: function () {
    let that = this;

    app.sendRequest({
      url: 'api.php?s=Distribution/shopConfig',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let nfx_shop_config = data.nfx_shop_config;

          that.setData({
            shop_config: nfx_shop_config
          })
        }
      }
    });
  },

  /**
   * 去提现
   */
  toWithdraw: function (e) {
    let that = this;
    let shop_id = that.data.shop_id;
    let toWithdrawFlag = that.data.toWithdrawFlag;
    if (toWithdrawFlag == 1) {
      return false;
    }
    app.clicked(that, 'toWithdrawFlag');

    wx.navigateTo({
      url: '/pagesnfx/pages/distribution/towithdraw/towithdraw?shop_id=' + shop_id,
    })
  }
})