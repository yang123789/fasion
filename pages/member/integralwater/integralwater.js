const app = new getApp();
var time = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_info: {},
    records_list: {},
    listClickFlag: 0
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

    app.restStatus(that, 'listClickFlag');
    app.sendRequest({
      url: "api.php?s=member/getMemberAccount",
      data: {},
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          that.setData({
            account_info: res.data
          })
          that.getRecords(that);
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
   * 获取纪录列表
   */
  getRecords: function(that){
    
    app.sendRequest({
      url: "api.php?s=member/getMemberAccountRecordsList",
      data: {},
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let records_list = res.data.data;
          if (records_list != undefined && records_list != null && records_list != ''){
            for (let index in records_list){
              records_list[index].create_time = time.formatTime(records_list[index].create_time, 'Y/M/D h:m:s');
            }
          }

          that.setData({
            records_list: records_list
          })
        }
      }
    });
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
})