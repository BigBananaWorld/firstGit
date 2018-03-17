const htmlTpl = require("Templates/tempChargeRegular.html")

module.exports = Backbone.View.extend({
    tagName: "p",

    className: "chargeRegular",

    template: _.template(htmlTpl),

    events : {
        "click #delete" : "onClickDelete"
    },

    initialize: function(param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function() {
        this.$el.append(this.template({
            charge : this.charge,
            give : this.give,
            isNew : this.isNew,
            num : this.num
        }));
        return this;
    },

    setParam : function(param){
        if(!param){
            return ;
        }
        this.charge = param.charge || 0;
        this.give = param.give || 0;
        this.isNew = param.isNew || false;
        this.num = param.num || 0;
        this.elid = param.elid || 0;
    },

    getValue : function(){
        var result = {};
        this.$('input[type="number"]').each(function(index,el){
            result[el.name] = el.value;
        })
       return result;
    },

    onClickDelete : function(e){
        var num = $(e.target).attr('num');
            if(!this.isNew){
                var sure = confirm("是否删除该记录?");
                if(sure){
                    this.trigger('delete',num);
                    this.removeEl();    
                }
            }else{
                this.trigger('delete',num);
                this.removeEl();
            }    
        
    },

    removeEl : function(){
        this.remove();
    }
});