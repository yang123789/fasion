const app = new getApp();
var time = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    defaultImg: {},
    team_list: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let defaultImg = app.globalData.defaultImg;
    let copyRight = app.globalData.copyRight;
    let promoter_id = options.promoter_id;
    
    that.setData({
      defaultImg: defaultImg,
      copyRight: copyRight
    })

    app.sendRequest({
      url: 'api.php?s=Distribution/teamList',
      data: {
        promoter_id: promoter_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let team_list = data;
          for (let index in team_list) {
            //头像图片处理
            if (team_list[index].user_info != undefined) {
              if (team_list[index].user_info.user_headimg != undefined) {
                let member_img = team_list[index].user_info.user_headimg;
                member_img = app.IMG(member_img);
                team_list[index].user_info.user_headimg = member_img == '' ? '0' : member_img;
              }
            }
            //时间格式转换
            let create_time = team_list[index].create_time;
            team_list[index].create_time = time.formatTime(create_time, 'Y-M-D h:m:s');
          }

          that.setData({
            team_list: team_list
          });
        }
      }
    });
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
    let defaultImg = that.data.defaultImg;
    let team_list = that.data.team_list;
    let base = that.data.Base;
    let index = e.currentTarget.dataset.index;
    let img = team_list[index].user_info.user_headimg;
    let parm = {};
    let parm_key = "team_list[" + index + "].user_info.user_headimg";

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  }
})