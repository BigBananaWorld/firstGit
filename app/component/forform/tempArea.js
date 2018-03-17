const htmlTpl = require("Templates/formTemplate/tempArea.html");
const htmlOption = require("Templates/formTemplate/tempAreaOption.html");
/**
 * 级联组件
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
        this.county = null;
        this.listenTo(this, "proReady", this.proRender); //省数据接收完毕
        this.listenTo(this, "cityReady", this.cityRender); //市数据接收完毕
        this.listenTo(this, "countyReady", this.countyRender); //区数据接收完毕

        this.url = 'https://www.kziche.com/admin/Member/location';
        this.proParam = {
            key: this.key,
            type: 1
        };
        this.cityParam = {
            key: this.key,
            type: 2,
            parentId: 0
        };
        this.countyParam = {
            key: this.key,
            type: 3,
            parentId: 0
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
        this.key = param.key || "";//访问接口的登陆秘钥
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
                    this.trigger('countyReady', res.data);
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
                        callBack(this.county);
                    }
                }

            }.bind(this)
        })
    },

    onChangeProvince: function(e) {
        var proid = $(e.target).val();
        this.cityParam.parentId = proid;
        this.queryData(this.url, this.cityParam, 2);
        this.$("select[name='county']").empty().append('<option value="">请选择</option>').attr("disabled", true);
    },

    onChangeCity: function(e) {
        var cityoid = $(e.target).val();
        this.countyParam.parentId = cityoid;
        this.queryData(this.url, this.countyParam, 3);
        this.$("select[name='county']").attr("disabled", false);
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

    countyRender: function(data) {
        var templateOptions = _.template(htmlOption);
        this.$("select[name='county']").empty();
        this.$("select[name='county']").append(templateOptions({
            options: data
        }));
    },

    getValue: function() {
        var pro = this.$("select[name='province']").val();
        var city = this.$("select[name='city']").val();
        var county = this.$("select[name='county']").val();
        return {
            province: pro,
            city: city,
            county: county
        }
    },

    setValue: function(pro, city, county) {
        var me = this;
        if (pro) {
            this.province = pro;
            this.queryData(this.url, this.proParam, 1, function(e) {
                me.$("select[name='province']").val(e);
            });
            if(!city){
                this.cityParam.parentId = pro;
                this.queryData(this.url, this.cityParam, 2);
                this.$("select[name='county']").empty();
            };
        }

        if (city) {
            this.city = city;
            this.cityParam.parentId = pro;
            this.queryData(this.url, this.cityParam, 2, function(e) {
                me.$("select[name='city']").val(e);
            });
            if(!county){
                this.countyParam.parentId = city;
                this.queryData(this.url, this.countyParam, 3);
            }
        }

        if (county) {
            this.county = county;
            this.countyParam.parentId = city;
            this.queryData(this.url, this.countyParam, 3, function(e) {
                me.$("select[name='county']").val(e);
            });
        }
    },
    
    getName: function() {
        return this.name;
    },

    test : function(){
        console.log(this.getValue());
        this.setValue(37,128);
    }

});