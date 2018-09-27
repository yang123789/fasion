const app = new getApp();
var time = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    show_type: 'brokerge',
    user_commission_list: {},
    towithdraw_list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let shop_id = options.shop_id;
    shop_id == 'undefined' ? 0 : shop_id;
    that.commissionList(that, shop_id);

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
   * 选择显示类型
   */
  changeShowType: function (e) {
    let that = this;
    let show_type = e.currentTarget.dataset.type;
    let shop_id = that.data.shop_id;

    if (show_type == 'widthdraw') {
      that.towithdrawList(that, shop_id);
    } else {
      that.commissionList(that, shop_id);
    }

    that.setData({
      show_type: show_type
    })
  },

  /**
   * 佣金明细
   */
  commissionList: function (that, shop_id) {
    app.sendRequest({
      url: 'api.php?s=Distribution/userAccountRecordsList',
      data: {
        shop_id: shop_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let user_commission_list = data;
          for (let index in user_commission_list) {
            let create_time = user_commission_list[index].create_time;
            user_commission_list[index].create_time = time.formatTime(create_time, 'Y-M-D h:m:s');
          }

          that.setData({
            user_commission_list: user_commission_list
          })
        }
      }
    });
  },

  /**
   * 提现明细
   */
  towithdrawList: function (that, shop_id) {
    app.sendRequest({
      url: 'api.php?s=Distribution/userCommissionWithdraw',
      data: {
        shop_id: shop_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let towithdraw_list = data.data;
          for (let index in towithdraw_list) {
            let create_time = towithdraw_list[index].ask_for_date;
            towithdraw_list[index].ask_for_date = time.formatTime(create_time, 'Y-M-D h:m:s');
          }

          that.setData({
            towithdraw_list: towithdraw_list
          })
        }
      }
    });
  }
})