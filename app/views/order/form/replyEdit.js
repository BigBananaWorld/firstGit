const htmlTpl = require("Templates/viewsTemplate/order/orderReply.html");
const htmlDetail = require("Templates/viewsTemplate/order/orderReplyPay.html");
const compText = require("Component/forform/tempText.js");
require("CSSdir/orderview.css");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function(code,upUrl,loginKey) {
        this.orderid = sessionStorage.getItem("orderid");
        this.code = code || 0;
        this.key = loginKey;

        this.$el.html(this.template({
            titles: ["订单管理","评价列表","评价详情"],
            back : upUrl
        }));

        this.textReply = new compText();
        
        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        // this.listenTo(this, 'confirmSuccess',this.confirmFinish);//表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Order/commentDetail';
        this.param = {
            key : this.key,
            comment_id : this.code,
            order_id : this.orderid
        }
        //如果传入参数则为编辑页面，没有则为添加页面
         // if ((typeof code) !== "undefined" && code != null){
            this.queryData(this.url, this.param);
        // }
    },

    render: function() {
        this.$('#reply').append(this.textReply.render().el);

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textReply.setParam({
            title: '回复用户内容'
        });
       
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function(url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res);
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

    fillPage: function(res) {
        this.textReply.setValue(res.reply);
        var templateDetail = _.template(htmlDetail);
        this.$("#orderDetail").append(templateDetail({
            items : res.items
        }));
        this.$("#order").append(res.data.order_sn);
        this.$("#createTime").append(res.data.create_time);
        this.$("#nickname").append(res.data.nickname);
        this.$("#score").append(res.data.score);
        this.$("#comment").append(res.data.content);
        this.$("#storename").append(res.data.store_name);
    },

    onClickClear: function(){

    },

    onClickConfirm: function(){
        var content = this.textReply.getValue();
        var me = this;
        $.ajax({
            url: 'https://www.kziche.com/admin/Order/commentReply',
            type: 'post',
            data: {
                 key : me.key,
                 comment_id : this.code,
                 content  : content
            },
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

    removeEl: function() {
        this.remove();
    }

});