const htmlTpl = require("Templates/viewsTemplate/formExample.html");
const compText = require("Component/forform/tempText.js");

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
            titles: ["订单管理","退款原因","退款原因详情"],
            back : upUrl
        }));

        this.textReason = new compText();
        
        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish',this.confirmFinish);//表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Order/refundReasonDetail';
        this.param = {
            key : this.key,
            id: this.code
        }
        //如果传入参数则为编辑页面，没有则为添加页面
         if ((typeof code) !== "undefined" && code != null){
            this.queryData(this.url, this.param);
        }
    },

    render: function() {
        this.$('#main').append(this.textReason.render().el);

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textReason.setParam({
            title: '退款原因',
            msg : "退款原因尽量简短"
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
        this.textReason.setValue(res.data);
    },

    onClickClear: function(){

    },

    confirmFinish : function(){
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function(){
        var content = this.textReason.getValue();
        var me = this;
        $.ajax({
            url: 'https://www.kziche.com/admin/Order/addrefundReason',
            type: 'post',
            data: {
                 key : me.key,
                 id : me.code,
                 name : content
            },
            success: function(res) {
              if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail',res.msg);
                }
            }.bind(this),
            error: function() {
                alert('页面出错');
            }.bind(this)
        })
    },

    removeEl: function() {
        this.remove();
    }

});