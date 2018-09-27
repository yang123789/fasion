const app = new getApp();
var time = require("../../../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        prompt: '',
        Base: '',
        defaultImg: {},
        cancle_pay: 0,
        combo_id: 0,
        combo_buy_num: 1,
        order_top_image: [1, 2, 3, 4, 5],
        order_tag: '',
        order_goods_type: '',
        order_sku_list: '',
        cart_list: '',
        coupon_list: {},
        discount_money: 0.00,
        goods_count_money: 0.00,
        express_company_list: {},
        goods_list: {},
        member_account: {},
        member_address: {},
        order_total_money: {},
        pick_up_money: 0.00,
        promotion_full_mail: {},
        goods_sku_list: '',
        pay_money: 0.00, //应付金额
        mask_status: 0, //遮罩层
        pay_box_status: 0, //支付方式弹框
        delivery_status: 0, //配送方式弹框
        delivery_type: 1, //配送方式
        coupon_status: 0, //优惠券弹框
        use_coupon: 0, //优惠券
        coupon_money: 0.00, //优惠券金额
        integral: 0, //积分
        user_telephone: '', //手机号
        leavemessage: '', //留言
        balance: 0.00, //使用余额
        pay_type: 0, //支付方式
        order_invoice_money: 0.00, //发票税额
        invoice_status: 0, //发票弹框
        invoice_need: 0, //是否需要发票
        invoice_title: '', //发票抬头
        taxpayer_identification_number: '', //纳税人识别号
        invoice_content_status: 0, //发票内容弹框
        invoice_content: '', //发票内容
        pick_up_status: 0, //自提点弹框
        pick_up: 0, //自提点id,
        pick_up_point: '', //自提点
        pick_up_money: 0.00, //自提点运费
        o2o_distribution: 0.00, //本地配送运费
        express_company_status: 0, //物流公司弹框
        shipping_company_id: 0, //物流公司id
        express_company: '', //物流公司
        express_money: 0.00, //物流运费
        shipping_time: [], //配送时间列表
        shipping_time_out: [], //配送时间段列表
        shipping_time_status: 0, //配送时间弹框
        shipping_time_index: -1, //配送时间偏移量
        shipping_time_out_index: -1, //配送时间段偏移量
        shipping_time_out_val: '', //配送时间段
        use_point: 0, //抵现使用积分
        use_point_money: 0.00, //积分抵现金额
        max_use_point: 0, //最大使用积分
        presell_options: [1, 0], //预售款项选择
        is_full_payment: 0, //预售是否全款
        commitOrderFlag: 0,
        myAddressFlag: 0,
        default_size: '',
        xznr: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let tag = options.tag;
        if (options.default_size){
            let default_size = JSON.parse(options.default_size);
            that.setData({
                default_size: default_size
            })
        }
        if (options.xznr) {
            let xznr = options.xznr;
            that.setData({
                xznr: xznr,
            })
        }
        
        //console.log(default_size)
        
        let base = app.globalData.siteBaseUrl;
        let defaultImg = app.globalData.defaultImg;
        let balance = parseFloat(that.data.balance).toFixed(2);
        let order_invoice_money = parseFloat(that.data.order_invoice_money).toFixed(2);
        let copyRight = app.globalData.copyRight;

        if (tag == 1) {
            tag = 'buy_now';
            let sku = options.sku;
            let goods_type = options.goods_type;

            that.setData({
                order_goods_type: goods_type,
                order_sku_list: sku,
            })
        } else if (tag == 2) {
            tag = 'cart';
            let cart_list = options.cart_list
            that.setData({
                cart_list: cart_list
            })
        } else if (tag == 3) {
            tag = 'combination_packages';
            let sku = options.sku;
            let goods_type = options.goods_type;
            let combo_id = options.combo_id;
            let num = options.num;

            that.setData({
                combo_id: combo_id,
                combo_buy_num: num,
                order_goods_type: goods_type,
                order_sku_list: sku,
            })
        } else if (tag == 4) {
            tag = 'groupbuy';
            let sku = options.sku;
            let goods_type = options.goods_type;

            that.setData({
                order_goods_type: goods_type,
                order_sku_list: sku
            })
        } else if (tag == 5) {
            tag = 'js_point_exchange';
            let sku = options.sku;
            let goods_type = options.goods_type;

            that.setData({
                order_goods_type: goods_type,
                order_sku_list: sku
            })
        } else if (tag == 6) {
            tag = 'goods_presell';
            let sku = options.sku;
            let goods_type = options.goods_type;

            that.setData({
                order_goods_type: goods_type,
                order_sku_list: sku
            })
        } else {
            app.showBox(that, '无法获取订单信息');
            setTimeout(function () {
                wx.navigateBack({
                    delta: 1
                })
            }, 1000);
        }

        that.setData({
            Base: base,
            order_tag: tag,
            defaultImg: defaultImg,
            copyRight: copyRight,
            balance: balance,
            order_invoice_money: order_invoice_money,
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
        let cancle_pay = that.data.cancle_pay;
        if (cancle_pay == 1) {
            app.setTabParm('cancle_pay');
            let tab_parm = app.globalData.tab_parm;

            wx.switchTab({
                url: '/pages/member/member/member',
            })
            return;
        }

        let myAddressFlag = that.data.myAddressFlag;
        app.restStatus(that, 'myAddressFlag');

        let pay_money = that.data.pay_money;
        let order_tag = that.data.order_tag;
        let order_goods_type = that.data.order_goods_type;
        let order_sku_list = that.data.order_sku_list;
        let cart_list = that.data.cart_list;

        let parm = {
            order_tag: order_tag
        };

        if (order_tag == 'buy_now') {
            //立即购买
            parm.order_goods_type = order_goods_type;
            parm.order_sku_list = order_sku_list;
            parm.size_id = that.data.default_size.id;
            parm.xz = that.data.xznr;
        } else if (order_tag == 'cart') {
            //购物车 
            parm.cart_list = cart_list;

        } else if (order_tag == 'combination_packages') {
            //组合商品
            let combo_id = that.data.combo_id;
            let combo_buy_num = that.data.combo_buy_num;

            parm.order_sku_list = order_sku_list;
            parm.combo_id = combo_id;
            parm.order_goods_type = order_goods_type;
            parm.combo_buy_num = combo_buy_num;

        } else if (order_tag == 'groupbuy') {
            //团购
            parm.order_sku_list = order_sku_list;

        } else if (order_tag == 'js_point_exchange') {
            //积分兑换
            parm.order_sku_list = order_sku_list;

        } else if (order_tag == 'goods_presell') {
            //预售订单
            parm.order_sku_list = order_sku_list;
            parm.size_id = that.data.default_size.id;
            parm.xz = that.data.xznr;
        } else {

            app.showBox(that, '无法获取订单信息');
            setTimeout(function () {
                wx.navigateBack({
                    delta: 1
                })
            }, 1000);
            return false;
        }

        app.sendRequest({
            url: 'api.php?s=order/getOrderData',
            data: parm,
            success: function (res) {
                let code = res.code;
                let data = res.data;

                console.log(res);
                if (code == 0) {
                    //选中默认优惠券
                    let coupon_list = that.data.coupon_list;
                    let use_coupon = that.data.use_coupon;
                    let coupon_money = parseFloat(that.data.coupon_money);
                    let user_telephone = that.data.user_telephone;
                    let shop_config = data.shop_config;
                    let use_point = that.data.use_point;
                    let use_point_money = parseFloat(that.data.use_point_money);
                    let max_use_point = parseInt(that.data.max_use_point);
                    let o2o_distribution = that.data.o2o_distribution;
                    let promotion_full_mail = data.promotion_full_mail == undefined ? [] : data.promotion_full_mail;

                    if (order_tag == 'goods_presell') {
                        //预售定金
                        if (data.presell_money != undefined && data.presell_money != '') {
                            data.presell_money = parseFloat(data.presell_money).toFixed(2);
                        }
                    }
                    //本地配送运费
                    if (data.o2o_distribution != undefined) {
                        o2o_distribution = data.o2o_distribution;
                    }

                    //满额包邮
                    if (promotion_full_mail.is_open == 1) {
                        if (promotion_full_mail.full_mail_money == 0 || parseFloat(data.count_money) >= parseFloat(promotion_full_mail.full_mail_money)) {
                            data.pick_up_money = 0;
                            data.express = 0;
                            o2o_distribution = 0.00;
                            promotion_full_mail.if_fee = 1;
                        }
                    }

                    //积分兑换
                    let goods_count_money = data.count_money;
                    if (data.point_exchange_type > 1) {
                        data.count_money = 0;
                    }
                    if (data.point_exchange_type > 0) {
                        data.coupon_list = [];
                        use_coupon = 0;
                    }
                    if (data.point_config == undefined) {
                        data.point_config = [];
                    }
                    //积分抵现-最大积分
                    if (data.point_config.is_open == 1) {
                        use_point = data.max_use_point > data.member_account.point ? data.member_account.point : data.max_use_point;
                        max_use_point = use_point;
                        use_point_money = parseFloat(use_point) * parseFloat(data.point_config.convert_rate);
                        use_point_money = parseFloat(use_point_money).toFixed(2);
                    }

                    if (data.coupon_list != undefined && data.coupon_list[0] != undefined) {
                        coupon_list = data.coupon_list;
                        if (use_coupon == 0) {
                            use_coupon = coupon_list[0].coupon_id;
                            coupon_money = parseFloat(coupon_list[0].money);
                        }
                    }

                    if (user_telephone == '' && data.user_telephone != undefined) {
                        user_telephone = data.user_telephone;
                    }

                    if (order_tag == 'buy_now' && order_goods_type == 0) {
                        data.express = 0.00;
                    }

                    let discount_money = parseFloat(data.discount_money) + coupon_money;
                    let balance = parseFloat(that.data.balance);
                    let new_pay_money = parseFloat(data.count_money) + parseFloat(data.express) - discount_money - balance;

                    //未开启商家配送 开启买家自提
                    if (shop_config.seller_dispatching == 0 && shop_config.buyer_self_lifting == 1) {
                        new_pay_money = parseFloat(data.count_money) + parseFloat(data.pick_up_money) - discount_money - balance;
                        let point_list = data.pickup_point_list.data;
                        let pick_up = point_list[0] == undefined ? 0 : point_list[0].id;
                        let pick_up_point = point_list[0] == undefined ? '' : point_list[0].province_name + '　' + point_list[0].city_name + '　' + point_list[0].district_name + '　' + point_list[0].address;

                        that.setData({
                            delivery_type: 2,
                            pick_up: pick_up,
                            pick_up_point: pick_up_point
                        })
                    }

                    pay_money = parseFloat(pay_money) > 0 ? pay_money : new_pay_money;
                    pay_money = pay_money < 0 ? 0.00 : pay_money;
                    let shipping_company_id = that.data.shipping_company_id;
                    let express_company = that.data.express_company;
                    let express_company_list = data.express_company_list;
                    express_company_list = express_company_list == undefined ? [] : express_company_list;
                    data.address_default = data.address_default == undefined ? [] : data.address_default;

                    //选中默认物流
                    if (parseInt(data.express_company_count) > 0 && shipping_company_id == 0 && data.express_company_list[0] != undefined && shop_config.seller_dispatching == 1) {
                        for (let index in express_company_list) {
                            if (express_company_list[index].is_default == 1) {
                                shipping_company_id = express_company_list[index].co_id;
                                express_company = data.express_company_list[index].company_name;
                            }
                        }

                        if (shipping_company_id == 0 && parseInt(data.express_company_count) > 0 && data.express_company_list[0] != undefined && shop_config.seller_dispatching == 1) {
                            shipping_company_id = express_company_list[0].co_id;
                            express_company = express_company_list[0].company_name;
                        }
                    }


                    if (data.address_default != undefined && data.address_default.address_info != undefined) {
                        let address_info = data.address_default.address_info;
                        data.address_default.address_info = address_info.replace(/&nbsp;/g, '　');
                    }
                    let order_info = data;
                    //图片处理
                    for (let index in order_info.itemlist) {
                        let img = order_info.itemlist[index].picture_info.pic_cover_small;
                        order_info.itemlist[index].picture_info.pic_cover_small = app.IMG(img);
                    }
                    //赠品图片处理
                    for (let index in order_info.goods_mansong_gifts) {
                        let img = order_info.goods_mansong_gifts[index].gift_goods.picture_info.pic_cover_small
                        order_info.goods_mansong_gifts[index].gift_goods.picture_info.pic_cover_small = app.IMG(img);
                    }
                    //积分抵现-抵现
                    if (data.point_config.is_open == 1) {
                        use_point_money = use_point_money > pay_money ? pay_money : use_point_money;
                        use_point = Math.ceil(use_point_money / data.point_config.convert_rate);
                        pay_money = pay_money - use_point_money;
                        pay_money = pay_money < 0 ? 0.00 : pay_money;
                        pay_money = pay_money.toFixed(2);
                    }

                    that.setData({
                        order_info: order_info,
                        goods_sku_list: data.goods_sku_list,
                        user_telephone: user_telephone,
                        use_coupon: use_coupon,
                        coupon_money: parseFloat(coupon_money).toFixed(2),
                        pay_money: parseFloat(pay_money).toFixed(2),
                        coupon_list: coupon_list,
                        discount_money: parseFloat(discount_money).toFixed(2),
                        express_company_list: express_company_list,
                        shipping_company_id: shipping_company_id,
                        express_company: express_company,
                        itemlist: data.itemlist,
                        member_account: data.member_account,
                        member_address: data.address_default,
                        count_money: parseFloat(data.count_money).toFixed(2),
                        goods_count_money: goods_count_money,
                        express_money: parseFloat(data.express).toFixed(2),
                        o2o_distribution: parseFloat(o2o_distribution).toFixed(2),
                        pick_up_money: parseFloat(data.pick_up_money).toFixed(2),
                        promotion_full_mail: promotion_full_mail,
                        shop_config: data.shop_config,
                        max_use_point: max_use_point,
                        use_point: use_point,
                        use_point_money: parseFloat(use_point_money).toFixed(2)
                    })
                    that.lodingShippingTime(that, data.currentTime);
                }
            }
        })
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
        let order_info = that.data.order_info;
        let defaultImg = that.data.defaultImg;
        let parm = {};
        let img = order_info.itemlist[index].picture_info.pic_cover_small;

        if (defaultImg.is_use == 1) {
            let default_img = defaultImg.value.default_goods_img;
            if (img.indexOf(default_img) == -1) {
                let parm_key = "order_info.itemlist[" + index + "].picture_info.pic_cover_small";

                parm[parm_key] = default_img;
                that.setData(parm);
            }
        }
    },

    /**
     * 赠品图片加载失败
     */
    errorGiftImg: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let order_info = that.data.order_info;
        let defaultImg = that.data.defaultImg;
        let parm = {};
        let img = order_info.goods_mansong_gifts[index].gift_goods.picture_info.pic_cover_small;

        if (defaultImg.is_use == 1) {
            let default_img = defaultImg.value.default_goods_img;
            if (img.indexOf(default_img) == -1) {
                let parm_key = "order_info.goods_mansong_gifts[" + index + "].gift_goods.picture_info.pic_cover_small";

                parm[parm_key] = default_img;
                that.setData(parm);
            }
        }
    },

    /**
     * 加载配送时间
     */
    lodingShippingTime: function (that, current_time) {
        let week_arr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        let MIN = 1;//配送时间至少需要两天
        let shipping_time = [];

        for (let i = 1; i < 30 + MIN; i++) {

            let date = new Date(current_time);
            date.setDate(date.getDate() + i);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let week = week_arr[date.getDay()];
            let time = Math.round(date.getTime() / 1000);

            shipping_time[i - 1] = {};
            shipping_time[i - 1].year = year;
            shipping_time[i - 1].month = month;
            shipping_time[i - 1].day = day;
            shipping_time[i - 1].week = week;
            shipping_time[i - 1].time = time;
        }

        that.setData({
            shipping_time: shipping_time
        })
    },

    /**
     * 商品详情
     */
    goodsDetail: function (e) {
        let goods_id = e.currentTarget.dataset.id;

        wx.navigateTo({
            url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id,
        })
    },

    /**
     * 输入手机号码
     */
    inputTel: function (e) {
        let that = this;
        let user_telephone = e.detail.value;
        that.setData({
            user_telephone: user_telephone
        })
    },

    /**
     * 收货地址
     */
    myAddress: function (event) {
        let that = this;
        let myAddressFlag = that.data.myAddressFlag;

        if (myAddressFlag == 1) {
            return false;
        }
        app.clicked(that, 'myAddressFlag');

        wx.navigateTo({
            url: '/pages/member/memberaddress/memberaddress'
        })
    },

    /**
     * 支付方式
     */
    payType: function (event) {
        let that = this;
        let status = event.currentTarget.dataset.status;

        that.setData({
            pay_box_status: status,
            mask_status: status
        })
    },

    /**
     * 选择支付方式
     */
    selectPayType: function (e) {
        let that = this;
        let use_point = parseInt(that.data.use_point);
        let use_point_money = parseFloat(that.data.use_point_money);
        let pay_type = e.currentTarget.dataset.flag;
        let delivery_type = that.data.delivery_type;
        let goods_count_money = parseFloat(that.data.goods_count_money);

        if (delivery_type == 2) {
            delivery_type = pay_type == 0 ? delivery_type : 1;
        }
        let coupon_money = parseFloat(that.data.coupon_money);
        let order_info = that.data.order_info;
        let express = 0.00;

        //根据配送方式选择运费
        if (delivery_type == 1) {
            express = parseFloat(that.data.express_money);
        } else if (delivery_type == 2) {
            express = parseFloat(that.data.pick_up_money);
        } else if (delivery_type == 3) {
            express = parseFloat(that.data.o2o_distribution);
        }
        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        let balance = parseFloat(that.data.balance);

        discount_money = discount_money + coupon_money;
        let pay_money = count_money + express - discount_money - balance;
        let old_pay_money = goods_count_money + express - discount_money;
        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let invoice_need = that.data.invoice_need; //是否需要发票
        let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * old_pay_money : 0.00;
        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
        pay_money = pay_money < 0 ? 0.00 : pay_money;
        pay_money = pay_money.toFixed(2);

        //积分抵现-抵现
        if (order_info.point_config.is_open == 1) {
            use_point_money = parseFloat(use_point * order_info.point_config.convert_rate);
            use_point_money = use_point_money > pay_money ? pay_money : use_point_money;
            use_point = Math.ceil(use_point_money / order_info.point_config.convert_rate);
            pay_money = pay_money - use_point_money;
            pay_money = pay_money < 0 ? 0.00 : pay_money;
            pay_money = pay_money.toFixed(2);
        }

        that.setData({
            pay_type: pay_type,
            delivery_type: delivery_type,
            order_invoice_money: parseFloat(order_invoice_money).toFixed(2),
            pay_money: pay_money,
            use_point: use_point,
            use_point_money: parseFloat(use_point_money).toFixed(2)
        })
        that.closePoupo();
    },

    /**
     * 配送方式
     */
    deliveryType: function (event) {
        let that = this;
        let status = event.currentTarget.dataset.status;

        that.setData({
            delivery_status: status,
            mask_status: status
        })
    },

    /**
     * 选择配送方式
     */
    deliveryTypeSelect: function (e) {
        let that = this;
        let status = e.currentTarget.dataset.status;
        let coupon_money = parseFloat(that.data.coupon_money);
        let goods_count_money = parseFloat(that.data.goods_count_money);
        let order_info = that.data.order_info;
        let express = 0.00;

        //根据配送方式选择运费
        if (status == 1) {
            express = parseFloat(that.data.express_money);
        } else if (status == 2) {
            express = parseFloat(that.data.pick_up_money);
        } else if (status == 3) {
            express = parseFloat(that.data.o2o_distribution);
        }

        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        let balance = parseFloat(that.data.balance);
        let use_point = parseInt(that.data.use_point);
        let use_point_money = parseFloat(that.data.use_point_money);

        discount_money = discount_money + coupon_money;
        let pay_money = count_money + express - discount_money - balance;
        let old_pay_money = goods_count_money + express - discount_money;

        if (status == 2) {
            let point_list = that.data.order_info.pickup_point_list.data;
            let pick_up = point_list[0] == undefined ? 0 : point_list[0].id;
            let pick_up_point = point_list[0] == undefined ? '' : point_list[0].province_name + '　' + point_list[0].city_name + '　' + point_list[0].district_name + '　' + point_list[0].address;

            that.setData({
                pick_up: pick_up,
                pick_up_point: pick_up_point
            })
        }

        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let invoice_need = that.data.invoice_need; //是否需要发票
        let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * old_pay_money : 0.00;
        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
        pay_money = pay_money < 0 ? 0.00 : pay_money;
        pay_money = pay_money.toFixed(2);

        //积分抵现-抵现
        if (order_info.point_config.is_open == 1) {
            use_point_money = parseFloat(use_point * order_info.point_config.convert_rate);
            use_point_money = use_point_money > pay_money ? pay_money : use_point_money;
            use_point = Math.ceil(use_point_money / order_info.point_config.convert_rate);
            pay_money = pay_money - use_point_money;
            pay_money = pay_money < 0 ? 0.00 : pay_money;
            pay_money = pay_money.toFixed(2);
        }

        that.setData({
            delivery_type: status,
            order_invoice_money: parseFloat(order_invoice_money).toFixed(2),
            pay_money: pay_money,
            use_point: use_point,
            use_point_money: parseFloat(use_point_money).toFixed(2)
        })
        that.closePoupo();
    },

    /**
     * 物流公司
     */
    expressCompany: function (e) {
        let that = this;

        that.setData({
            express_company_status: 1,
            mask_status: 1
        })
    },

    /**
     * 选择物流公司
     */
    selectExpressCompany: function (e) {
        let that = this;
        let data = e.currentTarget.dataset;
        let express_money = parseFloat(data.fee);
        let shipping_company_id = data.id;
        let express_company = data.name;
        let coupon_money = parseFloat(that.data.coupon_money) // 优惠券金额
        let order_info = that.data.order_info; //待付款订单信息
        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        let balance = parseFloat(that.data.balance);
        let use_point = parseInt(that.data.use_point);
        let use_point_money = parseFloat(that.data.use_point_money);
        let promotion_full_mail = that.data.promotion_full_mail;
        let goods_count_money = parseFloat(that.data.goods_count_money);

        //满额包邮
        if (promotion_full_mail.is_open == 1) {
            if (promotion_full_mail.if_fee == 1) {
                express_money = 0;
            }
        }

        discount_money = discount_money + coupon_money;
        let pay_money = count_money + express_money - discount_money - balance;
        let old_pay_money = goods_count_money + express_money - discount_money;
        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let invoice_need = that.data.invoice_need; //是否需要发票
        let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * old_pay_money : 0.00;
        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
        pay_money = pay_money < 0 ? 0.00 : pay_money;
        pay_money = pay_money.toFixed(2);

        //积分抵现-抵现
        if (order_info.point_config.is_open == 1) {
            use_point_money = parseFloat(use_point * order_info.point_config.convert_rate);
            use_point_money = use_point_money > pay_money ? pay_money : use_point_money;
            use_point = Math.ceil(use_point_money / order_info.point_config.convert_rate);
            pay_money = pay_money - use_point_money;
            pay_money = pay_money < 0 ? 0.00 : pay_money;
            pay_money = pay_money.toFixed(2);
        }

        that.setData({
            express_money: parseFloat(express_money).toFixed(2),
            shipping_company_id: shipping_company_id,
            express_company: express_company,
            order_invoice_money: parseFloat(order_invoice_money).toFixed(2),
            pay_money: pay_money,
            use_point: use_point,
            use_point_money: parseFloat(use_point_money).toFixed(2)
        })
        that.closePoupo();
    },

    /**
     * 优惠券
     */
    couponStatus: function (e) {
        let that = this;

        that.setData({
            coupon_status: 1,
            mask_status: 1
        })
    },

    /**
     * 选择优惠券
     */
    selectCoupon: function (e) {
        let that = this;
        let id = e.currentTarget.dataset.id;
        let coupon_money = parseFloat(e.currentTarget.dataset.money); // 优惠券金额
        let order_info = that.data.order_info; //待付款订单信息
        let delivery_type = that.data.delivery_type; //配送方式
        let goods_count_money = parseFloat(that.data.goods_count_money);
        let express = 0.00;

        //根据配送方式选择运费
        if (delivery_type == 1) {
            express = parseFloat(that.data.express_money);
        } else if (delivery_type == 2) {
            express = parseFloat(that.data.pick_up_money);
        } else if (delivery_type == 3) {
            express = parseFloat(that.data.o2o_distribution);
        }
        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        let balance = parseFloat(that.data.balance);
        let use_point = parseInt(that.data.use_point);
        let use_point_money = parseFloat(that.data.use_point_money);

        discount_money = discount_money + coupon_money;
        let pay_money = count_money + express - discount_money - balance;
        let old_pay_money = goods_count_money + express - discount_money;
        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let invoice_need = that.data.invoice_need; //是否需要发票
        let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * old_pay_money : 0.00;
        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
        pay_money = pay_money < 0 ? 0.00 : pay_money;
        pay_money = pay_money.toFixed(2);

        //积分抵现-抵现
        if (order_info.point_config.is_open == 1) {
            use_point_money = parseFloat(use_point * order_info.point_config.convert_rate);
            use_point_money = use_point_money > pay_money ? pay_money : use_point_money;
            use_point = Math.ceil(use_point_money / order_info.point_config.convert_rate);
            pay_money = pay_money - use_point_money;
            pay_money = pay_money < 0 ? 0.00 : pay_money;
            pay_money = pay_money.toFixed(2);
        }

        that.setData({
            use_coupon: id,
            coupon_money: parseFloat(coupon_money).toFixed(2),
            order_invoice_money: parseFloat(order_invoice_money).toFixed(2),
            pay_money: pay_money,
            discount_money: parseFloat(discount_money).toFixed(2),
            use_point: use_point,
            use_point_money: parseFloat(use_point_money).toFixed(2)
        })
        that.closePoupo();
    },

    /**
     * 自提地址
     */
    pickUp: function (e) {
        let that = this;


        that.setData({
            pick_up_status: 1,
            mask_status: 1,
        })
    },

    /**
     * 选择自提地址
     */
    pickUpSelect: function (e) {
        let that = this;
        let data = e.currentTarget.dataset;
        let pick_up = data.id;
        let province = data.province;
        let city = data.city;
        let disctrict = data.disctrict;
        let address = data.address;
        let pick_up_point = province + '　' + city + '　' + disctrict + '　' + address;

        that.setData({
            pick_up: pick_up,
            pick_up_point: pick_up_point
        })

        that.closePoupo();
    },

    /**
     * 发票
     */
    invoiceType: function (e) {
        let that = this;

        that.setData({
            invoice_status: 1,
            mask_status: 1
        })
    },

    /**
     * 选择是否需要发票
     */
    selectInvoice: function (e) {
        let that = this;
        let status = e.currentTarget.dataset.status;
        let order_invoice_content_list = that.data.shop_config.order_invoice_content_list;
        let order_info = that.data.order_info; //待付款订单信息
        let delivery_type = that.data.delivery_type; //配送方式
        let coupon_money = parseFloat(that.data.coupon_money) // 优惠券金额
        let express = 0.00;

        //根据配送方式选择运费
        if (delivery_type == 1) {
            express = parseFloat(that.data.express_money);
        } else if (delivery_type == 2) {
            express = parseFloat(that.data.pick_up_money);
        } else if (delivery_type == 3) {
            express = parseFloat(that.data.o2o_distribution);
        }
        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        let goods_count_money = parseFloat(that.data.goods_count_money);
        let balance = parseFloat(that.data.balance);
        let use_point = parseInt(that.data.use_point);
        let use_point_money = parseFloat(that.data.use_point_money);

        discount_money = discount_money + coupon_money;
        let pay_money = count_money + express - discount_money - balance;
        let old_pay_money = goods_count_money + express - discount_money;
        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let order_invoice_money = status == 1 ? order_invoice_tax / 100 * old_pay_money : 0.00;
        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
        pay_money = pay_money < 0 ? 0.00 : pay_money;
        pay_money = pay_money.toFixed(2);
        order_invoice_money = parseFloat(order_invoice_money).toFixed(2);

        //积分抵现-抵现
        if (order_info.point_config.is_open == 1) {
            use_point_money = parseFloat(use_point * order_info.point_config.convert_rate);
            use_point_money = use_point_money > pay_money ? pay_money : use_point_money;
            use_point = Math.ceil(use_point_money / order_info.point_config.convert_rate);
            pay_money = pay_money - use_point_money;
            pay_money = pay_money < 0 ? 0.00 : pay_money;
            pay_money = pay_money.toFixed(2);
        }

        that.setData({
            invoice_need: status,
            invoice_content: order_invoice_content_list[0],
            order_invoice_money: parseFloat(order_invoice_money).toFixed(2),
            pay_money: pay_money,
            use_point: use_point,
            use_point_money: parseFloat(use_point_money).toFixed(2)
        })

        that.closePoupo();
    },

    /**
     * 发票内容
     */
    invoiceContent: function (e) {
        let that = this;

        that.setData({
            invoice_content_status: 1,
            mask_status: 1
        })
    },

    /**
     * 选择发票内容
     */
    selectInvoiceContent: function (e) {
        let that = this;
        let content = e.currentTarget.dataset.content;

        that.setData({
            invoice_content: content
        })

        that.closePoupo();
    },

    /**
     * 修改配送时间
     */
    updateShippingTime: function (e) {
        let that = this;

        that.setData({
            shipping_time_status: 1,
            mask_status: 1
        })
    },

    /**
     * 选择配送时间
     */
    selectShippingTime: function (e) {
        let that = this;
        let shipping_time_index = e.currentTarget.dataset.index;

        that.setData({
            shipping_time_index: shipping_time_index,
        })
    },

    /**
      * 选择配送时间段
      */
    selectShippingTimeOut: function (e) {
        let that = this;
        let shipping_time_out_index = e.currentTarget.dataset.index;
        let shipping_time_out_val = that.data.shop_config.time_slot[shipping_time_out_index];
        shipping_time_out_val = shipping_time_out_val.start + ':00-' + shipping_time_out_val.end + ':00';

        that.setData({
            shipping_time_out_index: shipping_time_out_index,
            shipping_time_out_val: shipping_time_out_val
        })
    },

    /**
     * 删除配送时间
     */
    deleteShippingTime: function (e) {
        let that = this;

        that.setData({
            shipping_time_index: -1,
            shipping_time_out_index: -1,
            shipping_time_out_val: ''
        })
    },

    /**
     * 关闭弹框
     */
    closePoupo: function (e) {
        let that = this;

        that.setData({
            mask_status: 0, //遮罩层
            pay_box_status: 0, //支付方式弹框
            delivery_status: 0, //配送方式弹框
            coupon_status: 0, //优惠券弹框
            pick_up_status: 0, //自提点弹框
            express_company_status: 0, //物流公司弹框
            invoice_status: 0, //发票弹框
            invoice_content_status: 0, //发票内容弹框
            shipping_time_status: 0, //配送时间弹框
        })
    },

    /**
     * 选择预售款项
     */
    presellOptions: function (e) {
        let that = this;
        let presell_options = that.data.presell_options;
        let is_full_payment = e.currentTarget.dataset.type;

        if (is_full_payment == 1) {
            presell_options[0] = 0;
            presell_options[1] = 1;
        } else {
            presell_options[0] = 1;
            presell_options[1] = 0;
        }

        that.setData({
            is_full_payment: is_full_payment,
            presell_options: presell_options
        })
    },

    /**
     * 积分输入
     */
    inputPoint: function (event) {
        let that = this;
        let use_point = parseInt(event.detail.value);
        let max_use_point = parseInt(that.data.max_use_point);
        let use_point_money = parseFloat(that.data.use_point_money);
        let balance = parseFloat(that.data.balance);

        let delivery_type = that.data.delivery_type; //配送方式
        let express = 0.00;

        //根据配送方式选择运费
        if (delivery_type == 1) {
            express = parseFloat(that.data.express_money);
        } else if (delivery_type == 2) {
            express = parseFloat(that.data.pick_up_money);
        } else if (delivery_type == 3) {
            express = parseFloat(that.data.o2o_distribution);
        }
        let coupon_money = parseFloat(that.data.coupon_money) // 优惠券金额
        let order_info = that.data.order_info; //待付款订单信息
        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        let goods_count_money = parseFloat(that.data.goods_count_money);
        discount_money = discount_money + coupon_money;
        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let invoice_need = that.data.invoice_need; //是否需要发票
        let pay_money = count_money + express - discount_money;
        let old_pay_money = goods_count_money + express - discount_money;
        let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * old_pay_money : 0.00;

        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money) - balance;
        pay_money = pay_money < 0 ? 0.00 : pay_money;
        pay_money = pay_money.toFixed(2);

        if (use_point < 0) {
            use_point = 0;
            app.showBox(that, '积分输入错误');
        }

        pay_money = pay_money < 0 ? 0.00 : pay_money;
        pay_money = parseFloat(pay_money).toFixed(2);

        //积分抵现-抵现
        if (order_info.point_config.is_open == 1) {
            use_point = use_point > max_use_point ? max_use_point : use_point;
            use_point_money = parseFloat(order_info.point_config.convert_rate) * use_point;
            use_point_money = use_point_money > pay_money ? pay_money : use_point_money;
            use_point = Math.ceil(use_point_money / order_info.point_config.convert_rate);
            pay_money = pay_money - use_point_money;
            pay_money = pay_money < 0 ? 0.00 : pay_money;
            pay_money = pay_money.toFixed(2);
        } else {
            use_point = 0;
            use_point_money = 0.00;
        }

        that.setData({
            use_point: use_point,
            pay_money: pay_money,
            use_point_money: parseFloat(use_point_money).toFixed(2)
        })
        return use_point;
    },

    /**
     * 发票抬头输入
     */
    inputInvoiceTitle: function (e) {
        let that = this;
        let title = e.detail.value;

        that.setData({
            invoice_title: title
        })
    },

    /**
     * 纳税人识别号输入
     */
    inputTaxpayerIdentificationNumber: function (e) {
        let that = this;
        let identification_number = e.detail.value;

        that.setData({
            taxpayer_identification_number: identification_number
        })
    },

    /**
     * 留言输入
     */
    inputMessage: function (e) {
        let that = this;
        let leavemessage = e.detail.value;

        that.setData({
            leavemessage: leavemessage
        })
    },

    /**
     * 提交订单
     */
    commitOrder: function (event) {
        let that = this;
        let commitOrderFlag = that.data.commitOrderFlag;
        let order_tag = that.data.order_tag;
        let order_goods_type = that.data.order_goods_type;
        let goods_sku_list = that.data.goods_sku_list; //商品列表
        let user_telephone = that.data.user_telephone; //手机号
        let delivery_type = that.data.delivery_type; //配送方式
        let use_coupon = that.data.use_coupon; //优惠券
        let integral = that.data.integral; //积分
        let leavemessage = that.data.leavemessage; //留言
        let account_balance = that.data.balance; //使用余额
        let pay_type = that.data.pay_type; //支付方式
        let pick_up_id = that.data.pick_up; //自提点,
        let shipping_company_id = that.data.shipping_company_id; //物流公司
        let invoice_need = that.data.invoice_need; //是否需要发票
        let invoice_title = that.data.invoice_title; //发票抬头
        let taxpayer_identification_number = that.data.taxpayer_identification_number; //纳税人识别号
        let invoice_content = that.data.invoice_content; //发票内容
        let buyer_invoice = invoice_title + '$' + invoice_content + '$' + taxpayer_identification_number; //发票
        buyer_invoice = invoice_need == 1 ? buyer_invoice : '';
        let is_full_payment = that.data.is_full_payment; //预售是否全款
        let member_address = that.data.member_address;
        let balance = parseFloat(that.data.balance);
        let pay_money = parseFloat(that.data.pay_money);
        let point = parseFloat(that.data.member_account.point);
        let count_point_exchange = parseFloat(that.data.order_info.count_point_exchange);
        let combo_id = that.data.combo_id;
        let combo_buy_num = that.data.combo_buy_num;
        let shipping_time = that.data.shipping_time;
        let shipping_time_index = that.data.shipping_time_index;
        let shipping_time_val = shipping_time_index == -1 ? 0 : shipping_time[shipping_time_index].time;
        let shipping_time_out_val = that.data.shipping_time_out_val;
        let order_designated_delivery_time = that.data.shop_config.order_designated_delivery_time;
        let shop_config = that.data.shop_config;
        let point_exchange_type = that.data.order_info.point_exchange_type;
        let use_point = that.data.use_point;
        let point_config = that.data.order_info.point_config;
        let goods_count_money = parseFloat(that.data.goods_count_money);

        if (commitOrderFlag == 1) {
            return false;
        }
        app.clicked(that, 'commitOrderFlag');

        if (shop_config.seller_dispatching == 0 && shop_config.buyer_self_lifting == 0) {
            app.showBox(that, '商家未配置配送方式');
            app.restStatus(that, 'commitOrderFlag');
            return false;
        }

        if (delivery_type == 2 || isNaN(parseInt(shipping_time_val)) || order_designated_delivery_time == 0 || delivery_type == 3) {
            shipping_time_val = 0;
        }

        if (order_tag == 'buy_now' && order_goods_type == 0) {
            let myreg = /^(((13[0-9]{1})|(14[7]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
            if (user_telephone.length != 11 || !myreg.test(user_telephone)) {
                app.showBox(that, '请输入正确的手机号');
                app.restStatus(that, 'commitOrderFlag');
                return false;
            }
        } else {
            if (member_address == '' || member_address == null || member_address == undefined) {
                app.showBox(that, '请先选择收货地址');
                app.restStatus(that, 'commitOrderFlag');
                return false;
            }

            if (delivery_type == 2 && pick_up_id == 0) {
                app.showBox(that, '商家未配置自提点，请选择其他配送方式');
                app.restStatus(that, 'commitOrderFlag');
                return false;
            }
        }

        if (invoice_need == 1) {
            if (invoice_title == '') {
                app.showBox(that, '请输入个人或公司发票抬头');
                app.restStatus(that, 'commitOrderFlag');
                return false;
            }
        }

        if (point < count_point_exchange) {
            app.showBox(that, '当前用户积分不足');
            app.restStatus(that, 'commitOrderFlag');
            return false;
        }

        integral = point_config.is_open == 1 ? use_point : count_point_exchange;

        pay_type = pay_money == 0 ? 5 : pay_type;

        if (pay_type == 5) {
            let express = 0.00;

            //根据配送方式选择运费
            if (delivery_type == 1) {
                express = parseFloat(that.data.express_money);
            } else if (delivery_type == 2) {
                express = parseFloat(that.data.pick_up_money);
            } else if (delivery_type == 3) {
                express = parseFloat(that.data.o2o_distribution);
            }
            let coupon_money = parseFloat(that.data.coupon_money) // 优惠券金额
            let order_info = that.data.order_info; //待付款订单信息
            let discount_money = parseFloat(order_info.discount_money); //优惠金额
            let count_money = parseFloat(order_info.count_money); //商品总价
            discount_money = discount_money + coupon_money;
            let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
            let invoice_need = that.data.invoice_need; //是否需要发票
            pay_money = count_money + express - discount_money;
            let old_pay_money = goods_count_money + express;
            let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * old_pay_money : 0.00;
            pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
            pay_money = pay_money < 0 ? 0.00 : pay_money;
            pay_money = pay_money.toFixed(2);
            pay_type = pay_money == 0 ? 0 : pay_type;
        }
        let url = combo_id == 0 ? 'api.php?s=order/orderCreate' : 'api.php?s=order/comboPackageOrderCreate';
        url = order_tag == 'buy_now' && order_goods_type == 0 ? 'api.php?s=order/virtualOrderCreate' : url;
        url = order_tag == 'groupbuy' ? 'api.php?s=order/groupBuyOrderCreate' : url;
        url = order_tag == 'js_point_exchange' ? 'api.php?s=order/pointExchangeOrderCreate' : url;
        url = order_tag == 'goods_presell' ? 'api.php?s=order/presellOrderCreate' : url;

        app.sendRequest({
            url: url,
            data: {
                user_telephone: user_telephone,
                use_coupon: use_coupon,
                integral: integral,
                goods_sku_list: goods_sku_list,
                leavemessage: leavemessage,
                account_balance: account_balance,
                pay_type: pay_type,
                buyer_invoice: buyer_invoice,
                pick_up_id: pick_up_id,
                shipping_company_id: shipping_company_id,
                combo_package_id: combo_id,
                buy_num: combo_buy_num,
                shipping_time: shipping_time_val,
                distribution_time_out: shipping_time_out_val,
                point_exchange_type: point_exchange_type,
                shipping_type: delivery_type,
                is_full_payment: is_full_payment
            },
            success: function (res) {
                let code = res.code;
                let data = res.data;

                if (code == 0) {
                    if (data.order_id == -4012) {
                        app.showBox(that, '当前收货地址暂不支持配送！');
                        app.restStatus(that, 'commitOrderFlag');
                        return false;
                    }

                    if (data.order_id == -4014) {
                        app.showBox(that, '当前地址不支持货到付款');
                        app.restStatus(that, 'commitOrderFlag');
                        return false;
                    }

                    if (data.out_trade_no == undefined || data.out_trade_no == '') {
                        app.showBox(that, '订单生成失败');
                        app.restStatus(that, 'commitOrderFlag');
                        return false;
                    }

                    if (pay_type == 5 || pay_money == 0) {
                        let out_trade_no = data.out_trade_no;

                        wx.reLaunch({
                            url: '/pagesother/pages/pay/paycallback/paycallback?status=1&out_trade_no=' + out_trade_no,
                        })
                    } else {
                        let out_trade_no = data.out_trade_no;
                        if (order_tag == 'buy_now' && order_goods_type == 0) {
                            app.setTabType(2);
                        } else {
                            app.setTabType('');
                        }
                        if (order_tag == 'goods_presell') {
                            app.setTabType(4);
                        }
                        wx.navigateTo({
                            url: '/pagesother/pages/pay/getpayvalue/getpayvalue?out_trade_no=' + out_trade_no
                        })
                    }
                }
                console.log(res)
            }
        })
    },
})