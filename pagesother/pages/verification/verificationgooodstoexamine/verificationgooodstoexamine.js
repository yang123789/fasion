const app = new getApp();
var time = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: [],
    vg_id: '', //核销商品ID
    goods_info: [], //核销商品信息
    person_info: [], //核销员信息
    virtualFlag: 0,
    is_login: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    let vg_id = options.id;

    if (options.scene != undefined && options.scene != ''){
      vg_id = options.scene;
    }else{
      that.setData({
        is_login: 1
      })
    }

    that.setData({
      Base: base,
      defaultImg: defaultImg,
      vg_id: vg_id,
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
    let vg_id = that.data.vg_id;
    let is_login = that.data.is_login;

    if (is_login == 0){
      let second = 0;
      let timer = setInterval(function(){

        second++;
        let token = app.globalData.token;
        if(token != ''){
          that.getVirtualGoodsInfo(that, vg_id);
          clearInterval(timer);
        }

        if (second >= 30){
          app.showBox('登录超时', 2000);
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/index/index',
            })
          },2000)
        }
      },1000);
    }else{
      that.getVirtualGoodsInfo(that, vg_id);
    }
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
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let goods_info = that.data.goods_info;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = goods_info.picture.pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "goods_info.picture.pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 获取核销商品信息
   */
  getVirtualGoodsInfo: function (that, vg_id) {
    console.log(vg_id);
    app.sendRequest({
      url: 'api.php?s=Verification/VerificationGooodsToExamine',
      data: {
        vg_id: vg_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let person_info = [];

          if (data.verificadition_person_info.data != undefined && data.verificadition_person_info.data[0] != undefined) {
            person_info = data.verificadition_person_info.data[0];
          }

          data.info.time = '不限制';
          if (data.info != '' && data.info.end_time != undefined && data.info.end_time != '') {
            data.info.time = data.info.end_time == 0 ? data.info.time : '到' + time.formatTime(data.info.end_time, 'Y-M-D') + '之前有效';
          }
          let goods_info = data.info;
          let img = goods_info.picture.pic_cover_small;
          goods_info.picture.pic_cover_small = app.IMG(img);

          that.setData({
            goods_info: data.info,
            person_info: person_info,
            is_login: 1,
          })
        }
        console.log(res)
      }
    })
  },

  /**
   * 核销
   */
  verificationVirtualGoods: function(e) {
    let that = this;
    let virtualFlag = that.data.virtualFlag;
    let virtual_goods_id = that.data.vg_id;

    if (virtualFlag == 1){
      return false;
    }
    app.clicked(that, 'virtualFlag');
    
    app.sendRequest({
      url: 'api.php?s=Verification/verificationVirtualGoods',
      data: {
        virtual_goods_id: virtual_goods_id
      },
      success: function(res) {
        let code = res.code;
        let data = res.data;
        console.log(res);

        if(code == 0){

          if(data > 0){

            app.showBox(that, "核销成功");
            setTimeout(function(e){
              wx.switchTab({
                url: '/pages/member/member/member',
              })
            },1500);
            

          }else{

            app.showBox(that, '核销失败');
            app.sendRequest({
              url: 'api.php?s=Verification/VerificationGooodsToExamine',
              data: {
                vg_id: virtual_goods_id
              },
              success: function (res) {
                code = res.code;
                data = res.data;

                if (code == 0) {
                  
                  let person_info = [];

                  if (data.verificadition_person_info.data != undefined && data.verificadition_person_info.data[0] != undefined) {
                    person_info = data.verificadition_person_info.data[0];
                  }
                  let goods_info = data.info;
                  let img = goods_info.picture.pic_cover_small;
                  goods_info.picture.pic_cover_small = app.IMG(img);
                  that.setData({
                    goods_info: goods_info,
                    person_info: person_info
                  })
                  app.restStatus(that, 'virtualFlag');
                }
                console.log(res)
              }
            })
          }
        }
      }
    })
  }
})