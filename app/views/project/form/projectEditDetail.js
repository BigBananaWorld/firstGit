const htmlTpl = require("Templates/viewsTemplate/projectNormalEdit.html");
const compText = require("Component/forform/tempText.js");
const compUeditor = require("Component/forform/tempUeditor.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

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
            back : upUrl
        }));

        this.textIntro = new compText();
        this.ueditorDetail = new compUeditor();
        this.listenTo(this, "renderFinish", this.renderPlugin);
        this.initParamOfPage();
      
    },

    render: function() {
        this.$('#main').append(this.textIntro.render().el);
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
        this.textIntro.setParam({
            title: "项目简介"
        });
        this.ueditorDetail.setParam({
            title: "项目详情",
            msg: "在这里编辑项目展示页的详情"
        });
    },

    fillPage: function(data) { //这里再进行数据的装配
        this.textIntro.setValue(data.brief_introduction);
        this.ueditorDetail.setValue(data.describe);
    },

    getFormData : function(){
        var intro = this.textIntro.getValue();
        var detail = this.ueditorDetail.getValue();
        return {
            describe : detail,
            brief_introduction : intro
        }
    },

    onClickBack: function(e){

    },

    onClickClear: function(e){
       
    },

    removeEl: function() {
        this.remove();
    }

});