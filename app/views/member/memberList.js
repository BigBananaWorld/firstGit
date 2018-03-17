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
            titles: ["会员管理","会员列表"],
            back : false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd : false,
            addLink : "",
            showSearch : true,
            linesNum : 1
        });
        this.key = loginKey;//登陆秘钥

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange); //监听页数变化事件
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Member/memberList';
        //查询参数当前对象内共用，保证条件的一致
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            signStartTime: this.getDate('month',3),
            signEndTime: this.getDate(),
            grade_name: ''
        };
        this.queryData(this.url, this.tableParam, true);
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
        var thead = ["用户名", "性别", "用户来源", "车牌", "手机号", "会员等级", "积分", "余额","赠送金额", "注册日期", "实名认证"]; //表头
        var rows = ['nickname', 'sex', 'source_name', 'license_plate', 'phone', 'grade_name', 'integral', 'balance','gift_amount', 'create_time', 'is_validate']; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "edt", link: "views/member/form/memberEdit" }, 
        { name: '订单', elID: 'id', elName: "ord",link: "views/order/orderList" },
        { name: '冻结', elID: 'id', elName: "dj" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line : 0,
            param: {
                title: "时间范围",
                name: "daterange",
                startDate: this.getDate('month',3),
                endDate: this.getDate()
            }
        }, {
            type: 'text',
            line : 0,
            param: {
                title: "输入条件",
                value: "",
                explain: "用户名/手机号",
                name: "text"
            }
        }];
        this.search.setParam(searchComponents);
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

    goSearch: function() {
        var dateRange = this.search.getElByName('daterange');
        var searchText = this.search.getElByName('text');
       
        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.signStartTime = dateRange.getStartDate();
        this.tableParam.signEndTime = dateRange.getEndDate();
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