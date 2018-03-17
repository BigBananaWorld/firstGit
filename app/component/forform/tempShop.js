const htmlTpl = require("Templates/formTemplate/tempShop.html");
const htmlOption = require("Templates/formTemplate/tempAreaOption.html");
const htmlShopOption = require("Templates/formTemplate/tempShopOption.html");
/**
 * 根据商店地区选取店铺
 */
module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events: {
        "change select[name='province']": "onChangeProvince",
        "change select[name='city']": "onChangeCity"
    },

    initialize: function(loginKey) {
        this.key = loginKey;
        this.province = null;
        this.city = null;
        this.shop = null;

        this.listenTo(this, "proReady", this.proRender); //省数据接收完毕
        this.listenTo(this, "cityReady", this.cityRender); //市数据接收完毕
        this.listenTo(this, "shopReady", this.shopRender); //区数据接收完毕

        this.url = 'https://www.kziche.com/admin/Member/location';
        this.shopUrl = "https://www.kziche.com/admin/Order/storeList";
        this.proParam = {
            key: this.key,
            type: 1
        };
        this.cityParam = {
            key: this.key,
            type: 2,
            parentId: 0
        };
        this.shopParam = {
            key : this.key,
            searchCriteria: '',
            page: "",
            pagesize: "",
           store_name : "",
           province_id:"",
           city_id : "",
           cate : ""
        };
        this.queryData(this.url, this.proParam, 1);
    },

    render: function() {
        this.$el.append(this.template({
            "title": this.title,
            "name": this.name,
            "msg": this.msg
        }));
        return this;
    },

    setParam: function(param) {
        if (!param) {
            return;
        }
        this.title = param.title || "三级级联"; //标题
        this.name = param.name || ""; //该输入框绑定的传出参数名
        this.msg = param.msg || ""; //输入框注意事项
    },

    /**
     * 查询数据
     * @param  {[type]} url   [description]
     * @param  {[type]} param [description]
     * @param  {[type]} type  [查询的级别,1省,2市,3区]
     * @return {[type]}       [description]
     */
    queryData: function(url, param, typeto, callBack) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (typeto == 1) {
                    this.trigger('proReady', res.data);
                }
                if (typeto == 2) {
                    this.trigger('cityReady', res.data);
                }
                if (typeto == 3) {
                    this.trigger('shopReady', res.data);
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this),
            complete: function() {
                if (callBack) {
                    if (typeto == 1) {
                        callBack(this.province);
                    }
                    if (typeto == 2) {
                        callBack(this.city);
                    }
                    if (typeto == 3) {
                        callBack(this.shop);
                    }
                }

            }.bind(this)
        })
    },

    onChangeProvince: function(e) {
        var proid = $(e.target).val();
        this.cityParam.parentId = proid;
        this.queryData(this.url, this.cityParam, 2);
        this.$("select[name='shop']").empty().append('<option value="">请选择</option>').attr("disabled", true);
    },

    onChangeCity: function(e) {
        var cityid = $(e.target).val();
        var temp = this.getValue();
        var province = temp.province;
        var city = temp.city;
        this.shopParam.province_id = province;
        this.shopParam.city_id = city;
        this.queryData(this.shopUrl, this.shopParam, 3);
        this.$("select[name='shop']").attr("disabled", false);
    },

    proRender: function(data) {
        var templateOptions = _.template(htmlOption);
        this.$("select[name='province']").empty();
        this.$("select[name='province']").append(templateOptions({
            options: data
        }));
    },

    cityRender: function(data) {
        var templateOptions = _.template(htmlOption);
        this.$("select[name='city']").empty();
        this.$("select[name='city']").append(templateOptions({
            options: data
        }));
    },

    shopRender: function(data) {
        var data = data || [];
        this.$("select[name='shop']").empty();
        var templateOptions = _.template(htmlShopOption);
        this.$("select[name='shop']").append(templateOptions({
            options: data 
        }));
    },

    getValue: function() {
        var pro = this.$("select[name='province']").val();
        var city = this.$("select[name='city']").val();
        var shop = this.$("select[name='shop']").val();
        return {
            province: pro,
            city: city,
            shop: shop
        }
    },

    setValue: function(pro, city, shop) {
        var me = this;
        if (pro) {
            this.province = pro;
            this.queryData(this.url, this.proParam, 1, function(e) {
                me.$("select[name='province']").val(e);
            });
        }

        if (city) {
            this.city = city;
            this.cityParam.parentId = pro;
            this.queryData(this.url, this.cityParam, 2, function(e) {
                me.$("select[name='city']").val(e);
            });
        }

        if (shop) {
            this.shop = shop;
            this.shopParam.province_id = this.province;
            this.shopParam.city_id = this.city;
            this.queryData(this.shopUrl, this.shopParam, 3, function(e) {
                me.$("select[name='shop']").val(e);
            });
        }
    },
    
    getName: function() {
        return this.name;
    }

});