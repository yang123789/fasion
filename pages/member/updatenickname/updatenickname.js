const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    nickname: '',
    new_nickname: '',
    saveNicknameFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      data: {},
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          that.setData({
            nickname: res.data.user_info.nick_name,
            new_nickname: res.data.user_info.nick_name
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
   * 输入昵称
   */
  inputNickName: function(event){
    let that = this;
    
    let new_nickname = event.detail.value;

    that.setData({
      new_nickname: new_nickname,
    })
  },

  /**
   * 保存
   */
  saveNickname: function(){
    let that = this;
    let saveNicknameFlag = that.data.saveNicknameFlag;
    let nickname = that.data.nickname;
    let new_nickname = that.data.new_nickname;

    if (saveNicknameFlag == 1) {
      return false;
    }
    app.clicked(that, 'saveNicknameFlag');

    if (new_nickname == nickname && nickname != ''){
      app.showBox(that, '与原昵称一致，无需修改');
      app.restStatus(that, 'saveNicknameFlag');
      return false;
    }
    if (new_nickname == ''){
      app.showBox(that, '昵称不可为空');
      app.restStatus(that, 'saveNicknameFlag');
      return false;
    }

    app.sendRequest({
      url: 'api.php?s=member/modifyNickName',
      data: {
        nickname: new_nickname
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          if(res.data > 0){
            wx.navigateBack({
              delta: 1
            })
          }else{
            app.showBox(that, '保存失败');
            app.restStatus(that, 'saveNicknameFlag');
          }
        }
      }
    });
  }
})