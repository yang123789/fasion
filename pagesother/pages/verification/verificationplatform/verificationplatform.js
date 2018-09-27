const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: '',
    member_info: [],
    virtual_code: '', //虚拟码
    chcekVirtualFlag: 0,
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
      defaultImg: defaultImg
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

    app.restStatus(that, 'chcekVirtualFlag');
    app.sendRequest({
      url: 'api.php?s=Verification/verificationPlatform',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let member_info = data;
          let img = member_info.user_headimg;
          member_info.user_headimg = app.IMG(img); //图片路径处理
          that.setData({
            member_info: member_info,
          })
        }
        console.log(res)
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
   * 头像加载失败
   */
  errorHeadImg: function (e) {
    let that = this;
    let member_info = that.data.member_info;
    let defaultImg = that.data.defaultImg;
    let img = member_info.user_info.user_headimg;
    let base = that.data.Base;
    let parm = {};
    let parm_key = "member_info.user_info.user_headimg";

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_headimg;
      if (defaultImg.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },
 
  /**
   * 输入虚拟码
   */
  inputVirtualCode: function(e) {
    let that = this;
    let virtual_code = e.detail.value;
    
    that.setData({
      virtual_code: virtual_code
    })
  },

  /**
   * 核销
   */
  chcekVirtualCode: function(){
    let that = this;
    let virtual_code = that.data.virtual_code;
    let chcekVirtualFlag = that.data.chcekVirtualFlag;

    if (chcekVirtualFlag == 1){
      return false;
    }
    app.clicked(that, 'chcekVirtualFlag');

    app.sendRequest({
      url: 'api.php?s=Verification/checkVirtualCode',
      data: {
        virtual_code: virtual_code
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if(data == 0){
            app.showBox(that, '未获取到该虚拟码信息');
            app.restStatus(that, 'chcekVirtualFlag');
          }else{
            wx.navigateTo({
              url: '/pagesother/pages/verification/verificationgooodstoexamine/verificationgooodstoexamine?id=' + res.data,
            })
          }
        }
        console.log(res)
      }
    })
  }
})