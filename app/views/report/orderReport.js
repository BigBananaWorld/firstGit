const htmlTpl = require("Templates/viewsTemplate/echartPage.html");
const compEchart = require("Component/echarts/tempEchart.js")
const compSearch = require("Component/tempSearch.js");
const barOption = require("Component/echarts/barOption");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    initialize: function(loginKey) {
        this.$el.html(this.template({}));

        this.ecCount = new compEchart();
        this.ecAmount = new compEchart();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 1
        });
        this.key = loginKey; //登陆秘钥

        this.ecList = []; //元素是该页面的所有图表，方便对所有图表进行批量操作

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this, "renderFinish", this.renderEchart);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();
    },

    render: function() {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.ecCount.render().el);
        this.$('#cont').append(this.ecAmount.render().el);
        return this;
    },

    renderEchart: function() {
        this.ecCount.trigger("renderFinish");
        this.ecAmount.trigger("renderFinish");
        this.startListenWindowSize("cont");
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        // 搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line: 0,
            param: {
                title: "时间范围",
                name: "daterange",
                startDate: this.getDate('month', 1),
                endDate: this.getDate(),
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                defaultTitle : '所有门店',
                title: "门店名称",
                options: [],
                name: "shop"
            }
        }];
        this.search.setParam(searchComponents);
        this.fillSelectOption();

        /**
         * 配置参数说明
         * id : 图表对应的父容器dom的ID,多个图表ID不可重复
         * url : 图表对应数据接口url
         * dataParam : 接口条件参数
         * title : 图表标题
         * legend : 图例名称
         * xaxis  : X轴对应的数据参数名
         * ecSeries : name:对应的图例名称,Y轴对应的数据参数名
         */
        this.ecCount.setEchartOption(barOption);
        this.ecCount.setParam({
            id: "orderCount",
            url: 'https://www.kziche.com/admin/Report/reconciliation',
            dataParam: {
                key: this.key,
                startTime: this.getDate('month', 1),
                endTime: this.getDate(),
                storeId: ""
            },
            title: "门店订单数量(个 )",
            legend: ["订单数"],
            xaxis: "date",
            ecSeries: [{
                name: "订单数",
                dataName: "count"
            }]
        });

        this.ecAmount.setEchartOption(barOption);
        this.ecAmount.setParam({
            id: "orderAmount",
            url: 'https://www.kziche.com/admin/Report/reconciliation',
            dataParam: {
                key: this.key,
                startTime: this.getDate('month', 1),
                endTime: this.getDate(),
                storeId: ""
            },
            title: "门店订单金额(元)",
            legend: ["订单金额"],
            xaxis: "date",
            ecSeries: [{
                name: "订单金额",
                dataName: "amout"
            }]
        });

        this.ecList.push(this.ecCount);
        this.ecList.push(this.ecAmount);
    },

    goSearch: function() {
        var dateRange = this.search.getElByName('daterange');
        var searchShop = this.search.getElByName('shop');
        var dataParam = {
            key: this.key,
            startTime: "",
            endTime: "",
            storeId: ""
        };

        var start = dateRange.getStartDate();
        var end = dateRange.getEndDate();
        var shopid = searchShop.getValue();
        dataParam.startTime = start;
        dataParam.endTime = end;
        dataParam.storeId = shopid;
        this.ecCount.freshEchart(dataParam);
        this.ecAmount.freshEchart(dataParam);

    },
    // 监听窗口大小变化
    startListenWindowSize: function(id) {
        var me = this;
        var firstDom = document.getElementById(id);
        this.currentWidth = firstDom.clientWidth;

        window.onresize = function() {
            var dom = document.getElementById(id);
            var changeWidth = dom.clientWidth - 100;
            var changeSize = changeWidth - me.currentWidth;
            if (Math.abs(changeSize) > 40) {
                _.each(me.ecList, function(ec, index) {
                    ec.resizeEchart(changeWidth);
                });
                me.currentWidth = dom.clientWidth - 100;
            }
        }
    },

    removeEl: function() {
        var me = this;
        _.each(me.ecList, function(el, index) {
            el.dispose();
        });
        this.remove();
    },

    freshTable: function(data) {

    },

    fillSelectOption: function() {
        var me = this;
        var searchShop = me.search.getElByName("shop");
        $.ajax({
            url: "https://www.kziche.com/admin/Report/storeList",
            type: 'get',
            dataType: 'json',
            data: {
                key: me.key
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
    /**
     * 获取日期
     * @param  {string} type  [修改的类型month月份,day天数]
     * @param  {num} param [与当前日期回退的type数量]
     * @return {[type]}       [description]
     */
    getDate: function(type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});