const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: {},
    brand_adv: {},
    goods_brand_list: {},
    brand_id: 0,
    brand_select_index: 0,
    goods_list: {},
    img_height: '156px',
    page: 1,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    swiperHeight: 153,
    aClickFlag: 0,
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

    app.sendRequest({
      url: 'api.php?s=goods/getBrandListInfo',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let brand_id = that.data.brand_id;
          let goods_brand_list = data.goods_brand_list;

          if (goods_brand_list['data'][0] != undefined || goods_brand_list[0] != undefined) {
            brand_id = data.goods_brand_list.data[0].brand_id;
            that.getBrandGoodsList(that, brand_id);
          }

          let brand_adv = data.brand_adv;
          for (let index in brand_adv.adv_list) {
            let img = brand_adv.adv_list[index].adv_image;
            brand_adv.adv_list[index].adv_image = app.IMG(img);
          }

          that.setData({
            brand_adv: brand_adv,
            goods_brand_list: data.goods_brand_list.data,
            brand_id: brand_id
          })

        }
        console.log(res)
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
    app.restStatus(that, 'aClickFlag');
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
    let brand_id = that.data.brand_id;
    let goods_list = that.data.goods_list;
    let page = that.data.page;

    app.sendRequest({
      url: 'api.php?s=goods/getBrandGoodsList',
      data: {
        brand_id: brand_id,
        page: page
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let parm = {};
          let parm_key = '';
          let new_goods_list = data.data;

          if (new_goods_list[0] != undefined) {
            page++;
            for (let index in new_goods_list) {
              let key = parseInt(goods_list.length) + parseInt(index);
              let img = new_goods_list[index].pic_cover_small;
              new_goods_list[index].pic_cover_small = app.IMG(img);
              parm_key = 'goods_list[' + key + ']';
              parm[parm_key] = new_goods_list[index];
            }
            that.setData(parm);
          }

          that.setData({
            page: page,
          })
        }
        console.log(res);
      }
    });
  },

  /**
   * 获取品牌商品
   */
  getBrandGoodsList: function (that, new_brand_id) {
    let brand_id = that.data.brand_id;

    app.sendRequest({
      url: 'api.php?s=goods/getBrandGoodsList',
      data: {
        brand_id: new_brand_id,
        page: 1
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.data;

          for (let index in goods_list) {
            let img = goods_list[index].pic_cover_small;
            goods_list[index].pic_cover_small = app.IMG(img);
          }

          that.setData({
            page: 2,
            goods_list: goods_list
          })
        }
        console.log(res);
      }
    });
  },

  /**
   * 选择品牌
   */
  selectBrand: function (event) {
    let that = this;
    let brand_id = event.currentTarget.dataset.id;
    let index = event.currentTarget.dataset.index;

    that.setData({
      page: 1,
      brand_id: brand_id,
      brand_select_index: index
    })

    that.getBrandGoodsList(that, brand_id);
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
  goodsImgError: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_list = that.data.goods_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = goods_list[index].pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "goods_list[" + index + "].pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 商品详情
   */
  aClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let aClickFlag = that.data.aClickFlag;

    if (aClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'aClickFlag');

    wx.navigateTo({
      url: '/pages' + url,
    })
  }
})