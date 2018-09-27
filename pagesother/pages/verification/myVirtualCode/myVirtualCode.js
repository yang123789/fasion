const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: [],
    virtual_list: [],
    nav: 0,
    verificationFlag: 0,
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

    app.restStatus(that, 'verificationFlag');
    app.sendRequest({
      url: 'api.php?s=Verification/myVirtualCode',
      data:{

      },
      success: function(res){
        let code = res.code;
        let data = res.data;
        
        if(code == 0){
          let virtual_list = data;
          for (let index in virtual_list) {
            let img = virtual_list[index].picture_info;
            virtual_list[index].picture_info = app.IMG(img);
          }
          console.log(res);
          that.setData({
            virtual_list: virtual_list
          })
        }
      }
    })
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
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let virtual_list = that.data.virtual_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = virtual_list[index].picture_info;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "virtual_list[" + index + "].picture_info";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 导航切换
   */
  selectTopNav: function(e){
    let that = this;
    let status = e.currentTarget.dataset.status;

    app.sendRequest({
      url: 'api.php?s=Verification/myVirtualCode',
      data: {
        type: status
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let virtual_list = data;
          for (let index in virtual_list){
            let img = virtual_list[index].picture_info;
            virtual_list[index].picture_info = app.IMG(img);
          }
          console.log(res);
          that.setData({
            nav: status,
            virtual_list: virtual_list
          })
        }
      }
    })
  },

  /**
   * 虚拟商品详情
   */
  verificationDetail: function(e){
    let that = this;
    let vg_id = e.currentTarget.dataset.id;
    let verificationFlag = that.data.verificationFlag;

    if (verificationFlag == 1){
      return false;
    }
    app.clicked(that, 'verificationFlag');
    
    wx.navigateTo({
      url: '/pagesother/pages/verification/verificationorderdetail/verificationorderdetail?vg_id=' + vg_id,
    })
  }
})