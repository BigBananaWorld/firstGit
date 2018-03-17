const htmlTpl = require("Templates/viewsTemplate/example2.html");
const compTable = require("Component/tempTable.js");
const compSearch = require("Component/tempSearch.js");
const compPage = require("Component/tempPage.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events : {
        "click a[name='link']" : "onClickLink"
    },

    initialize: function(loginKey,code,upUrl) {
        this.$el.html(this.template({
            titles: ["统计报表","对账表单"],
            back : false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd : true,
            addLink : "",
            addTitle : "下载Excel",
            showSearch : true,
            linesNum : 1
        });
        this.key = loginKey;
        this.count = 0;//当前查询条件下的记录总数

        this.listenTo(this.search, "goSearch", this.goSearch);
        this.listenTo(this.pagement, "pageChange", this.pageChange); //监听页数变化事件
        this.listenTo(this, "dataReady", this.freshTable);

        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Report/orderStatistics';
        this.tableParam = {
            key : this.key,
            storeId  : '',
            startTime  : this.getDate('month',1),
            endTime  : this.getDate(),
            isExcel : 1,
            pagesize : 15,
            page : 1
        }
        
        this.queryData(this.url, this.tableParam,true);
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
        var thead = ["时间", "订单号", "车牌号", "项目", "微信收款", "余额收款", "次卡收款", "线下收款","合计","总产值和收款差异","备注"]; //表头
        var rows = ["date","order_sn","license_plate","items","wechat_amount","balance_amount","card_amount","line_amount","actual_money","a","b"]; //表列
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setHasOpration(false);
        this.table.setHasCheckBox(false);

        //搜索栏配置
        var searchComponents = [{
                type: 'daterange',
                line : 0,
                param: {
                    title: "时间范围",
                    startDate: this.getDate('month',1),
                    endDate: this.getDate(),
                    name : "daterange"
                }
            }, {
                type: 'select',
                line : 0,
                param: {
                    defaultTitle : '所有门店',
                    title: "门店名称",
                    options: [],
                    name: "shop"
                }
            }
        ];
        this.search.setParam(searchComponents);
        this.fillSelectOption();
    },
/**
 * 查询数据
 * @param  {string} url       [接口url]
 * @param  {object} param     [需要传入的参数]
 * @param  {boolean} firstTime [是否需要重新渲染分页]
 */
    queryData: function(url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    this.count = res.count;
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total : res.count
                        })
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.count = 0;
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        })
    },

    pageChange: function(currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function(param) {
        var dateRange = this.search.getElByName('daterange');
        var searchShop = this.search.getElByName('shop');//接口没有涉及
        this.tableParam.isExcel = 1;
        this.tableParam.storeId = searchShop.getValue();
        this.tableParam.startTime  = dateRange.getStartDate();
        this.tableParam.endTime  = dateRange.getEndDate();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    removeEl: function() {
        this.remove();
    },

    freshTable: function(data) {
        this.dataLength = data.length;
        if(data.length == 0){
            this.pagement.clearPage();
        }
        this.table.setData(data);
    },

     fillSelectOption : function(){
        var me = this;
        var searchShop = me.search.getElByName("shop");
        $.ajax({
            url: "https://www.kziche.com/admin/Report/storeList",
            type: 'get',
            dataType: 'json',
            data: {
                 key : me.key
            },
            success: function(res) {
                if (res.code == 200) {
                    searchShop.setOptions(res.data);
                } else {
                    var temp = [];
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        });
    },

    onClickLink : function(e){
        if(this.dataLength == 0){
            return ;
        }
        var start = this.tableParam.startTime;
        var end = this.tableParam.endTime;
        var storeId = this.tableParam.storeId;
        var count = this.count;
        var key = this.key;
        var downloadUrl = "https://www.kziche.com/admin/Report/orderStatistics?key="+key+"&storeId="+storeId+"&startTime="+start+"&endTime="+end+"&isExcel=2&page=1&pagesize="+count;
        window.location.href = downloadUrl;
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