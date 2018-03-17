const htmlTpl = require("Templates/viewsTemplate/member/accountChange.html");
const compText = require("Component/forform/tempText.js");
const compMultSelect = require("Component/forform/tempMultiSelect.js");

var multiSelectModel = Backbone.Model.extend({
    url: "https://www.kziche.com/admin/Member/cardList"
});

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear"
    },

    initialize: function(code, upUrl, loginKey) {
        this.memberId = code;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["会员管理", "会员列表", "会员详情", "会员账户", "账户变更"],
            back: true
        }));

        this.textReason = new compText();
        this.multCard = new compMultSelect();
        
        this.selectModel = new multiSelectModel();
        this.selectModel.on("change",this.fillSelectOption,this);

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish',this.confirmFinish);//表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Member/memberDetail';
        this.param = {
            key: this.key,
            member_id: code
        }
        //如果传入参数则为编辑页面，没有则为添加页面
        if ((typeof code) !== "undefined") {
            this.queryData(this.url, this.param);
        }
    },

    render: function() {
        this.$('#main').append(this.textReason.render().el);
        this.$('#main').append(this.multCard.render().el);

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textReason.setParam({
            title: "变更原因"
        });

        this.multCard.setParam({
            title: "添加次卡"
        });
        //获取次卡数据
        this.selectModel.fetch({
            type: 'get',
            dataType: 'json',
            data: {
                 key : this.key,
                 page : 1,
                 pagesize : 20
            },
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

    fillPage: function(data) {
        this.$("#user").text(data.nickname);
        this.$("#money").text(data.balance);
        this.$("#score").text(data.integral);
    },

    onClickClear: function(e) {
        
    },

    confirmFinish : function(){
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function(e) {
        var me = this;
        var moneyOp = this.$("select[name='money']").val();
        var money = this.$("input[name='money']").val();
        var reason = this.textReason.getValue();
        var card_id = this.multCard.getValue();
    
        $.ajax({
            url: 'https://www.kziche.com/admin/Member/changeAccount',
            type: 'post',
            dataType: 'json',
            data: {
                key: me.key,
                member_id: me.memberId,
                accountState: moneyOp,
                reason: reason,
                accountNum: money,
                integralState: 1,
                integralNum: 2,
                card_id : card_id
            },
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish', res.data);
                } else {
                    alert(res.msg);
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function() {
                alert('页面出错');
            }.bind(this)
        })
    },

    fillSelectOption : function(mod,option){
        var data = mod.get("data");
        var options = [];
        _.each(data,function(val,index){
            var temp = {};
            temp.value = val.id;
            temp.content = val.name;
            options.push(temp);
        });
    
        this.multCard.setOptions(options);
    },

    removeEl: function() {
        this.remove();
    }

});