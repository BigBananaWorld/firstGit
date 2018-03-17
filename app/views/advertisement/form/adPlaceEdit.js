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
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["广告管理","广告位详情"],
            back : upUrl
        }));

        this.textName = new compText();
        this.textWeight = new compText();
        this.textHeight = new compText();
        
        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish',this.confirmFinish);//表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Ad/showAdPosition';
        this.param = {
            key : this.key,
            id : code,
        }
        //如果传入参数则为编辑页面，没有则为添加页面
         if ((typeof code) !== "undefined" && code != null){
            this.queryData(this.url, this.param)
        }
    },

    render: function() {
        this.$('#main').append(this.textName.render().el);
        this.$('#main').append(this.textWeight.render().el);
        this.$('#main').append(this.textHeight.render().el);

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textName.setParam({
            title: "广告位名称"
        });
        this.textWeight.setParam({
            title: '宽度',
            msg: "格式为整数,单位是px",
            pattern:  /^\d*$/,
            err:"请输入数字!"
        });
        this.textHeight.setParam({
            title: '高度',
            msg: "格式为整数,单位是px",
            pattern:  /^\d*$/,
            err:"请输入数字!"
        })
       

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

    fillPage: function(data) { //这里再进行数据的装配
        this.textName.setValue(data.name)
        this.textWeight.setValue(data.weight);
        this.textHeight.setValue(data.height);
    },

    onClickClear: function(){

    },

    confirmFinish : function(){
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function(){
        var name = this.textName.getValue();
        var weight = this.textWeight.getValue();
        var height = this.textHeight.getValue()
        
        $.ajax({
            url: 'https://www.kziche.com/admin/Ad/addAdPOsition',
            type: 'post',
            data: {
                 key : this.key,
                 id : this.code,
                 name : name,
                 weight : weight,
                 height : height
            },
            success: function(res) {
                if (res.code == 200) {
                   this.trigger('confirmFinish');
                } else {
                    var temp = {};
                    alert(res.msg);
                    // this.trigger('dataReady', temp);
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