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
    maskStatus: 0,
    toView : '',
    scrollTop : '',
    helpBargainFlag: 0,
    goodsDetailFlag: 0,
    bargainListFlag: 0,
    launch_id : 0,//砍价活动id
    is_self : 0,
    is_max_partake : 0,
    height:0,
    is_login: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let launch_id = options.launch_id;
    let height = 0;
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        height = res.windowHeight;
      }
    })
    this.setData({
      launch_id: launch_id,
      height: height,
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
    


    app.restStatus(that, 'helpBargainFlag');
    app.restStatus(that, 'goodsDetailFlag'); 
    app.restStatus(that, 'bargainListFlag');
    that.loadBargainInfo(that);
  },

  /**
   * 加载砍价信息
   */

  loadBargainInfo : function(that){
    let launch_id = that.data.launch_id;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    app.sendRequest({
      url: "api.php?s=bargain/bargainLaunch",
      data: {
        launch_id: launch_id
      },
      success: function (res) {

        let code = res.code;
        let data = res.data;

        console.log(res);
        if (code == 0) {
          let bargain_goods_info = data.bargain_goods_info; //砍价商品信息
          let goods_info = data.goods_info; // 商品信息
          let pic = data.pic; //商品图片
          let launch_info = data.launch_info; //砍价活动信息
          let partake_info = data.partake_info; //砍价设置信息
          let partake_list = data.partake_list; //砍价帮
          let user_info = data.user_info; //用户信息
          let current_time = data.current_time;//当前时间
          let maskStatus = 1;

          //头像处理
          let headImg = user_info.user_headimg;
          user_info.user_headimg = app.IMG(headImg);

          for (let index in partake_list) {
            let img = partake_list[index].user_info.user_headimg;

            partake_list[index].user_info.user_headimg = app.IMG(img);
          }

          //商品图处理
          let goods_pic = goods_info.pic.pic_cover;
          goods_info.pic.pic_cover = app.IMG(goods_pic);

          //计时
          let time_array = {};
          time_array.end_time = launch_info.end_time;
          that.timing_launch(that, time_array, 0, current_time);

          if (data.is_self == 1) {
            maskStatus = 1;
          } else {
            maskStatus = 0;
          }

          that.setData({
            Base: base,
            defaultImg: defaultImg,
            bargain_goods_info: bargain_goods_info,
            goods_info: goods_info,
            user_info: user_info,
            partake_info: partake_info,
            partake_list: partake_list,
            launch_info: launch_info,
            is_self: data.is_self,
            is_max_partake: data.is_max_partake,
            maskStatus: maskStatus,
          })
          console.log(that.data.timer_array);
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
  onShareAppMessage: function (options) {
    let that = this;
    let e = options.target;
    let launch_id = that.data.launch_id;
    let goods_name = e.dataset.name;
    let goods_pic = e.dataset.img;
    return {
      title: '我在砍价免费拿' + goods_name +'，走过路过帮我砍一刀！' ,
      path: '/pagesother/pages/bargain/bargainlaunch/bargainlaunch?launch_id=' + launch_id,
      imageUrl: goods_pic,
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
    let bargain_id = e.currentTarget.dataset.bargain_id;
    let goodsDetailFlag = that.data.goodsDetailFlag;

    if (goodsDetailFlag == 1){
      return false;
    }
    app.clicked(that, 'goodsDetailFlag');

    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=' + goods_name+'&bargain_id='+bargain_id,
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
   * 头像加载失败
   */
  errorHeadImg: function (e) {
    let that = this;
    let member_info = that.data.user_info;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let img = member_info.user_headimg;
    let parm = {};
    let parm_key = "user_info.user_headimg";


    if (defaultImg.is_use == 1) {
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
    let goods_info = that.data.goods_info;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let img = goods_info.pic.pic_cover;
    let parm = {};
    let parm_key = "goods_info.pic.pic_cover";


    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 列表头像加载失败
   */
  errorHeadListImg: function (e) {
    let that = this;
    let partake_list = that.data.partake_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let index = e.currentTarget.dataset.index;
    let img = partake_list[index].user_info.user_headimg;
    let parm = {};
    let parm_key = "partake_list[" + index + "].user_info.user_headimg";

    if (defaultImg.is_use == 1){
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 喊好友砍价
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  share_friends:function (e){

  },

/**
 * 帮好友砍价
 */
  friend_brafain:function(e){
    let that = this;
    let launch_id = e.currentTarget.dataset.launch_id;
    let helpBargainFlag = that.data.helpBargainFlag;
    let is_max_partake = that.data.is_max_partake;
    if(helpBargainFlag == 1){
      return false;
    }
    console.log(helpBargainFlag);
    app.clicked(that,'helpBargainFlag');
    app.sendRequest({
      url: 'api.php?s=bargain/helpBargain',
      data: {
        launch_id: launch_id,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data.data;
        console.log(res)
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, '帮好友砍价成功');
            app.restStatus(that,'helpBargainFlag');
          }else if(data == "-9001"){
            app.showBox(that, '当前砍价已结束');

          }else if(data == -9002){
            app.showBox(that, '您已参加过当前砍价');
          } else if(data == -9003){
            app.restStatus(that, 'helpBargainFlag');
            app.showBox(that, '无法获取砍价信息');
          } else{
            restStatus(that, 'helpBargainFlag');
             app.showBox(that, '帮好友砍价失败');
          }

          that.refreshData(that, launch_id);
          
          
        } else {
          app.restStatus(that, 'helpBargainFlag');
          app.showBox(that, '帮助好友砍价失败');
        }
      }
    });
  },

/**
 * 跳转到砍价列表
 * @return {[type]} [description]
 */
  jump_bargain:function(){
    console.log(11);
    let that = this;
    let bargainListFlag = that.data.bargainListFlag;
    if (bargainListFlag == 1){
      return false;
    }
    app.clicked(that, 'bargainListFlag');
    
    wx.navigateTo({
      url: "/pages/goods/goodsbargainlist/goodsbargainlist",
    })
  },

  refreshData: function (that,launch_id){
    app.sendRequest({
      url: "api.php?s=bargain/bargainLaunch",
      data: {
        launch_id: launch_id
      },
      success: function (res) {

        let code = res.code;
        let data = res.data;

        console.log(res);
        if (code == 0) {
          let bargain_goods_info = data.bargain_goods_info; //砍价商品信息
          let goods_info = data.goods_info; // 商品信息
          let pic = data.pic; //商品图片
          let launch_info = data.launch_info; //砍价活动信息
          let partake_info = data.partake_info; //砍价设置信息
          let partake_list = data.partake_list; //砍价帮
          let user_info = data.user_info; //用户信息
          let current_time = data.current_time;//当前时间
          let maskStatus = 1;

          //头像处理
          let headImg = user_info.user_headimg;
          user_info.user_headimg = app.IMG(headImg);

          for (let index in partake_list) {
            let img = partake_list[index].user_info.user_headimg;

            partake_list[index].user_info.user_headimg = app.IMG(img);
          }

          //商品图处理
          let goods_pic = goods_info.pic.pic_cover;
          goods_info.pic.pic_cover = app.IMG(goods_pic);

          //计时
          let time_array = {};
          time_array.end_time = launch_info.end_time;
          that.timing_launch(that, time_array, 0, current_time);

          if (data.is_self == 1) {
            maskStatus = 1;
          } else {
            maskStatus = 0;
          }

          that.setData({
            bargain_goods_info: bargain_goods_info,
            goods_info: goods_info,
            user_info: user_info,
            partake_info: partake_info,
            partake_list: partake_list,
            launch_info: launch_info,
            is_self: data.is_self,
            is_max_partake: data.is_max_partake,
            maskStatus: maskStatus,
          })
          console.log(that.data.timer_array);
        }

      }
    });
  },
  /**
   * 砍价计时
   */
  timing_launch: function (that, timer_array, index, current_time) {
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