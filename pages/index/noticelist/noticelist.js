const app = new getApp();
var time = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice_list: [],
    noticeContentFlag: 0,
    next_page: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getNoticeList(that);
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
    app.restStatus(that, 'noticeContentFlag');
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
    that.getNoticeList(that, 2);
  },

  /**
   * 公告列表
   */
  getNoticeList: function(that, page = 1) {
    let next_page = that.data.next_page;
    next_page = page > 1 ? next_page : page;
    app.sendRequest({
      url: "api.php?s=index/noticeList",
      data: {
        page: page
      },
      success: function (res) {
        console.log(res);
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let notice_list = data.data
          //时间处理
          for (let index in notice_list){
            let times = notice_list[index].create_time
            notice_list[index].create_time = time.formatTime(times, 'Y-M-D h:m:s');
          }
          next_page = page > 1 ? parseInt(next_page)+1 : next_page;
          that.setData({
            next_page: next_page,
            notice_list: notice_list,
          })
        }
      }
    });
  },

  /**
   * 公告内容
   */
  noticeContent: function(e) {
    let that = this;
    let noticeContentFlag = that.data.noticeContentFlag;
    let id = e.currentTarget.dataset.id;

    if (noticeContentFlag == 1){
      return false;
    }
    app.clicked(that, 'noticeContentFlag');
    
    wx.redirectTo({
      url: '/pages/index/noticecontent/noticecontent?id=' + id,
    })
  }
})