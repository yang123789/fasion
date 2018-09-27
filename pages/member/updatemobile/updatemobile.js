const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    user_info: {},
    mobile: '',
    new_mobile: '',
    code: [], //验证码
    mobile_code: '', //短信验证码
    verification_code: '', //输入验证码
    notice_code: '', //输入短信验证码
    second: 0, //计时
    noticeMobile: 0, //短信通知是否开启
    codeMobile: 0,//验证码是否开启
    saveMobileFlag: 0,
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
            mobile: data.user_info.user_tel,
            new_mobile: data.user_info.user_tel,
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
            noticeMobile: data.noticeMobile,
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
          let codeMobile = data.value.pc;
          if (codeMobile == 1) {
            app.verificationCode(that);
          }
          that.setData({
            codeMobile: data.value.pc,
          })
        }
      }
    })
  },

  /**
   * 
   */

  /**
   * 输入手机号
   */
  inputMobile: function (e) {
    let that = this;
    let mobile = e.detail.value;

    that.setData({
      new_mobile: mobile
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
   * 输入短信验证码
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
    let mobile = that.data.mobile;
    let new_mobile = that.data.new_mobile;
    let verification_code = that.data.verification_code;
    let key = app.globalData.key;
    let sendCodeFlag = that.data.sendCodeFlag;

    if (sendCodeFlag == 1) {
      return false;
    }
    app.clicked(that, 'sendCodeFlag');

    if (mobile != '') {
      mobile = new_mobile == mobile ? mobile : new_mobile;
    } else {
      mobile = new_mobile;
    }

    if (mobile == '') {
      app.showBox(that, '手机号不可为空');
      app.restStatus(that, 'sendCodeFlag');
      return false;
    }
    
    let myreg = /^(((13[0-9]{1})|(14[7]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile.length != 11 || !myreg.test(mobile)) {
      app.showBox(that, '请输入正确的手机号');
      app.restStatus(that, 'sendCodeFlag');
      return false;
    }

    app.sendRequest({
      url: "api.php?s=member/sendBindCode",
      data: {
        mobile: mobile,
        'type': 'mobile',
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
            }, 1000)
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
   * 保存手机号
   */
  saveMobile: function (e) {
    let that = this;
    let saveMobileFlag = that.data.saveMobileFlag;
    let mobile = that.data.mobile;
    let new_mobile = that.data.new_mobile;
    let codeMobile = that.data.codeMobile;
    let noticeMobile = that.data.noticeMobile;
    let code = that.data.code; //验证码
    let mobile_code = that.data.mobile_code; //短信验证码
    let verification_code = that.data.verification_code; //输入验证码
    let notice_code = that.data.notice_code; //输入短信验证码


    if (saveMobileFlag == 1) {
      return false;
    }
    app.clicked(that, 'saveMobileFlag');

    if (new_mobile == '') {
      app.showBox(that, '手机号不可为空');
      app.restStatus(that, 'saveMobileFlag');
      return false;
    }

    let myreg = /^(((13[0-9]{1})|(14[7]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (new_mobile.length != 11 || !myreg.test(new_mobile)) {
      app.showBox(that, '请输入正确的手机号');
      app.restStatus(that, 'saveMobileFlag');
      return false;
    }

    if (new_mobile == mobile) {
      app.showBox(that, '与原手机号一致，无需修改');
      app.restStatus(that, 'saveMobileFlag');
      return false;
    }

    if (noticeMobile == 1) {
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
              that.checkMobile(that, mobile, new_mobile);
            } else {
              app.verificationCode(that);
              app.showBox(that, data.message);
              app.restStatus(that, 'saveMobileFlag');
              return false;
            }
          }
        }
      });
    } else {
      that.checkMobile(that, mobile, new_mobile);
    }
  },

  /**
   * 验证手机号
   */
  checkMobile: function (that, mobile, new_mobile) {

    //验证手机号
    app.sendRequest({
      url: "api.php?s=login/mobile",
      data: {
        mobile: new_mobile
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data == true) {
            app.showBox(that, '该手机号已存在');
            app.restStatus(that, 'saveMobileFlag');
            return false;
          } else {
            that.save(that, new_mobile);
          }
        }
      }
    });
  },

  /**
   * 保存
   */
  save: function (that, mobile) {
    let verification_code = that.data.verification_code;
    app.sendRequest({
      url: "api.php?s=member/modifymobile",
      data: {
        mobile: mobile,
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
            app.restStatus(that, 'saveMobileFlag');
            return false;
          } else {
            app.showBox(that, '操作失败');
            app.restStatus(that, 'saveMobileFlag');
            return false;
          }
        }
      }
    });
  }
})