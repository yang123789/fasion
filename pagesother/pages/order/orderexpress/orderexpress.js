const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Base: '',
    defaultImg: {},
    express_info: {}, //订单物流信息
    packet_info: {}, //包裹物流信息
    express: {} //快递物流信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    let webSiteInfo = app.globalData.webSiteInfo;
    let order_id = options.id;

    app.sendRequest({
      url: 'api.php?s=order/orderExpress',
      data: {
        orderId: order_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let express_info = data.goods_packet_list;

          for (let index in express_info){
            if(index == 0){
              express_info[index].status = 1
            }else{
              express_info[index].status = 0
            }
            //图片处理
            for (let key in express_info[index].order_goods_list){
              if (express_info[index].order_goods_list[key].picture_info != undefined &&
                  express_info[index].order_goods_list[key].picture_info != null)
              {
                let img = express_info[index].order_goods_list[key].picture_info.pic_cover_micro;
                express_info[index].order_goods_list[key].picture_info.pic_cover_micro = app.IMG(img);
              }else{
                express_info[index].order_goods_list[key].picture_info = {};
                express_info[index].order_goods_list[key].picture_info.pic_cover_micro = '';
              }
            }
          }
          that.setData({
            Base: base,
            defaultImg: defaultImg,
            webSiteInfo: webSiteInfo,
            express_info: express_info,
            packet_info: express_info[0]
          })

          that.getExpressInfo(that, express_info[0].express_id);

        }
        console.log(res)
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
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let express_info = that.data.express_info;
    let defaultImg = that.data.defaultImg;
    let parm = {};
    let img = express_info[index].picture_info.pic_cover_micro;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "express_info[" + index + "].picture_info.pic_cover_micro";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 查询物流信息
   */
  getExpressInfo: function (that, express_id){
    app.sendRequest({
      url: 'api.php?s=order/getOrderGoodsExpressMessage',
      data: {
        express_id: express_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          that.setData({
            express: data
          })
          console.log(res);
        }
      }
    });
  },

  /**
   * 导航选择
   */
  navClick: function(event){
    let that = this;
    let index = event.currentTarget.dataset.index;
    let express_info = that.data.express_info;
    
    for(let key in express_info){
      express_info[key].status = 0;
    }
    
    express_info[index].status = 1;

    that.setData({
      express_info: express_info,
      packet_info: express_info[index],
    })
    
    that.getExpressInfo(that, express_info[index].express_id);
  },
})