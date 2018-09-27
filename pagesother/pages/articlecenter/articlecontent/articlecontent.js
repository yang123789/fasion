const app = new getApp();
var wxParse = require('../../../../wxParse/wxParse.js');
var time = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_detail: [], 
    prev_info: [],
    next_info: [],
    aClickFlag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let article_id = options.id;

    app.sendRequest({
      url: 'api.php?s=Article/getArticleDetail',
      data: {
        article_id: article_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          console.log(res);
          let article_detail = data.article_detail;
          let prev_info = data.prev_info == null ? [] : data.prev_info;
          let next_info = data.next_info == null ? [] : data.next_info;
          //富文本格式转化
          let article = article_detail.content;
          wxParse.wxParse('article', 'html', article, that, 5);
          //时间格式转换
          article_detail.public_time = time.formatTime(article_detail.public_time, 'Y-M-D h:m:s');
          that.setData({
            article_detail: article_detail,
            prev_info: prev_info,
            next_info: next_info
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
    app.restStatus(that, 'aClickFlag');
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
   * 上下篇切换
   */
  aClick: function(e) {
    let that = this;
    let aClickFlag = that.data.aClickFlag;
    let id = e.currentTarget.dataset.id;

    if (aClickFlag == 1){
      return false;
    }
    app.clicked(that, 'aClickFlag');
    wx.redirectTo({
      url: '/pagesother/pages/articlecenter/articlecontent/articlecontent?id=' + id,
    })
  }
})