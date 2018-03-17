const htmlTpl = require("Templates/viewsTemplate/echartPage.html");
const compEchart = require("Component/echarts/tempEchart.js")
const compSearch = require("Component/tempSearch.js");
const barOption = require("Component/echarts/barOption");
const barMemOption = require("Component/echarts/barMemberOption");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    initialize: function(loginKey) {
        this.$el.html(this.template({}));

        this.ecMember = new compEchart();
        this.ecActive = new compEchart();
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
        this.$('#cont').append(this.ecMember.render().el);
        this.$('#cont').append(this.ecActive.render().el);
        return this;
    },

    renderEchart: function() {
        this.ecMember.trigger("renderFinish");
        this.ecActive.trigger("renderFinish");
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
        }];
        this.search.setParam(searchComponents);
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
        this.ecMember.setEchartOption(barOption);
        this.ecMember.setParam({
            id: "member",
            url: 'https://www.kziche.com/admin/Report/membershipStatistics',
            dataParam: {
                key: this.key,
                startTime: this.getDate('month', 1),
                endTime: this.getDate()
            },
            title: "新增会员",
            legend: ["线上", "线下"],
            xaxis: "date",
            ecSeries: [{
                    name: "线上",
                    dataName: "wechatCount"
                },
                {
                    name: "线下",
                    dataName: "lineCount"
                }
            ]
        });

        this.ecActive.setEchartOption(barMemOption);
        this.ecActive.setParam({
            id: "activeMem",
            url: 'https://www.kziche.com/admin/Report/membershipStatistics',
            dataParam: {
                key: this.key,
                startTime: this.getDate('month', 1),
                endTime: this.getDate()
            },
            title: "用户活跃",
            legend: ["新用户", "活跃用户","稳定用户","睡眠用户"],
            xaxis: "date",
            ecSeries: [{
                    name: "新用户",
                    dataName: "tatalCount"
                },
                {
                    name: "活跃用户",
                    dataName: "activeCount"
                },
                {
                    name: "稳定用户",
                    dataName: "stableCount"
                },
                {
                    name: "睡眠用户",
                    dataName: "sleepCount"
                }
            ]
        });

        this.ecList.push(this.ecMember);
        this.ecList.push(this.ecActive);
    },

    goSearch: function() {
        var dateRange = this.search.getElByName('daterange');
        var dataParam = {
            key: this.key,
            startTime: "",
            endTime: ""
        };

        var start = dateRange.getStartDate();
        var end = dateRange.getEndDate();
    
        dataParam.startTime = start;
        dataParam.endTime = end;
        this.ecMember.freshEchart(dataParam);
        this.ecActive.freshEchart(dataParam);

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
            el.dispose()
        });
        this.remove();
    },

    freshTable: function(data) {

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