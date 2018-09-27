const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: [],
    vg_id: '',
    virtual_detail: [],
    immediateUseFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    let vg_id = options.vg_id;

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
    
    app.restStatus(that, 'immediateUseFlag');
    app.sendRequest({
      url: 'api.php?s=Verification/VerificationOrderDetail',
      data: {
        vg_id: vg_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let virtual_detail = data;
          let img = virtual_detail.picture.pic_cover_micro;
          virtual_detail.picture.pic_cover_micro = app.IMG(img);
          console.log(res);
          that.setData({
            virtual_detail: virtual_detail
          })
          console.log(virtual_detail)
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
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let virtual_detail = that.data.virtual_detail;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = virtual_detail.picture.pic_cover_micro;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "virtual_detail.picture.pic_cover_micro";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 会员中心
   */
  memberCenter: function(e) {
    wx.switchTab({
      url: '/pages/member/member/member',
    })
  },

  /**
   * 立即使用
   */
  immediateUse: function(e) {
    let that = this;
    let vg_id = that.data.vg_id;
    let immediateUseFlag = that.data.immediateUseFlag;

    if (immediateUseFlag == 1){
      return false;
    }
    app.clicked(that, 'immediateUseFlag');

    wx.navigateTo({
      url: '/pagesother/pages/verification/virtualgoodsshare/virtualgoodsshare?vg_id=' + vg_id,
    })
  }
})