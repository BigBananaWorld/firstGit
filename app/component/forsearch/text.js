const htmlTpl = require("Templates/searchTemplate/tempText.html");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "schText",

    template: _.template(htmlTpl),

    initialize: function(param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function() {
        this.$el.append(this.template({
            "title" : this.title,
            "value" : this.value,
            "explain" : this.explain,
            "allowEmpty" : this.allowEmpty,
            "name" : this.name
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
        if(!param){
            return ;
        }
        this.title = param.title || "文本框";//标题
        this.value = param.value || "";//输入框内值
        this.explain = param.explain || "输入内容";//输入提示
        this.allowEmpty = param.allowEmptytrue || true;//可否为空
        this.name = param.name || "";//该输入框绑定的传出参数名
    },

    setName : function(name){
        this.name = name;
    },

    getName : function(){
        return this.name;
    },

    setValue : function(value){
        this.$('input[type="text"]').val(value);
    },

    getValue : function(){
        var name = this.name;
        var value = this.$('input[type="text"]').val();
        return value.trim();
    },

    refresh : function(){
        this.$el.empty();
        this.render();
    }
    
});