App({

  /**
   * 全局变量
   */
  globalData: {
      siteBaseUrl: "http://dzshop.bjcaicheng.com/", //服务器url
    secondDirectory: '', //如网站域名后存在二级目录，填写二级目录  例：'域名/applet/'
    copyRight: {
      is_load: 1, //是否加载版权信息 (请求失败后加载此配置)
      default_logo: '/images/index/logo_copy.png', //版权LOGO图 (请求失败后加载此配置)
      technical_support: '山西牛酷信息科技有限公司　提供技术支持', //版权技术支持 (请求失败后加载此配置)
    },
    title: 'DZshop', //title (请求失败后使用的title, 请求成功则使用后台配置title)
    wx_info: '{}', //用户信息 (无需填写)
    session_key: '', //小程序参数 (无需填写)
    openid: '', //小程序用户唯一标识 (无需填写)
    token: '', //用户标识 (无需填写)
    sourceid: '', //推广ID (无需填写)
    is_login: 0, //是否登录 (无需填写)
    is_logout: 0, //是否退出登录 (无需填写)
    is_first_bind: 0, //是否第一次绑定会员 (无需填写)
    defaultImg: {
      is_use: 0
    }, //是否使用默认图 (无需填写)
    webSiteInfo: {}, //基础配置 (无需填写)
    tab_parm: '', //订单返回参数 (无需填写)
    tab_type: '', //订单返回类型 (无需填写)
    login_count: 0, //登录次数 (无需填写)
    is_login_request: 0, //是否正在进行登录/注册请求 (无需填写)
    is_yet_login: 0, //是否已经登录
    current_address: '', //保存当前地址
    goods_name:'',
    goods_id:''
  },

  //app初始化函数
  onLaunch: function () {
    let that = this;
    that.app_login();
    that.defaultImg();
    that.webSiteInfo();
    that.copyRightIsLoad();
    //获取屏幕宽高
    let mobile_width = 0;
    let mobile_height = 0;
    wx.getSystemInfo({
      success: function (res) {
        mobile_width = res.screenWidth;
      },
    })
    that.globalData.mobile_width = mobile_width;
  },

  onShow: function () {

  },

  //app登录
  app_login: function () {
    let that = this;

    //退出检测
    let is_logout = that.globalData.is_logout;
    if (is_logout == 1) {
      that.wechatLogin();
      return;
    }
    wx.login({
      success: function (res) {
        that.sendRequest({
          url: "api.php?s=Login/getWechatInfo",
          data: {
            code: res.code
          },
          success: function (wechat_res) {
            let code = wechat_res.code;
            //console.log(wechat_res)
            if (code == 0) {
              let wx_info = JSON.parse(wechat_res.data);
              if (wx_info.openid == '' || wx_info.openid == undefined || wx_info.openid == null) {
                that.showModal({
                  content: '小程序配置错误: ' + res.errMsg, //错误信息: res.errMsg
                })
              }
              that.setSessionKey(wx_info.session_key);
              that.setOpenid(wx_info.openid);
              if (wx_info.unionid != undefined && wx_info.unionid != '') {
                that.setUnionId(wx_info.unionid);
              }
              that.getUserSetting(that);
            }
          }
        });
      }
    });
  },

  /**
   * 是否授权
   */
  getUserSetting: function (that) {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (user_info) {
              if (user_info.userInfo) {
                that.setWxInfo(user_info.userInfo);
                that.wechatLogin();
              }
            }
          })
        }
      }  
    });
  },

  wechatLogin: function () {
    let that = this;
    let openid = that.globalData.openid;
    let wx_info = that.globalData.wx_info;
    let sourceid = that.globalData.sourceid;
    //防止重复请求登录/注册
    let is_login_request = that.globalData.is_login_request;
    if (is_login_request == 1) {
      return false;
    }
    console.log(sourceid)
    that.setLoginRequest(1);
    that.sendRequest({
      url: "api.php?s=login/wechatLogin",
      data: {
        openid: openid,
        wx_info: wx_info,
        sourceid: sourceid
      },
      success: function (res) {
        let code = res.code;
        //console.log(res);
        if (code == 0 || code == 10) {

          //登录/注册成功
          that.setToken(res.data.token);
          that.globalData.is_logout = 0;
          that.isNotLogin(1);
        } else if (code == 20) {

          //微信非自动注册,进行强制会员绑定
          that.globalData.is_first_bind = 1;
          //获取绑定信息
          let info = JSON.parse(wx_info);
          //替换用户头像object_name, 昵称object_name
          info.headimgurl = info.avatarUrl;
          info.nickname = info.nickName;
          delete info.avatarUrl;
          delete info.nickName;
          wx_info = JSON.stringify(info);

          let bind_message_info = {
            is_bind: 1,
            info: wx_info,
            openid: openid,
          };
          if (info.unionid != undefined) {
            bind_message_info.wx_unionid = info.unionid;
          }
          that.globalData.bind_message_info = JSON.stringify(bind_message_info);
        }
      }
    });
  },

  /**
   * 封装请求函数
   */
  sendRequest: function (param, customSiteUrl) {
    let that = this;
    let data = param.data || {};
    let header = param.header;
    let requestUrl;
    data.token = that.globalData.token;

    if (param.method == '' || param.method == undefined) {
      param.method = 'POST';
    }
    if (customSiteUrl) {
      requestUrl = customSiteUrl + param.url;
    } else {
      requestUrl = this.globalData.siteBaseUrl + param.url;
    }

    if (param.method) {
      if (param.method.toLowerCase() == 'post') {
        header = header || {
          'content-type': 'application/x-www-form-urlencoded;'
        }
      } else {
        data = this._modifyPostParam(data);
      }
      param.method = param.method.toUpperCase();
    }

    if (!param.hideLoading) {
      this.showToast({
        title: 'Loading...',
        icon: 'loading',
        duration: 20000,
      });
    }

    wx.request({
      url: requestUrl,
      data: data,
      method: param.method || 'GET',
      header: header || {
        'content-type': 'application/json'
      },
      success: function (res) {
        //请求失败
        if (res.statusCode && res.statusCode != 200) {
          that.hideToast();
          that.showModal({
            content: '请求失败: ' + res.statusCode,
            url: '/pages/index/index'
          })
          typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal(res.data);
          return;
        }
        typeof param.success == 'function' && param.success(res.data);
        let code = res.data.code;
        let message = res.data.message;
        if (code == -9999) {
          //未登录执行isNotLogin(code);
          that.isNotLogin(code);
          //未登录
          wx.showModal({
            title: '提示',
            content: '未登录 !',
            showCancel: false,
            success: function (res) {
              wx.reLaunch({
                url: '/pages/member/member/member',
              })
            }
          });

        } else if (code == -50) {
          //参数错误|数据异常
          that.showModal({
            content: message,
            url: '/pages/index/index'
          })
        } else if (code == -20) {
          //越权行为
          wx.switchTab({
            url: '/pages/member/member/member',
          })
        } else if (code == -10) {
          //数据异常
          that.showModal({
            content: message,
            code: -10,
          })
        }
        //console.log(res);
      },
      fail: function (res) {
        that.hideToast();
        typeof param.fail == 'function' && param.fail(res.data);
        that.showModal({
          content: '请求失败: ', //错误信息: res.errMsg
          url: '/pages/index/index'
        })
      },
      complete: function (res) {
        param.hideLoading || that.hideToast();
        typeof param.complete == 'function' && param.complete(res.data);
      }
    });
  },
  //微信提示 函数
  showToast: function (param) {
    wx.showToast({
      title: param.title,
      icon: param.icon,
      duration: param.duration || 1500,
      mask: true,
      success: function (res) {
        typeof param.success == 'function' && param.success(res);
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  //隐藏加载提示
  hideToast: function () {
    wx.hideToast();
  },
  //模态框提示
  showModal: function (param) {
    let that = this;
    wx.showModal({
      title: param.title || '提示',
      content: param.content,
      showCancel: param.showCancel || false,
      cancelText: param.cancelText || '取消',
      cancelColor: param.cancelColor || '#000000',
      confirmText: param.confirmText || '确定',
      confirmColor: param.confirmColor || '#3CC51F',
      success: function (res) {
        if (res.confirm) {
          typeof param.confirm == 'function' && param.confirm(res);
          let pages = getCurrentPages();
          if (param.url != '' && param.url != undefined) {
            wx.switchTab({
              url: param.url,
            })
          } else if (param.code == -10) {
            wx.navigateBack({
              delta: 1
            })
          }

        } else {
          typeof param.cancel == 'function' && param.cancel(res);
        }
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },

  _modifyPostParam: function (obj) {
    let query = '';
    let name, value, fullSubName, subName, subValue, innerObj, i;

    for (name in obj) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this._modifyPostParam(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this._modifyPostParam(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null) {
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  },

  getSiteBaseUrl: function () {
    return this.globalData.siteBaseUrl;
  },

  setSessionKey: function (session_key) {
    this.globalData.session_key = session_key;
  },

  setOpenid: function (openid) {
    this.globalData.openid = openid;
  },

  setUnionId: function (unionid) {
    let wx_info = JSON.parse(this.globalData.wx_info);
    wx_info.unionid = unionid;
    this.globalData.wx_info = JSON.stringify(wx_info);
  },

  setWxInfo: function (wx_info) {
    let default_wx_info = JSON.parse(this.globalData.wx_info);
    if (default_wx_info.unionid != undefined) {
      wx_info.unionid = default_wx_info.unionid;
    }
    this.globalData.wx_info = JSON.stringify(wx_info);
  },

  setToken: function (token) {
    this.globalData.token = token;
    if (token != '' && token != undefined) {
      this.globalData.is_login = 1;
    }
  },

  setTabParm: function (tab_parm) {
    this.globalData.tab_parm = tab_parm;
  },

  setTabType: function (tab_type) {
    this.globalData.tab_type = tab_type;
  },

  setCopyRight: function (copyRight) {
    this.globalData.copyRight = copyRight;
  },

  setLoginRequest: function (is_login_request) {
    this.globalData.is_login_request = is_login_request;
  },
  
  setSourceId: function (sourceid) {
    this.globalData.sourceid = sourceid;
  },

  /**
   * 界面弹框
   */
  showBox: function (that, content, time = 1500) {
    setTimeout(function callBack() {
      that.setData({
        prompt: content
      });
    }, 200)
    setTimeout(function callBack() {
      that.setData({
        prompt: ''
      });
    }, time + 200)
  },

  /**
   * 商品、用户头像默认图
   */
  defaultImg: function () {
    let that = this;

    that.sendRequest({
      url: "api.php?s=goods/getDefaultImages",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          that.globalData.defaultImg = data;
          that.globalData.defaultImg.value.default_goods_img = that.IMG(that.globalData.defaultImg.value.default_goods_img); //默认商品图处理
          that.globalData.defaultImg.value.default_headimg = that.IMG(that.globalData.defaultImg.value.default_headimg); //默认用户头像处理
        }
        //console.log(res);
      }
    });
  },

  /**
   * 基础配置
   */
  webSiteInfo: function () {
    let that = this;

    that.sendRequest({
      url: "api.php?s=login/getWebSiteInfo",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          that.globalData.webSiteInfo = data;
          if (data.title != '' && data.title != undefined) {
            that.globalData.title = data.title;
            wx.setNavigationBarTitle({
              title: data.title,
            })
          }
        }
        //console.log(res);
      }
    })
  },

  /**
   * 图片路径处理
   */
  IMG: function (img) {
    let base = this.globalData.siteBaseUrl;
    let directory = this.globalData.secondDirectory;
    img = img == undefined ? '' : img;
    img = img == 0 ? '' : img;
    if (img.indexOf('http://') == -1 && img.indexOf('https://') == -1 && img != '') {
      img = img.substring(0, 7) != '/upload' && directory != '' && img.indexOf(directory) == 0 ? img.replace(directory, '') : img;
      img = base + img;
    }
    return img;
  },

  /**
   * 根据图片高度获取轮播区块高度
   */
  setSwiperHeight: function (that, img_url) {
    let mobile_width = this.globalData.mobile_width;
    
    if (mobile_width > 0 && mobile_width != undefined) {
      wx.getImageInfo({
        src: img_url,
        success: function (res) {
          if (res.width > 0 && res.width != undefined) {

            let img_width = res.width;
            let img_height = res.height;
            let rate = mobile_width /res.width;
            let height = img_height * rate;

            that.setData({
              swiperHeight: height
            })
          } else {
            console.log('图片信息获取失败.')
          }
        },
        fail: function (e) {
          console.log('图片信息获取失败: ' + e);
        }
      })
    } else {
      console.log('屏幕宽度获取失败.')
    }
  },

  /**
   * 底部加载
   */
  copyRightIsLoad: function (e) {
    let that = this;

    that.sendRequest({
      url: "api.php?s=task/copyRightIsLoad",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let copyRight = data;
          copyRight.technical_support = '山西牛酷信息科技有限公司　提供技术支持';
          copyRight.default_logo = '/images/index/logo_copy.png';

          if (copyRight.is_load == 0) {
            let img = copyRight.bottom_info.copyright_logo;
            copyRight.default_logo = that.IMG(img);
            copyRight.technical_support = copyRight.bottom_info.copyright_companyname;
          }

          that.setCopyRight(copyRight);
        }
        //console.log(res);
      }
    })
  },

  /**
   * 已点击
   */
  clicked: function (that, parm) {
    let d = {};
    d[parm] = 1;
    that.setData(d);
  },

  /**
   * 状态重置
   */
  restStatus: function (that, parm) {
    let d = {};
    d[parm] = 0;
    that.setData(d);
  },

  /**
   * 获取验证码
   */
  verificationCode: function (that) {
    let key = this.globalData.openid;
    this.sendRequest({
      url: 'api.php?s=index/getVertification',
      data: {
        key: key
      },
      success: function (res) {
        that.setData({
          code: ' data:image/png;base64,' + res
        })
      }
    });
  },

  /**
   * 退出登录
   */
  logout: function (e) {
    let that = this;
    that.globalData.is_logout = 1;
    that.globalData.is_login = 0;
    that.globalData.token = '';
    that.setLoginRequest(0);
    that.globalData.current_address = '';
    that.globalData.is_yet_login = 0;
    wx.reLaunch({
        url: '/pages/member/member/member',
    })
  },

  isNotLogin: function (code) {
    var util = require("/utils/util.js");
    let that = this;

    if (code == 1) {
    
      let current_address = that.globalData.current_address;
      
      if (current_address == '' || that.globalData.is_yet_login == 1){
        return false;
      }
      that.globalData.is_yet_login = 1;
      if (current_address == '/pages/goods/cart/cart' || current_address == '/pages/member/member/member') {
        wx.switchTab({
          url: current_address
        })
      } else {
        wx.navigateTo({
          url: current_address,
        })
      }
    }
    if (code == '-9999') {
      //获取当前页
      let url_param = util.getCurrentPageUrlWithArgs();
      that.globalData.current_address = '/' + url_param;
      that.globalData.is_yet_login = 0;
    }
  }
})