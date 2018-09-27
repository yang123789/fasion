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
    is_show: [],
    is_card: [],
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
      url: 'api.php?s=order/virtualOrderDetail',
      data: {
        order_id: order_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        console.log(res);
        if (code == 0) {
          let order_detail = data.order;
          let is_show = [];
          let is_card = [];
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

          //显示
          if (order_detail.virtual_goods_list != '' && order_detail.virtual_goods_list != undefined) {
            for (let index in order_detail.virtual_goods_list) {
              let detail = order_detail.virtual_goods_list[index];

              if (detail.remark != ''){
                is_show[index] = 0;
              }

              if(detail.remark.indexOf('网盘地址') != -1) {
                detail.remark = detail.remark.replace(/&nbsp;/g, ' ');
                is_card[index] = 1;
              }
            }
          }
          that.setData({
            order_detail: order_detail,
            is_show: is_show,
            is_card: is_card
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
   * 显示卡密
   */
  remarkShow: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let is_show = that.data.is_show;
    let parm = {};
    let key = 'is_show[' + index + ']';

    parm[key] = 1;
    that.setData(parm);
  },

  /**
   * 我的虚拟商品
   */
  verificationOrderDetail: function (e) {
    let that = this;
    let verificationFlag = that.data.verificationFlag;
    let vg_id = e.currentTarget.dataset.id;
    let msg = e.currentTarget.dataset.msg;

    if (msg == '已过期') {
      app.showBox(that, '该虚拟码已过期');
      return false;
    } else if (msg == '已使用') {
      app.showBox(that, '该虚拟码已使用');
      return false;
    }
    if (verificationFlag == 1) {
      return false;
    }
    app.clicked(that, 'verificationFlag');

    wx.navigateTo({
      url: '/pagesother/pages/verification/verificationorderdetail/verificationorderdetail?vg_id=' + vg_id,
    })
  },
})