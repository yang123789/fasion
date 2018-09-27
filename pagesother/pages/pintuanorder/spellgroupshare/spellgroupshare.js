const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    empty_list: {},
    maskStatus: 1,
    joinBuyFlag: 0,
    goodsDetailFlag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goods_id = options.goods_id;
    let group_id = options.group_id;
    
    this.setData({
      goods_id: goods_id,
      group_id: group_id
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
    let goods_id = that.data.goods_id;
    let group_id = that.data.group_id;

    app.restStatus(that, 'joinBuyFlag');
    app.restStatus(that, 'goodsDetailFlag');
    app.sendRequest({
      url: "api.php?s=Pintuan/spellGroupShare",
      data: {
        goods_id: goods_id,
        group_id: group_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        console.log(res);
        if (code == 0) {
          let tuangou_group_info = data.tuangou_group_info;
          let current_time = data.current_time;
          let empty_list = {};

          //头像处理
          let headImg = tuangou_group_info.group_user_head_img;
          tuangou_group_info.group_user_head_img = app.IMG(headImg);

          for (let index in tuangou_group_info.user_list) {
            let img = tuangou_group_info.user_list[index].user_headimg;
            tuangou_group_info.user_list[index].user_headimg = app.IMG(img);
          }
          //计时
          let time_array = {};
          time_array.end_time = tuangou_group_info.end_time;
          that.timing_pintuan(that, time_array, 0, current_time);
          //空列表
          let num = tuangou_group_info.poor_num;
          for(let i = 0; i < num; i++){
            empty_list[i] = {};
          }

          that.setData({
            tuangou_group_info: tuangou_group_info,
            empty_list: empty_list,
            share_content: data.share_content,
            share_logo: data.share_logo,
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let goods_id = that.data.goods_id;
    let group_id = that.data.group_id;
    let share_logo = that.data.share_logo;
    let share_content = that.data.share_content;
    let tuangou_group_info = that.data.tuangou_group_info;
    let group_name = tuangou_group_info.group_name;
    group_name = group_name == undefined || group_name == null || group_name == '' ? '我' : group_name;

    let group_info = '【' + group_name + '的拼团，';
    if (tuangou_group_info.poor_num != '' && tuangou_group_info.poor_num != undefined) {
      group_info += '仅差' + tuangou_group_info.poor_num + '人】\n';
    }
    return {
      title: group_info + share_content.share_title,
      path: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=（拼团）' + that.data.share_content.share_title + '&group_id=' + group_id,
      imageUrl: share_logo,
      success: function(res){
        app.showBox(that, '分享成功');
      },
      fail: function(res){
        app.showBox(that, '分享失败');
      }
    }
  },

  /**
   * 商品详情
   */
  goodsDetail: function(e) {
    let that = this;
    let goods_id = e.currentTarget.dataset.id;
    let goods_name = e.currentTarget.dataset.name;
    let goodsDetailFlag = that.data.goodsDetailFlag;

    if (goodsDetailFlag == 1){
      return false;
    }
    app.clicked(that, 'goodsDetailFlag');

    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=' + goods_name,
    })
  },

  /**
   * 邀请好友
   */
  inviteFriends: function (e) {
    this.setData({
      maskStatus: 1
    })
  },

  /**
   * 关闭遮罩层
   */
  popupClose: function (e) {
    this.setData({
      maskStatus: 0
    })
  },

  /**
   * 参加团购
   */
  joinBuy: function(e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let goods_id = dataset.id;
    let goods_name = dataset.name;
    let group_id = dataset.group;
    let joinBuyFlag = that.data.joinBuyFlag;

    if (joinBuyFlag == 1){
      return false;
    }
    app.clicked(that, 'joinBuyFlag');

    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=' + goods_name + '&group_id=' + group_id,
    })
  },

  /**
   * 列表头像加载失败
   */
  errorHeadImg: function (e) {
    let that = this;
    let member_info = that.data.member_info;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let index = e.currentTarget.dataset.index;
    let img = tuangou_group_info.user_list[index].user_headimg;
    let parm = {};
    let parm_key = "tuangou_group_info.user_list[index].user_headimg";

    if (defaultImg.is_use == 1){
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 拼团计时
   */
  timing_pintuan: function (that, timer_array, index, current_time) {
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
        //计时结束
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