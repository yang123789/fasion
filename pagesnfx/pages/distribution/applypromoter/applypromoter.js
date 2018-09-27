const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    defaultImg: {},
    promoter_shop_name: '',
    applyPromoterFlag: 0,
    memberCenterFlag: 0
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
    app.restStatus(that, 'applyPromoterFlag');
    app.restStatus(that, 'memberCenterFlag');

    that.getNewApplyInfo(that);
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
   * 获取最新申请消息
   */
  getNewApplyInfo: function (that) {
    app.sendRequest({
      url: 'api.php?s=Distribution/applyPromoterInfo',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;

        console.log(res);
        if (code == 0) {
          let user_consume = data.user_consume;
          let promoter_level = data.promoter_level;
          let promoter_info = data.promoter_info;

          if (promoter_info != null) {
            if (promoter_info.promoter_id > 0 && promoter_info.is_audit == 1) {
              wx.switchTab({
                url: '/pages/member/member/member',
              })
            }
          }

          let level_id = 0;
          let level_index = -1;
          for (let index in promoter_level) {
            let level_money = promoter_level[index].level_money;
            if (parseFloat(user_consume) >= parseFloat(level_money)) {
              level_id = promoter_level[index].level_id;
              level_index = index;
            }
          }

          that.setData({
            promoter_info: promoter_info,
            promoter_level: promoter_level,
            level_id: level_id,
            level_index: level_index,
            reapply: data.reapply,
            user_consume: user_consume
          })
        }
      }
    })
  },

  /**
   * 输入店铺名称
   */
  inputPromoterShopName: function (e) {
    let that = this;
    let promoter_shop_name = e.detail.value;

    that.setData({
      promoter_shop_name: promoter_shop_name
    })
  },

  /**
   * 申请推广员
   */
  applyPromoter: function (e) {
    let that = this;
    let applyPromoterFlag = that.data.applyPromoterFlag;
    if (applyPromoterFlag == 1) {
      return false;
    }
    app.clicked(that, 'applyPromoterFlag');

    let shop_id = 0;
    let promoter_shop_name = that.data.promoter_shop_name;
    let level_index = that.data.level_index;
    let level_id = that.data.level_id;

    if (!(level_id > 0) || !(level_index >= 0)) {
      app.showBox(that, '您未满足消费条件！');
      app.restStatus(that, 'applyPromoterFlag');
      return false;
    }

    if (promoter_shop_name == '') {
      app.showBox(that, '请输入店铺名称！');
      app.restStatus(that, 'applyPromoterFlag');
      return false;
    }

    app.sendRequest({
      url: 'api.php?s=Distribution/applyPromoter',
      data: {
        shop_id: shop_id,
        promoter_shop_name: promoter_shop_name,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          if (data.code > 0) {
            app.showBox(that, '已提交申请,等待审核');
            that.getNewApplyInfo(that);
          } else {
            app.showBox(that, "申请失败");
            pp.restStatus(that, 'applyPromoterFlag');
          }
        }
      }
    })
  },

  /**
   * 返回会员中心
   */
  memberCenter: function (e) {
    let that = this;
    let memberCenterFlag = that.data.memberCenterFlag;
    if (memberCenterFlag == 1) {
      return false;
    }
    app.clicked(that, 'memberCenterFlag');

    wx.switchTab({
      url: '/pages/member/member/member',
    })
  }
})