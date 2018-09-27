const app = new getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: '',
    member_info: {
      level_name: '未登录...'
    },
    integralConfig: {}, //积分赠送配置
    isSign: 0, //是否签到
    unpaidOrder: 0, //待支付
    shipmentPendingOrder: 0, //待发货
    goodsNotReceivedOrder: 0, //待收货
    refundOrder: 0, //退款
    is_verification: 0, //是否本店核销员
    is_open_virtual_goods: 0, //是否开启虚拟商品
    is_login: 0,
    mask_status: 0,
    listClickFlag: 0,
    logoutFlag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    that.setData({
      Base: base,
      defaultImg: defaultImg,
    })
  },
    logout: function (e) {
        let that = this;
        let logoutFlag = that.data.logoutFlag;

        if (logoutFlag == 1) {
            return false;
        }
        app.clicked(that, 'logoutFlag');
        app.logout();
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
      app.restStatus(that, 'logoutFlag');
    let tab_parm = app.globalData.tab_parm;
    let tab_type = app.globalData.tab_type;

    if (tab_parm == 'cancle_pay') {
      let url = '/pagesother/pages/order/myorderlist/myorderlist?status=1';
      switch (tab_type) {
        case 2:
          url = '/pagesother/pages/order/myvirtualorderlist/myvirtualorderlist';
          break;
        case 3:
          url = '/pagesother/pages/pintuanorder/myorderlist/myorderlist?status=1';
          break;
        case 4:
          url = '/pagesother/pages/presellorder/mypresellorderlist/mypresellorderlist?status=-1';
          break;
      }

      app.setTabParm('');
      app.setTabType('');

      wx.navigateTo({
        url: url,
      })
    }

    let member_info = that.data.member_info;

    app.restStatus(that, 'listClickFlag');
    //检测登录状态

    let is_login = app.globalData.is_login;
    that.setData({
      is_login: is_login
    })
    if (is_login == 1) {
      that.loadingMemberInfo(that);
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
   * 获取用户信息
   */
  getwechatUserInfo: function (res) {
    let that = this;
    //console.log(res);
    // 获取用户授权
    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      app.showModal({
        content: '你已取消授权，需授权后才能登录！',
      })
      return false;
    } else if (res.detail.errMsg == 'getUserInfo:ok') {
      app.setWxInfo(res.detail.userInfo);
      //参数检测
      let session_key = app.globalData.session_key;
      if (session_key == '' || session_key == undefined) {
        app.showBox(that, '登录失败 !');
        return false;
      }
      app.wechatLogin();
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(res)
      }

      //检测是否开启强制会员绑定
      let is_first_bind = app.globalData.is_first_bind;
      if (is_first_bind == 1) {
        wx.reLaunch({
          url: '/pagesother/pages/login/login/login',
        })
        return;
      }
      //检测是否登录/注册成功
      let is_login = app.globalData.is_login;
      
      if (is_login == 1) {
        that.setData({
          is_login: is_login
        })
        that.loadingMemberInfo(that);
        app.isNotLogin(1);
      } else {
        let times = 0;
        setTimeout(function () {
          let load_timer = setInterval(function () {
            times++;
            //检测是否开启强制会员绑定
            let is_first_bind = app.globalData.is_first_bind;
            if (is_first_bind == 1) {
              wx.reLaunch({
                url: '/pagesother/pages/login/login/login',
              })
              clearInterval(load_timer);
              return;
            }
            //检测是否登录/注册成功
            is_login = app.globalData.is_login;
            
            if (is_login == 1) {
              //登录成功调用是否是之前从其页面跳转过来
              if (!app.isNotLogin(1)){
                that.loadingMemberInfo(that);
                app.showBox(that, '登陆成功');

                that.setData({
                  is_login: 1,
                  mask_status: 0
                })
                clearInterval(load_timer);
                return;
              }
             
            } else if (times == 30) {
              wx.showModal({
                title: '提示',
                content: '登录超时...',
                showCancel: false,
                success: function (res) {
                  wx.reLaunch({
                    url: '/pagesother/pages/login/login/login',
                  })
                }
              })
              clearInterval(load_timer);
            }
          }, 500);
        }, 500);
      }
    } else {
      app.showModal({
        content: '授权失败!',
        url: '/pages/index/index'
      })
    }
  },

  /**
   * 加载会员信息
   */
  loadingMemberInfo: function (that) {
    //会员详情
    app.sendRequest({
      url: 'api.php?s=member/getMemberDetail',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let member_info = data;
          let img = member_info.user_info.user_headimg;
          member_info.user_info.user_headimg = app.IMG(img); //图片路径处理

          that.setData({
            member_info: res.data,
          })
        }
        console.log(res)
      }
    })
    //订单信息&会员中心配置信息
    app.sendRequest({
      url: 'api.php?s=member/index',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {

          if (data.promoter_info != undefined) {
            that.setData({
              promoter_info: data.promoter_info
            })
          }
          
          that.setData({
            unpaidOrder: data.unpaidOrder,
            shipmentPendingOrder: data.shipmentPendingOrder,
            goodsNotReceivedOrder: data.goodsNotReceivedOrder,
            refundOrder: data.refundOrder,
            integralConfig: data.integralConfig,
            isSign: data.isSign,
            is_verification: data.is_verification,
            is_open_virtual_goods: data.is_open_virtual_goods,
            is_support_pintuan: data.is_support_pintuan,
            is_support_bargain: data.is_support_bargain,
          })
        }
        console.log(res)
      }
    })
  },

  /**
   * 头像加载失败
   */
  errorHeadImg: function (e) {
    let that = this;
    let member_info = that.data.member_info;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let img = member_info.user_info.user_headimg;
    let parm = {};
    let parm_key = "member_info.user_info.user_headimg";

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 签到
   */
  signIn: function (e) {
    let that = this;

    app.sendRequest({
      url: 'api.php?s=member/signIn',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {

          if (data == 0) {
            app.showBox(that, '签到失败');
          } else if (data == 1) {
            app.showBox(that, '签到成功');

            that.setData({
              isSign: 1
            })
            that.loadingMemberInfo(that);
          }
        }
        console.log(res);
      }
    })
  },

  /**
   * 页面跳转
   */
  listClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;

    if (listClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: url
    });
  },
})