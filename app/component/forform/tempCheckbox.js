const htmlTpl = require("Templates/formTemplate/tempCheckbox.html")

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events : {
        "click input[type='checkbox']" : "onClickCheck"
    },

    initialize: function(param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function() {
        this.$el.append(this.template({
            "title" : this.title,
            "value" : this.value,
            "options" : this.options,
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
 *    options : [{value:'',content:''}]
 *    name : "name"
 * }
 */
    setParam : function(param){
        if(!param){
            return ;
        }
        this.title = param.title || "文本框";//标题
        this.value = param.value || "1";//输入框内值
        this.options = param.options || [{value:"1",content:"内容1"},{value:"2",content:"内容2"}];//包含在组件中的checkbox
        this.name = param.name || "";//该输入框绑定的传出参数名
        this.msg = param.msg || "";//输入框注意事项
    },

    getValue : function(){
        return this.$('input[type="checkbox"]:checked').val();
    },

    setValue : function(val){
        this.value = val;
        var me = this;
        this.$('input[type="checkbox"]').prop("checked",false);
        this.$('input[type="checkbox"]').each(function(index,e){
            if(e.value == me.value){
                $(e).prop("checked",true);
            }
         
        })
    },

    setName : function(name){
        this.name = name;
    },

    getName : function(){
        return this.name;
    },

    onClickCheck : function(e){
        e.stopPropagation();
        this.$('input[type="checkbox"]').prop("checked",false);
        $(e.target).prop("checked",true);
    }
});