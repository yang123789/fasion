const app = new getApp();
var time = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    account_records_detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type_id = options.type_id;
    let shop_id = options.shop_id;
    let title = '分销佣金';
    let that = this;
    
    switch (type_id) {
      case '1':
        title = '分销佣金';
        break;
      case '2':
        title = '区域代理佣金';
        break;
      case '4':
        title = '股东分红';
        break;
      case '5':
        title = '全球分红';
        break;
    }
    wx.setNavigationBarTitle({
      title: title,
    })

    app.sendRequest({
      url: 'api.php?s=Distribution/userAccountRecordsDetail',
      data: {
        type_id: type_id,
        shop_id: shop_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let account_records_detail = data.account_records_detail;
          for (let index in account_records_detail) {
            let create_time = account_records_detail[index].create_time;
            account_records_detail[index].create_time = time.formatTime(create_time, 'Y-M-D h:m:s');
          }

          that.setData({
            account_records_detail: account_records_detail
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

  }
})