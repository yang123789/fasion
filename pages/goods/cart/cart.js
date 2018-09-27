const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    edit: 0, //修改状态
    cart_list: [], //购物车商品列表
    check_all: 1, //全部选中
    is_checked: 1, //是否存在选中
    total_price: 0.00, //总价
    numAdjustFlag: 0,
    goodsDetailFlag: 0,
    settlementFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let defaultImg = app.globalData.defaultImg;
    let shop_name = app.globalData.title;

    that.setData({
      defaultImg: defaultImg,
      shop_name: shop_name
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

    app.restStatus(that, 'settlementFlag');
    app.restStatus(that, 'goodsDetailFlag');
    app.sendRequest({
      url: 'api.php?s=goods/cart',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        let total_price = 0.00;
        
        console.log(res);
        if (code == 0) {
          let cart_list = data.cart_list;
          for (let index in cart_list) {
            cart_list[index].status = 1;
            let promotion_price = parseFloat(cart_list[index].promotion_price);
            let num = parseInt(cart_list[index].num);
            total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
            //图片处理
            if (cart_list[index].picture_info != undefined && cart_list[index].picture_info != null) {
              let img = cart_list[index].picture_info.pic_cover_small;
              cart_list[index].picture_info.pic_cover_small = app.IMG(img);
            } else {
              cart_list[index].picture_info = {};
              cart_list[index].picture_info.pic_cover_small = '';
            }
          }

          that.setData({
            cart_list: cart_list,
            total_price: total_price.toFixed(2),
            check_all: 1,
            edit: 0,
            is_checked: 1,
          });
        }
      }
    })
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
    let cart_list = that.data.cart_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = cart_list[index].picture_info.pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "cart_list.[" + index + "].picture_info.pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 购物车修改
   */
  cartEdit: function (event) {
    let that = this;
    let edit = event.currentTarget.dataset.edit;
    let cart_list = that.data.cart_list;
    let total_price = 0.00;
    let status = edit == 1 ? 0 : 1;

    for (let index in cart_list) {
      cart_list[index].status = status;
      if (status == 1) {
        let promotion_price = parseFloat(cart_list[index].promotion_price);
        let num = parseInt(cart_list[index].num);
        total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
      }
    }

    that.setData({
      edit: edit,
      check_all: status,
      is_checked: status,
      cart_list: cart_list,
      total_price: total_price.toFixed(2),
    })
  },

  /**
   * 选中商品
   */
  selectCart: function (event) {
    let that = this;
    let i = event.currentTarget.dataset.index;
    let status = event.currentTarget.dataset.status;
    let cart_list = that.data.cart_list;
    let total_price = that.data.total_price;
    let is_checked = 0;
    let check_all = 1;
    let promotion_price = parseFloat(cart_list[i].promotion_price);
    let num = parseInt(cart_list[i].num);

    if (status == 0) {
      status = 1;
      total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
    } else {
      status = 0;
      total_price = parseFloat(total_price) - parseFloat(promotion_price * num);
    }

    cart_list[i].status = status;

    for (let index in cart_list) {
      if (cart_list[index].status == 1) {
        is_checked = 1;
      }
      if (cart_list[index].status == 0) {
        check_all = 0;
      }
    }

    that.setData({
      cart_list: cart_list,
      is_checked: is_checked,
      check_all: check_all,
      total_price: total_price.toFixed(2),
    })
  },

  /**
   * 全选
   */
  checkAll: function (event) {
    let that = this;
    let check_all = that.data.check_all;
    let cart_list = that.data.cart_list;
    let total_price = 0.00;
    let status = 0;

    if (check_all == 1) {
      check_all = 0;
      status = 0;
    } else {
      check_all = 1;
      status = 1;
    }

    for (let index in cart_list) {
      cart_list[index].status = status;
      if (status == 1) {
        let promotion_price = parseFloat(cart_list[index].promotion_price);
        let num = parseInt(cart_list[index].num);
        total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
      }
    }

    that.setData({
      check_all: check_all,
      cart_list: cart_list,
      is_checked: check_all,
      total_price: total_price.toFixed(2),
    })
  },

  /**
   * 数量调节
   */
  numAdjust: function (event) {
    let that = this;
    let adjust_type = event.currentTarget.dataset.type;
    let i = event.currentTarget.dataset.index;
    let id = event.currentTarget.dataset.id;
    let numAdjustFlag = that.data.numAdjustFlag;
    let cart_list = that.data.cart_list;
    let num = cart_list[i].num;
    let total_price = that.data.total_price;

    if (numAdjustFlag == 1) {
      return false;
    }

    app.clicked(that, 'numAdjustFlag');

    app.sendRequest({
      url: 'api.php?s=goods/cart',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
          console.log(res.data)
        if (code == 0) {
          let new_cart_list = data.cart_list;
          let stock = new_cart_list[i].stock;
          let max_buy = new_cart_list[i].max_buy
          let min_buy = new_cart_list[i].min_buy;
          //加
          if (adjust_type == 'add') {
            if (num < stock) {
              if (max_buy > 0 && num >= max_buy) {
                app.showBox(that, '该商品最多购买' + max_buy + '件');
                app.restStatus(that, 'numAdjustFlag');
                return false;
              }
            } else {
              app.showBox(that, '已达到最大库存');
              app.restStatus(that, 'numAdjustFlag');
              return false;
            }
            num++;
          }
          //减
          if (adjust_type == 'minus') {
            if (num > 0) {
              if (num == min_buy && min_buy > 0) {
                app.showBox(that, '该商品最少购买' + min_buy + '件');
                app.restStatus(that, 'numAdjustFlag');
                return false;
              }
              if (num == 1) {
                app.showBox(that, '该商品最少购买' + 1 + '件');
                app.restStatus(that, 'numAdjustFlag');
                return false;
              }
              num--;
            }
          }

          new_cart_list[i].num = num;
          //新数组添加选中状态
          total_price = 0.00;
          for (let index in cart_list) {
            new_cart_list[index].status = cart_list[index].status;
            let promotion_price = parseFloat(new_cart_list[index].promotion_price);
            let num = parseInt(new_cart_list[index].num);
            total_price = parseFloat(total_price) + parseFloat(promotion_price * num);

            //图片处理
            if (new_cart_list[index].picture_info != undefined && new_cart_list[index].picture_info != null) {
              let img = new_cart_list[index].picture_info.pic_cover_small;
              new_cart_list[index].picture_info.pic_cover_small = app.IMG(img);
            } else {
              new_cart_list[index].picture_info = {};
              new_cart_list[index].picture_info.pic_cover_small = '';
            }
          }
          //执行
          app.sendRequest({
            url: 'api.php?s=goods/cartAdjustNum',
            data: {
              cartid: id,
              num: num,
            },
            success: function (res) {
              let code = res.data;
              if (code > 0) {
                that.setData({
                  cart_list: new_cart_list,
                  total_price: total_price.toFixed(2),
                })
                app.restStatus(that, 'numAdjustFlag');
              } else {
                app.showBox(that, '操作失败');
                app.restStatus(that, 'numAdjustFlag');
              }
            }
          })
        }
      }
    })
  },

  /**
   * 输入数量调节
   */
  inputAdjust: function (event) {
    let that = this;
    let i = event.currentTarget.dataset.index;
    let id = event.currentTarget.dataset.id;
    let cart_list = that.data.cart_list;
    let num = event.detail.value;
    let total_price = that.data.total_price;

    app.sendRequest({
      url: 'api.php?s=goods/cart',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let new_cart_list = data.cart_list;
          let stock = new_cart_list[i].stock;
          let max_buy = new_cart_list[i].max_buy
          let min_buy = new_cart_list[i].min_buy;

          if (max_buy > 0) {
            if (num >= max_buy) {
              app.showBox(that, '该商品最多购买' + max_buy + '件');
              num = max_buy;
            }
          } else {
            if (num >= stock) {
              app.showBox(that, '已达到最大库存');
              num = stock;
            }
          }

          if (min_buy > 0) {
            if (num <= min_buy) {
              app.showBox(that, '该商品最少购买' + min_buy + '件');
              num = min_buy;
            }
          } else {
            if (num <= 0) {
              app.showBox(that, '该商品最少购买' + 1 + '件');
              num = 1;
            }
          }

          new_cart_list[i].num = num;
          //新数组添加选中状态
          total_price = 0;
          for (let index in cart_list) {
            new_cart_list[index].status = cart_list[index].status;
            let promotion_price = parseFloat(new_cart_list[index].promotion_price);
            let num = parseInt(new_cart_list[index].num);
            total_price = parseFloat(total_price) + parseFloat(promotion_price * num);

            //图片处理
            if (new_cart_list[index].picture_info != undefined && new_cart_list[index].picture_info != null) {
              let img = new_cart_list[index].picture_info.pic_cover_small;
              new_cart_list[index].picture_info.pic_cover_small = app.IMG(img);
            } else {
              new_cart_list[index].picture_info = {};
              new_cart_list[index].picture_info.pic_cover_small = '';
            }
          }
          //执行
          app.sendRequest({
            url: 'api.php?s=goods/cartAdjustNum',
            data: {
              cartid: id,
              num: num,
            },
            success: function (res) {
              let code = res.data;
              if (code > 0) {
                that.setData({
                  cart_list: new_cart_list,
                  total_price: total_price.toFixed(2),
                })
              } else {
                app.showBox(that, '操作失败');
              }
            }
          })
        }
      }
    })
  },

  /**
   * 删除商品
   */
  deleteCart: function (event) {
    let that = this;
    let cart_list = that.data.cart_list;
    let del_id = '';

    for (let index in cart_list) {
      if (cart_list[index].status == 1) {
        if (del_id == '') {
          del_id += cart_list[index].cart_id;
        } else {
          del_id += ',' + cart_list[index].cart_id;
        }
      }
    }
    app.sendRequest({
      url: 'api.php?s=goods/cartDelete',
      data: {
        del_id: del_id,
      },
      success: function (res) {
        let code = res.data;
        if (code > 0) {
          app.sendRequest({
            url: 'api.php?s=goods/cart',
            data: {},
            success: function (res) {
              let code = res.code;
              let data = res.data;
              if (code == 0) {
                cart_list = data.cart_list;
                //新数组添加选中状态
                let total_price = 0.00;

                for (let index in cart_list) {
                  cart_list[index].status = 0;
                  let promotion_price = parseFloat(cart_list[index].promotion_price);
                  let num = parseInt(cart_list[index].num);
                  total_price = parseFloat(total_price) + parseFloat(promotion_price * num);

                  //图片处理
                  if (cart_list[index].picture_info != undefined && cart_list[index].picture_info != null) {
                    let img = cart_list[index].picture_info.pic_cover_small;
                    cart_list[index].picture_info.pic_cover_small = app.IMG(img);
                  } else {
                    cart_list[index].picture_info = {};
                    cart_list[index].picture_info.pic_cover_small = '';
                  }
                }

                that.setData({
                  cart_list: cart_list,
                  total_price: total_price.toFixed(2),
                })

                app.showBox(that, '操作成功');
              }
            }
          });
        } else {
          app.showBox(that, '操作失败');
        }
      }
    })
  },

  /**
   * 首页跳转
   */
  aIndex: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.switchTab({
      url: url,
    })
  },

  /**
   * 结算
   */
  settlement: function (event) {
    let that = this;
    let cart_list = that.data.cart_list;
    
    let settlementFlag = that.data.settlementFlag;
    let carts_list = '';
    if (settlementFlag == 1) {
      return false;
    }
    app.clicked(that, 'settlementFlag');

    for (let index in cart_list) {
      if (cart_list[index].status == 1) {
        let cart_id = cart_list[index].cart_id;
        if (carts_list == '') {
          carts_list = cart_id;
        } else {
          carts_list += ',' + cart_id;
        }
      }
    }
      
    wx.navigateTo({
        url: '/pagesother/pages/order/paymentorder/paymentorder?cart_list=' + carts_list + '&tag=2',
    })
  },

  /**
   * 商品详情
   */
  goodsDetail: function (e) {
    let that = this;
    let goods_id = e.currentTarget.dataset.id;
    let goods_name = e.currentTarget.dataset.name;
    let goodsDetailFlag = that.data.goodsDetailFlag;

    if (goodsDetailFlag == 1) {
      return false;
    }
    app.clicked(that, 'goodsDetailFlag');

    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&&goods_name=' + goods_name,
    })
  }
})