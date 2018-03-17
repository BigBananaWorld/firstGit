const htmlTpl = require("Templates/viewsTemplate/formExample.html");
const compCheckbox = require("Component/forform/tempCheckbox.js");
const compDate = require("Component/forform/tempDate.js");
const compSelect = require("Component/forform/tempSelect.js");
const compText = require("Component/forform/tempText.js");
const compFile = require("Component/forform/tempSingleFile.js");
const compShop = require("Component/forform/tempShop.js");

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
            titles: ["员工管理","员工详情"],
            back : upUrl
        }));

        this.textUserName = new compText();
        this.textRealName = new compText();
        this.textPassword = new compText();
        this.textConfirmPassword = new compText();
        this.textPhone = new compText();

        this.checkboxSex = new compCheckbox();
        this.selectRole = new compSelect();
        this.dateBirthday = new compDate();
        this.selectShop = new compShop(this.key);

        this.filePhoto = new compFile();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish',this.confirmFinish);//表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Order/staffDetail';
        this.param = {
            key: this.key,
            staff_id: this.code

        }
        //如果传入参数则为编辑页面，没有则为添加页面
        if((typeof code) !== "undefined" && code != null){
            this.queryData(this.url, this.param);
        }
    },

    render: function() {
        this.$('#main').append(this.textUserName.render().el);
        this.$('#main').append(this.textRealName.render().el);
        this.$('#main').append(this.textPassword.render().el);
        this.$('#main').append(this.textConfirmPassword.render().el);
        this.$('#main').append(this.selectRole.render().el);
        this.$('#main').append(this.checkboxSex.render().el);
        this.$('#main').append(this.dateBirthday.render().el);
        this.$('#main').append(this.selectShop.render().el);
        this.$('#main').append(this.filePhoto.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textUserName.setParam({
            title: "员工账户",
            msg : "员工用户名统一为手机号码",
            readonly : (this.code==0)?false : true
        });
        this.textPassword.setParam({
            title: "密码",
            msg : "密码长度为6-12位",
            // err : "密码格式不符",
            // pattern : /^\w{6,12}$/
        });
        this.textConfirmPassword.setParam({
            title: "确认密码",

        });
        this.textRealName.setParam({
            title: '姓名',
            msg: "员工真实姓名"
        })
        this.dateBirthday.setParam({
            title: '员工生日'
        })
        this.selectRole.setParam({
            title: "员工角色",
            options: [{
                    value: 2,
                    content: "员工"
                },
                {
                    value: 1,
                    content: "店长"
                }

            ]
        });
        this.checkboxSex.setParam({
            title: '性别',
            options: [{
                    value: 0,
                    content: "保密"
                },
                {
                    value: 1,
                    content: "男"
                },
                {
                    value: 2,
                    content: "女"
                }
            ]
        });
        this.filePhoto.setParam({
            title : "员工照片"
        });
        this.selectShop.setParam({
            title : "所属店铺"
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
        this.textUserName.setValue(data.phone);
        this.textRealName.setValue(data.staff_name);
        // this.textPassword = new compText();
        // this.textConfirmPassword = new compText();
        // this.textPhone = new compText();

        this.checkboxSex.setValue(data.sex);

        this.selectRole.setValue(data.role_id);
        this.dateBirthday.setValue(data.birth);
        this.selectShop.setValue(data.province_id,data.city_id,data.store_id);
        this.filePhoto.setFile(data.pic)
    },

    onClickBack: function() {

    },

    onClickClear: function() {

    },

    onClickConfirm: function() {
        if(!this.checkFormContent()){
            alert("表单内容填写格式有误");
            return ;
        }

        var form = new FormData();
        var name = this.textRealName.getValue();
        var password = this.textPassword.getValue();
        var confirmPassword = this.textConfirmPassword.getValue();
        var role = this.selectRole.getValue();
        var sex = this.checkboxSex.getValue();
        var birthday = this.dateBirthday.getValue();
        var store_id = this.selectShop.getValue();
        var file = this.filePhoto.getFiles();
        var ossPhoto = this.filePhoto.isChange();
        var phone = this.textUserName.getValue();
    
        form.append('id',this.code);
        form.append('password',password);
        form.append('repassword',confirmPassword);
        form.append('role_id',role);
        form.append('store_id',store_id.shop);
        form.append('name',name);
        form.append('sex',sex);
        form.append('phone',phone);
        form.append('cardid',"");//身份证号码
        form.append('pic',file[0]);
        form.append('oss_photo_notnull', ossPhoto);
        form.append('birth', birthday);
        
        $.ajax({
            url: 'https://www.kziche.com/admin/Order/addStaff',
            type: 'post',
            data: form,
            contentType: false,  
            processData: false,  
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

    confirmFinish : function(){
        alert("提交成功");
        window.history.back();
    },

    checkFormContent : function(){
        var passBol = this.textPassword.checkValue();
        var passSame = (this.textConfirmPassword.getValue() == this.textPassword.getValue());
        return passBol && passSame;
    },

    removeEl: function() {
        this.remove();
    }

});