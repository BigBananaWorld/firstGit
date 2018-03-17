const htmlTpl = require("Templates/formTemplate/tempPermission.html");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formPermission",

    template : _.template(htmlTpl),

    events : {
       "click input[type='checkbox']" : "onClickCheck",
       "change select[name='search']" : "onChangeSelect"
    },

    initialize: function(loginKey) {
        this.key = loginKey;
        this.values = [];
        this.listenTo(this,"dataReady",this.freshTable);
    },

    render: function() {
        // this.$el.append(this.template());
        this.queryData();
        return this;
    },

    queryData: function() {
        $.ajax({
            url: "https://www.kziche.com/admin/Order/privilegeInfo",
            type:  'get',
            dataType: 'json',
            data: {
                key: this.key,
            },
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        })
    },
/**
 * 添加配置参数
 * @param {[string]} name    [控件识别名称]
 * @param {[object]} options [下拉控件参数]
 * e : {
 * }
 */
    setParam : function(param){
        if(!param){
            return ;
        }
        this.title = param.title || "文本框";//标题
        this.name = param.name || "";//该输入框绑定的传出参数名
    },

    freshTable : function(data){
        console.log(data);
        this.$el.append(this.template({
            data : data
        }));
        this.trigger("permissionReady");
    },

    fillPage : function(){
        var me = this;
        var resultArray = this.values.split(",");
        this.$("input[type='checkbox']").each(function(index,el){
            for(let i = 0; i < resultArray.length ; i++){
                if( resultArray[i] == $(el).attr("elid")){
                    $(el).prop("checked",true).closest('.checkEle').addClass("active");
                }    
            }
            
        })
    },

    getValue : function(){
       var ids = [];
        this.$("input[type='checkbox']:checked").each(function(index,e){
            ids.push($(e).attr("elid"));
        });
        return ids.join(",");
    },

    setValue : function(val){
        if(val){
            this.values = val;
            this.fillPage();
        }else{
            this.values = [];
        }
    },

    getName : function(){
        return this.name;
    },

    onClickCheck : function(e){
        var target = $(e.target);
        var el = target.closest('.checkEle');
        if(el.hasClass("active")){
            el.removeClass("active");
        }else{
            el.addClass("active");
        }
        //如点击父选项，相应子元素也被选取
         if(target.attr("pid") == 0){
            target.closest("td").next().find("input[type='checkbox']").each(function(index,comp){
                if(target.prop("checked")){
                    $(comp).prop("checked",true).closest('.checkEle').addClass("active");
                }else{
                    $(comp).prop("checked",false).closest('.checkEle').removeClass("active");
                }
                
            });
         }
    },

    onChangeSelect : function(e){
        var val = $(e.target).val();
        if(val == ""){
            this.$("tbody tr").show();
        }else{
            this.$("tbody tr").each(function(index,comp){
                var temp = $(comp).attr("elid");
                if(val != temp ){
                    $(comp).hide();
                }
                if(val == temp){
                    $(comp).show();
                }
            })
        }
    }
});