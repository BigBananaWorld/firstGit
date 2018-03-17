const htmlTpl = require("Templates/viewsTemplate/formExample.html");
const compSelect = require("Component/forform/tempSelect.js");
const compText = require("Component/forform/tempText.js");
const compFile = require("Component/forform/tempSingleFile.js");
const compUeditor = require("Component/forform/tempUeditor.js");
const compAdArea = require("Component/forform/tempMultiSelect.js");
const compCheckbox = require("Component/forform/tempCheckbox.js");

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
            titles: ["广告管理","广告位列表","广告详情"],
            back : upUrl
        }));

        this.textAdName = new compText();
        this.textAdLink = new compText();
        this.textAdDescribe = new compText();

        this.selectStatu = new compSelect();
        this.checkboxType = new compCheckbox();
        this.selectArea = new compAdArea();
    
        this.filePhoto = new compFile();
        this.ueditorDetail = new compUeditor();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, "pageReady" , this.goQueryData);//等待页面所有元素加载完毕
        this.listenTo(this, "renderFinish", this.renderPlugin);
        this.listenTo(this, 'confirmFinish',this.confirmFinish);//表单提交成功后的回调函数
        this.listenTo(this, 'confirmFail',this.confirmFail);
    },

    render: function() {
        this.$('#main').append(this.textAdName.render().el);
        this.$('#main').append(this.textAdDescribe.render().el);
        this.$('#main').append(this.selectStatu.render().el);
        this.$('#main').append(this.selectArea.render().el);
        this.$('#main').append(this.filePhoto.render().el);
        this.$('#main').append(this.checkboxType.render().el);
        this.$('#main').append(this.textAdLink.render().el);
        this.$('#main').append(this.ueditorDetail.render().el);
        return this;
    },

    renderPlugin: function(){
        this.ueditorDetail.trigger("renderFinish");
    },

    goQueryData: function(){
        this.url = 'https://www.kziche.com/admin/Ad/showAd';
        this.param = {
          key: this.key,
          id : this.code
        };
        //如果传入参数则为编辑页面，没有则为添加页面
        if(this.code != 0 ){
            this.queryData(this.url,this.param);
        }
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textAdName.setParam({
            title: "广告名"
        });
        this.textAdDescribe.setParam({
            title:"广告简介",
            msg:"简要说明广告内容"
        });
        this.textAdLink.setParam({
            title: '广告链接',
            msg: "请提供广告的链接URL"
        });
        this.selectStatu.setParam({
            title: "广告状态",
            options: [{
                    value: 1,
                    content: "显示"
                },
                {
                    value: 2,
                    content: "隐藏"
                }
                
            ]
        });
        this.checkboxType.setParam({
            title : "广告投放方式",
            options: [{
                    value: 1,
                    content: "链接"
                },
                {
                    value: 2,
                    content: "富文本"
                }]
        });
        this.filePhoto.setParam({
            title:"广告图片"
        });
        this.ueditorDetail.setParam({
            title:"广告富文本编辑",
            msg:"在这里编辑广告页面"
        });
        this.selectArea.setParam({
            title:"广告投放地区"
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
        this.textAdName.setValue(data.title);
        this.textAdLink.setValue(data.url);
        this.textAdDescribe.setValue(data.decribe);

        this.selectStatu.setValue(data.status);
        this.selectArea.setValue((data.location_ids).split(","));
    
        this.filePhoto.setFile(data.pic);
        this.ueditorDetail.setValue(data.content);
        this.checkboxType.setValue(data.type);
    },

    onClickClear: function(){

    },

    onClickConfirm: function(){
        var name = this.textAdName.getValue();
        var link = this.textAdLink.getValue();
        var position = window.sessionStorage.getItem("position");
        var statu = this.selectStatu.getValue();
        var photo = this.filePhoto.getFiles();
        var isChange = this.filePhoto.isChange();
        var content = this.ueditorDetail.getValue();
        var decribe = this.textAdDescribe.getValue();
        var area = this.selectArea.getValue();
        var adType = this.checkboxType.getValue();
        
        var form = new FormData();
        form.append('id',this.code);
        form.append('key',this.key);
        form.append('name',name);
        form.append('pic',photo[0]);
        form.append('status',statu);
        form.append('content',content);
        form.append('url',link);
        form.append('decribe',decribe);
        form.append('type',adType);
        form.append('location_ids',area);
        form.append('position_id',position);
        form.append('oss_photo_notnull',isChange); 

        $.ajax({
            url: 'https://www.kziche.com/admin/Ad/addAd',
            type: 'post',
            data: form,
            contentType: false,  
            processData: false,  
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    this.trigger('confirmFail',res.msg);
                }
            }.bind(this),
            error: function() {
                alert('页面出错');
            }.bind(this)
        });
    },

/**
 * 填装多选组件的option,组件option为异步获取，所以在加载完成option后需出发pageReady事件。保证页面渲染完成
 * @return {[type]} [description]
 */
    fillSelectOption : function(){
        var me = this;
        var resArray =  [];
        $.ajax({
            url: "https://www.kziche.com/admin/Ad/locationInfo",
            type: 'get',
            dataType: 'json',
            data: {
                 key : me.key
            },
            success: function(res) {
                if (res.code == 200) {
                    for(let i = 0 ; i < res.data.length ;i++){
                        if(res.data[i].is_open == 1){
                            resArray.push({
                                content : res.data[i].name,
                                value : res.data[i].code
                            })
                        }
                        if(res.data[i].son){
                            var son = res.data[i].son;
                            for(let j = 0 ; j < son.length ; j ++){
                                if(son[j].is_open == 1){
                                    resArray.push({
                                        content : son[j].name,
                                        value : son[j].code
                                    })
                                }
                            }
                            
                        }

                    }
                    me.selectArea.setOptions(resArray);
                }
                me.trigger("pageReady");
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        });
    },

    confirmFinish : function(){
        alert("提交成功");
        window.history.back();
    },

    confirmFail : function(msg){
        alert(msg);
    },

    removeEl: function() {
        this.remove();
    }

});