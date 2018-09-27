const app = getApp()

Page({
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    clist: ['男装', '女装', '国际定制', '衬衫', '西装','中装','裙子','礼服','饰品'],
      bgcolor: ['e6f1ea', 'f5ebed', 'efe1f1', 'e5dbdd', 'dae0cc', 'd7e0ea', 'dde1e5', 'dedce3','f1dbdb'],
    index_notice: {}, //公告
    goods_platform_list: {}, //标签板块
    block_list: {}, //楼层板块
    coupon_list: {}, //优惠券
    discount_list: {}, //限时折扣
    current_time: 0, //当前时间
    timer_array: {}, //限时折扣计时
    search_text: '', //搜索内容
    userInfo: {},
    imageList: {},
    hasUserInfo: false,
    webSiteInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
    copyRight: {
      is_load: 1,
      default_logo: '', //LOGO图
      technical_support: '',  //技术支持
    },
    timer_ch: [], //计时器 句柄
    listClickFlag: 0,
    noticeContentFlag: 0,
    is_login: 0,
    imgUrlss: [],
    indicatorDotss: true,
    autoplays: true,
    intervals: 5000,
    durations: 1000,
    vsrc:''
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function (options) {
    let that = this;
    if (options.scene) {
      let scene = options.scene;

      if (scene.substring(0, 8) == 'sourceid') {
        let sourceid = scene.substring(9);
        sourceid = isNaN(parseInt(sourceid)) ? '' : parseInt(sourceid);
        app.setSourceId(sourceid);
      }
    }
    that.webSiteInfo();
  },

  onShow: function () {
    let that = this;
    app.restStatus(that, 'listClickFlag');
    app.restStatus(that, 'noticeContentFlag');
    app.sendRequest({
      url: "api.php?s=goods/getDefaultImages",
      data: {},
      success: function (res) {
          console.log(res)
        let code = res.code;
        let data = res.data;
        if (code == 0) {
           
           
          data.value.default_goods_img = that.IMG(data.value.default_goods_img); //默认商品图处理
          data.value.default_headimg = that.IMG(data.value.default_headimg); //默认用户头像处理
          that.setData({
            defaultImg: data
          })
          let webSiteInfo = app.globalData.webSiteInfo;
          let custom_template_is_enable = webSiteInfo.custom_template_is_enable;
          if (custom_template_is_enable != 1) {
            that.indexInit(that);
          } else {
            
          }
        }
      }
    });
    that.copyRightIsLoad();
  },
    godetail:function(e){
        var classid = e.currentTarget.dataset.classid;
        var NavigationBarTitle = e.currentTarget.dataset.navigationbartitle;
        console.log(e)
        wx.navigateTo({
            url: 'navdetail/navdetail?classid=' + classid + '&NavigationBarTitle=' + NavigationBarTitle,
        })
    },
    goques: function (e) {
        var NavigationBarTitle = e.currentTarget.dataset.navigationbartitle;
        wx.navigateTo({
            url: 'question/question?NavigationBarTitle=' + NavigationBarTitle
        })
    },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let webSiteInfo = app.globalData.webSiteInfo;
    let title = app.globalData.title;
    if (webSiteInfo.title != '' && webSiteInfo.title != undefined) {
      title = webSiteInfo.title;
    }
    return {
      title: title
    }
  },

  /**
   * 商品楼层图片加载失败
   */
  errorBlockImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.key;
    let block_list = that.data.block_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = block_list[index].goods_list[key].pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "block_list[" + index + "].goods_list[" + key + "].pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 限时折扣图片加载失败
   */
  errorDiscountImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let discount_list = that.data.discount_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = discount_list[index].picture.pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "discount_list[" + index + "].picture.pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 拼团商品图片加载失败
   */
  errorPintuanImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let pintuan_list = that.data.pintuan_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = pintuan_list[index].pic_cover_mid;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "pintuan_list[" + index + "].pic_cover_mid";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
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
      url: url,
    })
  },

  tabBar: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.switchTab({
      url: url,
    })
  },

  /**
   * 输入框绑定事件
   */
  searchInput: function (event) {
    let search_text = event.detail.value;
    this.setData({
      search_text: search_text
    })
  },

  /**
   * 领取优惠券
   */
  toReceivePopup: function (e) {
    let that = this;
    let coupon_type_id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let flag = true;
    let status = 1;


    if (flag) {
      app.sendRequest({
        url: 'api.php?s=goods/receiveGoodsCoupon',
        data: {
          coupon_type_id: coupon_type_id
        },
        success: function (res) {
          let code = res.code;
          let data = res.data;

          if (code == 0) {
            if (data > 0) {
              app.showBox(that, '领取成功');
            } else if (data == -2011) {
              app.showBox(that, '来迟了，已经领完了');
              status = 0;
            } else if (data == -2019) {
              app.showBox(that, '领取已达到上限');
              status = 0;
            } else {
              app.showBox(that, '未获取到优惠券信息');
              status = 0;
            }
            let d = {};
            let key = "coupon_list[" + index + "].status";
            d[key] = 0;

            that.setData(d);
          }
        }
      });
    }

    if (!flag) {
      let d = {};
      let key = "coupon_list[" + index + "].status";
      d[key] = 0;

      that.setData(d);
    }
  },

  /**
   * 计时
   */
  timing: function (that, timer_array, index) {
    let timer_ch = that.data.timer_ch;
    let current_time = that.data.current_time;
    let count_second = (timer_array[index].end_time * 1000 - current_time) / 1000;
    //首次加载
    if (count_second > 0) {
      count_second--;
      //时间计算
      let day = Math.floor((count_second / 3600) / 24);
      let hour = Math.floor((count_second / 3600) % 24);
      let minute = Math.floor((count_second / 60) % 60);
      let second = Math.floor(count_second % 60);
      //赋值
      timer_array[index].day = day;
      timer_array[index].hour = hour;
      timer_array[index].minute = minute;
      timer_array[index].second = second;
      timer_array[index].end = 0;

      that.setData({
        timer_array: timer_array
      })
    } else {
      timer_array[index].end = 1;

      that.setData({
        timer_array: timer_array
      })
    }
    //开始计时
    let timer = setInterval(function () {
      if (count_second > 0) {
        count_second--;
        //时间计算
        let day = Math.floor((count_second / 3600) / 24);
        let hour = Math.floor((count_second / 3600) % 24);
        let minute = Math.floor((count_second / 60) % 60);
        let second = Math.floor(count_second % 60);
        //赋值
        timer_array[index].day = day;
        timer_array[index].hour = parseInt(hour) < 10 ? 0 + '' + hour : hour;
        timer_array[index].minute = parseInt(minute) < 10 ? 0 + '' + minute : minute;;
        timer_array[index].second = parseInt(second) < 10 ? 0 + '' + second : second;;
        timer_array[index].end = 0;

        that.setData({
          timer_array: timer_array
        })
      } else {
        timer_array[index].end = 1;

        that.setData({
          timer_array: timer_array
        })

        clearInterval(timer);
      }
    }, 1000)
    let parm = {};
    let key = 'timer_ch[' + timer_ch.length + ']';
    parm[key] = timer;
    that.setData(parm);
  },

  /**
   * 首页初始化
   */
  indexInit: function (that) {
    let base = app.globalData.siteBaseUrl;
    let timeArray = {};

    app.sendRequest({
      url: 'api.php?s=index/getIndexData',
      data: {},
      success: function (res) {

        let code = res.code;
        let indicatorDots = true;
        if (code == 0) {
          let data = res.data;
          console.log(data)
        //    that.setData({
        //         clist: data.block_list
        //     })
           
          //当前时间初始化
          let current_time = data.current_time;
          that.setData({
            current_time: current_time,
            vsrc: data.adv_video.video_address
          })
          //首页导航
          let nav_list = [];
          if (data.nav_list != undefined) {
            nav_list = data.nav_list;
            for (let index in nav_list) {
              let nav_icon = nav_list[index].nav_icon;
              let applet_nav = nav_list[index].applet_nav;
              nav_list[index].nav_icon = that.IMG(nav_icon);
              nav_list[index].applet_nav = JSON.parse(applet_nav);
            }
          }
          //广告轮播初始化
          if (data.adv_list != undefined && data.adv_list.adv_index != undefined && data.adv_list.adv_index.adv_list != undefined) {
            let adv_index = data.adv_list.adv_index;
            let adv_list = adv_index.adv_list;
              //adv_list = that.IMG(adv_list);
              
              for (var i = 0; i < adv_list.length;i++){
                  adv_list[i].adv_image = that.IMG(adv_list[i].adv_image)
              }
              
            that.setData({
              imgUrls: adv_list,
            })
          } else {
            that.setData({
              imgUrls: [],
            })
          }
    //第二轮播初始化
            var adv_list_2 = data.adv_list_2.adv_index.adv_list;
            
            for (var i = 0; i < adv_list_2.length; i++) {
                    //console.log(adv_list_2[i].adv_image);
                adv_list_2[i].adv_image = that.IMG(adv_list_2[i].adv_image)
            }
            
            that.setData({
                imgUrlss: adv_list_2,
            })
          //优惠券初始化
          for (let index in data.coupon_list) {
            data.coupon_list[index].status = 1;
          }

          //初始化计时器
          let timer_ch = that.data.timer_ch;
          for (let index in timer_ch) {
            clearInterval(timer_ch[index]);
          }
          //限时折扣初始化
          let discount_list = data.discount_list.data;
          for (let index in discount_list) {
            let img = discount_list[index].picture.pic_cover_small;
            discount_list[index].picture.pic_cover_small = that.IMG(img);

            timeArray[index] = {};
            timeArray[index].end = 0;
            timeArray[index].end_time = discount_list[index].end_time;
            that.timing(that, timeArray, index);
          }
          //拼团推荐初始化
          let pintuan_list = [];
          if (data.pintuan_list != undefined) {
            if (data.pintuan_list.data != undefined) {
              pintuan_list = data.pintuan_list.data;
              for (let index in pintuan_list) {
                let img = pintuan_list[index].pic_cover_mid;
                pintuan_list[index].pic_cover_mid = that.IMG(img);
              }
            }
          }

          //商品楼层图片处理
          let block_list = data.block_list;
          for (let index in block_list) {
            for (let key in block_list[index].goods_list) {
              let img = block_list[index].goods_list[key].pic_cover_small;
              block_list[index].goods_list[key].pic_cover_small = that.IMG(img);
            }
          }

          that.setData({
            Base: base,
            indicatorDots: indicatorDots,
            nav_list: nav_list,
            index_notice: data.notice.data,
            goods_platform_list: data.goods_platform_list,
            block_list: block_list,
            coupon_list: data.coupon_list,
            discount_list: discount_list,
            pintuan_list: pintuan_list
          });
        }
        //console.log(res);
      }
    })
  },

  /**
   * 底部加载
   */
  copyRightIsLoad: function (e) {
    let that = this;

    app.sendRequest({
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

          that.setData({
            copyRight: copyRight
          })
        }
        //console.log(res);
      }
    })
  },

  /**
   * 公告内容
   */
  noticeContent: function (e) {
    let that = this;
    let noticeContentFlag = that.data.noticeContentFlag;
    let id = e.currentTarget.dataset.id;

    if (noticeContentFlag == 1) {
      return false;
    }
    app.clicked(that, 'noticeContentFlag');

    if (!id > 0) {
      return false;
    }

    wx.navigateTo({
      url: '/pages/index/noticecontent/noticecontent?id=' + id,
    })
  },

  /**
   * 图片路径处理
   */
  IMG: function (img) {
    let base = app.globalData.siteBaseUrl;
    let directory = app.globalData.secondDirectory;
    img = img == undefined ? '' : img;
    img = img == 0 ? '' : img;
    
    if (img.indexOf('http://') == -1 && img.indexOf('https://') == -1 && img != '') {
      img = img.substring(0, 6) != 'upload' && directory != '' && img.indexOf('/' + directory) > 0 ? img.replace('/' + directory, '') : img;
      img = base + img;
    }
    return img;
  },

  /**
   * 基础配置
   */
  webSiteInfo: function () {
    let that = this;

    app.sendRequest({
      url: "api.php?s=login/getWebSiteInfo",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {

          that.setData({
            webSiteInfo: data
          })

          if (data.title != '' && data.title != undefined) {
            wx.setNavigationBarTitle({
              title: data.title,
            })
          }
        }
        //console.log(res);
      }
    })
  },
})
