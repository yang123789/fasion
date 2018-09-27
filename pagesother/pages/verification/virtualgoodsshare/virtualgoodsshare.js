const app = new getApp();
var time = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    vg_id: '',
    qrcode: '',
    goods_detail: '',
    virtual_detail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let vg_id = options.vg_id;
    
    that.setData({
      Base: base,
      vg_id: vg_id,
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
    let vg_id = that.data.vg_id;

    app.sendRequest({
      url: 'api.php?s=Verification/virtualGoodsShare',
      data: {
        vg_id: vg_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let qrcode = data.path;
          qrcode = app.IMG(qrcode);
          let goods_detail = data.info;
          let virtual_detail = data.list;

          goods_detail.time = '不限制';
          if (goods_detail.info != '' && goods_detail.end_time != undefined && goods_detail.end_time != '') {
            goods_detail.time = goods_detail.end_time == 0 ? goods_detail.time : '到' + time.formatTime(goods_detail.end_time, 'Y-M-D') + '之前有效';
          }

          for (let index in virtual_detail){
            let times = virtual_detail[index].create_time;
            virtual_detail[index].create_time = time.formatTime(times, 'Y-M-D h:m:s');
          }

          console.log(res);
          that.setData({
            qrcode: qrcode,
            goods_detail: goods_detail,
            virtual_detail: virtual_detail
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
})