const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    group_purchase_adv: [],
    goods_list: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    swiperHeight: 153,
    goodsDetailFlag: 0,
    next_page: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    that.setData({
      Base: base,
      defaultImg: defaultImg
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
    let base = that.data.Base;

    app.restStatus(that, 'aClickFlag');
    app.restStatus(that, 'goodsDetailFlag');
    app.sendRequest({
      url: 'api.php?s=goods/getGroupPurchaseAdv',
      data: {},
      success: function (res) {

        let code = res.code;
        let data = res.data;

        if (code == 0) {

          let group_purchase_adv = data.group_purchase_adv;
          for (let index in group_purchase_adv.adv_list) {
            let img = group_purchase_adv.adv_list[index].adv_image;
            group_purchase_adv.adv_list[index].adv_image = app.IMG(img);
          }

          that.setData({
            group_purchase_adv: group_purchase_adv,
          })
          that.getGoodsList(that);
        }
        console.log(res);
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
    let that = this;
    let goods_list = that.data.goods_list;
    let next_page = that.data.next_page;
    let list_length = goods_list.length;
    list_length = list_length - 1 < 0 ? 0 : list_length - 1;

    app.sendRequest({
      url: 'api.php?s=goods/getGroupPurchaseGoodsList',
      data: {
        page: next_page,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let new_goods_list = data.data;

          if (goods_list.length > 0) {
            next_page++;
          }

          let d = {};
          let key = '';

          for (let index in new_goods_list.data) {
            let length = parseInt(list_length) + parseInt(index);
            let img = new_goods_list.data[index].picture.pic_cover_small;
            new_goods_list.data[index].picture.pic_cover_small = app.IMG(img);
            key = 'goods_list[' + length + ']';
            d[key] = new_goods_list.data[index];
          }

          that.setData(d);
          that.setData({
            next_page: next_page
          })
        }
      }
    });
  },

  /**
   * 获取团购商品
   */
  getGoodsList: function (that) {

    app.sendRequest({
      url: 'api.php?s=goods/getGroupPurchaseGoodsList',
      data: {
        page: 1
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let goods_list = res.data.data;

          let timer_array = {};
          for (let index in goods_list) {
            let img = goods_list[index].picture.pic_cover_small;
            goods_list[index].picture.pic_cover_small = app.IMG(img);

            timer_array[index] = {};
            timer_array[index].end_time = goods_list[index].end_time;
          }

          that.setData({
            goods_list: goods_list,
            page: 2
          })
          console.log(res)
        }
      }
    });
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
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_list = that.data.goods_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = goods_list[index].picture.pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) != 1) {
        let parm_key = "goods_list[" + index + "].picture.pic_cover_small";

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
      url: '/pages/goods/grouppurchase/grouppurchase?goods_id=' + goods_id + '&goods_name=' + goods_name,
    })
  }
})