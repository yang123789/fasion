const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    out_trade_no: '',
    pay_money: 0.00,
    balance_money: 0,
    out_trade_no: '',
    payOrderFlag: 0,
    shop_name: '',
    shop_config: {},
    use_balance: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let out_trade_no = options.out_trade_no;
    if (out_trade_no == undefined || out_trade_no == '') {
      app.showModal({
        content: '错误的订单',
        code: -10
      })
    }

    app.sendRequest({
      url: 'api.php?s=pay/pay',
      data: {
        out_trade_no: out_trade_no,
      },
      success: function (res) {
        console.log(res);
        let code = res.code;
        let data = res.data;
        let pay_money = 0;
        let balance_money = 0;
        let shop_config = {};
        let pay_value = {};

        if (data.pay_value != undefined) {
          pay_money = data.need_pay_money;
          balance_money = data.member_balance;
          shop_config = data.shop_config;
          pay_value = data.pay_value;

          if (data.pay_value.type != 4) {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];  //上一个页面

            prevPage.setData({
              cancle_pay: 1
            })
          }
        }

        if (code == 0) {
          that.setData({
            out_trade_no: out_trade_no,
            pay_money: pay_money,
            balance_money: balance_money,
            shop_config: shop_config,
            pay_value: pay_value
          })
        }
      }
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
   * 选择是否使用余额
   */
  useBalance: function (e) {
    let that = this;
    let use_balance = that.data.use_balance;
    use_balance = e.detail.value == '' ? false : true;

    that.setData({
      use_balance: use_balance
    })
  },

  bindBalance: function (e) {
    let that = this;
    let out_trade_no = that.data.out_trade_no;
    let use_balance = that.data.use_balance;
    use_balance = use_balance ? 1 : 0;
    app.sendRequest({
      url: 'api.php?s=pay/orderBindBalance',
      data: {
        out_trade_no: out_trade_no,
        is_use_balance: use_balance
      },
      success: function (res) {
        let data = res.data;
        let code = res.code;

        if (code == 0) {

          if (data.code == 0) {
            that.payOrder();
          } else if (data.code == 1) {
            wx.redirectTo({
              url: '/pagesother/pages/pay/paycallback/paycallback?status=1&out_trade_no=' + out_trade_no,
            })
          } else {
            app.showBox(that, data.message);
            return false;
          }
        }
      }
    })
  },

  /**
   * 确认支付
   */
  payOrder: function (e) {
    let that = this;
    let out_trade_no = that.data.out_trade_no;
    let openid = app.globalData.openid;
    let payOrderFlag = that.data.payOrderFlag;

    if (payOrderFlag == 1) {
      return false;
    }
    app.clicked(that, 'payOrderFlag');

    app.sendRequest({
      url: 'api.php?s=pay/appletWechatPay',
      data: {
        out_trade_no: out_trade_no,
        openid: openid
      },
      success: function (res) {
        let data = res.data;
        if (data.return_code == 'FAIL') {
          app.showBox(that, '支付失败');
          app.restStatus(that, 'payOrderFlag');
          return false;
        }
        let out_trade_no = that.data.out_trade_no;

        wx.requestPayment({
          timeStamp: data.timestamp.toString(),
          nonceStr: data.nonce_str,
          'package': 'prepay_id=' + data.prepay_id,
          signType: 'MD5',
          paySign: data.PaySign,
          success: function () {

            wx.redirectTo({
              url: '/pagesother/pages/pay/paycallback/paycallback?status=1&out_trade_no=' + out_trade_no,
            })
          },
          fail: function (res) {

            console.log(res);
            //取消支付
            if (res.errMsg == 'requestPayment:fail cancel') {
              wx.redirectTo({
                url: '/pagesother/pages/pay/paycallback/paycallback?status=-1&out_trade_no=' + out_trade_no,
              })
              app.showBox(that, '取消支付');
            }
          },
          complete: function (res) {
            // wx.reLaunch({
            //   url: '/pagesother/pages/pay/paycallback/paycallback',
            // })
          }
        })
      }
    })
  }
})