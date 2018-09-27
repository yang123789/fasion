const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: {},
    collection_type: 0,
    collection_list: [],
    next_page: 1,
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
      url: 'api.php?s=member/myCollection',
      data: {
        page: 1,
        'type': 0,
      },
      success: function(res){
        let code = res.code;
        let data = res.data;

        if(code == 0){
          let collection_list = data.data;
          for(let index in collection_list){
            let img = collection_list[index].goods_image;
            collection_list[index].goods_image = app.IMG(img);
          }

          that.setData({
            next_page: 2,
            collection_list: collection_list
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
    let that = this;
    let collection_list = that.data.collection_list;
    let collection_type = that.data.collection_type;
    let next_page = that.data.next_page;

    app.sendRequest({
      url: 'api.php?s=member/myCollection',
      data: {
        page: next_page,
        'type': collection_type,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let new_collection_list = data.data;
          let length = parseInt(collection_list.length);
          let parm = {};
          let parm_key = '';

          for (let index in new_collection_list){
            let img = new_collection_list[index].goods_image;
            new_collection_list[index].goods_image = app.IMG(img);
            let key = length + parseInt(index);
            parm_key = 'collection_list[' + key + ']';
            parm[parm_key] = new_collection_list[index];
          }
          next_page = length > 0 ? parseInt(next_page) + 1 : next_page;
          parm_key = 'next_page';
          parm[parm_key] = next_page;
          parm_key = 'collection_type';
          parm[parm_key] = collection_type;

          that.setData(parm);
        }
        console.log(res)
      }
    })
  },

  /**
   * 顶部导航选中
   */
  listClick: function(event){
    let that = this;
    let collection_type = event.currentTarget.dataset.type;

    app.sendRequest({
      url: 'api.php?s=member/myCollection',
      data: {
        page: 1,
        'type': collection_type,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let collection_list = data.data;
          for (let index in collection_list){
            let img = collection_list[index].goods_image;
            collection_list[index].goods_image = app.IMG(img);
          }
          that.setData({
            next_page: 2,
            collection_list: collection_list,
            collection_type: collection_type
          })
        }
        console.log(res)
      }
    })
  },

  /**
   * 取消收藏
   */
  cancleCollection: function(e){
    let that = this;
    let dataset = e.currentTarget.dataset;
    let fav_id = dataset.id;
    let fav_type = dataset.type;
    let index = dataset.index;
    let collection_list = that.data.collection_list;
    
    app.sendRequest({
      url: 'api.php?s=member/cancelFavorites',
      data: {
        fav_id: fav_id,
        fav_type: fav_type
      },
      success: function(res){
        let code = res.code;
        let data = res.data;

        if(code == 0){
          if(data > 0){
            app.showBox(that, '取消收藏成功');

            collection_list.splice(index, 1);

            that.setData({
              collection_list: collection_list
            })
          }else{
            app.showBox(that, '取消收藏失败');
          }
        }
        console.log(res);
      }
    })
  },

  /**
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let collection_list = that.data.collection_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = collection_list[index].goods_image;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "collection_list[" + index + "].goods_image";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },
})