const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    user_info: {},
    email: '',
    new_email: '',
    code: '', //验证码
    email_code: '', //邮箱验证码
    verification_code: '', //输入验证码
    notice_code: '', //输入邮箱验证码
    second: 0, //计时
    noticeEmail: 0, //邮箱通知是否开启
    codeEmail: 0,//验证码是否开启
    saveEmailFlag: 0,
    sendCodeFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;

    that.setData({
      Base: base,
    })
    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          that.setData({
            user_info: data.user_info,
            email: data.user_info.user_email,
            new_email: data.user_info.user_email,
          })
        }
      }
    })
    that.getNoticeConfig(that);
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
   * 通知开启检测
   */
  getNoticeConfig: function (that) {
    app.sendRequest({
      url: "api.php?s=member/getNoticeConfig",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          that.setData({
            noticeEmail: data.noticeEmail,
          })
        }
      }
    })
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
          let codeEmail = data.value.pc;
          if (codeEmail == 1) {
            app.verificationCode(that);
          }
          that.setData({
            codeEmail: data.value.pc,
          })
        }
      }
    })
  },

  /**
   * 
   */

  /**
   * 输入邮箱
   */
  inputEmail: function (e) {
    let that = this;
    let email = e.detail.value;

    that.setData({
      new_email: email
    })
  },

  /**
   * 输入验证码
   */
  verification_code: function (e) {
    let verification_code = e.detail.value;
    this.setData({
      verification_code: verification_code
    })
  },

  /**
   * 输入邮箱验证码
   */
  notice_code: function (e) {
    let notice_code = e.detail.value;
    this.setData({
      notice_code: notice_code
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
    let email = that.data.email;
    let new_email = that.data.new_email;
    let verification_code = that.data.verification_code
    let sendCodeFlag = that.data.sendCodeFlag;

    if (sendCodeFlag == 1) {
      return false;
    }
    app.clicked(that, 'sendCodeFlag');

    if (email != '') {
      email = new_email == email ? email : new_email;
    } else {
      email = new_email;
    }

    if (email == '') {
      app.showBox(that, '邮箱不可为空');
      app.restStatus(that, 'sendCodeFlag');
      return false;
    }

    let myreg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (!myreg.test(email)) {
      app.showBox(that, '邮箱格式不正确');
      app.restStatus(that, 'sendCodeFlag');
      return false;
    }

    app.sendRequest({
      url: "api.php?s=member/sendBindCode",
      data: {
        email: email,
        'type': 'email',
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

          if (data.code == -5) {
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
    let saveEmailFlag = that.data.saveEmailFlag;
    let email = that.data.email;
    let new_email = that.data.new_email;
    let codeEmail = that.data.codeEmail;
    let noticeEmail = that.data.noticeEmail;
    let code = that.data.code; //验证码
    let email_code = that.data.email_code; //邮箱验证码
    let verification_code = that.data.verification_code; //输入验证码
    let notice_code = that.data.notice_code; //输入邮箱验证码


    if (saveEmailFlag == 1) {
      return false;
    }
    app.clicked(that, 'saveEmailFlag');

    if (new_email == '') {
      app.showBox(that, '邮箱不可为空');
      app.restStatus(that, 'saveEmailFlag');
      return false;
    }

    let myreg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (!myreg.test(new_email)) {
      app.showBox(that, '邮箱格式不正确');
      app.restStatus(that, 'saveEmailFlag');
      return false;
    }

    if (new_email == email) {
      app.showBox(that, '与原邮箱一致，无需修改');
      app.restStatus(that, 'saveEmailFlag');
      return false;
    }

    if (noticeEmail == 1) {
      app.sendRequest({
        url: "api.php?s=member/checkDynamicCode",
        data: {
          key: app.globalData.openid,
          vertification: notice_code
        },
        success: function (res) {
          let code = res.code;
          let data = res.data;

          if (code == 0) {
            if (data.code == 0) {
              that.checkEmail(that, email, new_email);
            } else {
              app.verificationCode(that);
              app.showBox(that, data.message);
              app.restStatus(that, 'saveEmailFlag');
              return false;
            }
          }
        }
      });
    } else {
      that.checkEmail(that, email, new_email);
    }
  },

  /**
   * 验证邮箱
   */
  checkEmail: function (that, email, new_email) {

    //验证邮箱
    app.sendRequest({
      url: "api.php?s=login/email",
      data: {
        email: new_email
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data == true) {
            app.showBox(that, '该邮箱已存在');
            app.restStatus(that, 'saveEmailFlag');
            return false;
          } else {
            that.save(that, new_email);
          }
        }
      }
    });
  },

  /**
   * 保存
   */
  save: function (that, email) {
    let verification_code = that.data.verification_code; //验证码
    app.sendRequest({
      url: "api.php?s=member/modifyemail",
      data: {
        email: email,
        code: verification_code,
        key: app.globalData.openid
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            wx.navigateBack({
              delta: 1
            })
          } else if (data == -5) {
            app.showBox(that, '验证码错误');
            app.verificationCode(that);
            app.restStatus(that, 'saveEmailFlag');
            return false;
          } else {
            app.showBox(that, '操作失败');
            app.restStatus(that, 'saveEmailFlag');
            return false;
          }
        }
      }
    });
  }
})