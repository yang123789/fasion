const app = new getApp();
var wxParse = require('../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    promotion_adv: [],
    promotion_list: [],
    goods_list: [],
    promotion_id: '',
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    swiperHeight: 153,
    promotionTopicGoodsFlag: 0,
    next_page: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let siteBaseUrl = getApp().globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    app.sendRequest({
      url: 'api.php?s=goods/promotionTopic',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let promotion_adv = data.topic_adv;
          let promotion_list = data.info;
          let topic = [];

          if (promotion_list.total_count > 0){
            for (let index in promotion_list.data) {
              //专题图片处理
              let img = promotion_list.data[index].picture_img;
              promotion_list.data[index].picture_img = app.IMG(img);
              //富文本格式转化
              topic[index] = promotion_list.data[index].introduce;
              wxParse.wxParse('topic[' + index + ']', 'html', topic[index], that, 5);
            }
          }
          //广告位图片处理
          for (let index in promotion_adv.adv_list) {
            let img = promotion_adv.adv_list[index].adv_image;
            promotion_adv.adv_list[index].adv_image = app.IMG(img);
          }

          that.setData({
            Base: siteBaseUrl,
            defaultImg: defaultImg,
            promotion_adv: promotion_adv,
            promotion_list: promotion_list,
          })
        }
      }
    });
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
    app.restStatus(that, 'promotionTopicGoodsFlag');
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
   * 图片加载获取高度
   */
  imgLoad: function (e) {
    let res = wx.getSystemInfoSync();
    let height = e.detail.height;
    let width = e.detail.width;
    let rate = width / height;
    let swiper_height = res.windowWidth / rate;

    this.setData({
      swiperHeight: swiper_height
    })
  },

  /**
   * 专题详情
   */
  promotionTopicGoods: function (e) {
    let that = this;
    let promotionTopicGoodsFlag = that.data.promotionTopicGoodsFlag;
    let dataset = e.currentTarget.dataset;
    let promotion_id = dataset.id;
    let promotion_name = dataset.name;

    if (promotionTopicGoodsFlag == 1) {
      return false;
    }
    app.clicked(that, 'promotionTopicGoodsFlag');

    wx.navigateTo({
      url: '/pages/goods/promotiontopicgoods/promotiontopicgoods?id=' + promotion_id + '&name=' + promotion_name,
    })
  }
})