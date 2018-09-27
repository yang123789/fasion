const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    out_trade_no: '', //流水号
    recharge_money: 0.00,
    confirmPayFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    app.sendRequest({
      url: 'api.php?s=member/recharge',
      data: {},
      success: function (res) {
        let code = res.code;

        if(code == 0){
          that.setData({
            out_trade_no: res.data
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
    let that = this;
    app.restStatus(that, 'confirmPayFlag');
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
   * 输入金额
   */
  inputMoney: function(event){
    let that = this;

    let recharge_money = event.detail.value;

    that.setData({
      recharge_money: recharge_money
    })
  },

  /**
   * 确认支付
   */
  confirmPay: function(){
    let that = this;

    let confirmPayFlag = that.data.confirmPayFlag;
    let out_trade_no = that.data.out_trade_no;
    let recharge_money = that.data.recharge_money;

    if (confirmPayFlag == 1){
      return false;
    }
    app.clicked(that, 'confirmPayFlag');

    if (recharge_money <= 0){
      app.showBox(that, '充值金额错误');
      app.restStatus(that, 'confirmPayFlag');
      return false;
    }
    
    app.sendRequest({
      url: 'api.php?s=member/createRechargeOrder',
      data: {
        out_trade_no: out_trade_no,
        recharge_money: recharge_money,
      },
      success: function (res) {
        let code = res.code;

        if (code == 0) {
          if(res.data > 0){
            wx.navigateTo({
              url: '/pagesother/pages/pay/getpayvalue/getpayvalue?out_trade_no=' + out_trade_no,
            })
          }else{
            app.showBox(that, '充值失败');
          }
        }else{
          app.showBox(that, '充值失败');
        }
      }
    });
  }
})