const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    password: '',
    new_password: '',
    savePasswordFlag: 0,
    old_password: '',
    new_password: '',
    confirm_password: '',
    is_new: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    app.sendRequest({
      url: 'api.php?s=member/getMemberDetail',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let member_info = data;
          let old_password = member_info.user_info.user_password;
          let is_new = old_password != 'd41d8cd98f00b204e9800998ecf8427e' ? 0 : 1;
          that.setData({
            is_new: is_new
          })
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

  },

  /**
   * 输入原始密码
   */
  inputOldPassowrd: function (event) {
    let that = this;

    let old_password = event.detail.value;

    that.setData({
      old_password: old_password,
    })
  },

  /**
   * 输入新密码
   */
  inputNewPassword: function (event) {
    let that = this;

    let new_password = event.detail.value;

    that.setData({
      new_password: new_password,
    })
  },

  /**
   * 确认新密码
   */
  inputConfirmPassword: function (event) {
    let that = this;

    let confirm_password = event.detail.value;

    that.setData({
      confirm_password: confirm_password,
    })
  },

  /**
   * 保存
   */
  savePassword: function () {
    let that = this;
    let savePasswordFlag = that.data.savePasswordFlag;
    let is_new = that.data.is_new;
    let old_password = that.data.old_password;
    let new_password = that.data.new_password;
    let confirm_password = that.data.confirm_password;

    if (savePasswordFlag == 1) {
      return false;
    }
    app.clicked(that, 'savePasswordFlag');

    if(is_new != 1){
      if (old_password.length == 0) {
        app.showBox(that, '请输入原始密码');
        app.restStatus(that, 'savePasswordFlag');
        return false;
      }
    }

    if (new_password != confirm_password) {
      app.showBox(that, '两次密码输入不一致');
      app.restStatus(that, 'savePasswordFlag');
      return false;
    }

    app.sendRequest({
      url: 'api.php?s=member/modifyPassword',
      data: {
        old_password: old_password,
        new_password: new_password
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            app.showBox(that, data[1]);
            app.restStatus(that, 'savePasswordFlag');
          }
        } else {
          app.showBox(that, '保存失败');
          app.restStatus(that, 'savePasswordFlag');
        }
      }
    });
  }
})