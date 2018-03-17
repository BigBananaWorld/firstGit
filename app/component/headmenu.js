const tpl = require("Templates/headMenu.html")

module.exports = Backbone.View.extend({
    tagName : "div",

    className : "main-header",

    events : {
        "click a[name='logout']" : "onClickLogout"
    },

    template : _.template(tpl),

    initialize : function(){
         // this.render();
    },

    render : function(){
        this.$el.html(this.template());
        return this;
    },

    onClickLogout : function(e){
         var logoutSure = confirm("是否确定退出?");
            if(logoutSure){
                 localStorage.removeItem("kzicar_key");
                 window.location.href="../public/login.html";
            }
    }
});