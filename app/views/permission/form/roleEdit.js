const htmlTpl = require("Templates/viewsTemplate/formExample.html");
const compSelect = require("Component/forform/tempSelect.js");
const compText = require("Component/forform/tempText.js");
const compPermission = require("Component/forform/tempPermission.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #back": "onClickBack"
    },

    initialize: function(code,upUrl,loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["权限管理","角色列表","角色详情"],
            back : upUrl
        }));
        this.textName = new compText();
        this.permission = new compPermission(this.key);
        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this.permission,"permissionReady",this.startGetData);//因为该组件也需要异步调用数据，所以需要等待该组件渲染完毕
        this.listenTo(this, 'confirmFinish',this.confirmFinish);//表单提交成功后的回调函数
    },

    render: function() {
        this.$('#main').append(this.textName.render().el);
        this.$('#main').append(this.permission.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textName.setParam({
            title: "角色名称",
            msg: "管理角色名称"
        });

        this.permission.setParam({
            name : 'permission'
        });
    },

    startGetData : function(){
        this.url = 'https://www.kziche.com/admin/Order/roleDetail';
        this.param = {
            key: this.key,
            id: this.code
        }
        //如果传入参数则为编辑页面，没有则为添加页面
        if((typeof this.code) !== "undefined" && this.code != null){
            this.queryData(this.url, this.param);
        }
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
        this.textName.setValue(data.name);
        this.permission.setValue(data.authority)
    },

    onClickClear: function(e){
       
    },

    confirmFinish : function(){
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function(e){
        var me = this;
        var name = this.textName.getValue();
        var authority = this.permission.getValue();

       $.ajax({
            url: 'https://www.kziche.com/admin/Order/addRole',
            type: 'post',
            dataType: 'json',
            data: {
                key: me.key,
                id : me.code,
                name : name,
                authority : authority
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
                console.log('页面出错');
            }.bind(this)
        })
    },

    removeEl: function() {
        this.remove();
    }

});