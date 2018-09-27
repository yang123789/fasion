const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    register_type: 1, //注册方式
    copyRight: {},
    username: '', //用户名
    password: '', //密码
    confirm_password: '', //确认密码
    code: '', //验证码图
    verify_code: '', //验证码
    mobile: '', //手机号
    out_code: '', //动态验证码
    second: 0, //计时
    code_config: {
      value: {}
    }, //验证码配置
    login_config: {}, //登录配置
    reg_config: {}, //注册配置
    //轮播图属性
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    swiperHeight: 150,
    homeIndexFLag: 0,
    registerFlag: 0,
    loginFlag: 0,
    getOutCodeFlag: 0,
    is_first_bind: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let copyRight = app.globalData.copyRight;
    let is_first_bind = app.globalData.is_first_bind;

    that.setData({
      copyRight: copyRight,
      is_first_bind: is_first_bind
    })
    //加载广告位
    that.loadAdv();
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
    app.restStatus(that, 'homeIndexFLag');
    app.restStatus(that, 'registerFlag');
    app.restStatus(that, 'loginFlag');
    app.restStatus(that, 'getOutCodeFlag');

    app.sendRequest({
      url: 'api.php?s=login/registerInfo',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let code_config = data.code_config;
          let login_config = data.login_config;
          if (code_config.value.pc == 1) {
            app.verificationCode(that);
          }

          that.setData({
            code_config: code_config,
            login_config: login_config
          })
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
   * 加载广告位
   */
  loadAdv: function (e) {
    let that = this;
    app.sendRequest({
      url: 'api.php?s=login/getAdv',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          //广告轮播初始化
          if (data.adv_list != undefined && data.adv_list.adv_list != undefined) {
            let adv_index = data.adv_list;
            let adv_list = adv_index.adv_list;
            let length = -1;
            let indicatorDots = true;

            if (adv_list.length != undefined) {
              length = adv_list.length - 1;
            }
            if (adv_index.is_use != 0 && length > -1) {
              let new_adv_list = [];
              if (adv_index.ap_display == 1) {
                //多条广告，随机展示一条
                let index = Math.round(Math.random() * length);
                new_adv_list[0] = adv_list[index];
                adv_list = new_adv_list;
              } else if (adv_index.ap_display == 2) {
                //展示末尾一条
                new_adv_list[0] = adv_list[length];
                adv_list = new_adv_list;
              }
              for (let index in adv_list) {
                let img = adv_list[index].adv_image;
                adv_list[index].adv_image = app.IMG(img);
              }
            } else {
              adv_list = [];
            }

            if (adv_list.length == 1) {
              indicatorDots = false;
            }
            console.log(data)
            that.setData({
              imgUrls: adv_list,
              indicatorDots: indicatorDots,
            })
          } else {
            that.setData({
              imgUrls: [],
            })
          }
        }
      }
    })
  },

  /**
   * 输入账号
   */
  inputUsername: function (e) {
    let that = this;
    let username = e.detail.value;

    that.setData({
      username: username
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
    })
  },

  /**
   * 输入确认密码
   */
  inputConfirmPassword: function (e) {
    let that = this;
    let confirm_password = e.detail.value;

    that.setData({
      confirm_password: confirm_password
    })
  },

  /**
   * 输入验证码
   */
  inputVerify: function (e) {
    let that = this;
    let verify_code = e.detail.value;

    that.setData({
      verify_code: verify_code
    })
  },

  /**
   * 输入手机号
   */
  inputMobile: function (e) {
    let that = this;
    let mobile = e.detail.value;

    that.setData({
      mobile: mobile
    })
  },

  /**
   * 输入动态验证码
   */
  inputOutCode: function (e) {
    let that = this;
    let out_code = e.detail.value;

    that.setData({
      out_code: out_code
    })
  },

  /**
   * 选择注册方式
   */
  registerType: function (e) {
    let that = this;
    let register_type = e.currentTarget.dataset.type;

    that.setData({
      register_type: register_type
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
   * 首页
   */
  homeIndex: function (e) {
    let that = this;
    let homeIndexFLag = that.data.homeIndexFLag;
    if (homeIndexFLag == 1) {
      return false;
    }
    app.clicked(that, 'homeIndexFLag');
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 立即登录
   */
  login: function (e) {
    let that = this;
    let loginFlag = that.data.loginFlag;
    if (loginFlag == 1) {
      return false;
    }
    app.clicked(that, 'loginFlag');
    wx.reLaunch({
      url: '/pagesother/pages/login/login/login',
    })
  },

  /**
   * 获取动态码
   */
  getOutCode: function (e) {
    let that = this;

    let mobile = that.data.mobile;
    let verify_code = that.data.verify_code;
    let key = app.globalData.key;
    let getOutCodeFlag = that.data.getOutCodeFlag;

    if (getOutCodeFlag == 1) {
      return false;
    }
    app.clicked(that, 'getOutCodeFlag');

    if (mobile == '') {
      app.showBox(that, '手机号不可为空');
      app.restStatus(that, 'getOutCodeFlag');
      return false;
    }

    let myreg = /^(((13[0-9]{1})|(14[7]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile.length != 11 || !myreg.test(mobile)) {
      app.showBox(that, '请输入正确的手机号');
      app.restStatus(that, 'getOutCodeFlag');
      return false;
    }

    if (verify_code == '') {
      app.showBox(that, '手机号不可为空');
      app.restStatus(that, 'getOutCodeFlag');
      return false;
    }

    app.sendRequest({
      url: "api.php?s=login/sendSmsRegisterCode",
      data: {
        mobile: mobile,
        key: app.globalData.openid,
        vertification: verify_code
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

          if (data.code < 0) {
            app.verificationCode(that);
          }

          app.restStatus(that, 'getOutCodeFlag');
        } else {
          app.restStatus(that, 'getOutCodeFlag');
        }
      }
    });
  },

  /**
   * 账号注册
   */
  register: function (e) {
    let that = this;
    let username = that.data.username;
    let password = that.data.password;
    let confirm_password = that.data.confirm_password;
    let verify_code = that.data.verify_code;
    let mobile = that.data.mobile;
    let out_code = that.data.out_code;
    let code_config = that.data.code_config;
    let login_config = that.data.login_config;
    let register_type = that.data.register_type;
    let registerFlag = that.data.registerFlag;
    let is_first_bind = that.data.is_first_bind;
    let bind_message_info = '';

    if (is_first_bind == 1) {
      bind_message_info = app.globalData.bind_message_info;
    }

    if (registerFlag == 1) {
      return false;
    }
    app.clicked(that, 'registerFlag');

    if (register_type == 1) {
      if (username == '') {
        app.showBox(that, '用户名不可为空');
        app.restStatus(that, 'registerFlag');
        return false;
      }

      if (password == '') {
        app.showBox(that, '密码不可为空');
        app.restStatus(that, 'registerFlag');
        return false;
      }

      if (password != confirm_password) {
        app.showBox(that, '两次密码输入不一致');
        app.restStatus(that, 'registerFlag');
        return false;
      }

      if (code_config.value != undefined) {
        if (code_config.value.pc == 1) {
          if (verify_code == '') {
            app.showBox(that, '验证码不可为空');
            app.restStatus(that, 'registerFlag');
            return false;
          }
        }
      }
    }

    if (register_type == 2) {
      if (mobile == '') {
        app.showBox(that, '手机号不可为空');
        app.restStatus(that, 'registerFlag');
        return false;
      }

      if (code_config.value != undefined) {
        if (code_config.value.pc == 1) {
          if (verify_code == '') {
            app.showBox(that, '验证码不可为空');
            app.restStatus(that, 'registerFlag');
            return false;
          }
        }
      }

      if (login_config.mobile_config.is_use == 1) {
        if (out_code == '') {
          app.showBox(that, '动态码不可为空');
          app.restStatus(that, 'registerFlag');
          return false;
        }
      }

      if (password == '') {
        app.showBox(that, '密码不可为空');
        app.restStatus(that, 'registerFlag');
        return false;
      }

      if (password != confirm_password) {
        app.showBox(that, '两次密码输入不一致');
        app.restStatus(that, 'registerFlag');
        return false;
      }
    }



    app.sendRequest({
      url: 'api.php?s=login/appletRegister',
      data: {
        key: app.globalData.openid,
        username: username,
        password: password,
        verify: verify_code,
        mobile: mobile,
        sms_captcha: out_code,
        is_first_bind: is_first_bind,
        bind_message_info: bind_message_info
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        let message = res.message;
        console.log(res);
        if (code == 0) {
          app.restStatus(that, 'registerFlag');
          app.globalData.is_login = 1;
          app.globalData.is_logout = 0;
          app.globalData.token = data.token;
          app.globalData.is_first_bind = 0;
          app.globalData.bind_message_info = '';
          if (!app.isNotLogin(1)){
            wx.switchTab({
              url: '/pages/member/member/member',
            })
          }
          
        } else {
          if (message == '验证码错误') {
            app.verificationCode(that);
          }
          app.showBox(that, message);
          app.restStatus(that, 'registerFlag');
        }
      }
    })

  }
})