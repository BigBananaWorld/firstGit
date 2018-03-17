const htmlTpl = require("Templates/formTemplate/tempUeditor.html");
require("/public/ueditor/ueditor.config.js");
require("/public/ueditor/ueditor.all.min.js");
require("/public/ueditor/lang/zh-cn/zh-cn.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    initialize: function(param) {
        var param = param || {};
        this.setParam(param);   
        this.listenTo(this,"renderFinish",this.initUeditor);
    },

    render: function() {
        this.$el.append(this.template({
            "title" : this.title,
            "value" : this.value,
            "allowEmpty" : this.allowEmpty,
            "name" : this.name,
            "msg" : this.msg
        }));
        return this;
    },
/**
 * 添加配置参数
 * @param {[string]} name    [控件识别名称]
 * @param {[object]} options [下拉控件参数]
 * e : {
 *    title : "a",
 *    value : "content",
 *    explain : "string",
 *    allowEmpty : true,
 *    name : "name"
 * }
 */
    setParam : function(param){
        this.title = param.title || "富文本编辑";//标题
        this.value = param.value || "";//输入框内值
        this.allowEmpty = param.allowEmptytrue || true;//可否为空
        this.name = param.name || "";//该输入框绑定的传出参数名
        this.msg = param.msg || "";//输入框注意事项
    },
/**
 * 初始化ueditor
 * @return {[type]} [description]
 */
    initUeditor : function(){
        var me = this;
        this.isReady = 0;//判断是否加载完成
        this.ueditor = new UE.ui.Editor();
        this.ueditor.render("uedit");
        
        this.ueditor.addListener( 'ready', function( editor ) {
            me.ueditor.setContent(me.value);
            me.isReady = 1;
        } );
    },

    getValue : function(){
        return this.ueditor.getContent();
    },

    setValue : function(val){
        this.value = val || "请输入页面详情";
        if(this.isReady == 1){
            this.ueditor.setContent(this.value);
        }
    },

    setName : function(name){
        this.name = name;
    },

    getName : function(){
        return this.name;
    },

    delUeditor : function(){
        UE.delEditor('uedit');
    }

});