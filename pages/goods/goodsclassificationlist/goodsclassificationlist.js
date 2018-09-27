const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: {},
    showType: 1,
    goods_category_list: {}, //商品分类列表
    search_text: '', //搜索内容
    listClickFlag: 0,
    category_index: 0,
    is_load: 0,
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
    app.restStatus(that, 'listClickFlag');


    app.sendRequest({
      url: 'api.php?s=goods/goodsClassificationList',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let goods_category_list = data.goods_category_list;
          let show_type = data.show_type;

          that.setData({
            showType: show_type
          })

          for (let index in goods_category_list) {

            //一级分类图片处理
            let first_img = goods_category_list[index].category_pic;
            goods_category_list[index].category_pic = app.IMG(first_img);

            //二级分类图片处理
            let second_list = goods_category_list[index].child_list;
            for (let key in second_list) {
              let second_img = second_list[key].category_pic;
              second_list[key].category_pic = app.IMG(second_img);

              //三级分类图片处理
              let third_list = second_list[key].child_list;
              for (let parm in third_list) {
                let third_img = third_list[parm].category_pic;
                third_list[parm].category_pic = app.IMG(third_img);
              }
              second_list[key].child_list = third_list;
            }
            goods_category_list[index].child_list = second_list;

            let num = goods_category_list[index].num;
            if (num > 0) {
              let i = goods_category_list[index].child_list.length;
              for (i; i < num; i++) {
                goods_category_list[index].child_list[i] = {};
              }
            }
          }

          that.setData({
            goods_category_list: goods_category_list,
            is_load: 1
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

  },

  /**
   * 图片加载失败
   */
  imgError: function (e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let goods_category_list = that.data.goods_category_list;
    let defaultImg = that.data.defaultImg;
    let hierarchy = dataset.hierarchy;
    let first_index = dataset.index;
    let second_index = dataset.key;
    let third_index = dataset.parm;
    let base = that.data.Base;
    let parm = {};
    let parm_key = '';
    let img = '';

    if (hierarchy == 2) {
      img = goods_category_list[first_index].child_list[second_index].category_pic;
      parm_key = 'goods_category_list[' + first_index + '].child_list[' + second_index + '].category_pic';
    } else if (hierarchy == 3) {
      img = goods_category_list[first_index].child_list[second_index].child_list[third_index].category_pic;
      parm_key = 'goods_category_list[' + first_index + '].child_list[' + second_index + '].child_list[' + third_index + '].category_pic';
    }

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;

      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 商品分类广告图加载失败
   */
  categoryImgError: function (e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let goods_category_list = that.data.goods_category_list;
    let category_index = dataset.index;
    let parm = {};
    let key = 'goods_category_list[' + category_index + '].category_pic';
    
    parm[key] = '';
    that.setData(parm);
  },

  /**
   * 选择分类
   */
  selectCategory: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      category_index: index
    })
  },

  /**
   * 页面跳转
   */
  listClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;

    if (listClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: '/pages' + url,
    })
  },

  /**
   * 输入框绑定事件
   */
  searchInput: function (event) {
    let search_text = event.detail.value;
    this.setData({
      search_text: search_text
    })
  }
})