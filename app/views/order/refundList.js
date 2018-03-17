const htmlTpl = require("Templates/viewsTemplate/example2.html");
const compTable = require("Component/tempTable.js");
const compPage = require("Component/tempPage.js");
const compSearch = require("Component/tempSearch.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function(loginKey) {
        this.$el.html(this.template({
            titles: ["订单管理","退款申请列表"],
            back : false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd : false,
            addLink : "",
            showSearch : true,
            linesNum : 2
        });
        this.key = loginKey;

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/refundList';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            signStartTime : this.getDate('month',3),
            signEndTime : this.getDate(),
            state: ''
        }
        this.queryData(this.url, this.tableParam,true);
    },

    render: function() {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        // this.$('#pg').append(this.pagement.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        //列表初始配置
        var thead = ["会员","订单号","申请时间","内容","付款方式","金额","状态"]; //表头
        var rows = ["nickname","order_sn","create_time","items_name","pay_type_name","amount","state_name"]; //表列
        var opration = [{ name: '详情', elID: 'refund_id', elName: "xq",link:"views/order/form/refundView" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("refund_id");

        //搜索栏配置
        var searchComponents = [{
                type: 'daterange',
                line : 0,
                param: {
                    title: "时间范围",
                    startDate: this.getDate('month',3),
                    endDate: this.getDate(),
                    name : 'daterange'
                }
            },
             {
                type: 'text',
                line : 0,
                param: {
                    title: "搜索条件",
                    value: "",
                    explain: "要查询的会员名、订单",
                    name: "text"
                }
            },
            {
                type: 'select',
                line : 0,
                param: {
                    title: "处理状态",
                    options: [{
                        value: '1',
                        content: "未处理"
                    }, {
                        value: '2',
                        content: "已处理"
                  }],
                    name: "state"
                }
            }
        ];
        this.search.setParam(searchComponents);
    },
/**
 * 查询数据
 * @param  {string} url       [接口url]
 * @param  {object} param     [需要传入的参数]
 * @param  {boolean} firstTime [是否需要重新渲染分页]
 */
    queryData: function(url, param,firstTime,type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if(firstTime){
                        this.pagement.clearPage();
                        var totalPage =Math.ceil(res.count/this.pagement.getPageSize());
                    this.pagement.setParam({
                            totalPage : totalPage,
                            currentPage : 1,
                            total : res.count
                        })
                    this.$('#pg').append(this.pagement.render().el);
                    }
                   
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

    pageChange : function(currentPage){
        this.tableParam.page = currentPage;
        this.queryData(this.url,this.tableParam,false);
    },

    goSearch: function() {
        var dateRange = this.search.getElByName('daterange');
        var searchText = this.search.getElByName('text');
        var searchSelect = this.search.getElByName('state');
       
        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.signStartTime = dateRange.getStartDate();
        this.tableParam.signEndTime = dateRange.getEndDate();
        this.tableParam.state = searchSelect.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    removeEl: function() {
        this.remove();
    },

    freshTable: function(data) {
        if(data.length == 0){
            this.pagement.clearPage();
        }
        this.table.setData(data);
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