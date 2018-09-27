const app = new getApp();
var time = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: {},
    order_id: 0,
    order_detail: {},
    webSiteInfo: {},
    goodsDetailFlag: 0,
    verificationFlag: 0,
    logisticsFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    let webSiteInfo = app.globalData.webSiteInfo;

    if (options.id) {
      that.setData({
        Base: base,
        defaultImg: defaultImg,
        webSiteInfo: webSiteInfo,
        order_id: options.id
      })
    }
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
    let order_id = that.data.order_id;

    app.restStatus(that, 'goodsDetailFlag');
    app.restStatus(that, 'verificationFlag');
    app.restStatus(that, 'logisticsFlag');
    app.sendRequest({
      url: 'api.php?s=Presell/orderDetail',
      data: {
        order_id: order_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        console.log(res);
        if (code == 0) {
          let order_detail = data.order;
          //图片处理
          for (let index in order_detail.order_goods) {
            if (order_detail.order_goods[index].picture_info != undefined) {
              let img = order_detail.order_goods[index].picture_info.pic_cover_small;
              order_detail.order_goods[index].picture_info.pic_cover_small = app.IMG(img);
            } else {
              order_detail.order_goods[index].picture_info = {};
              order_detail.order_goods[index].picture_info.pic_cover_small = '';
            }
          }
          //时间格式转化
          order_detail.create_time = time.formatTime(order_detail.create_time, 'Y-M-D h:m:s')
          order_detail.shipping_time = order_detail.shipping_time > 0 ? time.formatTime(order_detail.shipping_time, 'Y-M-D') : '工作日、双休日与节假日均可送货';
          order_detail.address = order_detail.address.replace(/&nbsp;/g, '　');
          that.setData({
            order_detail: order_detail
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
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let order_detail = that.data.order_detail;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = order_detail.order_goods[index].picture_info.pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "order_detail.order_goods[" + index + "].picture_info.pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 商品详情
   */
  goodsDetail: function (e) {
    let that = this;
    let goodsDetailFlag = that.data.goodsDetailFlag;
    let goods_id = e.currentTarget.dataset.id;
    let goods_name = e.currentTarget.dataset.name;

    if (goodsDetailFlag == 1) {
      return false;
    }
    app.clicked(that, 'goodsDetailFlag');

    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&&goods_name=' + goods_name,
    })
  },

  /**
   * 拨打电话
   */
  tell: function () {
    let that = this;
    let webSiteInfo = that.data.webSiteInfo;
    if (webSiteInfo.web_phone != '' && webSiteInfo.web_phone != undefined) {
      wx.makePhoneCall({
        phoneNumber: webSiteInfo.web_phone,
      })
    } else {
      app.showBox(that, '暂无商家电话');
    }
  },

  /**
   * 我的虚拟商品
   */
  verificationOrderDetail: function (e) {
    let that = this;
    let verificationFlag = that.data.verificationFlag;
    let vg_id = e.currentTarget.dataset.id;

    if (verificationFlag == 1) {
      return false;
    }
    app.clicked(that, 'verificationFlag');

    wx.navigateTo({
      url: '/pagesother/pages/verification/verificationorderdetail/verificationorderdetail?vg_id=' + vg_id,
    })
  },

  /**
   * 查看物流
   */
  logistics: function (e) {
    let that = this;
    let logisticsFlag = that.data.logisticsFlag;
    let order_id = e.currentTarget.dataset.id;

    if (logisticsFlag == 1) {
      return false;
    }
    app.clicked(that, 'logisticsFlag');

    wx.navigateTo({
      url: '/pagesother/pages/order/orderexpress/orderexpress?id=' + order_id,
    })
  },
})