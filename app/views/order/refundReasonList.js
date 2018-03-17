const htmlTpl = require("Templates/viewsTemplate/example2.html");
const compTable = require("Component/tempTable.js");
const compSearch = require("Component/tempSearch.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function(loginKey) {
        this.$el.html(this.template({
             titles: ["订单管理","退款原因"],
            back : false
        }));
        this.table = new compTable();
        this.search = new compSearch({
            showAdd : true,
            addLink : "#views/order/form/refundReason",
            showSearch : false,
            linesNum : 0
        });
        this.key = loginKey;

        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/refundReason';
        this.tableParam = {
           key: this.key
        }
        this.queryData(this.url, this.tableParam);
    },

    render: function() {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        //列表初始配置
        var thead = ["退款原因"]; //表头
        var rows = ["name"]; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "edit" ,link:"views/order/form/refundReason" }, { name: '删除', elID: 'id', elName: "del" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

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

    removeEl: function() {
        this.remove();
    },

    onClickDelet : function(e){
        var sure = window.confirm("是否删除该条记录");
            console.log(sure)
        if(!sure){
            return ;
        }
        var id = $(e.target).attr("elid");
        var me = this;
        $.ajax({
            url: "https://www.kziche.com/admin/Order/delrefundReason",
            type: 'get',
            dataType: 'json',
            data: {
                key : me.key,
                ids : id
            },
            success: function(res) {
                if (res.code == 200) {
                    alert("删除成功");  
                  $(me).closest("tr").hide();
                } else {
                    alert(res.msg)
                    // var temp = [];
                    // this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function() {
                alert("网页出错");
            }.bind(this)
        })
    },

    freshTable: function(data) {
        this.table.setData(data);
        this.$("a[name='del']").click(this.onClickDelet);
    },

/**
 * 获取日期
 * @param  {string} type  [修改的类型month月份,day天数]
 * @param  {num} param [与当前日期回退的type数量]
 * @return {[type]}       [description]
 */
    getDate : function(type,param){
        let date = new Date();
        if(type && type=="month"){
            date.setMonth(date.getMonth()-param);
        }
        if(type && type=="day"){
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if(day < 10){
            day = "0" + day;
        }
        if(month < 10){
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});