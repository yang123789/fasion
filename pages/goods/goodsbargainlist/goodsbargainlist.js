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
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    swiperHeight: 153,
    goodsDetailFlag: 0,
    next_page: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let siteBaseUrl = getApp().globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    that.setData({
      Base: siteBaseUrl,
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

    app.restStatus(that, 'goodsDetailFlag');
    app.sendRequest({
      url: "api.php?s=bargain/bargainList",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let goods_list = data.data;

          for(let index in goods_list){
            let img = goods_list[index].pic_cover_mid;
            goods_list[index].pic_cover_mid = app.IMG(img);
          }

          that.setData({
            goods_list: goods_list
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
    let that = this;
    let next_page = that.data.next_page;
    let goods_list = that.data.goods_list;

    app.sendRequest({
      url: "api.php?s=bargain/bargainlist",
      data: {
        page: next_page
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let new_goods_list = data.data;
          let list_length = new_goods_list.length;
          next_page = list_length > 0 ? next_page + 1 : next_page;
          let length = goods_list.length;
          let d = {};
          let parm = '';

          for (let index in new_goods_list) {
            let key = parseInt(length) + parseInt(index);
            let img = new_goods_list[index].pic_cover_mid;
            new_goods_list[index].pic_cover_mid = app.IMG(img);
            parm = 'goods_list[' + key + ']';
            d[parm] = new_goods_list[index];
          }

          that.setData(d)
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
   * 商品详情
   */
  goodsDetail: function(e) {
    let that = this;
    let goodsDetailFlag = that.data.goodsDetailFlag;
    let goods_name = e.currentTarget.dataset.name;
    let goods_id = e.currentTarget.dataset.id;
    let bargain_id = e.currentTarget.dataset.bargainid;

    if (goodsDetailFlag == 1){
      return false;
    }
    app.clicked(that, 'goodsDetailFlag');
    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=' + goods_name + '&bargain_id=' + bargain_id, 
    })
  }
})