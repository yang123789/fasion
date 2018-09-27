// pages/liangti/newcc/newcc.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      fileimgurl:[],
      numnone:false,
      upurl:[],
      imgurls:'',
      mrvalue:2,
      sel:false,
     imglength:0,
      info:'',
      updata:false,
      optid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that=this;
      if (options.id){
          var id=options.id;
          that.setData({
              updata:true,
              optid: options.id
          })
          app.sendRequest({
              url: "api.php?s=member/getMemberSize",
              data: {
                  id: id,
              },
              success: function (res) {
                  //console.log(res.data)
                  if (res.data.type == 1) {
                      that.setData({
                          sel: true,
                          mrvalue:1
                      })
                  } else {
                      that.setData({
                         sel:false,
                          mrvalue:2
                      })
                  }
                  var html = res.data.img.join(',')+','
                  var upurl = res.data.img;
                  that.setData({
                      info: res.data,
                      fileimgurl: res.data.path,
                      imglength: res.data.path.length,
                      imgurls:html,
                      upurl: upurl
                  })
                  
                  var fileimgurl = that.data.fileimgurl;
                  var imglength = that.data.imglength;
                  if (fileimgurl.length == 3) {
                      that.setData({
                          numnone: true
                      })
                  }
              }
          })
     }
     
  },
  //保存信息
    formSubmit: function (e) {
        var that = this;
        var detail = e.detail.value;
        //console.log(detail)
        
        if (!detail.name) {
            wx.showToast({
                title: '请输入您的姓名',
                icon: 'none',
                duration: 1000
            })
        } else if (!detail.cm) {
            wx.showToast({
                title: '请输入您的身高',
                icon: 'none',
                duration: 1000
            })
        } else if (!detail.kg) {
            wx.showToast({
                title: '请输入您的体重',
                icon: 'none',
                duration: 1000
            })
        } else {
            //console.log(that.data.imgurls)
            var updata = that.data.updata;
            if (updata==false){
                app.sendRequest({
                    url: "api.php?s=member/addMemberSize",
                    data: {
                        sizename: detail.name,
                        height: detail.cm,
                        weight: detail.kg,
                        other: detail.sw,
                        notes: detail.bz,
                        img: that.data.imgurls,
                        types: that.data.mrvalue,
                    },
                    success: function (res) {
                        //console.log(res);
                        if (res.code == 0) {
                            wx.switchTab({

                                url: '../liangti',
                            })
                        }
                    }
                })
            }else{
                var upurl = that.data.upurl;
                var fileimgurl = that.data.fileimgurl;
                var newimgurls = upurl.join(',') + ',';
                this.setData({
                    fileimgurl: fileimgurl,
                    imgurls: newimgurls
                })
                app.sendRequest({
                    url: "api.php?s=member/updateMemberSize",
                    data: {
                        id: that.data.optid,
                        sizename: detail.name,
                        height: detail.cm,
                        weight: detail.kg,
                        other: detail.sw,
                        notes: detail.bz,
                        img: that.data.imgurls,
                        types: that.data.mrvalue,
                    },
                    success: function (res) {
                        if(res.code==0){
                            wx.switchTab({
                                url: '../liangti',
                            })
                        }
                    }
                })
            }
            
        }
    },
    filebtn:function(){
        var html = '';
        var fileimgurl = this.data.fileimgurl;
        var upurl = this.data.upurl;
        var imglength = this.data.imglength;
        //console.log(imglength)
        var that=this;
        wx.chooseImage({
            count: 3 - imglength,
            sizeType: ['compressed'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
               
                if (tempFilePaths.length>3){

                }else{
                    for (var i = 0; i < tempFilePaths.length; i++) {
                        //console.log(tempFilePaths[i])
                        wx.uploadFile({
                            url: 'http://dzshop.bjcaicheng.com/api.php?s=upload/uploadFileForApp', //这个方法就是后台处理上传的方法
                            filePath: tempFilePaths[i], //获取到上传的图片
                            name: 'file',
                            success: function (info) {

                                html += JSON.parse(info.data).data.data;
                                fileimgurl.push(JSON.parse(info.data).data.path);
                                //console.log(fileimgurl)
                                var s = JSON.parse(info.data).data.data.replace(/,/g, '');
                                upurl.push(s)
                                //console.log(fileimgurl.length)
                                that.setData({
                                    imgurls: html,
                                    fileimgurl: fileimgurl,
                                    upurl: upurl,
                                    imglength: fileimgurl.length
                                })
                               
                                if (fileimgurl.length==3){
                                        that.setData({
                                            numnone:true
                                        })
                                }
                            }
                        })

                    }
                }
                
               
                
                
                
            }
        })
    },
    delimg:function(e){
        var index = e.currentTarget.dataset.index;
        var fileimgurl = this.data.fileimgurl;
        var upurl = this.data.upurl;
        var filename = upurl[index];
        var imglength = this.data.imglength;
        fileimgurl.splice(index, 1)
        upurl.splice(index, 1)
        var newimgurls = upurl.join(',') + ',';
        this.setData({
            fileimgurl: fileimgurl,
            imgurls: newimgurls,
            imglength: imglength-1
        })
        if (fileimgurl.length<3){
            this.setData({
                numnone: false
            })
        }
        app.sendRequest({
            url: "api.php?s=upload/removeFile",
            data: {
                filename: filename
            },
            success: function (res) {
                
            }
        })
    },
    //设为默认
    swmr:function(e){
        var mrvalue = e.currentTarget.dataset.value;
        if (mrvalue==1){
            this.setData({
                mrvalue:2,
                sel:false
            })
        }else{
            this.setData({
                mrvalue: 1,
                sel:true
            })
        }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})