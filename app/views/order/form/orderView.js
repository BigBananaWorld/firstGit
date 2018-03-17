const htmlTpl = require("Templates/viewsTemplate/order/orderView.html");
const htmlPay = require("Templates/viewsTemplate/order/orderViewPay.html");
require("CSSdir/orderview.css");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function(code,upUrl,loginKey) {
        this.code = code || 0;
        this.key = loginKey;

        this.listenTo(this, 'dataReady', this.fillPage);

        this.url = 'https://www.kziche.com/admin/Order/orderDetail';
        this.param = {
            key : this.key,
            order_id : this.code
        }

        if ((typeof code) !== "undefined" && code != null){
            this.queryData(this.url, this.param);
        }
    },

    render: function() {
        this.$el.append(this.template({
            titles: ["订单管理","订单列表","订单详情"],
            back : true
        }));
        return this;
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function(url,param) {
        var me =  this;
       $.ajax({
            url: url,
            type:  'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        })
    },

    fillPage : function(data){
        this.$("#nickname").html(data.nickname);
        this.$("#store").html(data.store_name);
        this.$("#order").html(data.order_sn);
        this.$("#createTime").html(data.create_time);
        this.$("#sumAcount").html(data.sum_money);
        this.$("#actual").html(data.actual_money);
        this.$("#payType").html(data.pay_type_name);
        this.$("#wechat_sn").html(data.wechat_sn);
        var temp =  _.template(htmlPay);
        this.$("#orderDetail").append(temp({
            items : data.content
        }))

    },

    removeEl: function() {
        this.remove();
    }

});