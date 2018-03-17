const htmlTpl = require("Templates/tempBatch.html");
/*
批量操作组件
 */
module.exports = Backbone.View.extend({
    tagName: "div",

    className: "batchElement",

    events : {
        "click a" : "onClickA"
    },

    template: _.template(htmlTpl),

    initialize: function(param) {
        this.setParam(param);
    },

    render: function() {
        this.$el.append(this.template({
            options : this.options
        }));
        return this;
    },

    setParam: function(param){
        this.options = param;
    },

    onClickA : function(e){
        var type = this.$("select").val();
        var text = this.$("select option:selected").text();
        if(type != ""){
            var sure = window.confirm("确定批量执行 "+text+" 操作?");
            if(sure){
                this.trigger("goBatch",type);
            }
        }
    }

});