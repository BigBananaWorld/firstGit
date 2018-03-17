const htmlTpl = require("Templates/viewsTemplate/formExample.html");
const compSelect = require("Component/forform/tempSelect.js");
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
           titles: ["权限管理","管理员列表","管理员详情"],
            back : upUrl
        }));

        this.textUserName = new compText();
        this.textPassword = new compText();
        this.textConfirmPassword = new compText();
        this.textName = new compText();

        this.selectRole = new compSelect();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish',this.confirmFinish);//表单提交成功后的回调函数
        this.listenTo(this, 'renderFinish',this.renderPageComplete);//页面渲染完成，主要是看下拉框渲染完成

        this.url = 'https://www.kziche.com/admin/Order/manageDetail';
        this.param = {
            key: this.key,
            manage_id: this.code
        }
       
    },

    render: function() {
        this.$('#main').append(this.textUserName.render().el);
        this.$('#main').append(this.textName.render().el);
        this.$('#main').append(this.textPassword.render().el);
        this.$('#main').append(this.textConfirmPassword.render().el);
        this.$('#main').append(this.selectRole.render().el);
        return this;
    },

    renderPageComplete : function(){
         //如果传入参数则为编辑页面，没有则为添加页面
        if((typeof this.code) !== "undefined" && this.code != null){
            this.queryData(this.url, this.param)
        }
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textUserName.setParam({
            title: "手机号码"
        });
        this.textName.setParam({
            title: "姓名"
        });
        this.textPassword.setParam({
            title: "登陆密码"
        });
         this.textConfirmPassword.setParam({
            title: "确认密码"
        });
        this.selectRole.setParam({
            title: "角色",
            name : "role",
            options: [{
                    value: 1,
                    content: "超级管理员"
                },
                {
                    value: 2,
                    content: "客服"
                }
            ]
        });
        this.fillSelectOption();

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
        this.textUserName.setValue(data.phone);
        this.textName.setValue(data.name);
        this.selectRole.setValue(data.role_id);
    },

    onClickClear: function(e){
        
    },

    confirmFinish : function(){
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function(e){
        var me = this;
        var userName = this.textUserName.getValue();
        var password = this.textPassword.getValue();
        var confirmPassword = this.textConfirmPassword.getValue();
        var name = this.textName.getValue();
        var role = this.selectRole.getValue();

       $.ajax({
            url: 'https://www.kziche.com/admin/Order/addManage',
            type: 'post',
            dataType: 'json',
            data: {
                key: me.key,
                id : me.code,
                phone : userName,
                password : password,
                repassword : confirmPassword,
                role_id : role,
                name : name
            },
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg)
                }
            }.bind(this),
            error: function() {
                alert('页面出错');
            }.bind(this)
        })
    },

     fillSelectOption : function(){
        var me = this;
        $.ajax({
            url: "https://www.kziche.com/admin/Order/roleList",
            type: 'get',
            dataType: 'json',
            data: {
                 key : me.key
            },
            success: function(res) {
                if (res.code == 200) {
                    me.selectRole.setOptions(res.data);
                    this.trigger("renderFinish");
                } else {
                    var temp = [];
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        });
    },

    removeEl: function() {
        this.remove();
    }

});