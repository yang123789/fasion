const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    goods_list: [],
    promotion_info: [],
    goodsDetailFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let topic_id = options.id;
    let topic_name = options.name;
    let siteBaseUrl = getApp().globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    wx.setNavigationBarTitle({
      title: topic_name,
    })

    app.sendRequest({
      url: 'api.php?s=goods/promotionTopicGoods',
      data: {
        topic_id: topic_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let promotion_info = data.info;
          let goods_list = promotion_info.goods_list;

          for (let index in goods_list) {
            if (goods_list[index].picture_info != undefined && goods_list[index].picture_info != ''){
              let img = goods_list[index].picture_info.pic_cover_small;
              goods_list[index].picture_info.pic_cover_small = app.IMG(img);
            }
          }

          if (promotion_info.background_img != undefined) {
            let img = promotion_info.background_img;
            promotion_info.background_img = app.IMG(img);
          }
          
          if (promotion_info.picture_img != undefined) {
            let img = promotion_info.picture_img;
            promotion_info.picture_img = app.IMG(img);
          }

          if (promotion_info.scroll_img != undefined) {
            let img = promotion_info.scroll_img;
            promotion_info.scroll_img = app.IMG(img);
          }
          
          for (let index in goods_list) {
            let img = goods_list[index].pic_cover_small;
            goods_list[index].pic_cover_small = app.IMG(img);
          }

          that.setData({
            Base: siteBaseUrl,
            defaultImg: defaultImg,
            promotion_info: promotion_info,
            goods_list: goods_list,
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
    app.restStatus(that, 'goodsDetailFlag');
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
    let goods_list = that.data.goods_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = goods_list[index].pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) != 1) {
        let parm_key = "goods_list[" + index + "].picture_info.pic_cover_small";

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
    let dataset = e.currentTarget.dataset;
    let goods_id = dataset.id;
    let goods_name = dataset.name;

    if (goodsDetailFlag == 1) {
      return false;
    }
    app.clicked(that, 'goodsDetailFlag');

    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=' + goods_name,
    })
  }
})