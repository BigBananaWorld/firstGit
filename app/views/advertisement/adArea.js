const htmlTpl = require("Templates/viewsTemplate/advertisement/adAreaEdit.html");
const htmlItem = require("Templates/viewsTemplate/advertisement/adArea.html");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events : {
        "click input[name='province']" : "onClickLabel",
        "click #open" : "onClickOpen"
    },

    initialize: function(loginKey) {
        this.key = loginKey;

        this.listenTo(this,"dataReady",this.fillPage);
        this.url = 'https://www.kziche.com/admin/Ad/locationInfo';
        this.tableParam = {
            key: this.key
        }
        this.queryData(this.url, this.tableParam);
    },

    render: function() {
        this.$el.append(this.template({
            titles: ["系统管理","开通城市"],
            back : false
        }));
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
       
    },
/**
 * 查询数据
 * @param  {string} url       [接口url]
 * @param  {object} param     [需要传入的参数]
 * @param  {boolean} firstTime [是否需要重新渲染分页]
 */
    queryData: function(url, param) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        })
    },

    fillPage : function(data){
        var templateItem = _.template(htmlItem);
        this.$("#cont").append(templateItem({
            items : data
        }));
    },

    getValue : function(){
        var ids = [];
        this.$("input[type='checkbox']:checked").each(function(index,e){
            ids.push($(e).attr("elid"));
        });
        return ids.join(",");
    },

    onClickLabel : function(e){
        e.stopPropagation();
        var id = $(e.target).attr("elid");
        if($(e.target).prop("checked")){
            this.$el.find("input[pid='"+id+"']").prop("checked",true);
        }else{
            this.$el.find("input[pid='"+id+"']").prop("checked",false);
        }
        
    },

    removeEl: function() {
        this.remove();
    },

    onClickOpen : function(){
        var ids = this.getValue();
        var me = this;
       $.ajax({
            url: 'https://www.kziche.com/admin/Ad/openArea',
            type: 'get',
            data: {
                key: me.key,
                area_ids : ids
            },
            success: function(res) {
                if (res.code == 200) {
                    alert("上传成功");
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail',res.msg);
                }
            }.bind(this),
            error: function() {
                alert('页面出错');
            }.bind(this)
        })
    }

});