const htmlTpl = require("Templates/formTemplate/tempSelect.html")

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    initialize: function(param) {
        var param = param || {};
        this.setParam(param);
       
    },

    render: function() {
        this.$el.append(this.template({
            options : this.options,
            name : this.name,
            title : this.title
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
        this.options = param.options || [];
        this.name = param.name || "";
        this.title = param.title || "默认标题";
    },

    setOptions : function(options){
        this.$("select").empty();
        this.$("select").append("<option value=''>请选择</option>");
        for(let i=0 ; i < options.length ; i++){
            this.$("select").append("<option value='"+ options[i].id+"'>"+ options[i].name+"</option>");
        }
    },

    setValue : function(val){
        this.$('select').val(val);
    },

    getValue : function(){
        var name = this.name;
        var value = this.$('select').val();
        return value;
    },

    getName : function(){
        return this.name;
    },

    refresh : function(){
        this.$el.empty();
        this.render();
    }

});