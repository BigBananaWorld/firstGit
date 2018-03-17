const htmlTpl = require("Templates/formTemplate/tempDate.html");

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
            title : this.title,
            elDate : this.elDate,
            elTime : this.elTime,
            showTime : this.showTime,
            showDate : this.showDate  
        }));
        return this;
    },

    setParam : function(param){
        this.name = param.name || "datetime";
        this.title = param.title || '条件时间';
        this.elDate = param.date ||this.getNowdate();
        this.elTime = param.time || "00:00";
        this.showTime = param.showTime || "hide";
        this.showDate = param.showDate || "show"; 
    },

    getNowdate : function(){
        var now = new Date();
        var result = "";
        var year = now.getFullYear();
        var month = (now.getMonth() + 1) + "";
         if(month.length <= 1){
            month = "0" + month;
        }
        var day = now.getDate() + "";
        if(day.length <= 1){
            day = "0" + day;
        }
        return year+'-'+month+'-'+day;
    },

    getName : function(){
        return this.name;
    },

    getValue : function(){
        if((this.showTime=="show") && (this.showDate=="show")){
            var date = this.$('input[name="date"]').val();
            var time = this.$('input[name="time"]').val();
            return date + ',' + time;
        }
        if(!(this.showTime=="show") && (this.showDate=="show")){
            var date = this.$('input[name="date"]').val();
            return date;
        }
        if((this.showTime=="show") && !(this.showDate=="show")){
            var time = this.$('input[name="time"]').val();
            return time;
        }
    },

    setValue : function(val){
        if(this.showTime == "show"){
            this.$('input[name="time"]').val(val);
        }else{
            this.$('input[name="date"]').val(val);
        }
        
    }
});