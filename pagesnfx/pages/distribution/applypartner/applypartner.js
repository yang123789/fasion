const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    defaultImg: {},
    apply_partner_info: {},
    applyPartnerFlag: 0,
    distributionCenterFlag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let shop_id = options.shop_id;
    that.setData({
      shop_id: shop_id
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

    app.restStatus(that, 'applyPartnerFlag');
    app.restStatus(that, 'distributionCenterFlag');
    that.loadApplyPartnerInfo(that);
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
   * 加载股东申请信息
   */
  loadApplyPartnerInfo: function (that) {
    app.sendRequest({
      url: 'api.php?s=Distribution/applyPartnerInfo',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let apply_partner_info = data;
          if (apply_partner_info.agent_type == 1) {
            wx.switchTab({
              url: '/pages/member/member/member',
            })
            return;
          }

          that.setData({
            apply_partner_info: apply_partner_info
          })
        }
      }
    });
  },
  
  /**
   * 申请股东
   */
  applyPartner: function (e) {
    let that = this;
    let applyPartnerFlag = that.data.applyPartnerFlag;
    if (applyPartnerFlag == 1) {
      return false;
    }
    app.clicked(that, 'applyPartnerFlag');

    let shop_id = that.data.shop_id;
    let apply_partner_info = that.data.apply_partner_info;
    if (apply_partner_info.is_meet != 1) {
      app.showBox(that, '当前您还不满足最低消费，无法申请股东');
      app.restStatus(that, 'applyPartnerFlag');
      return false;
    }

    app.sendRequest({
      url: 'api.php?s=Distribution/applyPartner',
      data: {
        shop_id: shop_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        console.log(res);
        if (code == 0) {
          if (data.code > 0) {
            app.showBox(that, '股东申请成功');
            that.loadApplyPartnerInfo(that);
          } else {
            app.showBox(that, '股东申请失败');
          }
        }
      }
    });
  },

  /**
   * 返回推广中心
   */
  distributionCenter: function (e) {
    let that = this;
    let distributionCenterFlag = that.data.distributionCenterFlag;
    if (distributionCenterFlag == 1) {
      return false;
    }
    app.clicked(that, 'distributionCenterFlag');

    wx.navigateBack({
      delta: 1
    })
  }
})