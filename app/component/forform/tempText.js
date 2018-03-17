const htmlTpl = require("Templates/formTemplate/tempText.html");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events : {
        "blur input[type='text']" : "onBlurText"
    },

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
            "name" : this.name,
            "msg" : this.msg,
            "err" : this.err,
            "readonly" : this.readonly
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
        this.msg = param.msg || "";//输入框注意事项
        this.err = param.err || "输入内容不符合格式";
        this.pattern = param.pattern || null;//正则匹配 
        this.readonly = param.readonly || false;
    },

    getValue : function(){
        return this.$('input[type="text"]').val()
    },

    setValue : function(val){
        this.value = val;
        this.$('input[type="text"]').val(val);
    },

    setName : function(name){
        this.name = name;
    },

    getName : function(){
        return this.name;
    },

    onBlurText : function(e){
        this.checkValue()?this.$('.formError').hide():this.$('.formError').show();
    },
/**
 * 对输入内容进行正则匹配
 * @return {boolean} [符合匹配为true 不匹配为false]
 */
    checkValue : function(){
        if(!this.pattern) return true;
        var re = this.pattern;
        return re.test(this.getValue());
    }

});