// pages/liangti/liangti.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      hascc: false,
      check_all:1,
      ltlist:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
  },
loaddata:function(){
    var that=this;
    app.sendRequest({
        url: "api.php?s=member/getMemeberSizeList",
        data: {
            
        },
        success: function (res) {
            console.log(res)
            if(res.data==''){
                that.setData({
                    hascc:false
                })
            }else{
                that.setData({
                    hascc: true,
                    ltlist:res.data
                })
            }
            
        }
    })
},
    newcc:function(){
        wx.navigateTo({
            url: 'newcc/newcc',
        })
    },
    
    //删除量体
    del:function(e){
        var id = e.target.dataset.id;
        var index = e.target.dataset.index;
        var that=this;
        var ltlist = that.data.ltlist;
        app.sendRequest({
            url: "api.php?s=member/memberSizeDelete",
            data: {
                id:id
            },
            success: function (res) {
                if (res.code == 0) {
                    ltlist.splice(index, 1)
                    that.setData({
                        ltlist: ltlist
                    })
                }
            }
             })
    },
    //设为默认
    swmr:function(e){
        var id = e.target.dataset.id;
        var index = e.target.dataset.index;
        console.log(index)
        var that = this;
        var ltlist = that.data.ltlist;
        app.sendRequest({
            url: "api.php?s=member/updateMemberSizeDefault",
            data: {
                id: id
            },
            success: function (res) {
                if (res.code == 0) {
                    for (var i = 0; i < ltlist.length;i++){
                        ltlist[i].type = 2;
                    }
                    ltlist[index].type = 1;
                    that.setData({
                        ltlist: ltlist
                    })
                    if (app.globalData.goods_id != '' && app.globalData.goods_name != '') {
                        var goods_id = app.globalData.goods_id;
                        var goods_name = app.globalData.goods_name;
                        
                        wx.redirectTo({
                            url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=' + goods_name,
                        })
                    }
                }
            }
        })
    },
    //编辑量体
    edit: function (e) {
        var id = e.target.dataset.id;
        wx.navigateTo({
            url: 'newcc/newcc?id='+id,
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
      this.loaddata();
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
  onShareAppMessage: function () {
  
  }
})