const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    user_info: {},
    info: '', //手机号||密码
    code_config: 0, //是否开启验证码
    code: '', //验证码
    password: '', //密码
    confirm_password: '', //确认密码
    info_code: '', //输入邮箱||手机验证码
    verification_code: '', //输入验证码
    second: 0, //计时
    saveFlag: 0,
    sendCodeFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let use_type = 0;
    if (options.use_type) {
      use_type = options.use_type;
    }
    that.setData({
      Base: base,
      use_type: use_type
    })

    that.getLoginVerifyCodeConfig(that);
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
    let use_type = that.data.use_type;

    if (use_type == 0) {
      wx.switchTab({
        url: '/pages/index/index',
      })
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
   * 验证码开启检测
   */
  getLoginVerifyCodeConfig: function (that) {
    app.sendRequest({
      url: "api.php?s=member/getLoginVerifyCodeConfig",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res)

        if (code == 0) {
          let code = data.value.pc;
          if (code == 1) {
            app.verificationCode(that);
          }
          that.setData({
            code_config: data.value.pc,
          })
        }
      }
    })
  },

  /**
   * 
   */

  /**
   * 输入邮箱||手机号
   */
  inputInfo: function (e) {
    let that = this;
    let info = e.detail.value;

    that.setData({
      info: info
    })
  },

  /**
   * 输入密码
   */
  inputPassword: function (e) {
    let that = this;
    let password = e.detail.value;

    that.setData({
      password: password
    });
  },

  /**
   * 输入确认密码
   */
  inputConfirmPassword: function (e) {
    let that = this;
    let confirm_password = e.detail.value;

    that.setData({
      confirm_password: confirm_password
    });
  },

  /**
   * 输入验证码
   */
  inputVerificationCode: function (e) {
    let verification_code = e.detail.value;
    this.setData({
      verification_code: verification_code
    })
  },

  /**
   * 输入邮箱||短信验证码
   */
  inputCode: function (e) {
    let info_code = e.detail.value;
    this.setData({
      info_code: info_code
    })
  },

  /**
   * 切换验证码
   */
  switchVerificationCode: function (e) {
    let that = this;
    app.verificationCode(that);
  },

  /**
   * 发送验证码
   */
  sendCode: function (e) {
    let that = this;
    let use_type = that.data.use_type;
    let info = that.data.info;
    let verification_code = that.data.verification_code
    let sendCodeFlag = that.data.sendCodeFlag;

    if (use_type == 1) {
      use_type = 'mobile';
    } else if (use_type == 2) {
      use_type = 'email';
    }

    if (sendCodeFlag == 1) {
      return false;
    }
    app.clicked(that, 'sendCodeFlag');

    if (info == '') {
      app.showBox(that, message + '不可为空');
      app.restStatus(that, 'saveFlag');
      return false;
    }

    if (use_type == 'mobile') {
      let myreg = /^(((13[0-9]{1})|(14[7]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (info.length != 11 || !myreg.test(info)) {
        app.showBox(that, '请输入正确的手机号');
        app.restStatus(that, 'saveFlag');
        return false;
      }

    } else if (use_type == 'email') {
      let myreg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (!myreg.test(info)) {
        app.showBox(that, '邮箱格式不正确');
        app.restStatus(that, 'saveFlag');
        return false;
      }

    } else {
      app.showBox(that, '非法操作');
      wx.switchTab({
        url: '/pages/index/index',
      })
      return false;
    }

    if (verification_code == '') {
      app.showBox(that, '验证码不可为空');
      app.restStatus(that, 'saveFlag');
      return false;
    }
    
    use_type = use_type == 'email' ? use_type : 'sms';
    
    app.sendRequest({
      url: "api.php?s=login/forgotValidation",
      data: {
        'type': use_type,
        send_param: info,
        key: app.globalData.openid,
        vertification: verification_code
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          if (data.code == 0) {
            let second = 120;
            let timer = setInterval(function () {
              second--;
              that.setData({
                second: second
              })
              if (second == 0) {
                clearInterval(timer);
              }
            }, 1000);
          }
          app.showBox(that, data.message);

          if (data.code == -5 || data.message == '验证码错误') {
            app.verificationCode(that);
          }

          app.restStatus(that, 'sendCodeFlag');
        } else {
          app.restStatus(that, 'sendCodeFlag');
        }
      }
    })
  },

  /**
   * 保存邮箱
   */
  saveEmail: function (e) {
    let that = this;
    let saveFlag = that.data.saveFlag;
    let info = that.data.info;
    let use_type = that.data.use_type;
    let password = that.data.password;
    let confirm_password = that.data.confirm_password;
    let info_code = that.data.info_code;
    let verification_code = that.data.verification_code;

    if (saveFlag == 1) {
      return false;
    }
    app.clicked(that, 'saveFlag');


    if (use_type == 1) {
      use_type = 'mobile';
    } else if (use_type == 2) {
      use_type = 'email';
    }

    if (info == '') {
      app.showBox(that, message + '不可为空');
      app.restStatus(that, 'saveFlag');
      return false;
    }

    if (use_type == 'mobile') {
      let myreg = /^(((13[0-9]{1})|(14[7]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (info.length != 11 || !myreg.test(info)) {
        app.showBox(that, '请输入正确的手机号');
        app.restStatus(that, 'saveFlag');
        return false;
      }

    } else if (use_type == 'email') {
      let myreg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (!myreg.test(info)) {
        app.showBox(that, '邮箱格式不正确');
        app.restStatus(that, 'saveFlag');
        return false;
      }

    } else {
      app.showBox(that, '非法操作');
      wx.switchTab({
        url: '/pages/index/index',
      })
      return false;
    }

    if (verification_code == '') {
      app.showBox(that, '验证码不可为空');
      app.restStatus(that, 'saveFlag');
      return false;
    }

    if (info_code == '') {
      app.showBox(that, '动态验证码不可为空');
      app.restStatus(that, 'saveFlag');
      return false;
    }

    if(password == '') {
      app.showBox(that, '密码不可为空');
      app.restStatus(that, 'saveFlag');
      return false;
    }

    if (confirm_password != password) {
      app.showBox(that, '两次密码不一致');
      app.restStatus(that, 'saveFlag');
      return false;
    }

    that.save(that, use_type, info, password);
  },

  /**
   * 保存
   */
  save: function (that, use_type, info, password) {
    let info_code = that.data.info_code; //手机||邮箱验证码
    let verification_code = that.data.verification_code; //验证码

    app.sendRequest({
      url: "api.php?s=login/setNewPasswordByEmailOrmobile",
      data: {
        'type': use_type,
        userInfo: info,
        password: password,
        key: app.globalData.openid,
        info_code: info_code,
        vertification: verification_code
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data.code >= 0) {
            app.showBox(that, '密码修改成功', 1500);
            setTimeout(function(){
              wx.reLaunch({
                url: '/pagesother/pages/login/login/login',
              })
            },1500);
            return true;
          } else {
            app.verificationCode(that);
            app.showBox(that, data.message);
            app.restStatus(that, 'saveFlag');
            return false;
          }
        }
      }
    });
  }
})