const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    account_list: {},
    addAccountFlag: 0,
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
    
    app.restStatus(that, 'addAccountFlag');
    app.restStatus(that, 'aClickFlag');
    app.sendRequest({
      url: 'api.php?s=member/accountList',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let account_list = data;

          that.setData({
            account_list: account_list
          })
        }
        console.log(res);
      }
    });
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
   * 添加账户
   */
  addAccount: function() {
    let that = this;
    let addAccountFlag = that.data.addAccountFlag;

    if (addAccountFlag == 1){
      return false;
    }
    app.clicked(that, 'addAccountFlag');

    wx.navigateTo({
      url: '/pages/member/addaccount/addaccount',
    })
  },
  
  /**
   * 删除账户
   */
  delAccount: function(e){
    let that = this;
    let key = e.currentTarget.dataset.key;
    let account_id = e.currentTarget.dataset.id;
    let is_default = e.currentTarget.dataset.default;
    let account_list = that.data.account_list;

    if (is_default == 1) {
      app.showBox(that, '默认账户不能删除');
      return false;
    }

    app.sendRequest({
      url: 'api.php?s=member/delAccount',
      data: {
        id: account_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          if (res.data > 0) {
            account_list.splice(key, 1);
            app.showBox(that, '删除成功');
            that.setData({
              account_list: account_list
            });
          }
          if (res.data == -2007) {
            app.showBox(that, '当前用户默认账户不能删除');
          }
        }
      }
    })
  },

  /**
   * 修改账户
   */
  aClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let aClickFlag = that.data.aClickFlag;

    if (aClickFlag == 1){
      return false;
    }
    app.clicked(that, 'aClickFlag');

    wx.navigateTo({
      url: '/pages' + url,
    })
  },

  /**
   * 选择账户
   */
  selectAccount: function (event) {
    let that = this;

    let key = event.currentTarget.dataset.key;
    let account_id = event.currentTarget.dataset.id;
    let account_list = that.data.account_list;

    app.sendRequest({
      url: 'api.php?s=member/checkAccount',
      data: {
        id: account_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          if (res.data > 0) {
            for (let i = 0; i < account_list.length; i++) {
              account_list[i].is_default = 0;
            }
            account_list[key].is_default = 1;

            that.setData({
              account_list: account_list
            });
            wx.navigateBack({
              delta: 1
            })
          }

        }
      }
    })
  },
})