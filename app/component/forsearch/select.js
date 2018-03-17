const htmlTpl = require("Templates/searchTemplate/tempSelect.html")

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "schSelect",

    template: _.template(htmlTpl),

    initialize: function(param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function() {
        this.$el.append(this.template({
            options : this.options,
            name : this.name,
            title : this.title,
            defaultTitle : this.defaultTitle
        }));
        return this;
    },
/**
 * 添加配置参数
 * @param {[string]} name    [控件识别名称]
 * @param {[object]} options [下拉控件参数]
 * e : {
 *    name : "name",
 *    titile : "title",
 *    options : [{value:'value',content:'content'}]
 * }
 */
    setParam : function(param){
        if(!param){
            return ;
        }
        this.defaultTitle = param.defaultTitle || "请选择";
        this.options = param.options || [];
        this.name = param.name || "";
        this.title = param.title || "默认标题";
    },

    setValue : function(){

    },

    getValue : function(){
        var name = this.name;
        var value = this.$('select').val();
        return value;
    },

    setOptions : function(options){
        var me = this;
        this.$("select").empty();
        this.$("select").append("<option value=''>"+me.defaultTitle+"</option>");
        for(let i=0 ; i < options.length ; i++){
            this.$("select").append("<option value='"+ options[i].id+"'>"+ options[i].name+"</option>");
        }
    },

    getName : function(){
        return this.name;
    },

    showOption : function(val){
       this.$("select").val(val);
    },

    refresh : function(){
        this.$el.empty();
        this.render();
    }

});