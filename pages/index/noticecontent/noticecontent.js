const app = new getApp();
var wxParse = require('../../../wxParse/wxParse.js');
var time = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice_info: [],
    prev_info: [],
    next_info: [],
    switchNoticeFlag: 0,
    allNoticeFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let notice_id = options.id;

    that.getNotice(that, notice_id);
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
    app.restStatus(that, 'switchNoticeFlag');
    app.restStatus(that, 'allNoticeFlag');
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
   * 获取公告文章
   */
  getNotice: function (that, notice_id) {
    app.sendRequest({
      url: "api.php?s=index/noticeContent",
      data: {
        id: notice_id
      },
      success: function (res) {
        console.log(res);
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let notice_info = data.notice_info
          //富文本处理
          let notice = notice_info.notice_content;
          wxParse.wxParse('notice', 'html', notice, that, 5);
          //时间处理
          notice_info.create_time = time.formatTime(notice_info.create_time, 'Y-M-D h:m:s');

          that.setData({
            notice_info: notice_info,
            prev_info: data.prev_info,
            next_info: data.next_info,
          })
          app.restStatus(that, 'switchNoticeFlag');
          wx.pageScrollTo({
            scrollTop: 0
          })
          wx.setNavigationBarTitle({
            title: notice_info.notice_title,
          })
        }
      }
    });
  },

  /**
   * 公告文章切换
   */
  switchNotice: function(e) {
    let that = this;
    let switchNoticeFlag = that.data.switchNoticeFlag;
    let notice_id = e.currentTarget.dataset.id;

    if (switchNoticeFlag == 1){
      return false;
    }
    app.clicked(that, 'switchNoticeFlag');
    that.getNotice(that, notice_id);
  },

  /**
   * 全部公告
   */
  allNotice: function(e) {
    let that = this;
    let allNoticeFlag = that.data.allNoticeFlag;

    if (allNoticeFlag == 1){
      return false;
    }
    app.clicked(that, 'allNoticeFlag');
    wx.redirectTo({
      url: '/pages/index/noticelist/noticelist',
    })
  }
})