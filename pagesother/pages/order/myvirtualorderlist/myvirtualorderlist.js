const app = new getApp();
var time = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: {},
    _no: '0',
    status: 'all',
    page: 1,
    virtual_order_list: [],
    aClickFlag: 0,
    payFlag: 0,
    evaluationFlag: 0,
    evaluationAgainFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    if (options.status) {
      that.setData({
        Base: base,
        defaultImg: defaultImg,
        _no: options.status,
        status: options.status - 1
      })
    } else {
      that.setData({
        Base: base,
        defaultImg: defaultImg,
      })
    }
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
    let status = that.data.status;
    let virtual_order_list = that.data.virtual_order_list;

    app.restStatus(that, 'aClickFlag');
    app.restStatus(that, 'payFlag');
    app.restStatus(that, 'evaluationFlag');
    app.restStatus(that, 'evaluationAgainFlag');

    app.sendRequest({
      url: 'api.php?s=order/myVirtualOrderList',
      data: {
        status: status
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let virtual_order_list = data.data;

          for (let index in virtual_order_list) {
            virtual_order_list[index].create_time = time.formatTime(virtual_order_list[index].create_time, 'Y-M-D h:m:s');
            //图片处理
            for (let key in virtual_order_list[index].order_item_list){
              let img = virtual_order_list[index].order_item_list[key].picture.pic_cover_small;
              virtual_order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
            }
          }
          let page = virtual_order_list.length > 0 ? 2 : 1;
          that.setData({
            virtual_order_list: virtual_order_list,
            page: page
          })
        }
        console.log(res)
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
    let that = this;
    let page = that.data.page;
    let status = that.data.status;
    let virtual_order_list = that.data.virtual_order_list;

    app.sendRequest({
      url: 'api.php?s=order/myVirtualOrderList',
      data: {
        status: status,
        page: page
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let new_virtual_order_list = res.data.data;
          let d = {};
          page = new_virtual_order_list.length > 0 ? page + 1 : page;

          for (let index in new_virtual_order_list) {
            new_virtual_order_list[index].create_time = time.formatTime(new_virtual_order_list[index].create_time, 'Y-M-D h:m:s');
            new_virtual_order_list[index].operation = {}; //去除无用数组
            //图片处理
            for (let key in new_virtual_order_list[index].order_item_list) {
              let img = new_virtual_order_list[index].order_item_list[key].picture.pic_cover_small;
              new_virtual_order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
            }
            //优化数据传入
            let key = "virtual_order_list[" + (parseInt(virtual_order_list.length) + parseInt(index)) + "]";
            d[key] = new_virtual_order_list[index];
          }
          //更新加入数据
          that.setData(d);

          that.setData({
            page: page
          })
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
    let key = e.currentTarget.dataset.key;
    let virtual_order_list = that.data.virtual_order_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = virtual_order_list[index].order_item_list[key].picture.pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "virtual_order_list[" + index + "].order_item_list[" + key + "].picture.pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 顶部导航选中
   */
  topNav: function (event) {
    let that = this;
    let status = event.currentTarget.dataset.id;
    let order_status = status == 0 ? 'all' : status - 1;

    app.sendRequest({
      url: 'api.php?s=order/myVirtualOrderList',
      data: {
        status: order_status
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let virtual_order_list = res.data.data;
          for (let index in virtual_order_list) {
            virtual_order_list[index].create_time = time.formatTime(virtual_order_list[index].create_time, 'Y-M-D h:m:s')
            //图片处理
            for (let key in virtual_order_list[index].order_item_list) {
              let img = virtual_order_list[index].order_item_list[key].picture.pic_cover_small;
              virtual_order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
            }
          }

          that.setData({
            virtual_order_list: virtual_order_list,
            _no: status,
            status: order_status,
            page: 2
          })
        }
        console.log(res)
      }
    })
  },

  /**
   * 随便逛逛
   */
  aIndex: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.switchTab({
      url: url,
    })
  },

  /**
   * 点击操作
   */
  aClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let aClickFlag = that.data.aClickFlag;

    if (aClickFlag == 1){
      return false;
    }
    app.clicked(that, 'aClickFlag');

    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 去支付
   */
  pay: function (e) {
    let that = this;
    let order_id = e.currentTarget.dataset.id;
    let payFlag = that.data.payFlag;
    if (payFlag == 1) {
      return false;
    }
    app.clicked(that, 'payFlag');

    app.sendRequest({
      url: 'api.php?s=order/orderPay',
      data: {
        order_id: order_id,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data != undefined && (typeof (data) == 'int' || typeof (data) == 'string')) {
            let out_trade_no = data;
            let url = '/pagesother/pages/pay/getpayvalue/getpayvalue?out_trade_no=' + out_trade_no;
            wx.navigateTo({
              url: url,
            })
          } else {
            app.restStatus(that, 'payFlag');
          }
        }
      }
    });
  },
  
  /**
   * 关闭订单
   */
  close: function (event) {
    let that = this;
    let order_id = event.currentTarget.dataset.id;
    let order_status = that.data.status;

    app.sendRequest({
      url: 'api.php?s=order/orderClose',
      data: {
        order_id: order_id
      },
      success: function (res) {
        let code = res.data;
        if (code > 0) {
          app.showBox(that, '操作成功');

          app.sendRequest({
            url: 'api.php?s=order/myVirtualOrderList',
            data: {
              status: order_status,
            },
            success: function (res) {
              let code = res.code;
              let virtual_order_list = res.data.data;
              if (code == 0) {
                for (let index in virtual_order_list) {
                  virtual_order_list[index].create_time = time.formatTime(virtual_order_list[index].create_time, 'Y-M-D h:m:s')
                  //图片处理
                  for (let key in virtual_order_list[index].order_item_list) {
                    let img = virtual_order_list[index].order_item_list[key].picture.pic_cover_small;
                    virtual_order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
                  }
                }
                that.setData({
                  virtual_order_list: virtual_order_list,
                  page: 2
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 删除订单
   */
  delete_order: function (event) {
    let that = this;
    let order_id = event.currentTarget.dataset.id;
    let order_status = that.data.status;

    app.sendRequest({
      url: 'api.php?s=order/deleteOrder',
      data: {
        order_id: order_id
      },
      success: function (res) {
        let code = res.data;
        if (code > 0) {
          app.showBox(that, '操作成功');

          app.sendRequest({
            url: 'api.php?s=order/myVirtualOrderList',
            data: {
              status: order_status,
              page: 1
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: "POST",
            success: function (res) {
              let code = res.code;
              let virtual_order_list = res.data.data;
              if (code == 0) {
                for (let index in virtual_order_list) {
                  virtual_order_list[index].create_time = time.formatTime(virtual_order_list[index].create_time, 'Y-M-D h:m:s')
                  //图片处理
                  for (let key in virtual_order_list[index].order_item_list) {
                    let img = virtual_order_list[index].order_item_list[key].picture.pic_cover_small;
                    virtual_order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
                  }
                }
                that.setData({
                  virtual_order_list: virtual_order_list,
                  page: 2
                })
              }
            }
          });
        } else {
          app.showBox(that, '操作失败');
        }
      }
    });
  },

  /**
   * 评价
   */
  evaluation: function (e) {
    let that = this;
    let evaluationFlag = that.data.evaluationFlag;
    let order_id = e.currentTarget.dataset.id;

    if (evaluationFlag == 1){
      return false;
    }
    app.clicked(that, 'evaluationFlag');

    wx.navigateTo({
      url: '/pagesother/pages/order/reviewcommodity/reviewcommodity?id=' + order_id,
    })
  },

  /**
   * 追加评价
   */
  evaluationAgain: function (e) {
    let that = this;
    let evaluationAgainFlag = that.data.evaluationAgainFlag;
    let order_id = e.currentTarget.dataset.id;

    if (evaluationAgainFlag == 1){
      return false;
    }
    app.clicked(that, 'evaluationAgainFlag');

    wx.navigateTo({
      url: '/pagesother/pages/order/reviewagain/reviewagain?id=' + order_id,
    })
  }
})