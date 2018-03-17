const htmlTpl = require("Templates/formTemplate/tempColor.html");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events : {
        "change input[type='color']" : "onChangeColor",
        "input input[type='text']" : "onTextInput"
    },

    initialize: function(param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function() {
        this.$el.append(this.template({
            "title" : this.title,
            "value" : this.value,
            "allowEmpty" : this.allowEmpty,
            "name" : this.name,
            "msg" : this.msg
        }));
        this.showValue();
        return this;
    },
/**
 * 添加配置参数
 * @param {[string]} name    [控件识别名称]
 * @param {[object]} options [下拉控件参数]
 * e : {
 *    title : "a",
 *    value : "content",
 *    name : "name"
 * }
 */
    setParam : function(param){
        if(!param){
            return ;
        }
        this.title = param.title || "文本框";//标题
        this.value = param.value || "#ff3e43";//输入框内值
        this.allowEmpty = param.allowEmptytrue || true;//可否为空
        this.name = param.name || "";//该输入框绑定的传出参数名
        this.msg = param.msg || "";//输入框注意事项
    },

    getValue : function(){
        return this.$('input[type="color"]').val()
    },

    setValue : function(val){
        if(!val) {return;}
        this.value = val;
        this.$('input[type="color"]').val(val);
        this.showValue();
    },
/**
 * 在文本框中显示选中颜色的rbg值
 */
    showValue : function(){
        var value = this.getValue();
        this.$("input[type='text']").val(value);
    },

    getName : function(){
        return this.name;
    },

    onChangeColor : function(e){
       var color = $(e.target).val();
       this.$("input[type='text']").val(color);
    },

    onTextInput : function(e){
        var value = $(e.target).val();
        var pattern = /^#([a-fA-F0-9]{6})$/;
        if(pattern.test(value)){
            this.setValue(value);
        }
    }

});