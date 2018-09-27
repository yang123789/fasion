const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    path: '',
    show_save_qrcode: 0,
    saveQrcodeFlag: 0,
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
    app.restStatus(that, 'saveQrcodeFlag');

    that.setData({
      path: ''
    })
    that.changeQrcode();
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
   * 更换二维码
   */
  changeQrcode: function (e) {
    let that = this;
    app.sendRequest({
      url: 'api.php?s=member/showUserQrcode',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let path = data;
          path = app.IMG(path);
          that.setData({
            path: path
          })
        }
      }
    })
  },

  /**
   * 保存二维码弹框
   */
  showSaveQrcode: function (e) {
    let that = this;
    that.setData({
      show_save_qrcode: 1
    })
  },

  /**
   * 关闭弹框
   */
  hideSaveQrcode: function (e) {
    let that = this;
    that.setData({
      show_save_qrcode: 0
    })
  },

  /**
   * 长按保存二维码
   */
  saveQrcode: function (e) {
    let that = this;
    let img_url = that.data.path;
    let saveQrcodeFlag = that.data.saveQrcodeFlag;
    if (saveQrcodeFlag == 1) {
      return false;
    }
    app.clicked(that, 'saveQrcodeFlag');

    wx.downloadFile({
      url: img_url,
      success: function (res) {
        
        if (res.errMsg == 'downloadFile:ok') {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (res) {
              app.restStatus(that, 'saveQrcodeFlag');
              that.hideSaveQrcode();
            },
            fail: function (error) {
              app.showBox(that, '图片保存失败');
              console.log('图片保存失败: ' + error.errMsg)
              app.restStatus(that, 'saveQrcodeFlag');
              that.hideSaveQrcode();
            }
          })
        }
      },
      fail: function (error) {
        app.showBox(that, '图片保存失败');
        console.log('图片下载失败: ' + error.errMsg)
        app.restStatus(that, 'saveQrcodeFlag');
        that.hideSaveQrcode();
      }
    })
  }
})