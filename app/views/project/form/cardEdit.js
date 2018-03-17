const htmlTpl = require("Templates/viewsTemplate/formExample.html");
const compCheckbox = require("Component/forform/tempCheckbox.js");
const compSelect = require("Component/forform/tempSelect.js");
const compText = require("Component/forform/tempText.js");
const compFile = require("Component/forform/tempSingleFile.js");
const compUeditor = require("Component/forform/tempUeditor.js");

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
           titles: ["服务管理","次卡详情"],
            back : upUrl
        }));

        this.textCardName = new compText();
        this.textCardContent = new compText();
        this.textMoney = new compText();
        this.textNumber = new compText();
        this.ueditorDetail = new compUeditor();

        this.checkboxIsBuy = new compCheckbox();
        this.selectType = new compSelect();
        this.selectWay = new compSelect();
        this.filePhoto = new compFile();
        this.fileUsedPhoto = new compFile();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, "renderFinish", this.renderPlugin);
        this.listenTo(this, 'confirmFinish',this.confirmFinish);//表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Member/cardDetail';
        this.param = {
            key: this.key,
            card_id : code
        }
        //如果传入参数则为编辑页面，没有则为添加页面
        if ((typeof code) !== "undefined" && code != null){
            this.queryData(this.url, this.param)
        }
    },

    render: function() {
        this.$('#main').append(this.textCardName.render().el);
        this.$('#main').append(this.textCardContent.render().el);
        this.$('#main').append(this.textMoney.render().el);
        this.$('#main').append(this.textNumber.render().el);
       
        // this.$('#main').append(this.selectType.render().el);
        // this.$('#main').append(this.selectWay.render().el);

        this.$('#main').append(this.checkboxIsBuy.render().el);  
        this.$('#main').append(this.filePhoto.render().el);
        this.$('#main').append(this.fileUsedPhoto.render().el);
        this.$('#main').append(this.ueditorDetail.render().el);
        
        return this;
    },

    renderPlugin: function(){
        this.ueditorDetail.trigger("renderFinish");
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textCardName.setParam({
            title: "次卡名称"
        });
        this.textMoney.setParam({
            title: "购买金额",
            msg: "只接受整数金额"
        });
       this.textNumber.setParam({
        title:"有效次数",
        msg:"次卡使用次数"
       })
        this.textCardContent.setParam({
            title: '次卡描述',
            msg: "描述该次卡的用途"
        });
        this.ueditorDetail.setParam({
            title : "次卡详情",
            msg: "请在这里编辑次卡的详情信息"
        });
        this.selectType.setParam({
            title: "使用类型",
            options: [{
                    value: 1,
                    content: "标准洗车"
                }
            ]
        });
         this.selectWay.setParam({
            title: "使用方式",
            options: [{
                    value: 1,
                    content: "单独使用"
                },
                {
                    value: 2,
                    content: "混合使用"
                },
                {
                    value: 3,
                    content: "余额支付"
                }
            ]
        });
        this.checkboxIsBuy.setParam({
            title: '是否余额购买',
            options: [{
                    value: 1,
                    content: "是"
                },
                {
                    value: 2,
                    content: "否"
                }
            ]
        });
        this.filePhoto.setParam({
            title: "次卡图片",
            msg: "只上传1个图片"
        });
        this.fileUsedPhoto.setParam({
            title: "使用后图片",
             msg: "只上传1个图片"
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

    fillPage: function(data) { //这里再进行数据的装配
        this.textCardName.setValue(data.name);
        this.textCardContent.setValue(data.describe);
        this.textMoney.setValue(data.price);
        this.selectWay.setValue(data.rule);
        this.checkboxIsBuy.setValue(data.is_balance);
        this.selectType.setValue(data.category_id);
        this.ueditorDetail.setValue(data.detail);
        this.filePhoto.setFile(data.pic);
        this.fileUsedPhoto.setFile(data.finished_pic);
        this.textNumber.setValue(data.number);
    },


    onClickClear: function(e){
        
    },

    onClickConfirm: function(e){
        var form = new FormData();
        var name = this.textCardName.getValue();
        var price = this.textMoney.getValue();
        var describe = this.textCardContent.getValue();
        // var rule = this.selectWay.getValue();
        var isBalance = this.checkboxIsBuy.getValue();
        // var categoryId = this.selectType.getValue();
        var pic = this.filePhoto.getFiles();
        var ossPic = this.filePhoto.isChange();

        var usedPic = this.fileUsedPhoto.getFiles();
        var ossUsed = this.fileUsedPhoto.isChange();

        var detail = this.ueditorDetail.getValue();
        var number = this.textNumber.getValue();

        form.append('key',this.key);
        form.append('id' , this.code);
        form.append('name',name);
        form.append('price',price);
        form.append('describe',describe);
        form.append('detail',detail);
        // form.append('category_id',categoryId);
        // form.append('rule',rule);
        form.append('pic',pic[0]);
        form.append('oss_photo_notnull', ossPic);
        form.append('finished_pic',usedPic[0]);
        form.append('oss_photo_notnull1', ossUsed);
        form.append('number',number);
        form.append('is_balance',isBalance);
        
        $.ajax({
            url: 'https://www.kziche.com/admin/Member/addCard',
            type: 'post',
            data: form,
            contentType: false,  
            processData: false,  
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
        })
    },

     confirmFinish : function(){
        alert("提交成功");
        window.history.back();
    },

    removeEl: function() {
        this.remove();
    }

});