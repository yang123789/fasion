const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    address_list: {
      length: 0
    },
    aClickFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    app.restStatus(that, 'aClickFlag');
    that.getAddressList(that);
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
   * 获取地址列表
   */
  getAddressList: function (that) {
    app.sendRequest({
      url: 'api.php?s=member/getmemberaddresslist',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let address_list = data.data;
          for (let index in address_list) {
            address_list[index].address_info = address_list[index].address_info.replace(/&nbsp;/g, '　');
          }
          that.setData({
            address_list: address_list
          });
          //console.log(res);
        }
      }
    })
  },

  /**
   * 获取微信地址
   */
  getWechatAddress: function () {
    let that = this;

    wx.chooseAddress({
      success: function (res) {
        if (res.errMsg == 'chooseAddress:ok') {
          app.sendRequest({
            url: 'api.php?s=member/saveWeixinAddress',
            data: {
              consigner: res.userName,
              mobile: res.telNumber,
              province: res.provinceName,
              city: res.cityName,
              district: res.countryName,
              address: res.detailInfo,
              zip_code: res.postalCode,
            },
            success: function (res) {
              let code = res.code;
              let data = res.data;

              if (code == 0) {
                if (data > 0) {
                  app.showBox(that, '获取成功');
                  that.getAddressList(that);
                } else {
                  app.showBox(that, '获取失败');
                }
              }
            }
          });
        }
      }
    })
  },

  /**
   * 选择收货地址
   */
  selectAddress: function (e) {
    let that = this;

    let key = e.currentTarget.dataset.key;
    let address_id = e.currentTarget.dataset.id;
    let address_list = that.data.address_list;

    app.sendRequest({
      url: 'api.php?s=member/updateAddressDefault',
      data: {
        id: address_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          if (res.data > 0) {
            for (let i = 0; i < address_list.length; i++) {
              address_list[i].is_default = 0;
            }
            address_list[key].is_default = 1;
          }
          that.setData({
            address_list: address_list
          });
          if (getCurrentPages().length >= 3) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      }
    })
  },

  /**
   * URL跳转
   */
  aClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let aClickFlag = that.data.aClickFlag;

    if (aClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'aClickFlag');

    wx.navigateTo({
      url: '/pages' + url,
    })
  },

  /**
   * 删除地址
   */
  delAddress: function (event) {
    let that = this;

    let key = event.currentTarget.dataset.key;
    let address_id = event.currentTarget.dataset.id;
    let is_default = event.currentTarget.dataset.default;
    let address_list = that.data.address_list;

    if (is_default == 1) {
      app.showBox(that, '默认地址不能删除');
      return false;
    }

    app.sendRequest({
      url: 'api.php?s=member/memberAddressDelete',
      data: {
        id: address_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          if (res.data > 0) {
            address_list.splice(key, 1);
            app.showBox(that, '删除成功');
            that.setData({
              address_list: address_list
            });
          }
          if (res.data == -2007) {
            app.showBox(that, '当前用户默认地址不能删除');
          }
        }
      }
    })
  }
})