const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    money: 0.00,
    max_money: 0.00,
    min_money: 1,
    multiple: 1, //倍数
    cash: 0.00,
    account_list: {}, //提现账号
    withdraw_message: '', //提现备注
    bank_account_id: 0,
    addAccountFlag: 0,
    toWithdrawFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

    app.restStatus(that, 'addAccountFlag');
    app.restStatus(that, 'toWithdrawFlag');
    app.sendRequest({
      url: 'api.php?s=member/toWithdrawInfo',
      data: {},
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let data = res.data;
          let bank_account_id = 0;
          if (data.account_list[0]!=undefined){
            bank_account_id = data.account_list[0].id;
          }
          that.setData({
            max_money: data.account,
            min_money: data.withdraw_cash_min,
            money: data.account,
            multiple: data.poundage,
            account_list: data.account_list,
            withdraw_message: data.withdraw_message,
            bank_account_id: bank_account_id,
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
   * 添加账号
   */
  addAccount: function () {
    let that = this;
    let addAccountFlag = that.data.addAccountFlag;
    
    if (addAccountFlag == 1){
      return false;
    }
    app.clicked(that, 'addAccountFlag');

    wx.navigateTo({
      url: '/pages/member/accountlist/accountlist',
    })
  },

  /**
   * 输入金额
   */
  inputToWithdraw: function(event) {
    let that = this;

    let cash = event.detail.value;
    
    that.setData({
      cash: cash
    })
  },

  /**
   * 申请提现
   */
  toWithdraw: function(){
    let that = this;

    let toWithdrawFlag = that.data.toWithdrawFlag;
    let max_money = parseFloat(that.data.max_money);
    let min_money = parseFloat(that.data.min_money);
    let money = parseFloat(that.data.money);
    let multiple = that.data.multiple;
    let cash = parseFloat(that.data.cash);
    let account_list = that.data.account_list;
    let bank_account_id = that.data.bank_account_id;
    
    if (toWithdrawFlag == 1) {
      return false;
    }
    app.clicked(that, 'toWithdrawFlag');

    if (bank_account_id == 0){
      app.showBox(that, '未添加提现账号');
      app.restStatus(that, 'toWithdrawFlag');
      return false;
    }

    if (cash > 0 == false){
      app.showBox(that, '金额输入错误');
      app.restStatus(that, 'toWithdrawFlag');
      return false;
    }

    if (cash < min_money){
      app.showBox(that, '最低提现金额'+min_money+'元');
      app.restStatus(that, 'toWithdrawFlag');
      return false;
    }

    if(cash % multiple != 0){
      app.showBox(that, '提现金额必须为'+multiple+'的倍数');
      app.restStatus(that, 'toWithdrawFlag');
      return false;
    }

    if (cash > money){
      app.showBox(that, '不可超出可提现金额');
      app.restStatus(that, 'toWithdrawFlag');
      return false;
    }

    app.sendRequest({
      url: 'api.php?s=member/toWithdraw',
      data: {
        cash: cash,
        bank_account_id: bank_account_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0){
            app.showBox(that, '已提交申请，请等待审核');
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },1700)
          }else{
            app.showBox(that, '提交失败！');
            app.restStatus(that, 'toWithdrawFlag');
          }
        }
        console.log(res)
      }
    })
  }
})