const htmlTpl = require("Templates/searchTemplate/tempDaterange.html");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "schDate",

    template: _.template(htmlTpl),

    initialize: function(param) {
         var param = param || {};
         this.setParam(param);
    },

    render: function() {
        this.$el.append(this.template({
            title : this.title,
            showTime : this.showTime,
            showDate : this.showDate,
            startDate : this.startDate,
            endDate : this.endDate,
            startTime : this.startTime,
            endTime : this.endTime
        }));
        return this;
    },

    setParam : function(param){
        this.name = param.name || "daterange";
        this.title = param.title || '起始时间';
        this.startDate = param.startDate ||this.getNowdate();
        this.endDate = param.endDate || this.getNowdate();
        this.startTime = param.startTime || "00:00";
        this.endTime = param.endTime || "23:59";
        this.showTime = param.showtime || false;
        this.showDate = param.showdate || true;
    },

    getNowdate : function(){
        var now = new Date();
        var result = "";
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        return year+'-'+month+'-'+day;
    },

    getName : function(){
        return this.name;
    },

    setStartDate : function(date){
        this.$("input[name='start']").val(date);
    },

    setEndDate : function(){

    },

    getStartDate : function(){
        return this.$('input[name="start"]').val();
    },

    getEndDate : function(){
        return this.$('input[name="end"]').val();
    },

    getStartTime : function(){
        return this.$('input[name="sttime"]').val();
    },

    getEndTime : function(){
        return this.$('input[name="edtime"]').val();
    },

    getValue : function(){
        return "";
    }

});