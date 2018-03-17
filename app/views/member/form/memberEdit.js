const htmlTpl = require("Templates/viewsTemplate/member/formExampleMember.html");
const htmlCar = require("Templates/viewsTemplate/member/carMessage.html");
const compCheckbox = require("Component/forform/tempCheckbox.js");
const compDate = require("Component/forform/tempDate.js");
const compSelect = require("Component/forform/tempSelect.js");
const compText = require("Component/forform/tempText.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear"
    },

    initialize: function(code,upUrl,loginKey) {
        this.key = loginKey;
        var isAdd = false;
        (code != null && (typeof code) !== "undefined")?isAdd = false:isAdd=true;

        this.$el.html(this.template({
            titles: ["会员管理","会员列表","会员详情"],
            isAdd : isAdd,
            code : code,
            back : upUrl
        }));

        this.textUserName = new compText();
        this.textRealName = new compText();
        this.textEmail = new compText();
        this.textPhone = new compText();
        this.textPassword = new compText();
        this.textConfirmPassword = new compText();

        this.checkboxSex = new compCheckbox();

        this.selectRank = new compSelect();
        this.dateBirthday = new compDate();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        // this.listenTo(this, 'confirmSuccess',this.confirmFinish);//表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Member/memberDetail';
        this.param = {
            key : this.key,
            member_id : code,
        }
        //如果传入参数则为编辑页面，没有则为添加页面
        if ((typeof code) !== "undefined" && code != null){
            this.queryData(this.url, this.param)
        }
    },

    render: function() {
        this.$('#main').append(this.textUserName.render().el);
        // this.$('#main').append(this.textRealName.render().el);
        this.$('#main').append(this.textEmail.render().el);
        this.$('#main').append(this.textPhone.render().el);
        this.$('#main').append(this.textPassword.render().el);
        this.$('#main').append(this.textConfirmPassword.render().el);
        // this.$('#main').append(this.selectRank.render().el);
        this.$('#main').append(this.checkboxSex.render().el);
        this.$('#main').append(this.dateBirthday.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textUserName.setParam({
            title: "用户姓名"
        });
        this.textEmail.setParam({
            title: "邮箱",
            msg: "按照正确的邮箱格式输入例：abc@qq.com",
            pattern : /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/,
            err : "邮箱格式错误"
        });
        this.textPhone.setParam({
            title: "手机号码",
            msg: "输入例子:13300000000",
            err:"号码格式错误",
            pattern:/^1\d{10}$/
        });
        this.textPassword.setParam({
            title: "登陆密码"
        });
        this.textConfirmPassword.setParam({
            title: "确认密码"
        });
        this.textRealName.setParam({
            title: '实名',
            msg: "用户真实姓名"
        });

        this.selectRank.setParam({
            title: "会员等级",
            options: [{
                    value: 1,
                    content: "铜牌会员"
                },
                {
                    value: 2,
                    content: "银牌会员"
                },
                {
                    value: 3,
                    content: "金牌会员"
                },
                {
                    value: 4,
                    content: "钻石会员"
                }
            ]
        });
        this.checkboxSex.setParam({
            title: '性别',
            options: [{
                    value: "男",
                    content: "男"
                },
                {
                    value: "女",
                    content: "女"
                },
                {
                    value: "保密",
                    content: "保密"
                }
            ]
        })
        this.dateBirthday.setParam({
            title: "用户生日"
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
        this.textUserName.setValue(data.name);
        this.textEmail.setValue(data.email);
        this.textPhone.setValue(data.phone);
        this.checkboxSex.setValue(data.sex);
        this.dateBirthday.setValue(data.birthday);
        this.$("#balance").text(data.balance);

        var temp =  _.template(htmlCar);
        this.$("#carMsg").append(temp({
            items : data.car
        }))
    },

    onClickClear: function(e){
       
    },

    onClickConfirm: function(e){
        //会员编辑还没有接口
    },

    removeEl: function() {
        this.remove();
    }

});