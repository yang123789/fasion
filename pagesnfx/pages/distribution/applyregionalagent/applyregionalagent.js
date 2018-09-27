const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    defaultImg: {},
    agent_type_array:
    [
      {
        'type_value': 1,
        'type_name': '省代'
      },
      {
        'type_value': 2,
        'type_name': '市代'
      },
      {
        'type_value': 3,
        'type_name': '区代'
      }
    ],
    agent_type_index: 0,
    agent_type: 1,
    province_array:
    [
      {
        'province_id': 0,
        'province_name': '请选择省'
      },
    ],
    city_array:
    [
      {
        'city_id': 0,
        'city_name': '请选择市'
      },
    ],
    district_array:
    [
      {
        'district_id': 0,
        'district_name': '请选择区/县'
      },
    ],
    province_index: 0,
    city_index: 0,
    district_index: 0,
    province: '请选择省',
    city: '请选择市',
    district: '请选择区/县',
    real_name: '',
    mobile: '',
    applyRegionAlagentFlag: 0,
    distributionCenterFlag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let shop_id = options.shop_id;

    that.setData({
      shop_id: shop_id
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
    app.restStatus(that, 'applyRegionAlagentFlag');
    app.restStatus(that, 'distributionCenterFlag');
    that.loadRegionAlagentInfo(that);
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
   * 加载区代信息
   */
  loadRegionAlagentInfo: function (that) {
    app.sendRequest({
      url: 'api.php?s=Distribution/applyRegionalAgentInfo',
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          let region_alagent_info = data;
          if (region_alagent_info.agent_type == -1) {
            that.loadProvinceList(that);
          }
          that.setData({
            region_alagent_info: region_alagent_info
          });
        }
      }
    });
  },

  /**
   * 加载省列表
   */
  loadProvinceList: function (that) {
    app.sendRequest({
      url: 'api.php?s=index/getProvince',
      data: {},
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let provinceArray = res.data;
          let province_array = [{
            area_id: 0,
            province_id: 0,
            province_name: '请选择省',
            sort: 0
          }];
          for (let i = 0; i < provinceArray.length; i++) {
            province_array[i + 1] = provinceArray[i];
          }
          that.setData({
            province_array: province_array
          })
          //console.log(that.data.provinceArray);
        }
      }
    })
  },

  /**
   * 省选择器
   */
  bindProvincChange: function (e) {
    let that = this;
    let index = e.detail.value;
    let provinceArray = that.data.province_array;
    let province_id = provinceArray[index].province_id;
    let province_name = provinceArray[index].province_name;
    that.setData({
      province_index: index,
      province: province_name,
      city_index: 0,
      district_index: 0
    })
    if (province_id == 0) {
      return;
    }
    app.sendRequest({
      url: 'api.php?s=index/getCity',
      data: {
        province_id: province_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let cityArray = res.data;
          let city_array = [{
            area_id: 0,
            city_id: 0,
            city_name: '请选择市',
            sort: 0
          }];
          for (let i = 0; i < cityArray.length; i++) {
            city_array[i + 1] = cityArray[i];
          }
          that.setData({
            city_array: city_array
          })
        }
      }
    })
  },

  /**
   * 市选择器
   */
  bindCityChange: function (e) {
    let that = this;
    let index = e.detail.value;
    let cityArray = that.data.city_array;
    let city_id = cityArray[index].city_id;
    let city_name = cityArray[index].city_name;
    that.setData({
      city_index: index,
      city: city_name,
      district_index: 0
    })
    if (city_id == 0) {
      return;
    }
    app.sendRequest({
      url: 'api.php?s=index/getDistrict',
      data: {
        city_id: city_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let districtArray = res.data;
          let district_array = [{
            area_id: 0,
            district_id: 0,
            district_name: '请选择区县',
            sort: 0
          }];
          for (let i = 0; i < districtArray.length; i++) {
            district_array[i + 1] = districtArray[i];
          }
          that.setData({
            district_array: district_array
          })
        }

      }
    })
  },

  /**
   * 区选择器
   */
  bindDistrictChange: function (e) {
    let that = this;
    let index = e.detail.value;
    let districtArray = that.data.district_array;
    let district_id = districtArray[index].district_id;
    let district_name = districtArray[index].district_name;
    that.setData({
      district_index: index,
      district: district_name
    })
  },

  /**
   * 区代类型选择器
   */
  bindApplyTypeChange: function (e) {
    let that = this;
    let index = e.detail.value;
    let agent_type_array = that.data.agent_type_array;
    let agent_type = agent_type_array[index].type_value;

    that.setData({
      agent_type_index: index,
      agent_type: agent_type
    })
  },

  /**
   * 输入真实姓名
   */
  inputRealName: function (e) {
    let that = this;
    let real_name = e.detail.value;

    that.setData({
      real_name: real_name
    })
  },

  /**
   * 输入联系电话
   */
  inputMobile: function (e) {
    let that = this;
    let mobile = e.detail.value;

    that.setData({
      mobile: mobile
    })
  },

  /**
   * 申请区代
   */
  applyRegionAlagent: function (e) {
    let that = this;
    let applyRegionAlagentFlag = that.data.applyRegionAlagentFlag;
    if (applyRegionAlagentFlag == 1) {
      return false;
    }
    app.clicked(that, 'applyRegionAlagentFlag');

    let shop_id = that.data.shop_id;
    let agent_type = that.data.agent_type;
    let real_name = that.data.real_name;
    let mobile = that.data.mobile;
    let province = that.data.province;
    let city = that.data.city;
    let district = that.data.district;
    let address = province + city + district;

    if (real_name == '') {
      app.showBox(that, '请输入真实姓名');
      app.restStatus(that, 'applyRegionAlagentFlag');
      return false;
    }

    if (mobile == '') {
      app.showBox(that, '请输入手机号码');
      app.restStatus(that, 'applyRegionAlagentFlag');
      return false;
    }

    let myreg = /^(((13[0-9]{1})|(14[7]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile.length != 11 || !myreg.test(mobile)) {
      app.showBox(that, '请输入正确的手机号');
      app.restStatus(that, 'applyRegionAlagentFlag');
      return false;
    }

    if (agent_type == 1) {

      if (province == '请选择省') {
        app.showBox(that, '请选择省份');
        app.restStatus(that, 'applyRegionAlagentFlag');
        return false;
      }

    } else if (agent_type == 2) {

      if (province == '请选择省') {
        app.showBox(that, '请选择省份');
        app.restStatus(that, 'applyRegionAlagentFlag');
        return false;
      } else if (city == '请选择市') {
        app.showBox(that, '请选择市');
        app.restStatus(that, 'applyRegionAlagentFlag');
        return false;
      }

    } else if (agent_type == 3) {

      if (province == '请选择省') {
        app.showBox(that, '请选择省份');
        app.restStatus(that, 'applyRegionAlagentFlag');
        return false;
      } else if (city == '请选择市') {
        app.showBox(that, '请选择市');
        app.restStatus(that, 'applyRegionAlagentFlag');
        return false;
      } else if (district == '请选择区/县') {
        app.showBox(that, '请选择区/县');
        app.restStatus(that, 'applyRegionAlagentFlag');
        return false;
      }

    }

    app.sendRequest({
      url: 'api.php?s=Distribution/applyRegionalAgent',
      data: {
        shop_id: shop_id,
        agent_type: agent_type,
        real_name: real_name,
        mobile: mobile,
        address: address
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          if (data.code > 0) {
            app.showBox(that, '区域代理申请成功');
            that.loadRegionAlagentInfo(that);
          } else {
            app.showBox(that, '区域代理申请失败');
            app.restStatus(that, 'applyRegionAlagentFlag');
          }
        }
      }
    });
  },

  /**
   * 返回推广中心
   */
  distributionCenter: function (e) {
    let that = this;
    let distributionCenterFlag = that.data.distributionCenterFlag;
    if (distributionCenterFlag == 1) {
      return false;
    }
    app.clicked(that, 'distributionCenterFlag');

    wx.navigateBack({
      delta: 1
    })
  }
})