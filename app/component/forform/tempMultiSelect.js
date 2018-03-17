const htmlTpl = require("Templates/formTemplate/tempMultiSelect.html");
require("CSSdir/style.css");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    events: {
        "click li": "clickOption",
        "click input[type='text']": "clickText",
        "click a[name='sure']": "clickOk",
        "click a[name='all']": "clickAll"
    },

    template: _.template(htmlTpl),

    initialize: function(param) {
        var param = param || {};
        this.setParam(param); 
    },

    render: function() {
        this.$el.append(this.template({
            name: this.name,
            title: this.title
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
    setParam: function(param) {
        if (!param) {
            return;
        }
        this.options = param.options || [];
        this.name = param.name || "";
        this.title = param.title || "";
    },

    /**
     * 填充多选框里的选项
     * @param {Array} options [选项为数组，元素格式为 {content : "demo", value: "1"}]
     */
    setOptions: function(options) {
        var templateOption = _.template("<% _.each(ops,function(op,index){ %>" +
            "<li><input type='checkbox' value='<%=op.value %>'><span><%=op.content %></span></li><% }) %>");
        this.$('.multselectOp').empty().append(templateOption({
            ops: options
        }));
    },

    setValue: function(arrayData) {
        this.$("input[type='checkbox']").each(function(index, el) {
            console.log($(el).val())
            for (let i = 0, len = arrayData.length; i < len; i++) {
                if ($(el).val() == arrayData[i]) {
                    $(el).prop("checked", true);
                }
            }
        });
        this.$("input[type='text']").val(this.getText());
    },
    /**
     * 获取选取目标的value值
     * @return {String} [获取的值用','分割]
     */
    getValue: function() {
        var result = [];
        this.$("input[type='checkbox']:checked").each(function(index, el) {
            result.push($(el).val());
        })
        return result.join(",");
    },
    /**
     * 获取选取目标的文本内容
     * @return {String} [获取的值用','分割]
     */
    getText: function() {
        var result = [];
        this.$("input[type='checkbox']:checked").each(function(index, el) {
            result.push($(el).closest("li").find("span").text());
        })
        return result.join(",");
    },

    clickText: function(e) {
        this.$(".muti").show();
    },

    clickOption: function(e) {
        var $el = $(e.target);
        if ((e.target).nodeName == "LI") {
            var $temp = $el.find("input[type='checkbox']");
            $temp.prop("checked") ? $temp.prop("checked", false) : $temp.prop("checked", true);
        } else if ((e.target).nodeName == "SPAN") {
            var $temp = $el.closest("li").find("input[type='checkbox']");
            $temp.prop("checked") ? $temp.prop("checked", false) : $temp.prop("checked", true);
        }
        this.$("input[type='text']").val(this.getText());
    },

    clickOk: function(e) {
        this.$(".muti").hide();
    },

    clickAll: function(e) {
        if (this.$("input[type='checkbox']:not(:checked)").size() > 0) {
            this.$("input[type='checkbox']").prop("checked", true);
        } else {
            this.$("input[type='checkbox']").prop("checked", false);
        }
        this.$("input[type='text']").val(this.getText());
    },

    getName: function() {
        return this.name;
    }

});