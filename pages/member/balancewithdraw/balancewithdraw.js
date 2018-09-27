const app = new getApp();
var time = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    withdraw_list:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    app.sendRequest({
      url: 'api.php?s=member/balanceWithdraw',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let withdraw_list = data.data;

          for (let index in withdraw_list){
            withdraw_list[index].ask_for_date = time.formatTime(withdraw_list[index].ask_for_date, 'Y-M-D h:m:s');
          }
          
          that.setData({
            withdraw_list: withdraw_list
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
})