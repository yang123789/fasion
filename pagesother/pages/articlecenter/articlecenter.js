const app = new getApp();
var time = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_class: {},
    select_index: -1,
    article_list: {},
    first_class: '全部',
    class_id: -1,
    articleDetailFlag: 0,
    next_page: 2,
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

    that.setData({
      next_page: 1
    })
    app.restStatus(that, 'articleDetailFlag');
    app.sendRequest({
      url: 'api.php?s=Article/getArticleClass',
      data: {},
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          that.getArticleList(that, 0, -1);
          that.setData({
            article_class: res.data.data,
            select_index: -1,
          })
        }
        console.log(res)
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
    let old_class_id = that.data.class_id;
    let next_page = that.data.next_page;

    app.sendRequest({
      url: 'api.php?s=Article/getArticleList',
      data: {
        class_id: class_id,
        page: next_page
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let article_list = res.data.data;
          let count = 0;
          for (let index in article_list) {
            article_list[index].image = app.IMG(article_list[index].image);
            count = 1;
          }
          next_page = count > 0 ? parseInt(next_page) + 1 : next_page;
        
          that.setData({
            article_list: article_list,
            select_index: select_index,
            class_id: class_id,
            next_page: next_page
          })
        }
        console.log(res);
      }
    });
  },

  /**
   * 一级分类选中
   */
  selectNav: function(event){
    let that = this;
    let class_id = event.currentTarget.dataset.id;
    let select_index = event.currentTarget.dataset.index;
    let first_class = '';
    if(select_index == -1){
      first_class = '全部';
    }else{
      first_class = that.data.article_class[select_index].name;
    }
    
    that.getArticleList(that, class_id, select_index);
    that.setData({
      first_class: first_class,
    })
  },

  /**
   * 获取文章列表
   */
  getArticleList: function (that, class_id, select_index){
    
    app.sendRequest({
      url: 'api.php?s=Article/getArticleList',
      data: {
        class_id: class_id,
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let article_list = res.data.data;

          for (let index in article_list){
            article_list[index].image = app.IMG(article_list[index].image);
          }
          
          that.setData({
            article_list: article_list,
            select_index: select_index,
            class_id: class_id,
            next_page: 2
          })
        }
        console.log(res);
      }
    });
  },

  /**
   * 文章详情
   */
  articleDetail: function(event){
    let that = this;
    let article_id = event.currentTarget.dataset.id;
    let articleDetailFlag = that.data.articleDetailFlag;

    if (articleDetailFlag == 1){
      return false;
    }
    app.clicked(that, 'articleDetailFlag');
    
    wx.navigateTo({
      url: '/pagesother/pages/articlecenter/articlecontent/articlecontent?id=' + article_id,
    })
  }
})