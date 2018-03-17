const htmlTpl = require("Templates/viewsTemplate/order/refundView.html");
const htmlPay = require("Templates/viewsTemplate/order/orderViewPay.html");
require("CSSdir/orderview.css");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    events : {
        "click #agree" : "onClickAgree",
        "click #notagree" : "onClickNotagree",
        "click #submit" : "onClickSubmit",
        "click #cancel" : "onClickCancel"
    },

    template: _.template(htmlTpl),

    initialize: function(code,upUrl,loginKey) {
        this.code = code || 0;
        this.key = loginKey;

        this.listenTo(this, 'dataReady', this.fillPage);

        this.url = 'https://www.kziche.com/admin/Order/refundDetail';
        this.param = {
            key : this.key,
            refund_id : this.code
        }

        if ((typeof code) !== "undefined" && code != null){
            this.queryData(this.url, this.param);
        }
    },

    render: function() {
        this.$el.append(this.template({
            titles: ["订单管理","退款申请列表","退款详情"],
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
        this.$("#phone").html(data.phone);
        this.$("#reason").html(data.refund_name + data.reason);
        this.$("#order").html(data.order_sn);
        this.$("#createTime").html(data.create_time);
        this.$("#amount").html(data.amount);
        this.$("#actual").html(data.actual_money);
        var temp =  _.template(htmlPay);
        this.$("#orderDetail").append(temp({
            items : data.content
        }));

        this.param = {
            key : this.key,
            order_sn : data.order_sn,
            refund_id : this.code,
            amount: data.amount,
            order_id : data.order_id,
            member_id : data.member_id,
            pay_type : data.pay_type
        };
    },

    onClickAgree : function(e){
        this.$("#confirm").show();
    },

    onClickNotagree : function(e){
        var content = this.$("#suggestion").val();
        var isAgree = 2;
        this.param.is_agree = isAgree;
        this.param.advice = content;
        $.ajax({
            url: 'https://www.kziche.com/admin/Order/refund',
            type: 'post',
            data: this.param,
            success: function(res) {
              if (res.code == 200) {
                    alert("提交成功");
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail',res.msg);
                }
            }.bind(this),
            error: function() {
                alert('页面出错');
            }.bind(this)
        });
    },

    onClickSubmit : function(e){
        var content = this.$("#suggestion").val();
        var isAgree = 1;
        this.param.is_agree = isAgree;
        this.param.advice = content;
        $.ajax({
            url: 'https://www.kziche.com/admin/Order/refund',
            type: 'post',
            data: this.param,
            success: function(res) {
              if (res.code == 200) {
                    alert("上传成功");
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail',res.msg);
                }
            }.bind(this),
            error: function() {
                alert('页面出错');
            }.bind(this)
        });
    },

    onClickCancel : function(e){
        this.$("#confirm").hide();
    },

    removeEl: function() {
        this.remove();
    }

});