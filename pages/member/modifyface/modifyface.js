const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: '',
    user_info: {},
    filePath: '', //要上传文件资源的路径
    tempFiles: {},
    name: 'img', //上传文件key
    saveHeadImgFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let user_info = data.user_info;
          user_info.user_headimg = app.IMG(user_info.user_headimg); //图片路径处理
          that.setData({
            Base: base,
            defaultImg: defaultImg,
            user_info: user_info
          })
        }
      }
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
   * 头像加载失败
   */
  errorHeadImg: function (e) {
    let that = this;
    let user_info = that.data.user_info;
    let defaultImg = that.data.defaultImg;
    let img = user_info.user_headimg;
    let parm = {};
    let parm_key = "user_info.user_headimg";

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },
  
  /**
   * 返回上一页
   */
  backPrevPage: function () {
    let flag = wx.navigateBack();
  },

  /**
   * 上传图片至微信服务器
   */
  uploadImg: function(){
    let that = this;

    let filePath = that.data.filePath;
    let tempFiles = that.data.tempFiles;
    //选择图片
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      success: function(res) {
        //替换当前上传图片资源
        filePath = res.tempFilePaths[0];
        tempFiles = res.tempFiles[0];
        console.log(res);

        that.setData({
          filePath: filePath,
          tempFiles: tempFiles
        })
      },
      fail: function(res){
        app.showBox(that, '无法获取本地图片');
        console.log(res);
      }
    })
  },

  /**
   * 上传至服务器
   */
  uplodeHeadImg: function(event){
    let that = this;
    let filePath = that.data.filePath;
    let name = 'file_upload';
    let base = that.data.Base;
    let saveHeadImgFlag = that.data.saveHeadImgFlag;

    if (saveHeadImgFlag == 1){
      return false;
    }
    app.clicked(that, 'saveHeadImgFlag');
    
    if (filePath == ''){
      wx.navigateBack({
        delta: 1
      })
    }
    
    wx.uploadFile({
      url: base +'api.php?s=upload/uploadFile',
      filePath: filePath,
      name: name,
      formData: {
        token: app.globalData.token,
        file_path: 'upload/avator/',
      },
      success: function(res){
        console.log(res);
        let data = res.data;

        if (JSON.parse(data)){
          data = JSON.parse(data);
        }else{
          app.showBox(that, '保存失败');
          app.restStatus(that, 'saveHeadImgFlag');
        }
        
        let code = data.code;
        if(code == 0){
          data = data.data;
          let code = data.code;
          let message = data.message;
          let img_url = data.data;

          if(code > 0){
            that.saveHeadImg(that, img_url);
          }else{
            app.showBox(that, message);
            app.restStatus(that, 'saveHeadImgFlag');
          }
          
        }else{
          app.showBox(that, '保存失败');
          app.restStatus(that, 'saveHeadImgFlag');
        }
      },
      fail: function(res){
        console.log(res);
        app.showBox(that, '保存失败');
        app.restStatus(that, 'saveHeadImgFlag');
      }
    })
  },

  /**
   * 保存头像
   */
  saveHeadImg: function (that, img_url){

    app.sendRequest({
      url: 'api.php?s=member/modifyFace',
      data: {
        user_headimg: img_url
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {

          if(data > 0){
            wx.navigateBack({
              delta: 1
            })
          }else{
            app.showBox(that, '保存失败');
            app.restStatus(that, 'saveHeadImgFlag');
          }
        }
      }
    });
  }
})