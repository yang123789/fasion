const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: {},
    category_id: '',
    category_list: [],
    goods_list: [],
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

    app.sendRequest({
      url: 'api.php?s=member/newMyPath',
      data: {
        page_index: 1,
        page_size: 0,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let goods_list = data.data;
          for(let index in goods_list){
            let img = goods_list[index].goods_info.picture_info.pic_cover_small;
            goods_list[index].goods_info.picture_info.pic_cover_small = app.IMG(img);
          }
          that.setData({
            category_list: data.category_list,
            goods_list: goods_list
          })
        }
        console.log(res)
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
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_list = that.data.goods_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = goods_list[index].goods_info.picture_info.pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "goods_list[" + index + "].goods_info.picture_info.pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 顶部导航选中
   */
  selectCate: function (event) {
    let that = this;
    let category_id = event.currentTarget.dataset.id;

    app.sendRequest({
      url: 'api.php?s=member/newMyPath',
      data: {
        page_index: 1,
        page_size: 0,
        category_id: category_id,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let goods_list = data.data;
          for (let index in goods_list) {
            let img = goods_list[index].goods_info.picture_info.pic_cover_small;
            goods_list[index].goods_info.picture_info.pic_cover_small = app.IMG(img);
          }
          that.setData({
            goods_list: goods_list,
            category_id: category_id
          })
        }
        console.log(res)
      }
    })
  },

  /**
   * 删除足迹
   */
  delMyPath: function(e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let id = dataset.id;
    let index = dataset.index;
    let goods_list = that.data.goods_list;
    
    app.sendRequest({
      url: 'api.php?s=member/delMyPath',
      data: {
        'type': 'browse_id',
        value: id,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          if (data > 0){
            app.showBox(that, '删除成功');
            goods_list.splice(index, 1);
            that.setData({
              goods_list: goods_list
            })
          }else{
            app.showBox(that, '删除失败');
          }
        }
        console.log(res)
      }
    })
  }
})