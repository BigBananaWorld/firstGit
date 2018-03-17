const tpl = require("Templates/siderbar.html");

module.exports = Backbone.View.extend({
    tagName : "div",

    className : "main-sidebar",

    events : {
        "click h3" : "onClickTitle",
        "click a" : "onClickA"
    },

    template : _.template(tpl),

    initialize : function(){
         this.render();
    },

    render : function(){
        this.$el.html(this.template());
        return this;
    },

    onClickTitle : function(e){
      var isActive = $(e.target).closest('h3').next().hasClass("active");
      this.$(".panel-body").slideUp().removeClass("active");
      if(!isActive){
        $(e.target).closest('h3').next().slideDown().addClass("active");
      }
    },

    onClickA : function(e){
        this.$(".panel-body li a").removeClass("active");
        $(e.target).addClass("active");
    },

    showCurrentOption : function(op){
        var op = "#" + op;
        var targetOption = null;
        this.$(".panel-body li a").each(function(index,el){
            if(op == $(el).attr("href")){
                targetOption = $(el);
            }
        })

        if(targetOption){
                if(targetOption.closest("ul").hasClass("active")){
                this.$(".panel-body li a").removeClass("active");
                targetOption.addClass("active");
            }else{
                this.$(".panel-body li a").removeClass("active");
                this.$(".panel-body").slideUp().removeClass("active");
                targetOption.closest("ul").slideDown().addClass("active");
                targetOption.addClass("active");
            }
        }
      
    }
});