const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    showType: 1,
    category_id: 0,
    goods_list: {}, //商品列表
    goodsCategoryList: [], //分类列表
    category_brands: [], //品牌列表
    category_price_grades: [], //价格区间
    search_text: '', //搜索内容
    categoryStatus: 0,
    sortStatus: 0,
    screenStatus: 0,
    maskStatus: 0,
    category_index: -1,
    salesSort: 'desc',
    newSort: 'asc',
    priceSort: 'asc',
    obyzd: '',
    brand_id: '',
    min_price: '',
    max_price: '',
    new_min_price: '',
    new_max_price: '',
    screen: 0,
    next_page: 2, //下一页,
    listClickFlag: 0,
    searchFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let siteBaseUrl = getApp().globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    let url = '';
    let category_id = '';
    if (options.id != undefined) {
      category_id = options.id;
    }
    let category_alias = options.alias;
    
    if (category_alias != '' && category_alias != undefined){
      wx.setNavigationBarTitle({
        title: category_alias,
      })
    }

    app.sendRequest({
      url: 'api.php?s=goods/goodsList',
      data: {
        category_id: category_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0){
          let goods_list = data.goods_list;
          let next_page = that.data.next_page++;
          let goodsCategoryList = data.goodsCategoryList;
          let category_index = that.data.category_index;
          
          for (let index in goodsCategoryList){
            if (goodsCategoryList[index].category_id == category_id){
              category_index = index;
            }
            let child_list = goodsCategoryList[index].child_list
            
            for (let key in child_list){
              if (child_list[key].category_id == category_id){
                category_index = index;
              }
            }
          }
          //图片处理
          for(let index in goods_list){
            let img = goods_list[index].pic_cover_small;
            goods_list[index].pic_cover_small = app.IMG(img);
          }

          let screen = 0;
          if(goods_list != undefined){
            if (goods_list[0] != undefined && category_id != 0 && category_id != '' && category_id != undefined) {
              screen = 1;
            }
          }

          that.setData({
            Base: siteBaseUrl,
            defaultImg: defaultImg,
            category_id: category_id,
            category_index: category_index,
            goods_list: goods_list,
            goodsCategoryList: goodsCategoryList,
            category_brands: data.category_brands,
            category_price_grades: data.category_price_grades,
            next_page: next_page,
            screen: screen,
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
    app.restStatus(that, 'searchFlag');
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
    let page = that.data.next_page;
    let category_id = that.data.category_id;
    let obyzd = that.data.obyzd;
    let salesSort = that.data.salesSort;
    let newSort = that.data.newSort;
    let priceSort = that.data.priceSort;
    let st = '';
    let brand_id = that.data.brand_id;
    let min_price = that.data.min_price;
    let max_price = that.data.max_price;

    if (obyzd == 'ng.sales') {
      st = salesSort;

    } else if (obyzd == 'ng.is_new') {
      st = newSort;

    } else if (obyzd == 'ng.promotion_price') {
      st = priceSort;

    }

    app.sendRequest({
      url: 'api.php?s=goods/goodsList',
      data: {
        category_id: category_id,
        obyzd: obyzd,
        st: st,
        brand_id: brand_id,
        mipe: min_price,
        mape: max_price,
        page: page
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0){
          let new_goods_list = data.goods_list;

          if (new_goods_list[0] != undefined){
            page++;

            let goods_list = that.data.goods_list;
            let index = goods_list.length;

            let k = {};
            let parm = '';
            for (let key in new_goods_list){
              let img = new_goods_list[key].pic_cover_small;
              new_goods_list[key].pic_cover_small = app.IMG(img);
              parm = 'goods_list[' + index + ']';
              k[parm] = new_goods_list[key];
              index++;
            }
            parm = 'next_page';
            k[parm] = page;

            that.setData(k)
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
  listClick: function(event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;

    if (listClickFlag == 1){
      return false;
    }
    app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: '/pages'+url,
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
  },

  /**
   * 搜索商品
   */
  search: function(event){
    let that = this;
    let searchFlag = that.data.searchFlag;
    let search_text = that.data.search_text;
    
    if (searchFlag == 1){
      return false;
    }
    app.clicked(that, 'searchFlag');

    wx.navigateTo({
      url: '/pages/goods/goodssearchlist/goodssearchlist?search_text=' + search_text,
    })
  },

  /**
   * 展示类型(1块展示 2列表展示)
   */
  showType: function(e){
    let that = this;
    let showType = that.data.showType;
    showType = showType == 1 ? 2 : 1;

    that.setData({
      showType: showType
    })
  },

  /**
   * 分类弹框
   */
  category: function(e){
    let that = this;
    let categoryStatus = that.data.categoryStatus;
    categoryStatus = categoryStatus == 0 ? 1 : 0;
    let maskStatus = categoryStatus == 1 ? 1 : 0;

    that.setData({
      categoryStatus: categoryStatus,
      sortStatus: 0,
      screenStatus: 0,
      maskStatus: maskStatus
    })
  },

  /**
   * 排序弹框
   */
  sort: function (e) {
    let that = this;
    let sortStatus = that.data.sortStatus;
    sortStatus = sortStatus == 0 ? 1 : 0;
    let maskStatus = sortStatus == 1 ? 1 : 0;

    that.setData({
      sortStatus: sortStatus,
      categoryStatus: 0,
      screenStatus: 0,
      maskStatus: maskStatus
    })
  },

  /**
   * 筛选弹框
   */
  screen: function(e){
    let that = this;
    let screenStatus = that.data.screenStatus;
    screenStatus = screenStatus == 0 ? 1 : 0;
    let maskStatus = screenStatus == 1 ? 1 : 0;
    
    that.setData({
      screenStatus: screenStatus,
      categoryStatus: 0,
      sortStatus: 0,
      maskStatus: maskStatus
    })
  },

  /**
   * 关闭弹框
   */
  closePoupo: function(e){
    let that = this;

    that.setData({
      maskStatus: 0,
      categoryStatus: 0,
      sortStatus: 0,
      screenStatus: 0,
      new_min_price: '',
      new_max_price: '',
    })
  },

  /**
   * 选择分类
   */
  selectCategory: function(e){
    let that = this;
    let dataset = e.currentTarget.dataset;
    let category_id = dataset.id;
    let category_index = dataset.index;
    let goodsCategoryList = that.data.goodsCategoryList;

    if (category_index > -1 && goodsCategoryList[category_index].category_id == category_id && goodsCategoryList[category_index].child_list.length > 0){
      that.setData({
        category_id: category_id,
        category_index: category_index,
      })
      return false;
    }

    category_id = category_id == 0 ? ' ' : category_id;
    app.sendRequest({
      url: 'api.php?s=goods/goodsList',
      data: {
        category_id: category_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if(code == 0){
          let goods_list = data.goods_list;
          
          if (goods_list != undefined) {
            let screen = 0;
            if (goods_list[0] != undefined && category_id !=0){
              screen = 1;
            }

            for (let index in goods_list) {
              let img = goods_list[index].pic_cover_small;
              goods_list[index].pic_cover_small = app.IMG(img);
            }

            that.setData({
              goods_list: goods_list,
              category_brands: data.category_brands,
              category_price_grades: data.category_price_grades,
              min_price: '',
              max_price: '',
              next_page: 2,
              category_id: category_id,
              category_index: category_index,
              screen: screen,
            })

            that.closePoupo();
          }
          console.log(res);
        }
      },
    })
  },

  /**
   * 选择排序
   */
  selectSort: function(e){
    let that = this;
    let dataset = e.currentTarget.dataset;
    let obyzd = dataset.obyzd;
    let st = dataset.st;
    let category_id = that.data.category_id;
    let salesSort = that.data.salesSort;
    let newSort = that.data.newSort;
    let priceSort = that.data.priceSort;
    let brand_id = that.data.brand_id;
    let min_price = that.data.min_price;
    let max_price = that.data.max_price;
    
    if (obyzd == 'ng.sales'){
      salesSort = salesSort == 'desc' ? 'asc' : 'desc';

    } else if (obyzd == 'ng.is_new'){
      newSort = newSort == 'desc' ? 'asc' : 'desc';

    } else if (obyzd == 'ng.promotion_price') {
      priceSort = priceSort == 'desc' ? 'asc' : 'desc';

    }else{
      salesSort = 'desc';
      newSort = 'asc';
      priceSort = 'asc';
    }

    app.sendRequest({
      url: 'api.php?s=goods/goodsList',
      data: {
        category_id: category_id,
        obyzd: obyzd,
        st: st,
        brand_id: brand_id,
        mipe: min_price,
        mape: max_price,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.goods_list;

          if (goods_list != undefined) {

            for (let index in goods_list) {
              let img = goods_list[index].pic_cover_small;
              goods_list[index].pic_cover_small = app.IMG(img);
            }
            that.setData({
              obyzd: obyzd,
              goods_list: goods_list,
              next_page: 2,
              category_id: category_id,
              salesSort: salesSort,
              newSort: newSort,
              priceSort: priceSort,
            })

            that.closePoupo();
          }
          console.log(res);
        }
      },
    })
  },

  /**
   * 选择品牌
   */
  selectBrand: function(e){
    let that = this;
    let dataset = e.currentTarget.dataset;
    let brand_id = dataset.id;
    let category_id = that.data.category_id;
    let obyzd = that.data.obyzd;
    let salesSort = that.data.salesSort;
    let newSort = that.data.newSort;
    let priceSort = that.data.priceSort;
    let st = '';
    let min_price = that.data.min_price;
    let max_price = that.data.max_price;

    if (obyzd == 'ng.sales') {
      st = salesSort;

    } else if (obyzd == 'ng.is_new') {
      st = newSort;

    } else if (obyzd == 'ng.promotion_price') {
      st = priceSort;

    }

    app.sendRequest({
      url: 'api.php?s=goods/goodsList',
      data: {
        category_id: category_id,
        obyzd: obyzd,
        st: st,
        brand_id: brand_id,
        mipe: min_price,
        mape: max_price,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.goods_list;

          if (goods_list != undefined) {
            
            for (let index in goods_list) {
              let img = goods_list[index].pic_cover_small;
              goods_list[index].pic_cover_small = app.IMG(img);
            }
            that.setData({
              obyzd: obyzd,
              goods_list: goods_list,
              next_page: 2,
              category_id: category_id,
              salesSort: salesSort,
              newSort: newSort,
              priceSort: priceSort,
            })

            that.closePoupo();
          }
          console.log(res);
        }
      },
    })
  },

  /**
   * 选择价格区间
   */
  selectPrice: function(e){
    let that = this;
    let dataset = e.currentTarget.dataset;
    let min_price = dataset.min;
    let max_price = dataset.max;

    that.setData({
      new_min_price: min_price,
      new_max_price: max_price,
    })
  },

  /**
   * 重置价格区间
   */
  restPrice: function(e){
    let that = this;
    let category_id = that.data.category_id;
    let obyzd = that.data.obyzd;
    let salesSort = that.data.salesSort;
    let newSort = that.data.newSort;
    let priceSort = that.data.priceSort;
    let st = '';
    let brand_id = that.data.brand_id;

    if (obyzd == 'ng.sales') {
      st = salesSort;

    } else if (obyzd == 'ng.is_new') {
      st = newSort;

    } else if (obyzd == 'ng.promotion_price') {
      st = priceSort;

    }

    app.sendRequest({
      url: 'api.php?s=goods/goodsList',
      data: {
        category_id: category_id,
        obyzd: obyzd,
        st: st,
        brand_id: brand_id,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.goods_list;

          for (let index in goods_list) {
            let img = goods_list[index].pic_cover_small;
            goods_list[index].pic_cover_small = app.IMG(img);
          }
          if (goods_list[0] != undefined) {
            that.setData({
              obyzd: obyzd,
              goods_list: goods_list,
              next_page: 2,
              category_id: category_id,
              salesSort: salesSort,
              newSort: newSort,
              priceSort: priceSort,
              min_price: '',
              max_price: '',
            })

            that.closePoupo();
          }
        }
      }
    });
  },

  /**
   * 确认价格区间
   */
  confirmPrice: function(e){
    let that = this;
    let category_id = that.data.category_id;
    let obyzd = that.data.obyzd;
    let salesSort = that.data.salesSort;
    let newSort = that.data.newSort;
    let priceSort = that.data.priceSort;
    let st = '';
    let brand_id = that.data.brand_id;
    let min_price = that.data.new_min_price;
    let max_price = that.data.new_max_price;

    if (max_price == 0){
      min_price = '';
      max_price = '';
    }

    if (obyzd == 'ng.sales') {
      st = salesSort;

    } else if (obyzd == 'ng.is_new') {
      st = newSort;

    } else if (obyzd == 'ng.promotion_price') {
      st = priceSort;

    }

    app.sendRequest({
      url: 'api.php?s=goods/goodsList',
      data: {
        category_id: category_id,
        obyzd: obyzd,
        st: st,
        brand_id: brand_id,
        mipe: min_price,
        mape: max_price,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.goods_list;

          for (let index in goods_list) {
            let img = goods_list[index].pic_cover_small;
            goods_list[index].pic_cover_small = app.IMG(img);
          }
          that.setData({
            obyzd: obyzd,
            goods_list: goods_list,
            next_page: 2,
            category_id: category_id,
            salesSort: salesSort,
            newSort: newSort,
            priceSort: priceSort,
            min_price: min_price,
            max_price: max_price
          })

          that.closePoupo();
        }
      }
    });
  }
})