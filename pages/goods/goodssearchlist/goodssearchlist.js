const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    goods_list: {}, //商品列表
    search_text: '',
    salesSort: 'desc',
    newSort: 'desc',
    priceSort: 'asc',
    obyzd: '',
    next_page: 1, //下一页,
    listClickFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let siteBaseUrl = getApp().globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    let search_text = options.search_text;

    wx.setNavigationBarTitle({
      title: '"' + search_text + '"的搜索结果',
    })

    app.sendRequest({
      url: 'api.php?s=goods/goodsSearchList',
      data: {
        search_name: search_text
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if(code == 0){
          let goods_list = data;

          for(let index in goods_list){
            let img = goods_list[index].pic_cover_small;
            goods_list[index].pic_cover_small = app.IMG(img);
          }
          
          that.setData({
            goods_list: goods_list,
            Base: siteBaseUrl,
            defaultImg: defaultImg,
            search_text: search_text,
            next_page: 2,
          })
          console.log(res);
        }
      },
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
    let search_text = that.data.search_text;
    let page = that.data.next_page;
    let obyzd = that.data.obyzd;
    let st = '';
    let salesSort = that.data.salesSort;
    let newSort = that.data.newSort;
    let priceSort = that.data.priceSort;

    if (obyzd == 'ng.sales') {
      st = salesSort == 'desc' ? 'asc' : 'desc';
      
    } else if (obyzd == 'ng.is_new') {
      st = newSort == 'desc' ? 'asc' : 'desc';

    } else if (obyzd == 'ng.promotion_price') {
      st = priceSort == 'desc' ? 'asc' : 'desc';

    }

    app.sendRequest({
      url: 'api.php?s=goods/goodsSearchList',
      data: {
        search_name: search_text,
        obyzd: obyzd,
        st: st,
        shop_id: 0,
        page: page,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {

          if (data[0] != undefined) {
            page++;

            let goods_list = that.data.goods_list;
            let new_goods_list = data;
            let index = goods_list.length;
            let k = {};
            let parm = '';

            for (let key in new_goods_list) {
              let img = new_goods_list[key].pic_cover_small;
              new_goods_list[key].pic_cover_small = app.IMG(img);
              parm = 'goods_list[' + index + ']';
              k[parm] = new_goods_list[key];
              index++;
            }

            parm = 'next_page';
            k[parm] = page;

            that.setData(k);
          }
        }
      }
    });
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
      if (img.indexOf(default_img) == -1) {
        let parm_key = "goods_list[" + index + "].pic_cover_small";
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 页面跳转
   */
  listClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;
    
    if (listClickFlag == 1){
      return false;
    }
    app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: '/pages' + url,
    })
  },

  /**
   * 选择排序
   */
  selectSort: function (e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let obyzd = dataset.obyzd;
    let st = dataset.st;
    let search_text = that.data.search_text;
    let salesSort = that.data.salesSort;
    let newSort = that.data.newSort;
    let priceSort = that.data.priceSort;

    if (obyzd == 'ng.sales') {
      salesSort = salesSort == 'desc' ? 'asc' : 'desc';
      newSort = 'desc';
      priceSort = 'asc';
    } else if (obyzd == 'ng.is_new') {
      newSort = newSort == 'desc' ? 'asc' : 'desc';
      salesSort = 'desc';
      priceSort = 'asc';
    } else if (obyzd == 'ng.promotion_price') {
      salesSort = 'desc';
      newSort = 'desc';
      priceSort = priceSort == 'desc' ? 'asc' : 'desc';
    } else {
      salesSort = 'desc';
      newSort = 'desc';
      priceSort = 'asc';
    }

    app.sendRequest({
      url: 'api.php?s=goods/goodsSearchList',
      data: {
        search_name: search_text,
        obyzd: obyzd,
        st: st,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {

          if (data != undefined) {
            let goods_list = data;

            for (let index in goods_list) {
              let img = goods_list[index].pic_cover_small;
              goods_list[index].pic_cover_small = app.IMG(img);
            }
            that.setData({
              goods_list: goods_list,
              obyzd: obyzd,
              salesSort: salesSort,
              newSort: newSort,
              priceSort: priceSort,
              next_page: 2,
            })
          }
          console.log(res);
        }
      },
    })
  },
})