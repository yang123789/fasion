const app = new getApp();
var time = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Base: '',
    defaultImg: {},
    goods_id: 0,
    evaluates_count: {
      evaluate_count: 0,
      imgs_count: 0,
      praise_count: 0,
      center_count: 0,
      bad_count: 0
    },
    next_page: 1,
    comments_type: {},
    comments_list: {}, //评价列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let goods_id = options.id;
    let comments_type = options.type;
    let siteBaseUrl = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    
    app.sendRequest({
      url: 'api.php?s=goods/getGoodsEvaluateCount',
      data: {
        goods_id: goods_id,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let evaluates_count = data;

          that.setData({
            Base: siteBaseUrl,
            defaultImg: defaultImg,
            evaluates_count: evaluates_count
          })

          that.getComments(goods_id, comments_type);
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
    let goods_id = that.data.goods_id;
    let comments_type = that.data.comments_type;

    that.getComments(goods_id, comments_type);
  },

  /**
   * 头像加载失败
   */
  errorHeadImg: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let comments_list = that.data.comments_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = comments_list[index].user_img;

    if (defaultImg.is_use == 1){
      let default_img = that.data.defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "comments_list[" + index + "].user_img";
        parm[parm_key] = defaultImg;
        that.setData(parm);
      }
    }
  },

  /**
   * 商品评论
   */
  getComments: function (goods_id, comment_type) {
    let that = this;
    let page = that.data.next_page;
    let comments_type = that.data.comments_type;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    page = comment_type == comments_type ? page : 1;

    app.sendRequest({
      url: 'api.php?s=goods/getGoodsComments',
      data: {
        goods_id: goods_id,
        comments_type: comment_type,
        page: page
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {

          page++;

          if (res.data.data.length > 0) {
            let old_comments_list = that.data.comments_list;
            let comments_list = res.data.data;
            let length = old_comments_list.length == undefined ? 0 : old_comments_list.length;
            let d = {};

            for (let index in comments_list) {
              //匿名
              let new_member_name = '***';
              if (comments_list[index].member_name != '' && comments_list[index].member_name != undefined) {
                new_member_name = comments_list[index].member_name[0] + '***';
              }
              comments_list[index].member_name = comments_list[index].is_anonymous == 1 ? new_member_name : comments_list[index].member_name;
              //图片处理
              comments_list[index].user_img = app.IMG(comments_list[index].user_img);
              if (comments_list[index].user_img == '' && defaultImg.is_use == 1){
                if (defaultImg.is_use == 1) {
                  let default_img = defaultImg.value.default_headimg;
                  comments_list[index].user_img = default_img;
                }
              }
              //图片数组分割
              if (comments_list[index].image == '') {
                comments_list[index].image = {}
              } else {
                comments_list[index].image = comments_list[index].image.split(',');
                for (let key in comments_list[index].image){
                  let img = comments_list[index].image[key];
                  comments_list[index].image[key] = app.IMG(img);
                }
              }
              if (comments_list[index].again_image == '') {
                comments_list[index].again_image = {}
              } else {
                comments_list[index].again_image = comments_list[index].again_image.split(',');
                for (let key in comments_list[index].again_image) {
                  let img = comments_list[index].again_image[key];
                  comments_list[index].again_image[key] = app.IMG(img);
                }
              }
              //时间戳转换
              if (comments_list[index].addtime > 0) {
                comments_list[index].addtime = time.formatTime(comments_list[index].addtime, 'Y-M-D h:m:s');
              }
              if (comments_list[index].again_addtime > 0) {
                comments_list[index].again_addtime = time.formatTime(comments_list[index].again_addtime, 'Y-M-D h:m:s');
              }
              let key = "comments_list[" + (parseInt(index) + parseInt(length)) + "]";
              d[key] = comments_list[index];
            }

            if (parseInt(page) > 2){
              that.setData(d);
            }else{
              that.setData({
                comments_list: comments_list
              });
            }
            
            that.setData({
              goods_id: goods_id,
              comments_type: comment_type,
              next_page: page,
            })
          } else {

            if (parseInt(page) <= 2) {
              that.setData({
                comments_list: {},
              })
            }

            that.setData({
              goods_id: goods_id,
              comments_type: comment_type,
            })
          }
        }
        //console.log(res)
      }
    });
  },


  /**
   * 选择评论类型
   */
  evaluationType: function (e) {
    let that = this;
    let goods_id = that.data.goods_id;
    let evaluation_type = e.currentTarget.dataset.type;

    that.getComments(goods_id, evaluation_type);
  },
})