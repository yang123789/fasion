const app = getApp();
var wxParse = require('../../../wxParse/wxParse.js');
var time = require("../../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    is_loading: 0,
    Base: '', //库路径
    defaultImg: {},
    detail_id: 0,
    current_time: 0,
    //轮播图属性
    imgUrls: {},
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 300,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    swiperHeight: 320,
    selectType: 'img',
    //底部导航
    goodsNav: 0,
    goodsChildNav: 0,
    //遮罩层
    maskShow: 0,
    //优惠券弹框
    popupShow: 0,
    //商家服务弹框
    serviceShow: 0,
    //拼团弹框
    spellingShow: 0,
    spelling_index: 0,
    //购买、购物车弹框
    sBuy: 0,
    //阶梯优惠弹框
    ladderPreferentialShow: 0,
    animation: '',
    goods_id: 0,
    is_share: 0,
    buyButtonStatus: 0, //购买、购物车确认按钮
    goods_info: {}, //商品详情
    spelling: {}, //选中拼团
    comments_list: {}, //评价列表
    comments_type: 0, //评价类型
    next_page: 1, //下一页页码
    spec_list: {}, //规格列表
    attr_value_items_format: '', //选中规格组
    sku_id: 0, //选中规格
    sku_info: {}, //选中规格信息
    stock: 0, //选中规格库存
    member_price: 0.00, //选中规格价格
    goodsNum: 1, //购买数量
    group_id: 0, //拼团ID
    shop_name: '',
    addCartFlag: 0,
    comboFlag: 0,
    comboPackagesFlag: 0,
    buyNextFlag: 0,
    goodsDetailFlag: 0,
    moreEvaluationFlag: 0,
    groupPurchaseFlag: 0,
    groupBookingFlag: 0,
    confirmSpellFlag: 0,
    pointExchangeFlag: 0,
    goodsPresellFlag: 0,
    bargain_id: 0, //砍价ID
    is_bargain: 0, //是否砍价页面
    bargainNextFlag: 0,
    bargainFlag: 0,
    addressShow: 0,
      format:'',
      xztitle:false,
      xzvalue:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
    let that = this;
    let window_width = wx.getSystemInfoSync().windowWidth;
    let siteBaseUrl = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    let copyRight = app.globalData.copyRight;
    let goods_id = options.goods_id;
    let goods_name = options.goods_name;
    let group_id = 0;
    let webSiteInfo = app.globalData.webSiteInfo;
    let shop_name = app.globalData.title;
    let bargain_id = 0;
that.setData({
    goods_name: goods_name
})
    if (webSiteInfo.title != '' && webSiteInfo.title != undefined) {
      shop_name = webSiteInfo.title;
    }

    if (options.group_id && options.group_id != undefined) {
      group_id = options.group_id;
    }

    if (options.bargain_id && options.bargain_id != undefined) {
      bargain_id = options.bargain_id;
    }
    wx.setNavigationBarTitle({
      title: goods_name
    })

    that.setData({
      Base: siteBaseUrl,
      defaultImg: defaultImg,
      goods_id: goods_id,
      group_id: group_id,
      swiperHeight: window_width,
      copyRight: copyRight,
      shop_name: shop_name,
      bargain_id: bargain_id,
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

    app.restStatus(that, 'comboFlag');
    app.restStatus(that, 'comboPackagesFlag');
    app.restStatus(that, 'buyNextFlag');
    app.restStatus(that, 'goodsDetailFlag');
    app.restStatus(that, 'moreEvaluationFlag');
    app.restStatus(that, 'groupPurchaseFlag');
    app.restStatus(that, 'groupBookingFlag');
    app.restStatus(that, 'confirmSpellFlag');
    app.restStatus(that, 'pointExchangeFlag');
    app.restStatus(that, 'goodsPresellFlag');
    app.restStatus(that, 'bargainNextFlag');
    app.restStatus(that, 'bargainFlag');
    that.loadGoodsInfo(that);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let that = this;
    let goods_info = that.data.goods_info;

    return {
      title: goods_info.goods_name,
      path: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_info.goods_id,
      imageUrl: goods_info.picture_detail.pic_cover_small,
      success: function (res) {
        app.showBox(that, '分享成功');
      },
      fail: function (res) {
        app.showBox(that, '分享失败');
      }
    }

    let is_share = 0;

    that.setData({
      is_share: is_share
    })
  },

  /**
   * 加载商品信息
   */
  loadGoodsInfo: function (that) {
    let goods_id = that.data.goods_id;
    let group_id = that.data.group_id;
    let detail_id = that.data.detail_id;
    let attr_value_items_format = '';
    let member_price = 0.00;
    let base = that.data.Base;
    let bargain_id = that.data.bargain_id

    app.sendRequest({
      url: 'api.php?s=goods/goodsDetail',
      data: {
        id: goods_id,
        group_id: group_id,
        bargain_id: bargain_id,
      },
      success: function (res) {
          console.log(res.data)
        let code = res.code;
        let data = res.data;
          
        if (code == 0) {
          try {
            if (data.description != '' && data.description != null && data.description != undefined) {
              detail_id = goods_id;
            }

            //购买数量初始化
            let goodsNum = that.data.goodsNum;
            if (parseInt(data.min_buy) > 0) {
              goodsNum = parseInt(data.min_buy);
            }

            //优惠券时间格式转换
            for (let i in data.goods_coupon_list) {
              data.goods_coupon_list[i].start_time = time.formatTime(data.goods_coupon_list[i].start_time, 'Y-M-D');
              data.goods_coupon_list[i].end_time = time.formatTime(data.goods_coupon_list[i].end_time, 'Y-M-D');
              data.goods_coupon_list[i].status = 1;
            }

            //预售发货时间格式转换
            if (data.is_open_presell == 1 && data.presell_delivery_type == 1) {
              data.presell_time = time.formatTime(data.presell_time, 'Y-M-D h:m:s');
            }

            //视频路径处理
            data.goods_video_address = data.goods_video_address == undefined ? '' : data.goods_video_address;
            data.goods_video_address = data.goods_video_address == 0 ? '' : data.goods_video_address;
            let video = data.goods_video_address;
            if (video != '' && video.indexOf('https://') == -1 && video.indexOf('http://') >= -1) {
              data.goods_video_address = base + video;
            }

            //商品图片处理
            let imgUrls = data.img_list;
            for (let index in imgUrls) {
              let img = imgUrls[index].pic_cover_big;
              imgUrls[index].pic_cover_big = app.IMG(img);
            }
            let goods_info = data;
            goods_info.img_list[0].pic_cover_micro = app.IMG(goods_info.img_list[0].pic_cover_micro);
            goods_info.picture_detail.pic_cover_micro = app.IMG(goods_info.picture_detail.pic_cover_micro);
            goods_info.picture_detail.pic_cover_small = app.IMG(goods_info.picture_detail.pic_cover_small);

            //组合商品图片处理
            if (goods_info.comboPackageGoodsArray != undefined && goods_info.comboPackageGoodsArray.goods_array != undefined) {
              for (let index in goods_info.comboPackageGoodsArray.goods_array) {
                let img = goods_info.comboPackageGoodsArray.goods_array[index].pic_cover_micro;
                goods_info.comboPackageGoodsArray.goods_array[index].pic_cover_micro = app.IMG(img);
              }
            }

            //拼团头像处理
            if (goods_info.goods_pintuan != undefined) {
              goods_info.point_exchange_type = 0;
              if (goods_info.goods_pintuan.pintuan_list != undefined) {
                for (let index in goods_info.goods_pintuan.pintuan_list.data) {
                  let img = goods_info.goods_pintuan.pintuan_list.data[index].group_user_head_img;
                  goods_info.goods_pintuan.pintuan_list.data[index].group_user_head_img = app.IMG(img);
                }
              }
            }

            //富文本格式转化
            let description = goods_info.description;
            wxParse.wxParse('description', 'html', description, that, 5);

            if (goods_info.shipping_fee != undefined) {
              goods_info.shipping_fee = '￥' + goods_info.shipping_fee;
            }

            //start 砍价

            //地址&nbsp处理
            if (data.addresslist != undefined) {
              if (data.addresslist.data.length > 0) {
                for (let index in goods_info.addresslist.data) {
                  if (goods_info.addresslist.data[index].address_info != undefined) {
                    let address = goods_info.addresslist.data[index].address_info;
                    goods_info.addresslist.data[index].address_info = address.replace(/&nbsp;/g, ' ');
                  }
                }
              }

            }
            if (data.is_bargain == 1) {
              goods_info.point_exchange_type = 0;
              goods_info.is_open_presell = 0;
            }

           
              
             
            that.setData({
              goods_info: goods_info,
              detail_id: detail_id,
              imgUrls: data.img_list,
              current_time: data.current_time,
              goodsNum: goodsNum,
              is_bargain: data.is_bargain,
            
                
            });
              

            //限时折扣计时
            if (data.promotion_type == 2 && data.promotion_detail != '') {
              let time_array = {};
              time_array.end = 0;
              time_array.end_time = data.promotion_detail.end_time;
              that.timing(that, time_array);
            }

            //拼团计时
            if (goods_info.goods_pintuan != undefined) {
              if (goods_info.goods_pintuan.pintuan_list != undefined) {
                for (let index in goods_info.goods_pintuan.pintuan_list.data) {
                  let time_array = {};
                  time_array.end = 0;
                  time_array.end_time = goods_info.goods_pintuan.pintuan_list.data[index].end_time;
                  that.timing_pintuan(that, time_array, index);
                }
              }
            }

            //砍价计时
            if (data.goods_bargain != undefined) {
              if (data.goods_bargain.status == 1) {
                let time_array = {};
                time_array.end = 0;
                time_array.end_time = data.goods_bargain.end_time;
                that.timing(that, time_array);
              }

            }

            let sku_info = that.data.sku_info;//选中规格信息
            let sku_id = that.data.sku_id; //选中规格
            let attr_value_items = {}; //规格组
            let stock = 0; //库存
            //规格默认选中
            for (let i = 0; i < data.spec_list.length; i++) {
              for (let l = 0; l < data.spec_list[i].value.length; l++) {
                if (l == 0) {
                  data.spec_list[i].value[l]['status'] = 1;
                  attr_value_items[i] = data.spec_list[i].value[l].spec_id + ':' + data.spec_list[i].value[l].spec_value_id;
                  attr_value_items.length = i + 1;
                } else {
                  data.spec_list[i].value[l]['status'] = 0;
                }
              }
            }



            //规格组、库存判断
            for (let i = 0; i < data.sku_list.length; i++) {
              let count = 1;
              for (let l = 0; l < attr_value_items.length; l++) {
                if (data.sku_list[i].attr_value_items.indexOf(attr_value_items[l]) == -1) {
                  count = 0;
                }
              }
              if (count == 1) {
                attr_value_items_format = data.sku_list[i].attr_value_items_format;
                
                sku_id = data.sku_list[i].sku_id;
                member_price = data.sku_list[i].member_price;
                stock = data.sku_list[i].stock;
                sku_info = data.sku_list[i];
                 //console.log(sku_info)
              }
            }


              //console.log(data.spec_list)
            that.setData({
              spec_list: data.spec_list,
              sku_id: sku_id,
              attr_value_items_format: attr_value_items_format,
              member_price: member_price,
              stock: stock,
              sku_info: sku_info,
              is_loading: 1
            })
             
            //定位计算运费
            if (goods_info.goods_type == 1) {
              that.positionFreight(goods_id);
            }
            //加载商品评论
            let comment_type = that.data.comments_type;
            that.getComments(comment_type);
          } catch (error) {
            console.log(error)
            app.showModal({
              content: '商品信息加载失败...', //错误信息: error
              url: '/pages/index/index'
            })
          }
        } else {
          that.showBox(that, '商品信息加载失败...');
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1200);
        }
        console.log(res);
      }
    })
  },

  /**
   * 定位查询运费
   */
  positionFreight: function (goods_id) {
    let that = this;

    app.sendRequest({
      url: 'api.php?s=goods/getShippingFeeNameByLocation',
      data: {
        goods_id: goods_id,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {

          let fee = '';
          let parm = {};
          let key = 'goods_info.shipping_fee';

          if (data == '' || data == null || data == undefined) {
            return false;
          }

          if (data[0] != undefined && data[0].co_id == 0) {
            //不允许选择物流
            fee = data[0].express_fee;
          } else {
            let fee_index = -1;
            for (let index in data) {
              if (data[index].is_default == 1) {
                fee_index = index;
              }
            }
            //不存在默认物流
            fee_index = fee_index == -1 ? 0 : fee_index;
            if (data[fee_index] != undefined) {
              fee = data[fee_index].express_fee;
            }
          }
          
          if (fee != '') {
            if (typeof (fee) == 'string') {
              parm[key] = fee;
              that.setData(parm);
            } else {
              parm[key] = '￥' + parseFloat(fee).toFixed(2);
              that.setData(parm);
            }
          }
        }
      }
    });
  },

  /**
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_info = that.data.goods_info;
    let imgUrls = that.data.imgUrls;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = imgUrls[index].pic_cover_big;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "imgUrls[" + index + "].pic_cover_big";

        parm[parm_key] = default_img;
        parm_key = "goods_info.img_list[0].pic_cover_micro";
        parm[parm_key] = default_img;
        parm_key = 'goods_info.picture_detail.pic_cover_micro';
        parm[parm_key] = default_img;
        parm_key = 'goods_info.picture_detail.pic_cover_small';
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 组合套餐图片加载失败
   */
  errorComboImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_info = that.data.goods_info;
    let defaultImg = that.data.defaultImg;
    let parm = {};
    let img = goods_info.comboPackageGoodsArray.goods_array[index].pic_cover_micro;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "goods_info.comboPackageGoodsArray.goods_array[" + index + "].pic_cover_micro";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 头像加载失败
   */
  errorHeadImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let comments_list = that.data.comments_list;
    let defaultImg = that.data.defaultImg;
    let parm = {};
    let img = comments_list[index].user_img;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "comments_list[" + index + "].user_img";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 拼团用户头像加载失败
   */
  errorPintuanUserImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let pintuan = that.data.goods_info.goods_pintuan.pintuan_list.data;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let parm_key = "goods_info.goods_pintuan.pintuan_list.data[" + index + "].group_user_head_img";
    let img = pintuan[index].group_user_head_img;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 组合商品详情
   */
  comboGoodsDetail: function (e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let goods_id = dataset.id;
    let goods_name = dataset.name;
    let comboFlag = that.data.comboFlag;

    if (comboFlag == 1) {
      return false;
    }
    app.clicked(that, 'comboFlag');

    wx.redirectTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=' + goods_name,
    })
  },

  /**
   * 组合套餐
   */
  comboPackages: function (e) {
    let that = this;
    let goods_id = e.currentTarget.dataset.id;
    let comboPackagesFlag = that.data.comboPackagesFlag;

    if (comboPackagesFlag == 1) {
      return false;
    }
    app.restStatus(that, 'comboPackagesFlag');

    wx.navigateTo({
      url: '/pages/goods/combopackagelist/combopackagelist?goods_id=' + goods_id,
    })
  },

  /**
   * 底部一级导航选中
   */
  goodsBottomNav: function (event) {
    let that = this;
    let id = event.currentTarget.dataset.id;

    that.setData({
      goodsNav: id
    });
  },

  /**
   * 底部二级导航选中
   */
  goodsBottomChildNav: function (event) {
    let that = this;
    let id = event.currentTarget.dataset.type;

    that.setData({
      goodsChildNav: id
    });
    that.getComments(id);
  },

  /**
   * 首页跳转
   */
  tapSwitch: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.switchTab({
      url: '/pages' + url,
    })
  },

  /**
   * 点赞
   */
  thumbUp: function () {
    let that = this;
    let goods_id = that.data.goods_id;
    let goods_info = that.data.goods_info;

    app.sendRequest({
      url: 'api.php?s=goods/getClickPoint',
      data: {
        goods_id: goods_id,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            goods_info.click_detail = {};
            goods_info.click_detail[0] = {
              status: 1
            };
          } else if (data == -1) {
            app.showBox(that, '您今天已经赞过该商品了');
          } else {
            app.showBox(that, '操作失败');
          }
          that.setData({
            goods_info: goods_info
          })
        }
        console.log(res);
      }
    });
  },

  /**
   * 商品评论
   */
  getComments: function (comment_type) {
    let that = this;
    let comments_type = that.data.comments_type;
    let page = that.data.next_page;
    let goods_id = that.data.goods_id;
    let defaultImg = that.data.defaultImg;

    app.sendRequest({
      url: 'api.php?s=goods/getGoodsComments',
      data: {
        goods_id: goods_id,
        comments_type: comment_type,
        page: page
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          if (res.data.data.length > 0) {
            let comments_list = res.data.data;

            //头像处理
            comments_list[0].user_img = app.IMG(comments_list[0].user_img);
            if (comments_list[0].user_img == '') {
              if (defaultImg.is_use == 1) {
                let default_img = defaultImg.value.default_headimg;
                comments_list[0].user_img = default_img;
              }
            }
            //匿名
            let new_member_name = '***';
            if (comments_list[0].member_name != '' && comments_list[0].member_name != undefined) {
              new_member_name = comments_list[0].member_name[0] + '***';
            }
            comments_list[0].member_name = comments_list[0].is_anonymous == 1 ? new_member_name : comments_list[0].member_name;

            //图片数组分割
            if (comments_list[0].image == '') {
              comments_list[0].image = {}
            } else {
              comments_list[0].image = comments_list[0].image.split(',');
              for (let key in comments_list[0].image) {
                let img = comments_list[0].image[key];
                comments_list[0].image[key] = app.IMG(img);
              }
            }
            if (comments_list[0].again_image == '') {
              comments_list[0].again_image = {}
            } else {
              comments_list[0].again_image = comments_list[0].again_image.split(',');
              for (let key in comments_list[0].again_image) {
                let img = comments_list[0].again_image[key];
                comments_list[0].again_image[key] = app.IMG(img);
              }
            }
            //时间戳转换
            if (comments_list[0].addtime > 0) {
              comments_list[0].addtime = time.formatTime(comments_list[0].addtime, 'Y-M-D h:m:s');
            }
            if (comments_list[0].again_addtime > 0) {
              comments_list[0].again_addtime = time.formatTime(comments_list[0].again_addtime, 'Y-M-D h:m:s');
            }
            page = comment_type == comments_type ? page + 1 : 1;

            that.setData({
              comments_list: comments_list,
              comments_type: comment_type,
              page: page
            })
          } else {
            let comments_list = {};
            let page = 1;
            that.setData({
              comments_list: comments_list,
              comments_type: comment_type,
              page: page
            })
          }
        }
        //console.log(res)
      }
    });
  },

  /**
   * 前去兑换（积分兑换）
   */
  integerExchange: function () {
    let goods_info = this.data.goods_info;
    let parm = {};
    let key = 'goods_info.point_exchange_type';
    parm[key] = 3;
    this.setData(parm)
  },

  /**
   * 购买弹框(动画效果未实现)
   */
  sBuyShow: function (event) {
    let type = event.currentTarget.dataset.type;
    let status = 0;
    if (type == 'buy') {
      status = 0;
    } else if (type == 'addCart') {
      status = 1;
    } else if (type == 'group') {
      status = 3;
    } else if (type == 'js_point_exchange') {
      status = 5;
    } else if (type == 'goods_presell') {
      status = 6;
    } else if (type == 'bargain') {
      status = 7;
    }
    let animation = wx.createAnimation({
      duration: 500,
    })
    animation.bottom('0').step();
    this.animation = animation;
    this.setData({
      sBuy: 1,
      maskShow: 1,
      buyButtonStatus: status,
      animation: this.animation.export()
    })
  },

  /**
   * 关闭弹框
   */
  popupClose: function (event) {
    let that = this;
    let sBuy = that.data.sBuy;

    if (sBuy == 1) {
      let animation = wx.createAnimation();
      animation.bottom('-100%').step();
      that.animation = animation;

      that.setData({
        animation: that.animation.export()
      })
    }
    that.setData({
      sBuy: 0,
      popupShow: 0,
      serviceShow: 0,
      maskShow: 0,
      ladderPreferentialShow: 0,
      spellingShow: 0,
      addressShow: 0,
    })
  },

  /**
   * sku选中
   */
  skuSelect: function (event) {
    let that = this;
    let key = event.currentTarget.dataset.key;
    let k = event.currentTarget.dataset.k;
    let ntitle='';
    let goods_info = that.data.goods_info;
    let arr = that.data.spec_list;
    let stock = that.data.stock;
    let sku_id = that.data.sku_id;
    let attr_value_items_format = that.data.attr_value_items_format;
    let member_price = that.data.member_price;
    let attr_value_items = {};
    let sku_info = that.data.sku_info;

    for (let i = 0; i < arr[key].value.length; i++) {
        
      arr[key].value[i].status = 0;
    }
    arr[key].value[k].status = 1;
    //拼合规格组
    for (let i = 0; i < arr.length; i++) {
      for (let l = 0; l < arr[i].value.length; l++) {
          
        if (arr[i].value[l]['status'] == 1) {
          attr_value_items[i] = arr[i].value[l].spec_id + ':' + arr[i].value[l].spec_value_id;
        if (arr[i].value[l]['spec_value_title'] == '无绣字') {
            ntitle=1;

        } 
            if (ntitle==1){
                that.setData({
                    xztitle:true
                })
            }else{
                that.setData({
                    xztitle: false
                })
            }
       
      }
    }
    }
    //规格组、库存判断
    
    for (let i = 0; i < goods_info.sku_list.length; i++) {
      let count = 1;
      for (let l = 0; l < attr_value_items.length; l++) {
        if (goods_info.sku_list[i].attr_value_items.indexOf(attr_value_items[l]) == -1) {
          count = 0;
        }
      }
      if (count == 1) {
         
        sku_id = goods_info.sku_list[i].sku_id;
        attr_value_items_format = goods_info.sku_list[i].attr_value_items_format;
        member_price = goods_info.sku_list[i].member_price;
        stock = goods_info.sku_list[i].stock;
        sku_info = goods_info.sku_list[i];
          
      }
    }
    that.setData({
      spec_list: arr,
      sku_id: sku_id,
      attr_value_items_format: attr_value_items_format,
      member_price: member_price,
      stock: stock,
      sku_info: sku_info
    })
  },

  /**
   * 商品数量调节
   */
  goodsNumAdjust: function (event) {
    let that = this;
    let button_type = event.currentTarget.dataset.type;
    let num = parseInt(that.data.goodsNum);
    let numCount = parseInt(that.data.stock);
    let max_buy = parseInt(that.data.goods_info.max_buy);
    let min_buy = parseInt(that.data.goods_info.min_buy);

    if (button_type == 'add' && numCount > 0) {
      num++;
      if (max_buy > 0 && num > max_buy) {
        app.showBox(that, '此商品限购，您最多购买' + max_buy + '件');
        return false;
      }

      if (num > numCount) {
        num = numCount;
      }
    } else if (button_type == 'minus' && numCount > 0) {
      num--;
      if (min_buy > 0 && num < min_buy) {
        app.showBox(that, '此商品限购，您最少购买' + min_buy + '件');
        return false;
      }

      if (num <= 0) {
        num = 1;
      }
    } else {
      num = 1;
    }
    that.setData({
      goodsNum: num
    })
  },
    xz:function(e){
        var value = e.detail.value;
        this.setData({
            xzvalue: e.detail.value
        })
    },
  /**
   * 数量调节检测
   */
  goodsNumAdjustCheck: function (event) {
    let that = this;
    let num = event.detail.value;
    let numCount = parseInt(that.data.stock);
    let max_buy = parseInt(that.data.goods_info.max_buy);
    let min_buy = parseInt(that.data.goods_info.min_buy);

    if (max_buy > 0 && num > max_buy) {
      app.showBox(that, '此商品限购，您最多购买' + max_buy + '件');
      that.setData({
        goodsNum: max_buy
      })
      return;
    }

    if (min_buy > 0 && num < min_buy) {
      app.showBox(that, '此商品限购，您最少购买' + min_buy + '件');
      that.setData({
        goodsNum: min_buy
      })
      return;
    }

    if (num > numCount) {
      num = numCount;
    } else if (num < 0) {
      num = 0;
    }
    that.setData({
      goodsNum: num
    })
  },

  /**
   * 加入购物车
   */
  addCart: function (event) {
    let that = this;
    let addCartFlag = that.data.addCartFlag;
    let goods_info = that.data.goods_info;
    let purchase_num = goods_info.purchase_num;
    let count = that.data.goodsNum;

    if (addCartFlag == 1) {
      return false;
    }
    app.clicked(that, 'addCartFlag');

    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      app.restStatus(that, 'addCartFlag');
      return false;
    }
    if (goods_info.default_size==null){
        app.showBox(that, '您还没有添加尺寸');
        app.restStatus(that, 'addCartFlag');
        return false;
    }
    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      app.restStatus(that, 'addCartFlag');
      return false;
    }
      var skuname = that.data.sku_info.sku_name.split(' ');
      skuname.pop()
      var x;
      var obj={};
      var narr=[];
     // console.log(skuname)
      var ArrObj = {
          arr: [],
          _objArr: [],
          get obj() {
              return this._obj;
          },
          set arr(arrs) {
              var that = this;
              arrs.forEach(function (val) {
                  var ceiA = [], objs = {};
                  if (val != "") {
                      ceiA = val.split(':');
                      objs['value1'] = ceiA[0];
                      objs['value2'] = ceiA[1];
                      (that._objArr).push(objs);
                  }
              })

          }
      }
      ArrObj.arr = skuname;
      //console.log(ArrObj._objArr);
      var sarr = ArrObj._objArr
      for (var i = 0; i < sarr.length;i++){
          if (sarr[i].value2 == '无绣字'){
              for (var y = 0; y < sarr.length;y++){
                  if (sarr[y].value1 == '绣字颜色') {
                      console.log(y)
                      sarr.splice(y,1)
                  }
              }
          }
      }
      function backObj(arr) {
          var ceilArr = [];
          for (x in arr) { ceilArr.push(arr[x].value1 + ":" + arr[x].value2); }
          return ceilArr;
      }
      var darr = backObj(sarr).join(' ') + ' ';
      
    let cart_detail = {
      shop_id: 0,
      shop_name: 'Niushop开源商城',
      trueId: that.data.goods_info.goods_id,
      goods_name: that.data.goods_info.goods_name,
      count: count,
      select_skuid: that.data.sku_id,
      select_skuName: darr,
      price: that.data.member_price,
      cost_price: that.data.sku_info.cost_price,
      picture: that.data.goods_info.picture,
      xz:that.data.xzvalue,
      size_id:that.data.goods_info.default_size.id
    };
    cart_detail = JSON.stringify(cart_detail);
    console.log(cart_detail)
    app.sendRequest({
      url: 'api.php?s=goods/addCart',
      data: {
        cart_detail: cart_detail,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data.code > 0) {
            app.showBox(that, '加入购物车成功')
            purchase_num = parseInt(purchase_num) + parseInt(count);
            let d = {};
            let parm = "goods_info.cart_count";
            d[parm] = purchase_num;

            that.setData(d);
            that.popupClose();
            app.restStatus(that, 'addCartFlag');
          } else {
            app.showBox(that, data.message)
            app.restStatus(that, 'addCartFlag');
          }
        }
      }
    });
  },

  /**
   * 购买下一步
   */
  buyNext: function (event) {
    let that = this;
    let sku_id = that.data.sku_id;
    let stock = that.data.stock;
    let goods_num = parseInt(that.data.goodsNum);
    let goods_sku_list = '';
    let goods_info = that.data.goods_info;
    let purchase_num = parseInt(goods_info.purchase_num);
    let max_buy = parseInt(goods_info.max_buy);
    let min_buy = parseInt(goods_info.min_buy);
    let buyNextFlag = that.data.buyNextFlag;
    let default_size = that.data.goods_info.default_size;
      
    if (buyNextFlag == 1) {
      return false;
    }
    app.clicked(that, 'buyNextFlag');

    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      app.restStatus(that, 'buyNextFlag');
      return false;
    }
      if (default_size == null) {
          app.showBox(that, '未设置身体尺寸');
          app.restStatus(that, 'buyNextFlag');
          return false;
      }
    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      app.restStatus(that, 'buyNextFlag');
      return false;
    }

    if (stock <= 0) {
      app.showBox(that, '商品已售馨');
      app.restStatus(that, 'buyNextFlag');
      return false;
    }

    if (goods_num <= 0) {
      app.showBox(that, '最少购买1件商品');
      app.restStatus(that, 'buyNextFlag');
      return false;
    }

    if (max_buy > 0 && (purchase_num + goods_num) > max_buy) {
      app.showBox(that, '此商品限购，您最多购买' + max_buy + '件');
      app.restStatus(that, 'buyNextFlag');
      return false;
    }
    let tag = "buy_now";
    let sku_list = sku_id + ':' + goods_num;
    let goods_type = goods_info.goods_type;
    let xznr = that.data.xzvalue;
    var newds = JSON.stringify(default_size);
    wx.navigateTo({
        url: '/pagesother/pages/order/paymentorder/paymentorder?tag=' + 1 + '&sku=' + sku_list + '&goods_type=' + goods_type + '&default_size=' + newds + '&xznr=' + xznr,
    })
    
  },

  /**
   * 发起拼团
   */
  groupBooking: function (e) {
    let that = this;
    let sku_id = that.data.sku_id;
    let stock = that.data.stock;
    let goods_num = parseInt(that.data.goodsNum);
    let goods_sku_list = '';
    let goods_info = that.data.goods_info;
    let purchase_num = parseInt(goods_info.purchase_num);
    let max_buy = parseInt(goods_info.max_buy);
    let min_buy = parseInt(goods_info.min_buy);
    let groupBookingFlag = that.data.groupBookingFlag;

    if (groupBookingFlag == 1) {
      return false;
    }
    app.clicked(that, 'groupBookingFlag');

    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      app.restStatus(that, 'groupBookingFlag');
      return false;
    }

    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      app.restStatus(that, 'groupBookingFlag');
      return false;
    }

    if (stock <= 0) {
      app.showBox(that, '商品已售馨');
      app.restStatus(that, 'groupBookingFlag');
      return false;
    }

    if (goods_num <= 0) {
      app.showBox(that, '最少购买1件商品');
      app.restStatus(that, 'groupBookingFlag');
      return false;
    }

    if (max_buy > 0 && (purchase_num + goods_num) > max_buy) {
      app.showBox(that, '此商品限购，您最多购买' + max_buy + '件');
      app.restStatus(that, 'groupBookingFlag');
      return false;
    }
    let sku_list = sku_id + ':' + goods_num;
    let goods_type = goods_info.goods_type;

    wx.navigateTo({
      url: '/pagesother/pages/pintuanorder/paymentorder/paymentorder?tag=' + 1 + '&sku=' + sku_list + '&goods_type=' + goods_type + '&group_id=0',
    })
  },

  /**
   * 空库存
   */
  nullStock: function () {
    let that = this;
    app.showBox(that, '商品已售馨');
  },

  /**
   * 分享
   */
  share: function () {
    let that = this;
    let is_share = 1;

    that.setData({
      is_share: is_share
    })
  },

  /**
   * 取消分享
   */
  cancleShare: function () {
    let that = this;
    let is_share = 0;

    that.setData({
      is_share: is_share
    })
  },

  /**
   * 收藏
   */
  collection: function () {
    let that = this;
    let goods_info = that.data.goods_info;
    let is_fav = goods_info.is_member_fav_goods;
    let method = is_fav == 0 ? 'FavoritesGoodsorshop' : 'cancelFavorites';
    let message = is_fav == 0 ? '收藏' : '取消收藏';
    is_fav = is_fav == 0 ? 1 : 0;
    goods_info.is_member_fav_goods = is_fav;

    app.sendRequest({
      url: 'api.php?s=member/' + method,
      data: {
        fav_id: goods_info.goods_id,
        fav_type: 'goods',
        log_msg: goods_info.goods_name
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, message + '成功');

            that.setData({
              goods_info: goods_info
            })
          } else {
            app.showBox(that, message + '失败');
          }
        }
      }
    });
  },

  /**
   * 去团购
   */
  groupPurchase: function (e) {
    let that = this;
    let groupPurchaseFlag = that.data.groupPurchaseFlag;
    let goods_id = e.currentTarget.dataset.id;
    let goods_name = e.currentTarget.dataset.name;

    if (groupPurchaseFlag == 1) {
      return false;
    }
    app.clicked(that, 'groupPurchaseFlag');

    wx.navigateTo({
      url: '/pages/goods/grouppurchase/grouppurchase?goods_id=' + goods_id + '&goods_name=' + goods_name,
    })
  },

  /**
   * 去拼单
   */
  spellList: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let spelling = that.data.goods_info.goods_pintuan.pintuan_list.data[index];
    spelling.index = index;

    that.setData({
      spelling: spelling,
      spellingShow: 1,
      maskShow: 1,
    })
  },

  /**
   * 参与拼单
   */
  participateSpellList: function (e) {
    let that = this;
    let group_id = e.currentTarget.dataset.id;

    that.popupClose();

    let status = 4;
    let animation = wx.createAnimation({
      duration: 500,
    })
    animation.bottom('0').step();
    this.animation = animation;
    this.setData({
      sBuy: 1,
      maskShow: 1,
      buyButtonStatus: status,
      group_id: group_id,
      animation: this.animation.export()
    })
  },

  /**
   * 确认拼单
   */
  confirmSpellingList: function (e) {
    let that = this;
    let sku_id = that.data.sku_id;
    let group_id = that.data.group_id;
    let stock = that.data.stock;
    let goods_num = parseInt(that.data.goodsNum);
    let goods_sku_list = '';
    let goods_info = that.data.goods_info;
    let purchase_num = parseInt(goods_info.purchase_num);
    let max_buy = parseInt(goods_info.max_buy);
    let min_buy = parseInt(goods_info.min_buy);
    let confirmSpellFlag = that.data.confirmSpellFlag;

    if (confirmSpellFlag == 1) {
      return false;
    }
    app.clicked(that, 'confirmSpellFlag');

    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      app.restStatus(that, 'confirmSpellFlag');
      return false;
    }

    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      app.restStatus(that, 'confirmSpellFlag');
      return false;
    }

    if (stock <= 0) {
      app.showBox(that, '商品已售馨');
      app.restStatus(that, 'confirmSpellFlag');
      return false;
    }

    if (goods_num <= 0) {
      app.showBox(that, '最少购买1件商品');
      app.restStatus(that, 'confirmSpellFlag');
      return false;
    }

    if (max_buy > 0 && (purchase_num + goods_num) > max_buy) {
      app.showBox(that, '此商品限购，您最多购买' + max_buy + '件');
      app.restStatus(that, 'confirmSpellFlag');
      return false;
    }
    let sku_list = sku_id + ':' + goods_num;
    let goods_type = goods_info.goods_type;

    wx.navigateTo({
      url: '/pagesother/pages/pintuanorder/paymentorder/paymentorder?tag=' + 1 + '&sku=' + sku_list + '&goods_type=' + goods_type + '&group_id=' + group_id,
    })
  },

  /**
   * 积分兑换
   */
  pointExchange: function (e) {
    let that = this;
    let sku_id = that.data.sku_id;
    let stock = that.data.stock;
    let goods_num = parseInt(that.data.goodsNum);
    let goods_sku_list = '';
    let goods_info = that.data.goods_info;
    let purchase_num = parseInt(goods_info.purchase_num);
    let max_buy = parseInt(goods_info.max_buy);
    let min_buy = parseInt(goods_info.min_buy);
    let pointExchangeFlag = that.data.pointExchangeFlag;

    if (pointExchangeFlag == 1) {
      return false;
    }
    app.clicked(that, 'pointExchangeFlag');

    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      app.restStatus(that, 'pointExchangeFlag');
      return false;
    }

    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      app.restStatus(that, 'pointExchangeFlag');
      return false;
    }

    if (stock <= 0) {
      app.showBox(that, '商品已售馨');
      app.restStatus(that, 'pointExchangeFlag');
      return false;
    }

    if (goods_num <= 0) {
      app.showBox(that, '最少购买1件商品');
      app.restStatus(that, 'pointExchangeFlag');
      return false;
    }

    if (max_buy > 0 && (purchase_num + goods_num) > max_buy) {
      app.showBox(that, '此商品限购，您最多购买' + max_buy + '件');
      app.restStatus(that, 'pointExchangeFlag');
      return false;
    }
    let sku_list = sku_id + ':' + goods_num;
    let goods_type = goods_info.goods_type;

    wx.navigateTo({
      url: '/pagesother/pages/order/paymentorder/paymentorder?tag=' + 5 + '&sku=' + sku_list + '&goods_type=' + goods_type,
    })
  },

  /**
   * 立即预定
   */
  goodsPresell: function (e) {
    let that = this;
    let sku_id = that.data.sku_id;
    let stock = that.data.stock;
    let goods_num = parseInt(that.data.goodsNum);
    let goods_sku_list = '';
    let goods_info = that.data.goods_info;
    let purchase_num = parseInt(goods_info.purchase_num);
    let max_buy = parseInt(goods_info.max_buy);
    let min_buy = parseInt(goods_info.min_buy);
    let goodsPresellFlag = that.data.goodsPresellFlag;
    let default_size = that.data.goods_info.default_size;
      let xznr = that.data.xzvalue;
      var newds = JSON.stringify(default_size);
      
    if (goodsPresellFlag == 1) {
      return false;
    }
    app.clicked(that, 'goodsPresellFlag');

    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      app.restStatus(that, 'goodsPresellFlag');
      return false;
    }

    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      app.restStatus(that, 'goodsPresellFlag');
      return false;
    }

    if (stock <= 0) {
      app.showBox(that, '商品已售馨');
      app.restStatus(that, 'goodsPresellFlag');
      return false;
    }

    if (goods_num <= 0) {
      app.showBox(that, '最少购买1件商品');
      app.restStatus(that, 'goodsPresellFlag');
      return false;
    }

    if (max_buy > 0 && (purchase_num + goods_num) > max_buy) {
      app.showBox(that, '此商品限购，您最多购买' + max_buy + '件');
      app.restStatus(that, 'goodsPresellFlag');
      return false;
    }
    let sku_list = sku_id + ':' + goods_num;
    let goods_type = goods_info.goods_type;

    wx.navigateTo({
        url: '/pagesother/pages/order/paymentorder/paymentorder?tag=' + 6 + '&sku=' + sku_list + '&goods_type=' + goods_type + '&default_size=' + newds + '&xznr=' + xznr,
    })
  },

  /**
   * 选择评论类型
   */
  evaluationType: function (e) {
    let that = this;
    let goods_id = that.data.goods_id;
    let evaluation_type = e.currentTarget.dataset.type;

    that.getComments(evaluation_type);
  },

  /**
   * 更多评论
   */
  moreEvaluation: function (e) {
    let that = this;
    let goods_id = that.data.goods_id;
    let evaluation_type = e.currentTarget.dataset.type;
    let moreEvaluationFlag = that.data.moreEvaluationFlag;

    if (moreEvaluationFlag == 1) {
      return false;
    }
    app.clicked(that, 'moreEvaluationFlag');

    wx.navigateTo({
      url: '/pages/goods/controlevaluation/controlevaluation?id=' + goods_id + '&type=' + evaluation_type
    })
  },

  /**
   * 显示商家服务
   */
  serviceShow: function (e) {
    let that = this;

    that.setData({
      serviceShow: 1,
      maskShow: 1
    })
  },

  /**
   * 显示阶梯优惠
   */
  ladderPreferentialShow: function () {
    let that = this;
    that.setData({
      ladderPreferentialShow: 1,
      maskShow: 1,
    })
  },

  /**
   * 显示优惠券
   */
  popupShow: function (e) {
    let that = this;

    that.setData({
      popupShow: 1,
      maskShow: 1
    })
  },

  /**
   * 领取优惠券
   */
  toReceivePopup: function (e) {
    let that = this;
    let coupon_type_id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let max_fetch = parseInt(e.currentTarget.dataset.fetch);
    let receive_quantity = parseInt(e.currentTarget.dataset.received);
    let flag = true;
    let status = 1;

    if (max_fetch > 0 && receive_quantity >= max_fetch) {
      app.showBox(that, '领取已达到上限');
      flag = false;
      status = 0;
    }

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
            let key = "goods_info.goods_coupon_list[" + index + "].status";
            d[key] = 0;

            that.setData(d);
          }
        }
      });
    }

    if (!flag) {
      let d = {};
      let key = "goods_info.goods_coupon_list[" + index + "].status";
      d[key] = 0;

      that.setData(d);
    }
  },

  /**
   * 限时折扣计时
   */
  timing: function (that, timer_array) {
    let current_time = that.data.current_time;
    let count_second = (timer_array.end_time * 1000 - current_time) / 1000;
    //首次加载
    if (count_second > 0) {
      count_second--;
      //时间计算
      let day = Math.floor((count_second / 3600) / 24);
      let hour = Math.floor((count_second / 3600) % 24);
      let minute = Math.floor((count_second / 60) % 60);
      let second = Math.floor(count_second % 60);
      //赋值
      timer_array.day = day;
      timer_array.hour = hour;
      timer_array.minute = minute;
      timer_array.second = second;
      timer_array.end = 0;

      that.setData({
        timer_array: timer_array
      })
    } else {
      timer_array.end = 1;

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
        timer_array.day = day;
        timer_array.hour = hour;
        timer_array.minute = minute;
        timer_array.second = second;
        timer_array.end = 0;

        that.setData({
          timer_array: timer_array
        })
      } else {
        timer_array.end = 1;

        that.setData({
          timer_array: timer_array
        })

        clearInterval(timer);
      }
    }, 1000)
  },

  /**
   * 拼团计时
   */
  timing_pintuan: function (that, timer_array, index) {
    let current_time = that.data.current_time;
    let count_second = (timer_array.end_time * 1000 - current_time) / 1000;
    let d = {};
    let parm = '';

    //首次加载
    if (count_second > 0) {
      count_second--;
      //时间计算
      let hour = Math.floor(count_second / 3600);
      let minute = Math.floor((count_second / 60) % 60);
      let second = Math.floor(count_second % 60);

      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
      //赋值
      timer_array.hour = hour;
      timer_array.minute = minute;
      timer_array.second = second;
      timer_array.end = 0;

      d = {};
      parm = 'timers_array[' + index + ']';
      d[parm] = timer_array;
      that.setData(d);
    } else {
      timer_array.end = 1;

      d = {};
      parm = 'timers_array[' + index + ']';
      d[parm] = timer_array;
      that.setData(d);
    }
    //开始计时
    let timer = setInterval(function () {
      if (count_second > 0) {
        count_second--;
        //时间计算
        let hour = Math.floor(count_second / 3600);
        let minute = Math.floor((count_second / 60) % 60);
        let second = Math.floor(count_second % 60);

        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
        //赋值
        timer_array.hour = hour;
        timer_array.minute = minute;
        timer_array.second = second;
        timer_array.end = 0;

        d = {};
        parm = 'timers_array[' + index + ']';
        d[parm] = timer_array;
        that.setData(d);
      } else {
        timer_array.end = 1;

        d = {};
        parm = 'timers_array[' + index + ']';
        d[parm] = timer_array;
        that.setData(d);

        clearInterval(timer);
      }
    }, 1000)
  },

  /**
   * 图片预览
   */
  preivewImg: function (e) {
    let imgUrls = this.data.imgUrls;
    let index = e.currentTarget.dataset.index;
    let urls = [];
    for (let key in imgUrls) {
      urls.push(imgUrls[key].pic_cover_big);
    }

    wx.previewImage({
      current: urls[index],
      urls: urls,
    })
  },

  /**
   * 选择显示类型
   */
  selectType: function (e) {
    let selectType = e.currentTarget.dataset.type;
    this.setData({
      selectType: selectType
    })
  },

  //start 砍价
  /**
* 显示地址
*/
  addressShow: function (e) {
    let that = this;

    that.setData({
      addressShow: 1,
      maskShow: 1
    })
  },

  /**
  * 发起砍价
  */
  addBargainLaunch: function (e) {

    let that = this;
    let dataset = e.currentTarget.dataset;
    let bargain_id = dataset.bargain_id;
    let address_id = dataset.address_id;
    let sku_id = that.data.sku_id;

    let bargainFlag = that.data.bargainFlag;

    if (bargainFlag == 1) {
      return false;
    }
    app.clicked(that, 'bargainFlag');

    app.sendRequest({
      url: 'api.php?s=goods/addBargainLaunch',
      data: {
        bargain_id: bargain_id,
        sku_id: sku_id,
        address_id: address_id,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data.launch_id > 0) {
            wx.navigateTo({
              url: '/pagesother/pages/bargain/bargainlaunch/bargainlaunch?launch_id=' + data.launch_id,
            })
            setTimeout(function () {

            }, 1700);
          } else {
            app.restStatus(that, 'bargainFlag');
            app.showBox(that, '发起砍价失败');
          }

        } else {
          app.restStatus(that, 'bargainFlag');
          app.showBox(that, '发起砍价失败');
        }
      }
    });
  },

  bargainNext: function (e) {
    let that = this;
    let sku_id = that.data.sku_id;
    let stock = that.data.stock;
    let goods_num = 1;
    let goods_sku_list = '';
    let goods_info = that.data.goods_info;
    let purchase_num = parseInt(goods_info.purchase_num);
    let max_buy = parseInt(goods_info.max_buy);
    let min_buy = parseInt(goods_info.min_buy);
    let bargainNextFlag = that.data.bargainNextFlag;
    let member_price = that.data.member_price;
    if (bargainNextFlag == 1) {
      return false;
    }


    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      app.restStatus(that, 'bargainNextFlag');
      return false;
    }

    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      app.restStatus(that, 'bargainNextFlag');
      return false;
    }

    if (stock <= 0) {
      app.showBox(that, '商品已售馨');
      app.restStatus(that, 'bargainNextFlag');
      return false;
    }
    if (member_price < 1) {
      app.showBox(that, '1元以下商品不能参加砍价活动');
      app.restStatus(that, 'bargainNextFlag');
      return false;
    }
    if (goods_num <= 0) {
      app.showBox(that, '最少购买1件商品');
      app.restStatus(that, 'bargainNextFlag');
      return false;
    }
    console.log(goods_num);
    if (goods_num > 1) {
      app.showBox(that, '最多购买1件商品');
      app.restStatus(that, 'bargainNextFlag');
      return false;
    }

    let sku_list = sku_id + ':' + goods_num;
    let goods_type = goods_info.goods_type;
    that.popupClose();
    that.addressShow();
  },

  newAddress: function (e) {

    let that = this;
    let is_login = app.globalData.is_login;
    if (is_login == 0) {
      //未登录执行isNotLogin(code);
      app.isNotLogin('-9999');
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
      return;
    }
    let dataset = e.currentTarget.dataset;
    let goods_id = dataset.id;
    let goods_name = dataset.name;
    let bargain_id = dataset.bargain_id;
    wx.navigateTo({
      url: '/pages/member/addmemberaddress/addmemberaddress?goods_id=' + goods_id + '&goods_name=' + goods_name + '&bargain_id=' + bargain_id,
    })
  },
  onReachBottom: function (e) {
    let that = this;
    var pageNumber = that.data.goods_page_number + 1;
    that.setData({
      goods_page_number: pageNumber,
    });

    if (pageNumber <= that.data.goods_total_page) {
      wx.showLoading({
        title: '加载中',
      })
      // 请求后台，获取下一页的数据。
      app.sendRequest({
        url: 'api.php?s=index/indexGetGoodsList',
        data: {
          page_index: pageNumber,
        },
        success: function (res) {

          wx.hideLoading();
          let goods_list = that.data.goods_list.concat(res.data.data)
          // 将新获取的数据 res.data.list，concat到前台显示的showlist中即可。
          that.setData({
            goods_list: goods_list,
          });
          console.log(res);
        },
        fail: function (res) {
          wx.hideLoading()
        }
      })
    }

  },
  /**
 * 页面跳转
 */
    selsize:function(){
        app.globalData.goods_id = this.data.goods_id;
        app.globalData.goods_name = this.data.goods_name;
        wx.switchTab({
            url: '/pages/liangti/liangti',
        })
    },
    addsize:function(){
        app.globalData.goods_id = this.data.goods_id;
        app.globalData.goods_name = this.data.goods_name;
        wx.navigateTo({
            url: '/pages/liangti/newcc/newcc',
        })
    },
  listClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;

    if (listClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: '/pages' + url,
    })
  },
  //end 砍价
})