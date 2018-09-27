const app = getApp();
var time = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    //处理方式
    require_array: [
      {
        id: 1,
        value: '我要退款，但不退货'
      }
    ],
    //退款原因
    reason_array: [
      {
        id: '买/卖双方协商一致',
        value: '买/卖双方协商一致'
      },
      {
        id: '买错/多买/不想要',
        value: '买错/多买/不想要'
      },
      {
        id: '商品质量问题',
        value: '商品质量问题'
      },
      {
        id: '未收到货品',
        value: '未收到货品'
      },
      {
        id: '其他',
        value: '其他'
      },
    ],
    require_index: 0,
    reason_index: 0,
    refund_money: 0.00, //最多退款金额
    refund_balance: 0.00, //余额退款
    refund_require_money: 0.00, //申请退款金额
    refund_real_money: 0.00, //实际退款金额
    refund_express_company: '', //物流公司
    refund_shipping_no: '', //运单号
    refund_reason: '', //退款理由
    order_id: 0,
    order_goods_id: 0,
    refund_detail: {},
    refund_info: {},
    shop_address: {},
    refundFlag: 0,
    returnsGoodsFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    let require_array = that.data.require_array;
    let order_goods_id = options.id;
    let status = options.status;

    if (status == 2) {
      require_array[1] = {
        id: 2,
        value: '我要退款，并且退货'
      };
    }

    app.sendRequest({
      url: 'api.php?s=order/customerDetail',
      data: {
        order_goods_id: order_goods_id
      },
      success: function (res) {
        console.log(res);
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let refund_info = [];
          let refund_real_money = 0;
          if (data.refund_detail != '' && data.refund_detail != undefined) {
            refund_info = data.refund_detail.refund_info;
            if (refund_info[refund_info.length - 1] != undefined) {
              refund_info = refund_info[refund_info.length - 1];
              refund_info.action_time = time.formatTime(refund_info.action_time, 'Y-M-D h:m:s');
            }
            refund_real_money = data.refund_detail.refund_real_money
          }

          that.setData({
            refund_money: parseFloat(data.refund_money).toFixed(2),
            refund_balance: parseFloat(data.refund_balance).toFixed(2),
            require_array: require_array,
            order_goods_id: order_goods_id,
            refund_info: refund_info,
            refund_detail: data.refund_detail,
            shop_address: data.shop_address,
            refund_real_money: refund_real_money
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
    app.restStatus(that, 'refundFlag');
    app.restStatus(that, 'returnsGoodsFlag');
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
   * 输入物流公司
   */
  inputExpressCompany: function (e) {
    let that = this;
    let refund_express_company = e.detail.value;
    that.setData({
      refund_express_company: refund_express_company
    })
  },

  /**
   * 输入运单号
   */
  inputShippingNo: function (e) {
    let that = this;
    let refund_shipping_no = e.detail.value;
    that.setData({
      refund_shipping_no: refund_shipping_no
    })
  },

  selector: function (event) {
    let that = this;

    let require_index = that.data.require_index;
    let reason_array = that.data.reason_array;
    let reason_index = that.data.reason_index;
    let select_type = event.currentTarget.dataset.type;
    let index = event.detail.value;

    if (select_type == 1) {
      require_index = index;
    } else {
      reason_index = index;
    }

    that.setData({
      require_index: require_index,
      reason_index: reason_index,
    });
  },

  /**
   * 退款金额检测
   */
  refundRequireMoney: function (event) {
    let that = this;

    let refund_require_money = event.detail.value;
    let refund_money = that.data.refund_money;

    if (refund_require_money > refund_money) {
      app.showBox(that, '超出可退金额范围');
    }

    that.setData({
      refund_require_money: refund_require_money
    });
  },
  /**
   * 退款说明检测
   */
  refundReason: function (event) {
    let that = this;

    let refund_reason = event.detail.value;

    that.setData({
      refund_reason: refund_reason
    })
  },

  /**
   * 获取退款信息
   */
  getRefundInfo: function (that, order_goods_id) {
    app.sendRequest({
      url: 'api.php?s=order/customerDetail',
      data: {
        order_goods_id: order_goods_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let refund_info = res.data.refund_detail.refund_info;
          if (refund_info[refund_info.length - 1] != undefined) {
            refund_info = refund_info[refund_info.length - 1];
          } else {
            refund_info = {}
          }

          that.setData({
            refund_money: parseFloat(data.refund_money).toFixed(2),
            refund_balance: parseFloat(data.refund_balance).toFixed(2),
            order_id: data.refund_detail.order_id,
            order_goods_id: order_goods_id,
            refund_info: refund_info,
            refund_detail: data.refund_detail,
            shop_address: data.shop_address,
          })
        }
      }
    });
  },

  /**
   * 退款/退货申请 售后
   */
  refund: function (event) {
    let that = this;
    let refundFlag = that.data.refundFlag;
    let order_id = that.data.order_id;
    let order_goods_id = that.data.order_goods_id;
    let refund_require_money = parseFloat(that.data.refund_require_money);
    let refund_balance = parseFloat(that.data.refund_balance);
    let refund_money = that.data.refund_money;
    let require_array = that.data.require_array;
    let reason_array = that.data.reason_array;
    let require_index = that.data.require_index;
    let reason_index = that.data.reason_index;
    let refund_reason = that.data.refund_reason;
    let refund_type = require_array[require_index].id;

    if (refundFlag == 1) {
      return false;
    }
    app.clicked(that, 'refundFlag');

    if (refund_require_money == '' && refund_money > 0) {
      app.showBox(that, '请输入退款金额');
      app.restStatus(that, 'refundFlag');
      return false;
    }

    if (refund_require_money > refund_money) {
      app.showBox(that, '超出可退金额范围');
      app.restStatus(that, 'refundFlag');
      return false;
    }

    if (reason_index != 4) {
      refund_reason = reason_array[reason_index].id;
    } else {
      if (refund_reason == '') {
        app.showBox(that, '请输入退款说明');
        app.restStatus(that, 'refundFlag');
        return false;
      }
    }

    app.sendRequest({
      url: 'api.php?s=order/orderGoodsCustomerServiceAskfor',
      data: {
        order_id: order_id,
        order_goods_id: order_goods_id,
        refund_type: refund_type,
        refund_require_money: refund_require_money,
        refund_reason: refund_reason,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, '操作成功');

            that.getRefundInfo(that, order_goods_id);
          } else {
            app.showBox(that, '操作失败');
            app.restStatus(that, 'refundFlag');
          }
        }
      }
    });
  },

  /**
   * 买家退货 售后
   */
  returnsGoods: function (e) {
    let that = this;
    let id = that.data.refund_detail.id;
    let order_goods_id = that.data.order_goods_id;
    let refund_express_company = that.data.refund_express_company;
    let refund_shipping_no = that.data.refund_shipping_no;
    let refund_reason = that.data.refund_detail.refund_reason;
    let returnsGoodsFlag = that.data.returnsGoodsFlag;

    if (returnsGoodsFlag == 1) {
      return false;
    }
    app.clicked(that, 'returnsGoodsFlag');

    if (refund_express_company == '') {
      app.showBox(that, '请输入物流公司');
      app.restStatus(that, 'returnsGoodsFlag');
      return false;
    }

    if (refund_shipping_no == '') {
      app.showBox(that, '请输入运单号');
      app.restStatus(that, 'returnsGoodsFlag');
      return false;
    }

    app.sendRequest({
      url: 'api.php?s=order/orderGoodsCustomerExpress',
      data: {
        id: id,
        order_goods_id: order_goods_id,
        refund_express_company: refund_express_company,
        refund_shipping_no: refund_shipping_no,
        refund_reason: refund_reason,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, '操作成功');

            that.getRefundInfo(that, order_goods_id);
          } else {
            app.showBox(that, '操作成功失败');
            app.restStatus(that, 'returnsGoodsFlag');
          }
        }
      }
    });
  }

})