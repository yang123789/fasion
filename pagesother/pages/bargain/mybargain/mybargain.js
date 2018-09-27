const app = new getApp();
var time = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: {},
    bargain_list: [],
    member_info: [],
    goods_info :[],
    bargainDetailFlag: 0,
    goodsDetailFlag: 0,
    inviteFriendsFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    that.setData({
      Base: base,
      defaultImg: defaultImg,
    })

    app.sendRequest({
      url: 'api.php?s=member/getMemberDetail',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let member_info = data;
          let img = member_info.user_info.user_headimg;
          member_info.user_info.user_headimg = app.IMG(img); //图片路径处理

          that.setData({
            member_info: res.data,
          })
        }
        console.log(res)
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

    app.restStatus(that, 'orderDetailFlag');
    app.restStatus(that, 'goodsDetailFlag');
    app.restStatus(that, 'inviteFriendsFlag');
    app.sendRequest({
      url: 'api.php?s=bargain/myBargain',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          console.log(res);
          let bargain_list = data.list.data;
          let user_info = data.list.user_info;
          let current_time = data.current_time;

          that.setData({
            current_time: current_time
          })

          for (let index in bargain_list) {
            //时间格式转换
            bargain_list[index].start_time = time.formatTime(bargain_list[index].start_time, 'Y-M-D h:m:s');
            //倒计时
            let time_array = {};
            time_array.end_time = bargain_list[index].end_time;
            if (bargain_list[index].status == 1){
              that.timing_pintuan(that, time_array, index);
            }else{
              let d = {};
              let parm = 'timers_array[' + index + ']';
              d[parm] = {};
              that.setData(d);
            }
            //用户头像处理
            let headImg = user_info.user_headimg;
            user_info.user_headimg = app.IMG(headImg);
            //商品图片处理
            let goodsImg = bargain_list[index].goods_info.pic.pic_cover_micro;
            bargain_list[index].goods_info.pic.pic_cover_micro = app.IMG(goodsImg);
            //剩余金额计算
            let goods_money = bargain_list[index].goods_money;
            let bargain_min_money = bargain_list[index].bargain_min_money;
            let bargain_money = bargain_list[index].bargain_money;
            let surplus = parseFloat(goods_money) - parseFloat(bargain_min_money) - parseFloat(bargain_money);
            bargain_list[index].surplus = parseFloat(surplus).toFixed(2);
          }

          that.setData({
            bargain_list: bargain_list,
            user_info : user_info,
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
   * 头像加载失败
   */
  errorHeadImg: function (e) {
    let that = this;
    let member_info = that.data.member_info;
    let defaultImg = that.data.defaultImg;
    let img = member_info.user_info.user_headimg;
    let parm = {};
    let parm_key = "member_info.user_info.user_headimg";

    if (defaultImg.is_use == 1){
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 商品图片加载失败
   */
  errorGoodsImg: function (e) {
    let that = this;
    let bargain_list = that.data.bargain_list;
    let defaultImg = that.data.defaultImg;
    let index = e.currentTarget.dataset.index;
    let img = bargain_list[index].goods_info.pic.pic_cover_micro;
    let parm = {};
    let parm_key = "bargain_list[" + index + "].goods_info.pic.pic_cover_micro";

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 订单详情
   */
  orderDetail: function(e) {
    let that = this;
    let order_id = e.currentTarget.dataset.id;
    let orderDetailFlag = that.data.orderDetailFlag;

    if (orderDetailFlag == 1){
      return false;
    }
    app.clicked(that, 'orderDetailFlag');

    wx.navigateTo({
      url: '/pagesother/pages/bargain/bargainorderdetail/bargainorderdetail?id=' + order_id,
    })
  },

  /**
   * 商品详情
   */
  goodsDetail: function(e) {
    let that = this;
    let goods_id = e.currentTarget.dataset.id;
    let goods_name = e.currentTarget.dataset.name;
    let goodsDetailFlag = that.data.goodsDetailFlag;
    let bargain_id = e.currentTarget.dataset.bargain_id;

    if (goodsDetailFlag == 1) {
      return false;
    }
    app.clicked(that, 'goodsDetailFlag');

    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=' + goods_name + '&bargain_id=' + bargain_id,
    })
  },

  /**
   * 邀请好友
   */
  inviteFriends: function(e) {
    let that = this;
    let inviteFriendsFlag = that.data.inviteFriendsFlag;
    let launch_id = e.currentTarget.dataset.launch_id;
    if (inviteFriendsFlag == 1){
      return false;
    }
    app.clicked(that, 'inviteFriendsFlag');

    wx.navigateTo({
      url: '/pagesother/pages/bargain/bargainlaunch/bargainlaunch?launch_id=' + launch_id,
    })
  },

  /**
   * 砍价计时
   */
  timing_pintuan: function (that, timer_array, index) {
    let current_time = that.data.current_time;
    let count_second = (timer_array.end_time * 1000 - current_time) / 1000;
    let d = {};
    let parm = '';
    
    //首次加载
    if (count_second > 0) {
      count_second--;
      //时间计算
      let hour = Math.floor(count_second / 3600);
      let minute = Math.floor((count_second / 60) % 60);
      let second = Math.floor(count_second % 60);

      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
      //赋值
      timer_array.hour = hour;
      timer_array.minute = minute;
      timer_array.second = second;
      timer_array.end = 0;

      d = {};
      parm = 'timers_array[' + index + ']';
      d[parm] = timer_array;
      that.setData(d);
    } else {
      timer_array.end = 1;

      d = {};
      parm = 'timers_array[' + index + ']';
      d[parm] = timer_array;
      that.setData(d);
    }
    //开始计时
    let timer = setInterval(function () {
      if (count_second > 0) {
        count_second--;
        //时间计算
        let hour = Math.floor(count_second / 3600);
        let minute = Math.floor((count_second / 60) % 60);
        let second = Math.floor(count_second % 60);

        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
        //赋值
        timer_array.hour = hour;
        timer_array.minute = minute;
        timer_array.second = second;
        timer_array.end = 0;

        d = {};
        parm = 'timers_array[' + index + ']';
        d[parm] = timer_array;
        that.setData(d);
      } else {
        timer_array.end = 1;

        d = {};
        parm = 'timers_array[' + index + ']';
        d[parm] = timer_array;
        that.setData(d);

        clearInterval(timer);
      }
    }, 1000)
  },

})