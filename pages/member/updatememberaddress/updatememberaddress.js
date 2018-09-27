const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    provinceArray:
    [
      {
        'province_id': 0,
        'province_name': '请选择省'
      },
    ],
    cityArray:
    [
      {
        'city_id': 0,
        'city_name': '请选择市'
      },
    ],
    districtArray:
    [
      {
        'district_id': 0,
        'district_name': '请选择区县'
      },
    ],
    provinceIndex: 0,
    cityIndex: 0,
    districtIndex: 0,
    address_id: 0,
    consigner: '', //收件人
    mobile: '',
    phone: '',
    province: 0,
    city: 0,
    district: 0,
    address: '',
    saveAddressFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    let address_id = options.id;
    app.sendRequest({
      url: 'api.php?s=member/getMemberAddressDetail',
      data: {
        id: address_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let address_info = res.data;
          
          that.setData({
            address_id: address_info.id,
            consigner: address_info.consigner,
            mobile: address_info.mobile,
            phone: address_info.phone,
            province: address_info.province,
            city: address_info.city,
            district: address_info.district,
            address: address_info.address
          })
          that.provinceChange(that, address_info);
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
    let that = this;
    app.restStatus(that, 'saveAddressFlag');
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
   * 默认省
   */
  provinceChange: function (that, address_info){
    let provinceIndex = 0;

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
            if (provinceArray[i].province_id == address_info.province) {
              provinceIndex = i + 1;
            }
          }
          that.setData({
            provinceArray: province_array,
            provinceIndex: provinceIndex
          })
          that.cityChange(that, address_info);
        }
      }
    })
  },
  /**
   * 默认市
   */
  cityChange: function (that, address_info){
    let cityIndex = 0;
    
    app.sendRequest({
      url: 'api.php?s=index/getCity',
      data: {
        province_id: address_info.province
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
            if (cityArray[i].city_id == address_info.city){
              cityIndex = i+1;
            }
          }

          that.setData({
            cityArray: city_array,
            cityIndex: cityIndex
          })
          that.districtChange(that, address_info);
        }
      }
    })
  },
  /**
   * 默认区县
   */
  districtChange: function (that, address_info){
    let districtIndex = 0;

    app.sendRequest({
      url: 'api.php?s=index/getDistrict',
      data: {
        city_id: address_info.city
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
            if (districtArray[i].district_id == address_info.district){
              districtIndex = i+1;
            }
          }
          that.setData({
            districtArray: district_array,
            districtIndex: districtIndex
          })
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
    let provinceArray = that.data.provinceArray;
    let province_id = provinceArray[index].province_id;

    that.setData({
      provinceIndex: index,
      province: province_id,
      cityIndex: 0,
      districtIndex: 0
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
            cityArray: city_array
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
    let cityArray = that.data.cityArray;
    let city_id = cityArray[index].city_id;
    that.setData({
      cityIndex: index,
      city: city_id,
      districtIndex: 0
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
            districtArray: district_array
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
    let districtArray = that.data.districtArray;
    let district_id = districtArray[index].district_id;

    that.setData({
      districtIndex: index,
      district: district_id
    })
  },

  /**
   * 输入内容绑定数据
   */
  inputEvent: function (e) {
    let that = this;

    let data_type = e.currentTarget.dataset.type;
    let value = e.detail.value;

    if (data_type == 'consigner') {
      that.setData({
        consigner: value
      })
    }
    if (data_type == 'mobile') {
      that.setData({
        mobile: value
      })
    }
    if (data_type == 'phone') {
      that.setData({
        phone: value
      })
    }
    if (data_type == 'address') {
      that.setData({
        address: value
      })
    }
  },

  /**
   * 修改地址
   */
  saveAddress: function () {
    let that = this;

    let saveAddressFlag = that.data.saveAddressFlag;
    let id = that.data.address_id;
    let consigner = that.data.consigner;
    let mobile = that.data.mobile;
    let phone = that.data.phone;
    let province = that.data.province;
    let city = that.data.city;
    let district = that.data.district;
    let address = that.data.address;

    if (saveAddressFlag == 1){
      return false;
    }
    app.clicked(that, 'saveAddressFlag');

    //输入验证
    if (consigner == '') {
      app.showBox(that, '请输入收件人');
      app.restStatus(that, 'saveAddressFlag');
      return;
    }
    if (mobile == '') {
      app.showBox(that, '请输入手机号');
      app.restStatus(that, 'saveAddressFlag');
      return;
    }
    let myreg = /^(((13[0-9]{1})|(14[7]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile.length != 11 || !myreg.test(mobile)) {
      app.showBox(that, '请输入正确的手机号');
      app.restStatus(that, 'saveAddressFlag');
      return;
    }
    if (province == 0) {
      app.showBox(that, '请选择省份');
      app.restStatus(that, 'saveAddressFlag');
      return;
    }
    if (city == 0) {
      app.showBox(that, '请选择城市');
      app.restStatus(that, 'saveAddressFlag');
      return;
    }
    if (district == 0) {
      app.showBox(that, '请选择区县');
      app.restStatus(that, 'saveAddressFlag');
      return;
    }
    if (address == '') {
      app.showBox(that, '请输入详细地址');
      app.restStatus(that, 'saveAddressFlag');
      return;
    }
    app.sendRequest({
      url: 'api.php?s=member/updateMemberAddress',
      data: {
        id: id,
        consigner: consigner,
        mobile: mobile,
        phone: phone,
        province: province,
        city: city,
        district: district,
        address: address
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {

          wx.navigateBack({
            delta: 1
          })
        } else {

          app.showBox(that, '修改失败');
          app.restStatus(that, 'saveAddressFlag');
        }
      }
    })
  }
})