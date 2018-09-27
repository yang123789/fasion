const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    promotion_adv: [],
    group_list: [],
    goods_list: [],
    group_id: '',
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
    let siteBaseUrl = getApp().globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    app.sendRequest({
      url: 'api.php?s=goods/promotionZone',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let promotion_adv = data.promotion_adv;
          let group_list = data.group_list;
          let goods_list = data.goods_list;

          for (let index in promotion_adv.adv_list){
            let img = promotion_adv.adv_list[index].adv_image;
            promotion_adv.adv_list[index].adv_image = app.IMG(img);
          }

          for (let index in goods_list.data){
            let img = goods_list.data[index].pic_cover_small;
            goods_list.data[index].pic_cover_small = app.IMG(img);
          }

          that.setData({
            Base: siteBaseUrl,
            defaultImg: defaultImg,
            promotion_adv: promotion_adv,
            group_list: group_list,
            goods_list: goods_list.data,
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
    let that = this;
    let group_id = that.data.group_id;
    let goods_list = that.data.goods_list;
    let next_page = that.data.next_page;
    let list_length = goods_list.length;
    list_length = list_length - 1 < 0 ? 0 : list_length-1;

    app.sendRequest({
      url: 'api.php?s=goods/promotionZone',
      data: {
        page: next_page,
        group_id: group_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let new_goods_list = data.goods_list;
          
          if (goods_list.length > 0){
            next_page++;
          }

          let d = {};
          let key = '';

          for (let index in new_goods_list.data) {
            let length = parseInt(list_length) + parseInt(index);
            let img = new_goods_list.data[index].pic_cover_small;
            new_goods_list.data[index].pic_cover_small = app.IMG(img);
            key = 'goods_list[' + length + ']';
            d[key] = new_goods_list.data[index];
          }

          that.setData(d);
          that.setData({
            group_id: group_id,
            next_page: next_page
          })
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
    let img = goods_list[index].pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) != 1) {
        let parm_key = "goods_list[" + index + "].pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 选择标签
   */
  selectLabel: function(e) {
    let that = this;
    let group_id = e.currentTarget.dataset.id;

    app.sendRequest({
      url: 'api.php?s=goods/promotionZone',
      data: {
        group_id: group_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.goods_list.data;

          for (let index in goods_list) {
            let img = goods_list[index].pic_cover_small;
            goods_list[index].pic_cover_small = app.IMG(img);
          }

          that.setData({
            goods_list: goods_list,
            group_id: group_id,
            next_page: 2
          })
        }
      }
    });
  },

  /**
   * 商品详情
   */
  goodsDetail: function(e) {
    let that = this;
    let goodsDetailFlag = that.data.goodsDetailFlag;
    let dataset = e.currentTarget.dataset;
    let goods_id = dataset.id;
    let goods_name = dataset.name;

    if (goodsDetailFlag == 1){
      return false;
    }
    app.clicked(that, 'goodsDetailFlag');

    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=' + goods_name,
    })
  }
})