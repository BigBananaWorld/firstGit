const htmlTpl = require("Templates/tplModul2.html");
const img = require("../../image/loading.png");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "module",

    template: _.template(htmlTpl),

    initialize: function() {
        console.log(img);
    },

    render: function() {
        this.$el.append(this.template({
        	img : img
        }));
        return this;
    }
});