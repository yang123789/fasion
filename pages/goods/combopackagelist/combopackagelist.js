const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    goods_id: 0,
    comboPackageGoodsArray: [],
    combo_index: 0,
    combo_package_price: 0.00,
    original_price: 0.00,
    save_the_price: 0.00,
    index: 0,
    key: 0,
    sBuy: 0,
    animation: '',
    goods_type: '', //选中商品类型(main 当前商品,combo 组合商品)
    goods_index: 0, //选择商品下标
    goods_info: {}, //商品详情
    spec_list: {}, //规格列表
    attr_value_items_format: '', //选中规格组
    sku_id: 0, //选中规格
    sku_info: {}, //选中规格信息
    stock: 0, //选中规格库存
    promote_price: 0.00, //选中规格价格
    goodsNum: 1, //购买数量,
    goodsDetailFlag: 0,
    buyFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let siteBaseUrl = getApp().globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    let goods_id = options.goods_id;
    let combo_package_price = that.data.combo_package_price;
    let original_price = that.data.original_price;
    let save_the_price = that.data.save_the_price;

    that.setData({
      goods_id: goods_id,
      Base: siteBaseUrl,
      defaultImg: defaultImg,
    })
    
    app.sendRequest({
      url: 'api.php?s=goods/comboPackageList',
      data: {
        goods_id: goods_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let comboPackageGoodsArray = data.comboPackageGoodsArray;
          
          if (comboPackageGoodsArray[0] != undefined){
            combo_package_price = parseFloat(comboPackageGoodsArray[0].combo_package_price).toFixed(2);
            original_price = parseFloat(comboPackageGoodsArray[0].original_price).toFixed(2);
            save_the_price = parseFloat(comboPackageGoodsArray[0].save_the_price).toFixed(2);
          }
          //图片处理
          for (let index in comboPackageGoodsArray){
            let img = comboPackageGoodsArray[index].main_goods.pic_cover_small;
            comboPackageGoodsArray[index].main_goods.pic_cover_small = app.IMG(img);

            for (let key in comboPackageGoodsArray[index].goods_array){
              let second_img = comboPackageGoodsArray[index].goods_array[key].pic_cover_small;
              comboPackageGoodsArray[index].goods_array[key].pic_cover_small = app.IMG(second_img);
            }
          }

          that.setData({
            comboPackageGoodsArray: comboPackageGoodsArray,
            combo_package_price: combo_package_price,
            original_price: original_price,
            save_the_price: save_the_price,
          })
        }
        console.log(res);
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
    app.restStatus(that, 'buyFlag');
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
   * 主商品图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let index = dataset.index;
    let comboPackageGoodsArray = that.data.comboPackageGoodsArray;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = comboPackageGoodsArray[index].main_goods.pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "comboPackageGoodsArray[" + index + "].main_goods.pic_cover_small";
      
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 套餐商品图片加载失败
   */
  comboErrorImg: function (e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let index = dataset.index;
    let key = dataset.key;
    let comboPackageGoodsArray = that.data.comboPackageGoodsArray;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = comboPackageGoodsArray[index].goods_array[key].pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "comboPackageGoodsArray[" + index + "].goods_array[" + key + "].pic_cover_small";

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
    let dataset = e.currentTarget.dataset;
    let goods_id = dataset.id;
    let goods_name = dataset.name;
    let goodsDetailFlag = that.data.goodsDetailFlag;
    
    if (goodsDetailFlag == 1){
      return false;
    }
    app.clicked(that, 'goodsDetailFlag');

    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=' + goods_name,
    })
  },
  
  /**
   * 选择套餐
   */
  selectComboPackage: function(e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let index = dataset.index;
    let comboPackageGoodsArray = that.data.comboPackageGoodsArray;
    let combo_package_price = parseFloat(comboPackageGoodsArray[index].combo_package_price).toFixed(2);
    let original_price = parseFloat(comboPackageGoodsArray[index].original_price).toFixed(2);
    let save_the_price = parseFloat(comboPackageGoodsArray[index].save_the_price).toFixed(2);

    that.setData({
      combo_index: index,
      combo_package_price: combo_package_price,
      original_price: original_price,
      save_the_price: save_the_price,
    })
  },


  /**
  * 规格弹框(动画效果未实现)
  */
  skuShow: function (e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let goods_id = dataset.id;
    let goods_type = dataset.type;
    let index = that.data.index;
    let key = that.data.key;
    let attr_value_items_format = '';
    let promote_price = 0.00;

    app.sendRequest({
      url: 'api.php?s=goods/comboPackageSelectSku',
      data: {
        goods_id: goods_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          data = data.goods_detail;
          //图片处理
          let img = data.img_list[0].pic_cover_micro;
          data.img_list[0].pic_cover_micro = app.IMG(img);

          that.setData({
            goods_info: data,
          });
          let sku_info = that.data.sku_info;//选中规格信息
          let sku_id = that.data.sku_id; //选中规格
          let attr_value_items = {}; //规格组
          let stock = 0; //库存
          //规格默认选中
          for (let i = 0; i < data.spec_list.length; i++) {
            for (let l = 0; l < data.spec_list[i].value.length; l++) {
              if (l == 0) {
                data.spec_list[i].value[l]['status'] = 1;
                attr_value_items[i] = data.spec_list[i].value[l].spec_id + ':' + data.spec_list[i].value[l].spec_value_id;
                attr_value_items.length = i + 1;
              } else {
                data.spec_list[i].value[l]['status'] = 0;
              }
            }
          }

          //规格组、库存判断
          for (let i = 0; i < data.sku_list.length; i++) {
            let count = 1;
            for (let l = 0; l < attr_value_items.length; l++) {
              if (data.sku_list[i].attr_value_items.indexOf(attr_value_items[l]) == -1) {
                count = 0;
              }
            }
            if (count == 1) {
              attr_value_items_format = data.sku_list[i].attr_value_items_format;
              sku_id = data.sku_list[i].sku_id;
              promote_price = data.sku_list[i].promote_price;
              stock = data.sku_list[i].stock;
              sku_info = data.sku_list[i];
            }
          }

          that.setData({
            spec_list: data.spec_list,
            sku_id: sku_id,
            attr_value_items_format: attr_value_items_format,
            promote_price: promote_price,
            stock: stock,
            goods_type: goods_type,
            index: index,
            key: key,
          })

          let animation = wx.createAnimation({
            duration: 3000,
            timingFunction: 'ease-in',
            transformOrigin: "50% 50% 0",
            delay: 0
          })
          animation.opacity(1).translateX(-100).step();

          that.animation = animation;
          that.setData({
            sBuy: 1,
            animation: that.animation.export()
          })
        }
      }
    })
  },

  /**
   * 关闭弹框
   */
  sBuyClose: function (event) {
    this.setData({
      sBuy: 0,
    })
  },

  /**
   * sku选中
   */
  skuSelect: function (event) {
    let that = this;
    let key = event.currentTarget.dataset.key;
    let k = event.currentTarget.dataset.k;
    let goods_info = that.data.goods_info;
    let arr = that.data.spec_list;
    let stock = that.data.stock;
    let sku_id = that.data.sku_id;
    let attr_value_items_format = that.data.attr_value_items_format;
    let promote_price = that.data.promote_price;
    let attr_value_items = {};
    let sku_info = that.data.sku_info;

    for (let i = 0; i < arr[key].value.length; i++) {
      arr[key].value[i].status = 0;
    }
    arr[key].value[k].status = 1;

    //拼合规格组
    for (let i = 0; i < arr.length; i++) {
      for (let l = 0; l < arr[i].value.length; l++) {
        if (arr[i].value[l]['status'] == 1) {
          attr_value_items[i] = arr[i].value[l].spec_id + ':' + arr[i].value[l].spec_value_id;
          attr_value_items.length = i + 1;
        }
      }
    }

    //规格组、库存判断
    for (let i = 0; i < goods_info.sku_list.length; i++) {
      let count = 1;
      for (let l = 0; l < attr_value_items.length; l++) {
        if (goods_info.sku_list[i].attr_value_items.indexOf(attr_value_items[l]) == -1) {
          count = 0;
        }
      }
      if (count == 1) {
        sku_id = goods_info.sku_list[i].sku_id;
        attr_value_items_format = goods_info.sku_list[i].attr_value_items_format;
        promote_price = goods_info.sku_list[i].promote_price;
        stock = goods_info.sku_list[i].stock;
        sku_info = goods_info.sku_list[i];
      }
    }

    that.setData({
      spec_list: arr,
      sku_id: sku_id,
      attr_value_items_format: attr_value_items_format,
      promote_price: promote_price,
      stock: stock
    })
  },

  /**
   * 规格确认
   */
  confirm: function (e) {
    let that = this;
    let sku_id = that.data.sku_id;
    let promote_price = that.data.promote_price;
    let dataset = e.currentTarget.dataset;
    let index = that.data.index;
    let key = that.data.key;
    let goods_type = dataset.type;
    let k = {};
    let parm = '';

    if (goods_type == 'main'){
      parm = 'comboPackageGoodsArray[' + index + '].main_goods.sku_id';
      k[parm] = sku_id;
      parm = 'comboPackageGoodsArray[' + index + '].main_goods.promotion_price';
      k[parm] = promote_price;
      parm = 'sBuy';
      k[parm] = 0;
    } else if (goods_type == 'combo'){
      parm = 'comboPackageGoodsArray[' + index + '].goods_array[' + key + '].sku_id';
      k[parm] = sku_id;
      parm = 'comboPackageGoodsArray[' + index + '].goods_array[' + key + '].promotion_price';
      k[parm] = promote_price;
      parm = 'sBuy';
      k[parm] = 0;
    }else{
      app.showBox(that, '错误的规格信息');
      return false;
    }

    that.setData(k);

    let comboPackageGoodsArray = that.data.comboPackageGoodsArray;

  },

  /**
   * 空库存
   */
  nullStock: function (e) {
    let that = this;
    app.showBox(that, '商品已售馨');
  },
  
  /**
   * 立即购买
   */
  buy: function(e){
    let that = this;
    let comboPackageGoodsArray = that.data.comboPackageGoodsArray;
    let combo_index = that.data.combo_index;
    let combo = comboPackageGoodsArray[combo_index];
    let combo_id = comboPackageGoodsArray[combo_index].id;
    let main_goods = combo.main_goods;
    let goods_list = combo.goods_array;
    let buyFlag = that.data.buyFlag;
    let sku_id = [];

    if (buyFlag == 1){
      return false;
    }
    app.clicked(that, 'buyFlag');

    if (main_goods.sku_id != undefined && main_goods.sku_id != ''){
      sku_id.push(main_goods.sku_id + ':1');
    }else{
      sku_id.push(main_goods.sku_list[0].sku_id + ':1');
    }

    for(let index in goods_list){
      if (goods_list[index].sku_id != undefined && goods_list[index].sku_id != ''){
        sku_id.push(goods_list[index].sku_id + ':1');
      }else{
        sku_id.push(goods_list[index].sku_list[0].sku_id + ':1');
      }
    }

    let sku_list = sku_id.toString();
    if (sku_list == ''){
      app.showBox(that, '该套餐');
      app.restStatus(that, 'buyFlag');
      return false;
    }

    let goods_type = 1;

    wx.navigateTo({
      url: '/pagesother/pages/order/paymentorder/paymentorder?tag=' + 3 + '&sku=' + sku_list + '&goods_type=' + goods_type + '&combo_id=' + combo_id + '&num=' + 1,
    })
  }
})