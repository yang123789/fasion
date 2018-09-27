const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    defaultImg: {},
    shop_config: {},
    listClickFlag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let defaultImg = app.globalData.defaultImg;
    let copyRight = app.globalData.copyRight;

    that.setData({
      defaultImg: defaultImg,
      copyRight: copyRight
    })
    that.shopConfg();
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
      url: 'api.php?s=Distribution/distributionCenter',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          //头像图片处理
          let member_img = data.member_img;
          member_img = app.IMG(member_img);

          that.setData({
            member_img: member_img,
            member_info: data.member_info,
            nick_name: data.nick_name,
            promoter_info: data.promoter_info,
            store_menu: data.store_menu
          })
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
   * 头像加载失败
   */
  errorHeadImg: function (e) {
    let that = this;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let img = that.data.member_img;
    let parm = {};
    let parm_key = "member_img";

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },
  
  /**
   * 页面跳转
   */
  listClick: function (e) {
    let that = this;
    let url = e.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;
    if (listClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: url,
      fail: function (error) {
        console.log('页面跳转失败：' + JSON.stringify(error));
        app.restStatus(that, 'listClickFlag');
      }
    })
  },
  
  /**
   * 店铺配置
   */
  shopConfg: function () {
    let that = this;

    app.sendRequest({
      url: 'api.php?s=Distribution/shopConfig',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let nfx_shop_config = data.nfx_shop_config;

          that.setData({
            shop_config: nfx_shop_config
          })
        }
      }
    });
  }
})